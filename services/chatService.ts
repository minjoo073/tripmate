import api from './api';
import { ChatRoom, Message, Trip } from '../types';
import { mockChatRooms, mockMessages, mockMessagesC1, mockMessagesC2, mockMessagesC3, mockMyTrip, mockUsers } from '../mock/data';

const dynamicRooms = new Map<string, ChatRoom>();

export function getDynamicRoom(id: string): ChatRoom | undefined {
  return dynamicRooms.get(id);
}

const USE_MOCK = !process.env.EXPO_PUBLIC_API_URL;

export async function getChatRooms(): Promise<ChatRoom[]> {
  if (USE_MOCK) return mockChatRooms;
  const { data } = await api.get('/chat/rooms');
  return data;
}

export async function getMessages(roomId: string): Promise<Message[]> {
  if (USE_MOCK) {
    if (roomId === 'c1') return mockMessagesC1;
    if (roomId === 'c2') return mockMessagesC2;
    if (roomId === 'c3') return [];
    if (roomId.startsWith('dyn_')) return [];
    return mockMessages;
  }
  const { data } = await api.get(`/chat/rooms/${roomId}/messages`);
  return data;
}

export async function sendTripCard(roomId: string, trip: Trip): Promise<Message> {
  if (USE_MOCK) {
    return { id: Date.now().toString(), senderId: 'me', content: '', createdAt: new Date().toISOString(), type: 'trip_share', tripData: trip };
  }
  const { data } = await api.post(`/chat/rooms/${roomId}/messages`, { type: 'trip_share', tripId: trip.id });
  return data;
}

export async function sendMessage(roomId: string, content: string): Promise<Message> {
  if (USE_MOCK) {
    return { id: Date.now().toString(), senderId: 'me', content, createdAt: new Date().toISOString(), type: 'text' };
  }
  const { data } = await api.post(`/chat/rooms/${roomId}/messages`, { content });
  return data;
}

export async function acceptCompanion(roomId: string): Promise<void> {
  if (USE_MOCK) {
    const room = mockChatRooms.find((r) => r.id === roomId);
    if (room) room.status = 'accepted';
    return;
  }
  await api.post(`/chat/rooms/${roomId}/accept`);
}

export async function rejectCompanion(roomId: string): Promise<void> {
  if (USE_MOCK) return;
  await api.post(`/chat/rooms/${roomId}/reject`);
}

export async function startChat(userId: string): Promise<ChatRoom> {
  if (USE_MOCK) {
    const existing = mockChatRooms.find((r) => r.partner.id === userId);
    if (existing) return existing;

    const dynKey = `dyn_${userId}`;
    if (dynamicRooms.has(dynKey)) return dynamicRooms.get(dynKey)!;

    const partner = mockUsers.find((u) => u.id === userId);
    if (partner) {
      const room: ChatRoom = {
        id: dynKey,
        partner,
        lastMessage: '',
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
        status: 'tips',
      };
      dynamicRooms.set(dynKey, room);
      return room;
    }
    return mockChatRooms[0];
  }
  const { data } = await api.post('/chat/rooms', { userId });
  return data;
}
