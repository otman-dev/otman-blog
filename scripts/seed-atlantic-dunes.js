const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/enterprise-blog';

const categories = [
  {
    name: 'Pôle Energie',
    slug: 'pole-energie',
    description: 'Optimisation énergétique et efficacité environnementale',
    color: '#22c55e'
  },
  {
    name: 'Pôle Air',
    slug: 'pole-air',
    description: 'Traitement de l\'air et des gaz industriels',
    color: '#3b82f6'
  },
  {
    name: 'Pôle Déchets',
    slug: 'pole-dechets',
    description: 'Traitement et valorisation des déchets',
    color: '#f59e0b'
  },
  {
    name: 'Pôle Eau',
    slug: 'pole-eau',
    description: 'Traitement des eaux urbaines et industrielles',
    color: '#06b6d4'
  },
  {
    name: 'Pôle Industrie',
    slug: 'pole-industrie',
    description: 'Études de risque et modélisation industrielle',
    color: '#6366f1'
  },
  {
    name: 'Pôle Eco-Bâtiment',
    slug: 'pole-eco-batiment',
    description: 'Construction éco-responsable et durable',
    color: '#10b981'
  }
];

const tags = [
  { name: 'Environnement', slug: 'environnement', description: 'Solutions environnementales', color: '#22c55e' },
  { name: 'Construction', slug: 'construction', description: 'Projets de construction', color: '#8b5cf6' },
  { name: 'Efficacité Énergétique', slug: 'efficacite-energetique', description: 'Optimisation énergétique', color: '#f59e0b' },
  { name: 'Traitement', slug: 'traitement', description: 'Technologies de traitement', color: '#06b6d4' },
  { name: 'Innovation', slug: 'innovation', description: 'Solutions innovantes', color: '#ec4899' },
  { name: 'Durable', slug: 'durable', description: 'Développement durable', color: '#10b981' },
  { name: 'Clé en Main', slug: 'cle-en-main', description: 'Solutions complètes', color: '#6366f1' },
  { name: 'Ingénierie', slug: 'ingenierie', description: 'Services d\'ingénierie', color: '#ef4444' },
  { name: 'Laboratoire', slug: 'laboratoire', description: 'Analyses et tests', color: '#84cc16' },
  { name: 'Équipements', slug: 'equipements', description: 'Matériels spécialisés', color: '#f97316' }
];

