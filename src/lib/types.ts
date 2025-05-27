export interface Post {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Category {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  createdAt: string;
}

export interface User {
  _id?: string;
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'editor' | 'author';
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface SessionData {
  userId?: string;
  username?: string;
  role?: string;
  isAuthenticated?: boolean;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EmailSubscription {
  _id?: string;
  id: string;
  email: string;
  subscribedAt: string;
  isActive: boolean;
  source: 'coming_soon' | 'newsletter' | 'blog';
  ipAddress?: string;
  userAgent?: string;
}
