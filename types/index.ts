export interface User {
  id: string;
  nickname: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  location: string;
  mbti?: string;
  bio?: string;
  avatar?: string;
  travelStyles: string[];
  travelCount: number;
  rating: number;
  followers: number;
  isVerified: boolean;
  reviews?: Review[];
}

export interface Trip {
  id: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  travelStyles: string[];
  schedule?: ScheduleItem[];
}

export interface ScheduleItem {
  date: string;
  activities: string[];
}

export interface MatchResult {
  user: User;
  matchRate: number;
  trip: Trip;
}

export interface Review {
  id: string;
  reviewer: User;
  rating: number;
  content: string;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  partner: User;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  trip?: Trip;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  type: 'text' | 'trip_share';
  tripData?: Trip;
}

export interface Post {
  id: string;
  author: User;
  title: string;
  content: string;
  category: 'mate' | 'tips' | 'review';
  travelStyles: string[];
  trip?: Trip;
  likes: number;
  comments: number;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  token: string;
}

export interface FindMateFilter {
  destination: string;
  startDate: string;
  endDate: string;
  travelStyles: string[];
  anyGender: boolean;
  scheduleOverlap: boolean;
  verifiedOnly: boolean;
}
