require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://rasmus:wordpiss@adro.ddns.net:27017/';
const DATABASE_NAME = process.env.DATABASE_NAME || 'otman-blog';

// Sample tags data
const tags = [
  {
    name: "Environnement",
    slug: "environnement",
    description: "Solutions environnementales",
    color: "#22c55e",
    id: "environnement",
    createdAt: new Date("2025-05-27T12:41:47.857Z"),
    updatedAt: new Date("2025-05-27T12:41:47.857Z")
  },
  {
    name: "Construction",
    slug: "construction",
    description: "Techniques et innovations en construction",
    color: "#f59e0b",
    id: "construction",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Durable",
    slug: "durable",
    description: "Développement durable et solutions pérennes",
    color: "#10b981",
    id: "durable",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Clé en Main",
    slug: "cle-en-main",
    description: "Solutions complètes prêtes à l'emploi",
    color: "#6366f1",
    id: "cle-en-main",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Ingénierie",
    slug: "ingenierie",
    description: "Expertise technique et solutions d'ingénierie",
    color: "#8b5cf6",
    id: "ingenierie",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Innovation",
    slug: "innovation",
    description: "Technologies et approches innovantes",
    color: "#ec4899",
    id: "innovation",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedTags() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DATABASE_NAME);
    const tagsCollection = db.collection('tags');
    
    // Drop existing collection
    await tagsCollection.drop().catch(() => console.log('Tags collection does not exist yet, creating...'));
    
    // Insert tag data
    const result = await tagsCollection.insertMany(tags);
    console.log(`${result.insertedCount} tags inserted into the database`);
    
  } catch (error) {
    console.error('Error seeding tags collection:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seeding function
seedTags().catch(console.error);
