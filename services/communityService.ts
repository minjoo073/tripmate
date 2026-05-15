import api from './api';
import { Post } from '../types';
import { mockPosts } from '../mock/data';

const USE_MOCK = !process.env.EXPO_PUBLIC_API_URL;

export async function getPosts(category?: 'mate' | 'tips' | 'review', city?: string): Promise<Post[]> {
  if (USE_MOCK) {
    let result = mockPosts;
    if (category) result = result.filter((p) => p.category === category);
    if (city && city !== '전체') result = result.filter((p) => p.trip?.destination === city);
    return result;
  }
  const { data } = await api.get('/community/posts', { params: { category, city } });
  return data;
}

export async function getPost(postId: string): Promise<Post> {
  if (USE_MOCK) {
    return mockPosts.find((p) => p.id === postId) ?? mockPosts[0];
  }
  const { data } = await api.get(`/community/posts/${postId}`);
  return data;
}

export async function likePost(postId: string): Promise<void> {
  if (USE_MOCK) return;
  await api.post(`/community/posts/${postId}/like`);
}

export async function createPost(post: Partial<Post>): Promise<Post> {
  if (USE_MOCK) return mockPosts[0];
  const { data } = await api.post('/community/posts', post);
  return data;
}
