import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { ChatRoom, Message, Trip } from '../types';
import { mockChatRooms, mockMessages, mockMessagesC1, mockMessagesC2, mockMyTrip, mockUsers } from '../mock/data';

const USE_MOCK = !process.env.EXPO_PUBLIC_API_URL;

const MSGS_KEY = (roomId: string) => `chat_msgs_${roomId}`;
const DYN_ROOMS_KEY = 'chat_dyn_rooms';
const CONFIRMED_KEY = (roomId: string) => `chat_confirmed_${roomId}`;

// Once a companion is confirmed, the demo room stops replaying and shows the
// full conversation (persisted across reloads).
export async function isRoomConfirmed(roomId: string): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(CONFIRMED_KEY(roomId))) === '1';
  } catch {
    return false;
  }
}

// Seed messages for the built-in mock rooms (used until the user sends something).
function baseMessages(roomId: string): Message[] {
  if (roomId === 'c1') return mockMessagesC1;
  if (roomId === 'c2') return mockMessagesC2;
  if (roomId === 'c3') return [];
  if (roomId.startsWith('dyn_')) return [];
  return mockMessages;
}

async function loadDynRooms(): Promise<ChatRoom[]> {
  try {
    const stored = await AsyncStorage.getItem(DYN_ROOMS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

async function saveDynRooms(rooms: ChatRoom[]): Promise<void> {
  await AsyncStorage.setItem(DYN_ROOMS_KEY, JSON.stringify(rooms));
}

export async function getChatRooms(): Promise<ChatRoom[]> {
  if (USE_MOCK) {
    const dyn = await loadDynRooms();
    return [...dyn, ...mockChatRooms];
  }
  const { data } = await api.get('/chat/rooms');
  return data;
}

export async function getRoom(id: string): Promise<ChatRoom | undefined> {
  if (USE_MOCK) {
    const mock = mockChatRooms.find((r) => r.id === id);
    if (mock) return mock;
    const dyn = await loadDynRooms();
    return dyn.find((r) => r.id === id);
  }
  const { data } = await api.get(`/chat/rooms/${id}`);
  return data;
}

export async function getMessages(roomId: string): Promise<Message[]> {
  if (USE_MOCK) {
    if (roomId.startsWith('dyn_')) {
      const stored = await AsyncStorage.getItem(MSGS_KEY(roomId));
      return stored ? JSON.parse(stored) : [];
    }
    // Built-in demo rooms always return their scripted conversation (replayed in the UI).
    return baseMessages(roomId);
  }
  const { data } = await api.get(`/chat/rooms/${roomId}/messages`);
  return data;
}

// Persist a message — only for dynamic (user-started) rooms. Demo rooms are
// scripted showcases that replay on each entry, so they are not persisted.
async function appendStored(roomId: string, msg: Message): Promise<void> {
  if (!roomId.startsWith('dyn_')) return;
  const stored = await AsyncStorage.getItem(MSGS_KEY(roomId));
  const list: Message[] = stored ? JSON.parse(stored) : [];
  await AsyncStorage.setItem(MSGS_KEY(roomId), JSON.stringify([...list, msg]));

  if (msg.type === 'text' && msg.content) {
    const dyn = await loadDynRooms();
    const idx = dyn.findIndex((r) => r.id === roomId);
    if (idx >= 0) {
      dyn[idx] = { ...dyn[idx], lastMessage: msg.content, lastMessageAt: msg.createdAt };
      await saveDynRooms(dyn);
    }
  }
}

export async function sendTripCard(roomId: string, trip: Trip): Promise<Message> {
  const msg: Message = { id: Date.now().toString(), senderId: 'me', content: '', createdAt: new Date().toISOString(), type: 'trip_share', tripData: trip };
  if (USE_MOCK) {
    await appendStored(roomId, msg);
    return msg;
  }
  const { data } = await api.post(`/chat/rooms/${roomId}/messages`, { type: 'trip_share', tripId: trip.id });
  return data;
}

export async function sendMessage(roomId: string, content: string): Promise<Message> {
  const msg: Message = { id: Date.now().toString(), senderId: 'me', content, createdAt: new Date().toISOString(), type: 'text' };
  if (USE_MOCK) {
    await appendStored(roomId, msg);
    return msg;
  }
  const { data } = await api.post(`/chat/rooms/${roomId}/messages`, { content });
  return data;
}

const AUTO_REPLIES = [
  '오 좋아요! 저도 그 일정 비슷해요 😊',
  '반가워요! 여행 스타일 잘 맞을 것 같아요',
  '좋네요, 더 자세히 얘기해볼까요?',
  '저도 거기 가보고 싶었어요!',
  '일정 공유해주시면 맞춰볼게요 ✈️',
  '헉 완전 좋은 코스인데요?',
];

// Simulated partner reply (mock only) — keeps the conversation feeling alive.
export async function sendAutoReply(roomId: string, partnerId: string): Promise<Message> {
  const content = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
  const msg: Message = { id: `${Date.now()}_r`, senderId: partnerId, content, createdAt: new Date().toISOString(), type: 'text' };
  await appendStored(roomId, msg);
  return msg;
}

export async function acceptCompanion(roomId: string): Promise<void> {
  if (USE_MOCK) {
    const room = mockChatRooms.find((r) => r.id === roomId);
    if (room) room.status = 'accepted';
    await AsyncStorage.setItem(CONFIRMED_KEY(roomId), '1');
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
    const dyn = await loadDynRooms();
    const existingDyn = dyn.find((r) => r.id === dynKey);
    if (existingDyn) return existingDyn;

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
      await saveDynRooms([room, ...dyn]);
      return room;
    }
    return mockChatRooms[0];
  }
  const { data } = await api.post('/chat/rooms', { userId });
  return data;
}