const posts = [
  {
    title: 'Le Pôle Eco-Bâtiment : Construction Durable et Éco-Responsable',
    slug: 'pole-eco-batiment-construction-durable',
    excerpt: 'Découvrez notre expertise en construction éco-bâtiments avec 16 ans d\'expérience en ingénierie industrielle et solutions clé-en-main.',
    content: `# Le Pôle Eco-Bâtiment : Votre Partenaire en Construction Durable

ATLANTIC DUNES fait partie d'un groupe de sociétés de construction du bâtiment, en contact direct avec des investisseurs dans le domaine. Il s'agit d'un groupe d'entreprises privées de construction de maisons et d'habitation (villas).

## Notre Expertise

Nous avons deux bureaux à TANGER et bénéficions de **16 ans d'expérience** en ingénierie industrielle et construction clé-en-main.

### Domaines de Compétences

- **Construction éco-bâtiments** : Solutions respectueuses de l'environnement
- **Énergie et environnement** : Intégration des technologies vertes
- **Projets clé-en-main** : De la conception à la réalisation
- **Ingénierie industrielle** : Expertise technique approfondie

## Pourquoi Choisir Atlantic Dunes ?

L'environnement est une affaire de tous. Nous mettons notre expertise au service de projets durables qui respectent les normes environnementales les plus strictes.

### Nos Services

1. **Étude et conception** de projets éco-responsables
2. **Réalisation complète** de constructions durables
3. **Accompagnement personnalisé** de nos clients
4. **Solutions innovantes** en matière d'efficacité énergétique

Vous avez un besoin ? Nous trouvons la solution et nous vous assistons. Vous imaginez, nous réalisons !`,
    author: 'Atlantic Dunes',
    categories: ['Pôle Eco-Bâtiment'],
    tags: ['Construction', 'Environnement', 'Durable', 'Clé en Main', 'Ingénierie'],
    status: 'published',
    publishedAt: new Date('2024-01-15')
  },
  {
    title: 'Pôle Industrie : Expertise en Études de Risque et Modélisation',
    slug: 'pole-industrie-etudes-risque-modelisation',
    excerpt: 'Notre pôle industrie dispose de bureaux d\'étude spécialisés et de laboratoires d\'analyses pour optimiser vos projets industriels.',
    content: `# Pôle Industrie : Excellence en Ingénierie Industrielle

Fort de plusieurs bureaux d'étude spécialisés dans l'étude de risque et la modélisation, de laboratoires d'analyses chimiques, de bruit et d'odeur, ce pôle permet aux différentes entreprises spécialisées dans les problématiques environnementales d'apporter à leur clientèle une vision objective de leur projet.

## Nos Capacités Techniques

### Bureaux d'Étude Spécialisés
- **Études de risques industriels**
- **Modélisation des processus**
- **Analyses environnementales**
- **Optimisation des techniques**

### Laboratoires d'Analyses
- **Analyses chimiques** complètes
- **Mesures de bruit** et nuisances sonores
- **Analyses d'odeurs** et pollutions olfactives
- **Contrôles qualité** environnementaux

## Vision Objective de Vos Projets

Notre approche multi-disciplinaire permet d'optimiser les techniques grâce à des laboratoires de pointe et une expertise reconnue dans le domaine industriel.

### Avantages de Notre Approche

1. **Expertise technique** approfondie
2. **Analyses objectives** et fiables
3. **Solutions optimisées** pour chaque projet
4. **Accompagnement complet** de la conception à la réalisation

## Secteurs d'Intervention

- Industries chimiques et pétrochimiques
- Agroalimentaire
- Pharmaceutique
- Métallurgie
- Traitement des déchets`,
    author: 'Atlantic Dunes',
    categories: ['Pôle Industrie'],
    tags: ['Ingénierie', 'Laboratoire', 'Innovation', 'Traitement', 'Environnement'],
    status: 'published',
    publishedAt: new Date('2024-01-20')
  },
  {
    title: 'Pôle Eau : Solutions Complètes de Traitement des Eaux',
    slug: 'pole-eau-traitement-eaux-urbaines-industrielles',
    excerpt: 'Le pôle EAU propose des procédés et équipements spécialisés pour traiter toute problématique de pollution des effluents liquides.',
    content: `# Pôle Eau : Expertise en Traitement des Eaux

Le pôle de l'EAU regroupe des entités compétentes afin de proposer des procédés de traitement ou des matériels spécialisés pour traiter toute problématique de pollution des effluents liquides dans la station de traitement des eaux urbaines ou industrielles.

## Équipements et Technologies

### Gamme Complète d'Équipements
- **Dégrilleurs** automatiques et manuels
- **Filtres presse** haute performance
- **Convoyeurs** spécialisés
- **Systèmes de séparation** avancés

### Procédés de Traitement
- **Traitement primaire** : Dégrillage et dessablage
- **Traitement secondaire** : Procédés biologiques
- **Traitement tertiaire** : Affinage et désinfection
- **Traitement des boues** : Épaississement et déshydratation

## Applications

### Eaux Urbaines
- Stations d'épuration municipales
- Réseaux d'assainissement
- Traitement des eaux pluviales
- Gestion des débordements

### Eaux Industrielles
- Effluents chimiques
- Eaux de process
- Recyclage et réutilisation
- Conformité réglementaire

## Notre Approche

1. **Diagnostic** complet de vos besoins
2. **Conception** de solutions sur mesure
3. **Fabrication** d'équipements adaptés
4. **Installation** et mise en service
5. **Maintenance** et support technique

## Avantages de Nos Solutions

- **Efficacité** de traitement optimisée
- **Fiabilité** des équipements
- **Conformité** aux normes environnementales
- **Économies** d'exploitation`,
    author: 'Atlantic Dunes',
    categories: ['Pôle Eau'],
    tags: ['Traitement', 'Équipements', 'Environnement', 'Innovation', 'Clé en Main'],
    status: 'published',
    publishedAt: new Date('2024-01-25')
  },
  {
    title: 'Pôle Déchets : Valorisation et Traitement Innovants',
    slug: 'pole-dechets-valorisation-traitement-innovants',
    excerpt: 'Notre pôle déchets regroupe des experts en tri et valorisation pour des solutions industrielles performantes.',
    content: `# Pôle Déchets : Excellence en Valorisation

Ce pôle traitement et valorisation des déchets regroupe différents concepteurs et équipementiers dans le domaine du tri et de la valorisation des déchets.

## Notre Expertise

Ce Pôle d'experts définit les process, vous accompagne dans la recherche de solutions industrielles performantes, conçoit et fabrique les équipements, réalise des installations clé en main.

### Services Complets
- **Définition des process** de traitement
- **Recherche de solutions** industrielles
- **Conception et fabrication** d'équipements
- **Installations clé en main** complètes

## Technologies de Tri et Valorisation

### Équipements de Tri
- **Trieurs optiques** haute précision
- **Séparateurs magnétiques** et à courants de Foucault
- **Cribles rotatifs** et vibrants
- **Convoyeurs** spécialisés

### Procédés de Valorisation
- **Valorisation énergétique** par combustion
- **Valorisation matière** par recyclage
- **Compostage** des déchets organiques
- **Méthanisation** pour la production de biogaz

## Types de Déchets Traités

- **Déchets ménagers** et assimilés
- **Déchets industriels** non dangereux
- **Déchets de construction** et démolition
- **Déchets verts** et organiques
- **Déchets électroniques** (DEEE)

## Avantages de Nos Solutions

1. **Optimisation** des taux de valorisation
2. **Réduction** des volumes mis en décharge
3. **Conformité** réglementaire assurée
4. **Rentabilité** économique des projets
5. **Impact environnemental** minimisé

## Accompagnement Personnalisé

Nous vous accompagnons à chaque étape de votre projet, de l'étude de faisabilité à la mise en service de vos installations.`,
    author: 'Atlantic Dunes',
    categories: ['Pôle Déchets'],
    tags: ['Traitement', 'Innovation', 'Équipements', 'Environnement', 'Clé en Main'],
    status: 'published',
    publishedAt: new Date('2024-02-01')
  },
  {
    title: 'Pôle Air : Traitement Avancé des Gaz et de l\'Air',
    slug: 'pole-air-traitement-gaz-industriels',
    excerpt: 'Notre pôle air dispose de références clients publiques et privées dans les traitements de l\'air et des gaz industriels.',
    content: `# Pôle Air : Maîtrise du Traitement des Gaz

Ce pôle d'experts dispose d'un nombre important de références clients publiques et privés dans les domaines des traitements de l'air et des gaz, et intervient dans la sécurisation des projets et la réalisation d'installations clé en main.

## Garanties de Performance

Nous apportons les **garanties de résultats** sur les concentrations des gaz et les performances de nos installations.

### Technologies de Traitement
- **Absorption** chimique et physique
- **Adsorption** sur charbon actif
- **Oxydation thermique** et catalytique
- **Biofiltration** pour les composés organiques
- **Électrofiltration** des particules

## Applications Industrielles

### Secteurs d'Intervention
- **Industries chimiques** et pétrochimiques
- **Agroalimentaire** et pharmaceutique
- **Sidérurgie** et métallurgie
- **Cimenteries** et matériaux
- **Traitement des déchets**

### Types de Polluants Traités
- **COV** (Composés Organiques Volatils)
- **Poussières** et particules fines
- **Gaz acides** (SO2, HCl, HF)
- **Oxydes d'azote** (NOx)
- **Métaux lourds**

## Sécurisation des Projets

Notre approche garantit la sécurisation complète de vos projets grâce à :

1. **Études préliminaires** approfondies
2. **Dimensionnement** précis des équipements
3. **Tests pilotes** si nécessaire
4. **Garanties contractuelles** de performance
5. **Suivi** et maintenance

## Installations Clé en Main

- **Conception** sur mesure
- **Fabrication** d'équipements
- **Installation** et mise en service
- **Formation** du personnel
- **Support technique** continu

## Conformité Réglementaire

Nos solutions garantissent le respect des normes environnementales les plus strictes et des réglementations en vigueur.`,
    author: 'Atlantic Dunes',
    categories: ['Pôle Air'],
    tags: ['Traitement', 'Innovation', 'Environnement', 'Clé en Main', 'Ingénierie'],
    status: 'published',
    publishedAt: new Date('2024-02-05')
  },
  {
    title: 'Pôle Énergie : Optimisation Énergétique Globale',
    slug: 'pole-energie-optimisation-energetique',
    excerpt: 'Notre équipe d\'ingénieurs propose une approche globale d\'optimisation énergétique avec des offres clé en main.',
    content: `# Pôle Énergie : Excellence en Efficacité Énergétique

Le pôle énergie propose avec son équipe d'ingénieries et d'installateurs une approche globale d'optimisation énergétique, suivie d'offres clé en main et de services centrés sur l'efficacité énergétique et environnementale des secteurs du tertiaire et de l'industrie.

## Approche Globale

### Services d'Ingénierie
- **Audits énergétiques** complets
- **Études de faisabilité** technique et économique
- **Conception** de solutions sur mesure
- **Optimisation** des consommations

### Technologies Intégrées
Différentes technologies sont étudiées et intégrées par le pôle énergie dans les projets clé en main :

- **Énergies renouvelables** (solaire, éolien, biomasse)
- **Cogénération** et trigénération
- **Pompes à chaleur** haute performance
- **Systèmes de récupération** d'énergie
- **Éclairage LED** et gestion intelligente

## Secteurs d'Application

### Tertiaire
- **Bureaux** et centres d'affaires
- **Hôpitaux** et établissements de santé
- **Écoles** et universités
- **Hôtels** et centres commerciaux

### Industrie
- **Process industriels** énergivores
- **Utilités** (air comprimé, vapeur, froid)
- **Éclairage** industriel
- **Systèmes de ventilation**

## Bénéfices de Nos Solutions

### Économiques
- **Réduction** des factures énergétiques
- **Amortissement** rapide des investissements
- **Subventions** et aides financières
- **Valorisation** du patrimoine

### Environnementaux
- **Réduction** des émissions de CO2
- **Préservation** des ressources naturelles
- **Amélioration** de l'empreinte carbone
- **Conformité** aux réglementations

## Offres Clé en Main

1. **Diagnostic** énergétique initial
2. **Étude** et conception des solutions
3. **Financement** et montages financiers
4. **Réalisation** des installations
5. **Maintenance** et exploitation
6. **Suivi** des performances

Notre expertise garantit des résultats mesurables et durables pour l'optimisation de votre consommation énergétique.`,
    author: 'Atlantic Dunes',
    categories: ['Pôle Energie'],
    tags: ['Efficacité Énergétique', 'Innovation', 'Environnement', 'Clé en Main', 'Ingénierie'],
    status: 'published',
    publishedAt: new Date('2024-02-10')
  }
];

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Clear existing data
    console.log('Clearing existing data...');
    await db.collection('categories').deleteMany({});
    await db.collection('tags').deleteMany({});
    await db.collection('posts').deleteMany({});
    
    // Insert categories
    console.log('Inserting categories...');
    const categoryResult = await db.collection('categories').insertMany(
      categories.map(cat => ({
        ...cat,
        id: cat.slug,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
    console.log(`Inserted ${categoryResult.insertedCount} categories`);
    
    // Insert tags
    console.log('Inserting tags...');
    const tagResult = await db.collection('tags').insertMany(
      tags.map(tag => ({
        ...tag,
        id: tag.slug,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
    console.log(`Inserted ${tagResult.insertedCount} tags`);
    
    // Insert posts
    console.log('Inserting posts...');
    const postResult = await db.collection('posts').insertMany(
      posts.map(post => ({
        ...post,
        id: post.slug,
        published: post.status === 'published',
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
    console.log(`Inserted ${postResult.insertedCount} posts`);
    
    // Create indexes
    console.log('Creating indexes...');
    await db.collection('categories').createIndex({ name: 1 }, { unique: true });
    await db.collection('categories').createIndex({ slug: 1 }, { unique: true });
    
    await db.collection('tags').createIndex({ name: 1 }, { unique: true });
    await db.collection('tags').createIndex({ slug: 1 }, { unique: true });
    
    await db.collection('posts').createIndex({ slug: 1 }, { unique: true });
    await db.collection('posts').createIndex({ title: 1 });
    await db.collection('posts').createIndex({ categories: 1 });
    await db.collection('posts').createIndex({ tags: 1 });
    await db.collection('posts').createIndex({ published: 1 });
    await db.collection('posts').createIndex({ publishedAt: -1 });
    
    console.log('Database seeded successfully!');
    
    // Summary
    console.log('\n=== SEED SUMMARY ===');
    console.log(`Categories: ${categories.length}`);
    console.log(`Tags: ${tags.length}`);
    console.log(`Posts: ${posts.length}`);
    console.log('\nCategories created:');
    categories.forEach(cat => console.log(`  - ${cat.name}`));
    console.log('\nSample posts created:');
    posts.forEach(post => console.log(`  - ${post.title}`));
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

// Run the seed function
seedDatabase();
