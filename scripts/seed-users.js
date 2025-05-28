require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://rasmus:wordpiss@adro.ddns.net:27017/';
const DATABASE_NAME = process.env.DATABASE_NAME || 'otman-blog';

// Sample users data
const users = [
  {
    id: "f4b14367-264e-418a-a03a-813f1844408d",
    username: "admin",
    email: "admin@example.com",
    passwordHash: "$2b$10$jT6K/9CK.PnC3Ww2g44SXeR1oEsauUDcHA0/mh7HydihD3nATS2l6", // You can generate a new one if needed
    role: "admin",
    firstName: "Admin",
    lastName: "User",
    createdAt: new Date("2025-05-27T00:59:16.365Z"),
    lastLogin: new Date("2025-05-28T16:32:58.760Z")
  },
  {
    id: uuidv4(),
    username: "otman",
    email: "otman@example.com",
    passwordHash: bcrypt.hashSync("securePassword123", 10), // Example of generating a new hash
    role: "admin",
    firstName: "Mouhib",
    lastName: "Otman",
    createdAt: new Date(),
    lastLogin: new Date()
  }
];

async function seedUsers() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DATABASE_NAME);
    const usersCollection = db.collection('users');
    
    // Drop existing collection
    await usersCollection.drop().catch(() => console.log('Users collection does not exist yet, creating...'));
    
    // Insert user data
    const result = await usersCollection.insertMany(users);
    console.log(`${result.insertedCount} users inserted into the database`);
    
  } catch (error) {
    console.error('Error seeding users collection:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seeding function
seedUsers().catch(console.error);
