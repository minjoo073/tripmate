// Shape transformers — DB rows → frontend-friendly JSON
// Mirrors tripmate/types/index.ts

import type {
  User as DbUser,
  Trip as DbTrip,
  ChatRoom as DbChatRoom,
  Message as DbMessage,
  Post as DbPost,
} from '@prisma/client';

export function userDto(u: DbUser) {
  return {
    id: u.id,
    nickname: u.nickname,
    age: u.age,
    gender: u.gender,
    location: u.location,
    mbti: u.mbti ?? undefined,
    bio: u.bio ?? undefined,
    avatar: u.avatar ?? undefined,
    travelStyles: u.travelStyles,
    travelCount: u.travelCount,
    rating: u.rating,
    followers: u.followers,
    isVerified: u.isVerified,
  };
}

export function tripDto(t: DbTrip) {
  return {
    id: t.id,
    destination: t.destination,
    country: t.country,
    startDate: t.startDate.toISOString(),
    endDate: t.endDate.toISOString(),
    travelStyles: t.travelStyles,
    schedule: (t.schedule as unknown) ?? undefined,
  };
}

export function messageDto(m: DbMessage & { tripShared?: DbTrip | null }) {
  return {
    id: m.id,
    senderId: m.senderId,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    type: m.type,
    tripData: m.tripShared ? tripDto(m.tripShared) : undefined,
  };
}

export function chatRoomDto(
  room: DbChatRoom & { partner: DbUser; trip: DbTrip | null; unreadCount: number },
) {
  return {
    id: room.id,
    partner: userDto(room.partner),
    lastMessage: room.lastMessage,
    lastMessageAt: room.lastMessageAt.toISOString(),
    unreadCount: room.unreadCount,
    trip: room.trip ? tripDto(room.trip) : undefined,
    status: room.status,
  };
}

export function postDto(p: DbPost & { author: DbUser; trip: DbTrip | null }) {
  return {
    id: p.id,
    author: userDto(p.author),
    title: p.title,
    content: p.content,
    category: p.category,
    travelStyles: p.travelStyles,
    trip: p.trip ? tripDto(p.trip) : undefined,
    likes: p.likesCount,
    comments: p.commentsCount,
    createdAt: p.createdAt.toISOString(),
  };
}
