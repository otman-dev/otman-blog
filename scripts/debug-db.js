require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/enterprise-blog';
const DATABASE_NAME = process.env.DATABASE_NAME || 'enterprise-blog';

async function debugDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    console.log('MONGODB_URI:', MONGODB_URI);
    console.log('DATABASE_NAME from env:', DATABASE_NAME);
    
    // List all databases
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    console.log('\nAvailable databases:');
    dbs.databases.forEach(db => console.log(`  - ${db.name}`));
    
    // Check the specific database
    const db = client.db(DATABASE_NAME);
    console.log(`\nChecking database: ${DATABASE_NAME}`);
    
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Check collection counts
    for (const collection of ['categories', 'tags', 'posts']) {
      try {
        const count = await db.collection(collection).countDocuments();
        console.log(`${collection}: ${count} documents`);
      } catch (error) {
        console.log(`${collection}: collection doesn't exist`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

debugDatabase();
