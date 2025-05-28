require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://rasmus:wordpiss@adro.ddns.net:27017/';
const DATABASE_NAME = process.env.DATABASE_NAME || 'otman-blog';

// Sample email subscriptions data
const email_subscriptions = [
  {
    id: "5a5bb419-d80d-4881-8584-432854df5a7e",
    email: "momouhib@gmail.com",
    subscribedAt: new Date("2025-05-27T14:57:29.627Z"),
    isActive: true,
    source: "coming_soon",
    ipAddress: "196.69.53.97",
    userAgent: "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36"
  },
  {
    id: uuidv4(),
    email: "subscriber@example.com",
    subscribedAt: new Date(),
    isActive: true,
    source: "blog_footer",
    ipAddress: "127.0.0.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  },
  {
    id: uuidv4(),
    email: "newsletter@example.com",
    subscribedAt: new Date(),
    isActive: true,
    source: "newsletter_popup",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  }
];

async function seedEmailSubscriptions() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DATABASE_NAME);
    const subscriptionsCollection = db.collection('email_subscriptions');
    
    // Drop existing collection
    await subscriptionsCollection.drop().catch(() => console.log('Email subscriptions collection does not exist yet, creating...'));
    
    // Insert email subscription data
    const result = await subscriptionsCollection.insertMany(email_subscriptions);
    console.log(`${result.insertedCount} email subscriptions inserted into the database`);
    
  } catch (error) {
    console.error('Error seeding email subscriptions collection:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seeding function
seedEmailSubscriptions().catch(console.error);
