require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://rasmus:wordpiss@adro.ddns.net:27017/';
const DATABASE_NAME = process.env.DATABASE_NAME || 'otman-blog';

async function debugDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('\n=== MongoDB CONNECTION DETAILS ===');
    console.log('MONGODB_URI from env:', MONGODB_URI);
    console.log('DATABASE_NAME from env:', DATABASE_NAME);
    console.log('Connection string to use in MongoDB Compass:');
    console.log(MONGODB_URI);
    
    await client.connect();
    console.log('\n✓ Successfully connected to MongoDB');
    
    // Get server information
    const adminDb = client.db('admin');
    try {
      const serverInfo = await adminDb.command({ serverStatus: 1 });
      console.log('\n=== SERVER INFORMATION ===');
      console.log('MongoDB Version:', serverInfo.version);
      console.log('Host:', serverInfo.host);
    } catch (error) {
      console.log('Could not retrieve server status:', error.message);
    }
    
    // List all databases
    const dbs = await adminDb.admin().listDatabases();
    console.log('\n=== AVAILABLE DATABASES ===');
    dbs.databases.forEach(db => console.log(`  - ${db.name} (${(db.sizeOnDisk / (1024 * 1024)).toFixed(2)} MB)`));
    
    // Check if our database exists
    const dbExists = dbs.databases.some(db => db.name === DATABASE_NAME);
    console.log(`\nDatabase "${DATABASE_NAME}" exists: ${dbExists ? 'YES ✓' : 'NO ✗'}`);
    
    if (dbExists) {
      // Check the specific database
      const db = client.db(DATABASE_NAME);
      console.log(`\n=== EXAMINING DATABASE: ${DATABASE_NAME} ===`);
      
      const collections = await db.listCollections().toArray();
      console.log('Collections in database:');
      
      // Print collections and count documents
      for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`  - ${collection.name} (${count} documents)`);
      }
    }
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
