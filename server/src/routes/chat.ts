import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';
import { chatRoomDto, messageDto } from '../lib/dto.js';

const router = Router();

router.get('/rooms', requireAuth, async (req, res, next) => {
  try {
    const myId = req.userId!;
    const memberships = await prisma.chatMember.findMany({
      where: { userId: myId },
      include: {
        room: {
          include: {
            trip: true,
            members: { include: { user: true } },
          },
        },
      },
      orderBy: { room: { lastMessageAt: 'desc' } },
    });

    const rooms = memberships
      .map((m) => {
        const partnerMember = m.room.members.find((mm) => mm.userId !== myId);
        if (!partnerMember) return null;
        return chatRoomDto({
          ...m.room,
          partner: partnerMember.user,
          unreadCount: m.unreadCount,
        });
      })
      .filter(Boolean);
    res.json(rooms);
  } catch (err) {
    next(err);
  }
});

router.get('/rooms/:id', requireAuth, async (req, res, next) => {
  try {
    const myId = req.userId!;
    const room = await prisma.chatRoom.findUnique({
      where: { id: req.params.id! },
      include: { trip: true, members: { include: { user: true } } },
    });
    if (!room) throw new HttpError(404, 'not_found');
    const myMember = room.members.find((m) => m.userId === myId);
    if (!myMember) throw new HttpError(403, 'forbidden');
    const partnerMember = room.members.find((m) => m.userId !== myId);
    if (!partnerMember) throw new HttpError(404, 'no_partner');

    res.json(
      chatRoomDto({
        ...room,
        partner: partnerMember.user,
        unreadCount: myMember.unreadCount,
      }),
    );
  } catch (err) {
    next(err);
  }
});

const CreateRoomBody = z.object({ userId: z.string() });

router.post('/rooms', requireAuth, async (req, res, next) => {
  try {
    const myId = req.userId!;
    const body = CreateRoomBody.parse(req.body);
    if (body.userId === myId) throw new HttpError(400, 'cannot_chat_self');

    // Try to find an existing 1:1 room between the two.
    const existing = await prisma.chatRoom.findFirst({
      where: {
        AND: [
          { members: { some: { userId: myId } } },
          { members: { some: { userId: body.userId } } },
        ],
      },
      include: { trip: true, members: { include: { user: true } } },
    });

    let room = existing;
    if (!room) {
      const created = await prisma.chatRoom.create({
        data: {
          status: 'tips',
          members: { create: [{ userId: myId }, { userId: body.userId }] },
        },
      });
      room = await prisma.chatRoom.findUnique({
        where: { id: created.id },
        include: { trip: true, members: { include: { user: true } } },
      });
    }

    const partnerMember = room!.members.find((m) => m.userId !== myId)!;
    const myMember = room!.members.find((m) => m.userId === myId)!;
    res.json(chatRoomDto({ ...room!, partner: partnerMember.user, unreadCount: myMember.unreadCount }));
  } catch (err) {
    next(err);
  }
});

router.get('/rooms/:id/messages', requireAuth, async (req, res, next) => {
  try {
    const myId = req.userId!;
    const member = await prisma.chatMember.findUnique({
      where: { roomId_userId: { roomId: req.params.id!, userId: myId } },
    });
    if (!member) throw new HttpError(403, 'forbidden');

    const messages = await prisma.message.findMany({
      where: { roomId: req.params.id! },
      orderBy: { createdAt: 'asc' },
      take: 200,
    });

    // Pull trip data for any trip_share messages.
    const tripIds = messages.map((m) => m.tripId).filter((id): id is string => !!id);
    const trips = tripIds.length
      ? await prisma.trip.findMany({ where: { id: { in: tripIds } } })
      : [];
    const tripMap = new Map(trips.map((t) => [t.id, t]));

    // Reset unread on read.
    if (member.unreadCount > 0) {
      await prisma.chatMember.update({
        where: { roomId_userId: { roomId: req.params.id!, userId: myId } },
        data: { unreadCount: 0 },
      });
    }

    res.json(messages.map((m) => messageDto({ ...m, tripShared: m.tripId ? tripMap.get(m.tripId) ?? null : null })));
  } catch (err) {
    next(err);
  }
});

const SendMessageBody = z.union([
  z.object({ type: z.literal('text').optional(), content: z.string().min(1) }),
  z.object({ type: z.literal('trip_share'), tripId: z.string() }),
]);

router.post('/rooms/:id/messages', requireAuth, async (req, res, next) => {
  try {
    const myId = req.userId!;
    const roomId = req.params.id!;
    const member = await prisma.chatMember.findUnique({ where: { roomId_userId: { roomId, userId: myId } } });
    if (!member) throw new HttpError(403, 'forbidden');

    const body = SendMessageBody.parse(req.body);

    const created = await prisma.message.create({
      data: {
        roomId,
        senderId: myId,
        type: body.type === 'trip_share' ? 'trip_share' : 'text',
        content: body.type === 'trip_share' ? '' : (body as { content: string }).content,
        tripId: body.type === 'trip_share' ? body.tripId : null,
      },
    });

    // Bump room metadata and increment unread for the partner.
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: {
        lastMessage: created.content || '여행 일정 공유',
        lastMessageAt: created.createdAt,
      },
    });
    await prisma.chatMember.updateMany({
      where: { roomId, userId: { not: myId } },
      data: { unreadCount: { increment: 1 } },
    });

    const tripShared = created.tripId ? await prisma.trip.findUnique({ where: { id: created.tripId } }) : null;
    res.json(messageDto({ ...created, tripShared }));
  } catch (err) {
    next(err);
  }
});

router.post('/rooms/:id/accept', requireAuth, async (req, res, next) => {
  try {
    const myId = req.userId!;
    const member = await prisma.chatMember.findUnique({ where: { roomId_userId: { roomId: req.params.id!, userId: myId } } });
    if (!member) throw new HttpError(403, 'forbidden');
    await prisma.chatRoom.update({ where: { id: req.params.id! }, data: { status: 'accepted' } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.post('/rooms/:id/reject', requireAuth, async (req, res, next) => {
  try {
    const myId = req.userId!;
    const member = await prisma.chatMember.findUnique({ where: { roomId_userId: { roomId: req.params.id!, userId: myId } } });
    if (!member) throw new HttpError(403, 'forbidden');
    await prisma.chatRoom.update({ where: { id: req.params.id! }, data: { status: 'rejected' } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
