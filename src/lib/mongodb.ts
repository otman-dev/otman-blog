import { MongoClient, Db, Collection } from 'mongodb';
import { Post, Category, User, EmailSubscription } from './types';

const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = process.env.DATABASE_NAME || 'enterprise_blog';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<{ db: Db; client: MongoClient }> {
  if (!client) {
    try {
      console.log('Connecting to MongoDB...');
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  if (!db) {
    db = client.db(DB_NAME);
  }

  return { db, client };
}

export async function getPostsCollection(): Promise<Collection<Post>> {
  const { db } = await connectToDatabase();
  return db.collection<Post>('posts');
}

export async function getCategoriesCollection(): Promise<Collection<Category>> {
  const { db } = await connectToDatabase();
  return db.collection<Category>('categories');
}

export async function getUsersCollection(): Promise<Collection<User>> {
  const { db } = await connectToDatabase();
  return db.collection<User>('users');
}

export async function getEmailSubscriptionsCollection(): Promise<Collection<EmailSubscription>> {
  const { db } = await connectToDatabase();
  return db.collection<EmailSubscription>('email_subscriptions');
}

export async function initializeDatabase() {
  try {
    await connectToDatabase();
    
    // Create indexes for better performance
    const postsCollection = await getPostsCollection();
    const categoriesCollection = await getCategoriesCollection();
    const usersCollection = await getUsersCollection();
    const emailSubscriptionsCollection = await getEmailSubscriptionsCollection();

    await Promise.all([
      postsCollection.createIndex({ slug: 1 }, { unique: true }),
      postsCollection.createIndex({ published: 1 }),
      postsCollection.createIndex({ category: 1 }),
      postsCollection.createIndex({ createdAt: -1 }),
      categoriesCollection.createIndex({ slug: 1 }, { unique: true }),
      usersCollection.createIndex({ username: 1 }, { unique: true }),
      usersCollection.createIndex({ email: 1 }, { unique: true }),
      emailSubscriptionsCollection.createIndex({ email: 1 }, { unique: true }),
      emailSubscriptionsCollection.createIndex({ subscribedAt: -1 }),
      emailSubscriptionsCollection.createIndex({ source: 1 }),
    ]);

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}
