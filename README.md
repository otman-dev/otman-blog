# Otman Blog

A modern, responsive personal blog platform built with Next.js, MongoDB, and Tailwind CSS. Features a mobile-first design, admin dashboard, and clean professional branding.

## 🚀 Features

- **Mobile-First Design**: Optimized for all devices with responsive layouts
- **Personal Branding**: Professional design with integrated personal branding
- **Admin Dashboard**: Secure admin panel for content management
- **Blog Management**: Create, edit, and manage blog posts with rich text content
- **Authentication**: Secure login system with session management
- **MongoDB Integration**: Robust database for storing posts, users, and content
- **SEO Optimized**: Meta tags and structured data for search engine optimization
- **Vercel Ready**: Configured for seamless deployment on Vercel

## 🏗 Architecture

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom Mouhib Otman theme
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: iron-session for secure session management
- **Deployment**: Vercel with custom configuration

## 🛠 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database (local or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd enterprise-blog
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Configure your `.env.local` file:
```env
MONGODB_URI=mongodb://localhost:27017/enterprise-blog
SESSION_SECRET=your-secret-key-here
```

4. Create admin user:
```bash
npm run create-admin
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## 📁 Project Structure

```
├── public/
│   ├── LogoMouhibOtman.svg   # Mouhib Otman logo
│   └── ...                   # Static assets
├── src/
│   ├── app/
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── api/             # API routes
│   │   ├── blog/            # Blog pages
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Coming soon homepage
│   └── lib/
│       ├── auth.ts          # Authentication utilities
│       ├── blog.ts          # Blog service functions
│       ├── mongodb.ts       # Database connection
│       ├── session.ts       # Session management
│       └── types.ts         # TypeScript interfaces
├── scripts/
│   └── create-admin.js      # Admin user creation script
└── middleware.ts            # Route protection
```

## 🔐 Admin Access

Default admin credentials:
- **Username**: admin
- **Password**: admin123

Access the admin panel at: `/admin/login`

## 🎨 Mouhib Otman Design

The platform features a professional blue-themed design with:
- Custom Mouhib Otman logo integration
- Enterprise-grade color scheme (blues and grays)
- Modern, clean typography
- Responsive mobile-first layout
- Professional UI components

## 🚀 Deployment

The project is configured for Vercel deployment with `vercel.json`. Simply:

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📱 Pages

- **Homepage** (`/`): Coming soon page with countdown and email signup
- **Blog Listing** (`/blog`): All published blog posts
- **Blog Post** (`/blog/[slug]`): Individual blog post pages
- **Admin Login** (`/admin/login`): Secure admin authentication
- **Admin Dashboard** (`/admin/dashboard`): Content management interface
- **New Post** (`/admin/posts/new`): Blog post creation page

## 🔧 API Endpoints

- `POST /api/auth/login` - Admin authentication
- `GET /api/auth/session` - Session validation
- `POST /api/auth/logout` - Admin logout
- `GET /api/blog/posts` - Fetch all posts
- `POST /api/blog/posts` - Create new post
- `GET /api/blog/posts/[id]` - Get post by ID
- `PUT /api/blog/posts/[id]` - Update post
- `DELETE /api/blog/posts/[id]` - Delete post
- `GET /api/blog/posts/by-slug/[slug]` - Get post by slug

## 📊 Database Seeding

### Mouhib Otman Content Seeding

To populate your database with Mouhib Otman content (categories, tags, and sample posts), run:

```bash
npm run seed-atlantic-dunes
```

This script will:
- **Clear existing data** (categories, tags, posts)
- **Create 6 categories** based on Mouhib Otman's expertise areas:
  - Pôle Energie (Energy)
  - Pôle Air (Air Treatment)
  - Pôle Déchets (Waste Management)
  - Pôle Eau (Water Treatment)
  - Pôle Industrie (Industrial Engineering)
  - Pôle Eco-Bâtiment (Eco-Building)
- **Create 10 relevant tags** for content categorization
- **Generate 6 comprehensive blog posts** about each pole
- **Set up database indexes** for optimal performance

**Note**: This will overwrite existing content. Make sure to backup your data if needed.

### Sample Content Included

The seeding script creates professional blog posts covering:
- Construction and eco-building expertise
- Industrial risk studies and modeling
- Water treatment solutions and equipment
- Waste management and valorization
- Air treatment and gas purification
- Energy optimization and efficiency

Each post includes:
- Professional French content about Atlantic Dunes services
- Proper categorization with relevant poles
- Strategic tag assignment for discoverability
- Rich markdown formatting with headers and lists
- Published status for immediate visibility

## 📄 License

This project is licensed under the MIT License.

---

**Mouhib Otman** - Personal insights and innovation
