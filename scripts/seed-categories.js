require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://rasmus:wordpiss@adro.ddns.net:27017/';
const DATABASE_NAME = process.env.DATABASE_NAME || 'otman-blog';

// Sample categories data
const categories = [
  {
    name: "Pôle Energie",
    slug: "pole-energie",
    description: "Optimisation énergétique et efficacité environnementale",
    color: "#22c55e",
    id: "pole-energie",
    createdAt: new Date("2025-05-27T12:41:47.776Z"),
    updatedAt: new Date("2025-05-27T12:41:47.776Z")
  },
  {
    name: "Pôle Eco-Bâtiment",
    slug: "pole-eco-batiment",
    description: "Construction durable et solutions éco-responsables",
    color: "#8b5cf6",
    id: "pole-eco-batiment",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Pôle Digital",
    slug: "pole-digital",
    description: "Solutions numériques et transformation digitale",
    color: "#3b82f6",
    id: "pole-digital", 
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Pôle Air",
    slug: "pole-air",
    description: "Traitement de l'air et des gaz industriels",
    color: "#0ea5e9",
    id: "pole-air", 
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Pôle Eau",
    slug: "pole-eau",
    description: "Gestion et traitement des eaux",
    color: "#06b6d4",
    id: "pole-eau", 
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedCategories() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DATABASE_NAME);
    const categoriesCollection = db.collection('categories');
    
    // Drop existing collection
    await categoriesCollection.drop().catch(() => console.log('Categories collection does not exist yet, creating...'));
    
    // Insert category data
    const result = await categoriesCollection.insertMany(categories);
    console.log(`${result.insertedCount} categories inserted into the database`);
    
  } catch (error) {
    console.error('Error seeding categories collection:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seeding function
seedCategories().catch(console.error);
