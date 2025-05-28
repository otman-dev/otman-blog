require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://rasmus:wordpiss@adro.ddns.net:27017/';
const DATABASE_NAME = process.env.DATABASE_NAME || 'otman-blog';

// Sample posts data
const posts = [
  {
    title: "Construction Durable et Éco-Responsable",
    slug: "pole-eco-batiment-construction-durable",
    excerpt: "Découvrez notre expertise en construction éco-bâtiments avec 16 ans d'expérience en solutions durables.",
    content: `# Le Pôle Eco-Bâtiment : Votre Partenaire en Construction Durable

Le Pôle Eco-Bâtiment de Mouhib Otman vous offre une expertise complète en construction écologique et durable, développée au cours de mes 16 années d'expérience dans le secteur.

## Notre Approche

Notre équipe d'ingénieurs et de techniciens qualifiés s'engage à fournir des solutions éco-responsables qui répondent aux exigences les plus strictes en matière de durabilité et de performance énergétique.

## Services Clés en Main

- **Conception et construction** de bâtiments écologiques
- **Rénovation** pour améliorer l'efficacité énergétique
- **Développement** de projets durables
- **Consultation** en matière de construction verte

Contactez-nous dès aujourd'hui pour discuter de votre projet de construction durable.`,    author: "Mouhib Otman",
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

Le Pôle Énergie d'Atlantic Dunes propose des solutions sur mesure pour répondre aux défis énergétiques actuels.

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
  },
  {
    title: "Traitement de l'Air et Qualité Environnementale",
    slug: "traitement-air-qualite-environnementale",
    excerpt: "Découvrez comment nos solutions de traitement de l'air contribuent à un environnement plus sain et plus durable.",
    content: `# Traitement de l'Air et Qualité Environnementale

Notre Pôle Air propose des solutions avancées pour améliorer la qualité de l'air dans les environnements industriels et urbains.

## Technologies de Pointe

Nos systèmes de traitement d'air utilisent les technologies les plus récentes pour garantir une filtration optimale et une réduction significative des émissions polluantes.

## Applications

- **Industrie** : solutions de filtration et d'épuration des émissions
- **Espaces commerciaux** : systèmes de purification d'air
- **Environnements urbains** : monitoring et amélioration de la qualité de l'air
- **Projets résidentiels** : solutions intégrées pour un air plus sain

Améliorez votre empreinte environnementale et la santé de votre espace grâce à nos solutions de traitement d'air.`,    author: "Mouhib Otman",
    categories: ["Pôle Air"],
    tags: ["Environnement", "Innovation", "Ingénierie"],
    status: "published",
    publishedAt: new Date("2024-03-05T00:00:00.000Z"),
    id: "traitement-air-qualite-environnementale",
    published: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Gestion Durable des Ressources en Eau",
    slug: "gestion-durable-ressources-eau",
    excerpt: "Nos solutions innovantes pour la gestion et le traitement de l'eau contribuent à préserver cette ressource précieuse.",
    content: `# Gestion Durable des Ressources en Eau

Le Pôle Eau de Mouhib Otman développe des solutions intégrées pour optimiser l'utilisation de l'eau et améliorer sa qualité dans divers contextes.

## Notre Vision

Nous croyons que chaque goutte compte. Notre mission est de développer des technologies et des méthodes qui permettent une utilisation plus efficace et plus respectueuse de cette ressource limitée.

## Nos Services

- **Traitement des eaux usées** avec des technologies de pointe
- **Systèmes de récupération** et de recyclage des eaux
- **Solutions de filtration** adaptées à différentes applications
- **Conseil en gestion durable** des ressources hydriques

Engageons-nous ensemble dans une gestion plus responsable de nos ressources en eau.`,
    author: "Mouhib Otman",
    categories: ["Pôle Eau"],
    tags: ["Environnement", "Durable", "Innovation"],
    status: "published",
    publishedAt: new Date("2024-04-10T00:00:00.000Z"),
    id: "gestion-durable-ressources-eau",
    published: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedPosts() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DATABASE_NAME);
    const postsCollection = db.collection('posts');
    
    // Drop existing collection
    await postsCollection.drop().catch(() => console.log('Posts collection does not exist yet, creating...'));
    
    // Insert post data
    const result = await postsCollection.insertMany(posts);
    console.log(`${result.insertedCount} posts inserted into the database`);
    
  } catch (error) {
    console.error('Error seeding posts collection:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seeding function
seedPosts().catch(console.error);
