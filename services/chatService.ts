import api from './api';
import { ChatRoom, Message, Trip } from '../types';
import { mockChatRooms, mockMessages, mockMessagesC1, mockMessagesC2, mockMyTrip } from '../mock/data';

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
  if (USE_MOCK) return;
  await api.post(`/chat/rooms/${roomId}/accept`);
}

export async function rejectCompanion(roomId: string): Promise<void> {
  if (USE_MOCK) return;
  await api.post(`/chat/rooms/${roomId}/reject`);
}

export async function startChat(userId: string): Promise<ChatRoom> {
  if (USE_MOCK) {
    const existing = mockChatRooms.find((r) => r.partner.id === userId);
    return existing ?? mockChatRooms[0];
  }
  const { data } = await api.post('/chat/rooms', { userId });
  return data;
}
