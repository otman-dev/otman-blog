import { v4 as uuidv4 } from 'uuid';
import { getPostsCollection, getCategoriesCollection, getTagsCollection, initializeDatabase } from './mongodb';
import { Post, Category, Tag } from './types';

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
    console.log('getPostById: Looking for post with ID:', id);
    await initializeDatabase();
    const postsCollection = await getPostsCollection();
    
    // First try to find by custom id field
    console.log('getPostById: Trying custom id field...');
    let post = await postsCollection.findOne({ id });
    console.log('getPostById: Found by custom id:', post ? 'YES' : 'NO');
    
    // If not found, try to find by MongoDB _id field
    if (!post) {
      console.log('getPostById: Trying MongoDB _id field...');
      try {
        // Check if the id is a valid MongoDB ObjectId
        const { ObjectId } = await import('mongodb');
        console.log('getPostById: Is valid ObjectId:', ObjectId.isValid(id));
        if (ObjectId.isValid(id)) {
          console.log('getPostById: Trying ObjectId format...');
          post = await postsCollection.findOne({ _id: new ObjectId(id) } as any);
          console.log('getPostById: Found by ObjectId:', post ? 'YES' : 'NO');
        }
      } catch (error) {
        console.log('getPostById: ObjectId failed, trying string _id:', id);
        // Try as string _id in case it's stored as string
        post = await postsCollection.findOne({ _id: id } as any);
        console.log('getPostById: Found by string _id:', post ? 'YES' : 'NO');
      }
    }
    
    console.log('getPostById: Final result:', post ? `Found: ${post.title}` : 'Not found');
    return post;
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
    
    // Store the post with both categories and tags fields
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
      // First try to find existing post by custom id
      let existingPost = await postsCollection.findOne({ id });
        // If not found, try by MongoDB _id
      if (!existingPost) {
        try {
          const { ObjectId } = await import('mongodb');
          if (ObjectId.isValid(id)) {
            existingPost = await postsCollection.findOne({ _id: new ObjectId(id) } as any);
          }
        } catch (error) {
          existingPost = await postsCollection.findOne({ _id: id } as any);
        }
      }
      
      if (existingPost && !existingPost.published) {
        updateData.publishedAt = new Date().toISOString();
      }
    }
    
    // Try to update by custom id first
    let result = await postsCollection.findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    // If not found, try updating by MongoDB _id
    if (!result) {
      try {
        const { ObjectId } = await import('mongodb');        if (ObjectId.isValid(id)) {
          result = await postsCollection.findOneAndUpdate(
            { _id: new ObjectId(id) } as any,
            { $set: updateData },
            { returnDocument: 'after' }
          );
        }
      } catch (error) {
        // Try as string _id
        result = await postsCollection.findOneAndUpdate(
          { _id: id } as any,
          { $set: updateData },
          { returnDocument: 'after' }
        );
      }
    }
    
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
    
    // Try to delete by custom id first
    let result = await postsCollection.deleteOne({ id });
    
    // If not found, try deleting by MongoDB _id
    if (result.deletedCount === 0) {
      try {
        const { ObjectId } = await import('mongodb');        if (ObjectId.isValid(id)) {
          result = await postsCollection.deleteOne({ _id: new ObjectId(id) } as any);
        }
      } catch (error) {
        // Try as string _id
        result = await postsCollection.deleteOne({ _id: id } as any);
      }
    }
    
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

// Tags service
export async function getAllTags(): Promise<Tag[]> {
  try {
    await initializeDatabase();
    const tagsCollection = await getTagsCollection();
    const tags = await tagsCollection.find({}).sort({ name: 1 }).toArray();
    
    // Add post count for each tag
    const postsCollection = await getPostsCollection();
    const tagsWithCounts = await Promise.all(
      tags.map(async (tag) => {
        const postCount = await postsCollection.countDocuments({ tags: tag.name });
        return { ...tag, postCount };
      })
    );
    
    return tagsWithCounts;
  } catch (error) {
    console.error('Error getting tags:', error);
    return [];
  }
}

export async function createTag(tagData: Omit<Tag, 'id' | 'createdAt'>): Promise<Tag | null> {
  try {
    await initializeDatabase();
    const tagsCollection = await getTagsCollection();
    
    const newTag: Tag = {
      ...tagData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    
    await tagsCollection.insertOne(newTag);
    return newTag;
  } catch (error) {
    console.error('Error creating tag:', error);
    return null;
  }
}

export async function updateTag(id: string, updates: Partial<Tag>): Promise<Tag | null> {
  try {
    await initializeDatabase();
    const tagsCollection = await getTagsCollection();
    
    const result = await tagsCollection.findOneAndUpdate(
      { id },
      { $set: updates },
      { returnDocument: 'after' }
    );
    
    return result || null;
  } catch (error) {
    console.error('Error updating tag:', error);
    return null;
  }
}

export async function deleteTag(id: string): Promise<boolean> {
  try {
    await initializeDatabase();
    const tagsCollection = await getTagsCollection();
    const result = await tagsCollection.deleteOne({ id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting tag:', error);
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
