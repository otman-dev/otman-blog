require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://rasmus:wordpiss@adro.ddns.net:27017/';
const DATABASE_NAME = process.env.DATABASE_NAME || 'otman-blog';

// Sample data for each collection based on provided examples
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
  }
];

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
  }
];

const posts = [
  {
    title: "Construction Durable et Éco-Responsable",
    slug: "pole-eco-batiment-construction-durable",
    excerpt: "Découvrez notre expertise en construction éco-bâtiments avec 16 ans d'expérience en solutions durables.",
    content: `# Le Pôle Eco-Bâtiment : Votre Partenaire en Construction Durable

ATL Le Pôle Eco-Bâtiment vous offre une expertise complète en construction écologique et durable, développée au cours de nos 16 années d'expérience dans le secteur.

## Notre Approche

Notre équipe d'ingénieurs et de techniciens qualifiés s'engage à fournir des solutions éco-responsables qui répondent aux exigences les plus strictes en matière de durabilité et de performance énergétique.

## Services Clés en Main

- **Conception et construction** de bâtiments écologiques
- **Rénovation** pour améliorer l'efficacité énergétique
- **Développement** de projets durables
- **Consultation** en matière de construction verte

Contactez-nous dès aujourd'hui pour discuter de votre projet de construction durable.`,
    author: "Mouhib Otman",
    categories: ["Pôle Eco-Bâtiment"],
    tags: ["Construction", "Environnement", "Durable", "Clé en Main", "Ingénierie"],
    status: "published",
    publishedAt: new Date("2024-01-15T00:00:00.000Z"),
    id: "pole-eco-batiment-construction-durable",
    published: true,
    createdAt: new Date("2025-05-27T12:41:47.937Z"),
    updatedAt: new Date("2025-05-27T21:00:04.029Z")
  },
  {
    title: "Solutions Énergétiques Innovantes",
    slug: "solutions-energetiques-innovantes",
    excerpt: "Explorez nos solutions énergétiques de pointe pour optimiser votre consommation et réduire votre empreinte carbone.",
    content: `# Solutions Énergétiques Innovantes

Le Pôle Énergie de Mouhib Otman propose des solutions sur mesure pour répondre aux défis énergétiques actuels.

## Notre Expertise

Avec une équipe d'experts en énergie renouvelable et en efficacité énergétique, nous vous accompagnons dans la transition vers des systèmes plus durables et économiques.

## Nos Solutions

- **Audit énergétique** pour identifier les opportunités d'amélioration
- **Intégration de sources d'énergies renouvelables**
- **Optimisation** des systèmes existants
- **Gestion intelligente** de la consommation énergétique

Contactez-nous pour développer votre stratégie énergétique durable.`,
    author: "Mouhib Otman",
    categories: ["Pôle Energie"],
    tags: ["Environnement", "Durable", "Ingénierie"],
    status: "published",
    publishedAt: new Date("2024-02-20T00:00:00.000Z"),
    id: "solutions-energetiques-innovantes",
    published: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

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
  }
];

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DATABASE_NAME);
    
    // Seed collections
    await seedCollection(db, 'users', users);
    await seedCollection(db, 'categories', categories);
    await seedCollection(db, 'tags', tags);
    await seedCollection(db, 'posts', posts);
    await seedCollection(db, 'email_subscriptions', email_subscriptions);
    
    console.log('All collections successfully seeded!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

async function seedCollection(db, collectionName, data) {
  try {
    // Drop existing collection to start fresh
    await db.collection(collectionName).drop().catch(() => console.log(`Collection ${collectionName} does not exist yet, creating...`));
    
    // Insert new data
    if (data.length > 0) {
      const result = await db.collection(collectionName).insertMany(data);
      console.log(`${result.insertedCount} documents inserted into collection: ${collectionName}`);
    } else {
      console.log(`No data to insert into collection: ${collectionName}`);
    }
  } catch (error) {
    console.error(`Error seeding collection ${collectionName}:`, error);
    throw error;
  }
}

// Run the seeding function
seedDatabase().catch(console.error);
