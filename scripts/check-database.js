require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://rasmus:wordpiss@adro.ddns.net:27017/';
const DATABASE_NAME = process.env.DATABASE_NAME || 'otman-blog';

async function checkDatabase() {
  let client;

  try {
    console.log(`Connecting to MongoDB...`);
    console.log(`Database URI: ${MONGODB_URI}`);
    console.log(`Database name: ${DATABASE_NAME}`);
    
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB successfully');

    // List all databases
    const adminDb = client.db('admin');
    const { databases } = await adminDb.admin().listDatabases();
    console.log('Available databases:');
    databases.forEach(db => {
      console.log(`- ${db.name}`);
    });

    // Check if our database exists
    const databaseExists = databases.some(db => db.name === DATABASE_NAME);
    console.log(`Database '${DATABASE_NAME}' exists: ${databaseExists}`);

    if (!databaseExists) {
      console.log(`Creating database '${DATABASE_NAME}'...`);
      // In MongoDB, creating a database is as simple as using it
      const newDb = client.db(DATABASE_NAME);
      await newDb.createCollection('initialization');
      console.log(`Database '${DATABASE_NAME}' created successfully`);
    }

    // Now ensure all needed collections exist
    const db = client.db(DATABASE_NAME);
    const collections = ['users', 'posts', 'categories', 'tags', 'email_subscriptions'];
    
    for (const collection of collections) {
      const exists = await db.listCollections({ name: collection }).hasNext();
      if (!exists) {
        console.log(`Creating collection '${collection}'...`);
        await db.createCollection(collection);
        console.log(`Collection '${collection}' created successfully`);
      } else {
        console.log(`Collection '${collection}' already exists`);
      }
    }
    
    console.log('Database check completed successfully');
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the function
checkDatabase();
