import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/otman-blog';
const DATABASE_NAME = process.env.DATABASE_NAME || 'otman-blog';

async function createDefaultAdmin() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DATABASE_NAME);
    const usersCollection = db.collection('users');
    
    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ username: 'admin-visitor'});
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create default admin user
    const defaultAdmin = {
      id: uuidv4(),
      username: 'admin-visitor',
      email: 'admin-visitor@otman-blog.com',
      passwordHash: await bcrypt.hash('visitor123', 10),
      role: 'admin',
      firstName: 'admin',
      lastName: 'Visitor',
      createdAt: new Date().toISOString(),
    };
    
    await usersCollection.insertOne(defaultAdmin);
    console.log('Default admin user created successfully');
    console.log('Username: admin-visitor');
    console.log('Password: visitor123');
    console.log('⚠️  Please change the password after first login!');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.close();
  }
}

// Run the script
createDefaultAdmin().catch(console.error);
