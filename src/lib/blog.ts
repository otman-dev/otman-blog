import { v4 as uuidv4 } from 'uuid';
import { getPostsCollection, getCategoriesCollection, initializeDatabase } from './mongodb';
import { Post, Category } from './types';

// Posts service
export async function getAllPosts(options: {
  published?: boolean;
  limit?: number;
  skip?: number;
  category?: string;
  featured?: boolean;
} = {}): Promise<Post[]> {
  try {
    await initializeDatabase();
    const postsCollection = await getPostsCollection();
      const filter: {
      published?: boolean;
      category?: string;
      featured?: boolean;
    } = {};
    
    if (options.published !== undefined) filter.published = options.published;
    if (options.category) filter.category = options.category;
    if (options.featured !== undefined) filter.featured = options.featured;
    
    const query = postsCollection.find(filter).sort({ createdAt: -1 });
    
    if (options.skip) query.skip(options.skip);
    if (options.limit) query.limit(options.limit);
    
    return await query.toArray();
  } catch (error) {
    console.error('Error getting posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    await initializeDatabase();
    const postsCollection = await getPostsCollection();
    return await postsCollection.findOne({ slug, published: true });
  } catch (error) {
    console.error('Error getting post by slug:', error);
    return null;
  }
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    await initializeDatabase();
    const postsCollection = await getPostsCollection();
    return await postsCollection.findOne({ id });
  } catch (error) {
    console.error('Error getting post by id:', error);
    return null;
  }
}

export async function createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post | null> {
  try {
    await initializeDatabase();
    const postsCollection = await getPostsCollection();
    
    const newPost: Post = {
      ...postData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: postData.published ? new Date().toISOString() : undefined,
    };
    
    await postsCollection.insertOne(newPost);
    return newPost;
  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
}

export async function updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
  try {
    await initializeDatabase();
    const postsCollection = await getPostsCollection();
    
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    // If publishing for the first time, set publishedAt
    if (updates.published && !updates.publishedAt) {
      const existingPost = await postsCollection.findOne({ id });
      if (existingPost && !existingPost.published) {
        updateData.publishedAt = new Date().toISOString();
      }
    }
    
    const result = await postsCollection.findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    return result || null;
  } catch (error) {
    console.error('Error updating post:', error);
    return null;
  }
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    await initializeDatabase();
    const postsCollection = await getPostsCollection();
    const result = await postsCollection.deleteOne({ id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}

// Categories service
export async function getAllCategories(): Promise<Category[]> {
  try {
    await initializeDatabase();
    const categoriesCollection = await getCategoriesCollection();
    return await categoriesCollection.find({}).sort({ name: 1 }).toArray();
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    await initializeDatabase();
    const categoriesCollection = await getCategoriesCollection();
    return await categoriesCollection.findOne({ slug });
  } catch (error) {
    console.error('Error getting category by slug:', error);
    return null;
  }
}

export async function createCategory(categoryData: Omit<Category, 'id' | 'createdAt'>): Promise<Category | null> {
  try {
    await initializeDatabase();
    const categoriesCollection = await getCategoriesCollection();
    
    const newCategory: Category = {
      ...categoryData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    
    await categoriesCollection.insertOne(newCategory);
    return newCategory;
  } catch (error) {
    console.error('Error creating category:', error);
    return null;
  }
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  try {
    await initializeDatabase();
    const categoriesCollection = await getCategoriesCollection();
    
    const result = await categoriesCollection.findOneAndUpdate(
      { id },
      { $set: updates },
      { returnDocument: 'after' }
    );
    
    return result || null;
  } catch (error) {
    console.error('Error updating category:', error);
    return null;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    await initializeDatabase();
    const categoriesCollection = await getCategoriesCollection();
    const result = await categoriesCollection.deleteOne({ id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
}

// Utility functions
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function truncateText(text: string, length: number = 150): string {
  if (text.length <= length) return text;
  return text.substring(0, length).replace(/\s+\S*$/, '') + '...';
}
