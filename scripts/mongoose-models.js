const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://rasmus:wordpiss@adro.ddns.net:27017/';
const DATABASE_NAME = process.env.DATABASE_NAME || 'otman-blog';

// Keep the connection string as is, without adding dbName parameter
const URI = MONGODB_URI;

// Create Mongoose schemas directly in JS
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  color: { type: String, required: true },
  createdAt: { type: String, required: true },
  postCount: { type: Number, required: false }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret.__v;
      return ret;
    }
  }
});

const TagSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: false },
  color: { type: String, required: false },
  createdAt: { type: String, required: true },
  postCount: { type: Number, required: false }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret.__v;
      return ret;
    }
  }
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  categories: { type: [String], required: true },
  tags: { type: [String], required: true },
  published: { type: Boolean, required: true, default: false },
  featured: { type: Boolean, required: true, default: false },
  imageUrl: { type: String, required: false },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
  publishedAt: { type: String, required: false },
  metaDescription: { type: String, required: false },
  metaKeywords: { type: String, required: false },
  readingTime: { type: Number, required: false }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret.__v;
      return ret;
    }
  }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'editor', 'author'] },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: { type: String, required: false },
  createdAt: { type: String, required: true },
  lastLogin: { type: String, required: false }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret.passwordHash;
      delete ret.__v;
      return ret;
    }
  }
});

const EmailSubscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: String, required: true },
  isActive: { type: Boolean, required: true, default: true },
  source: { type: String, required: true, enum: ['coming_soon', 'newsletter', 'blog'] },
  ipAddress: { type: String, required: false },
  userAgent: { type: String, required: false }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret.__v;
      return ret;
    }
  }
});

// Create models
const models = {
  Category: mongoose.models.Category || mongoose.model('Category', CategorySchema),
  Tag: mongoose.models.Tag || mongoose.model('Tag', TagSchema),
  Post: mongoose.models.Post || mongoose.model('Post', PostSchema),
  User: mongoose.models.User || mongoose.model('User', UserSchema),
  EmailSubscription: mongoose.models.EmailSubscription || mongoose.model('EmailSubscription', EmailSubscriptionSchema)
};

// Connect function
const connectToMongoose = async () => {
  console.log('Connecting to MongoDB with Mongoose...');
  return mongoose.connect(URI, {
    dbName: DATABASE_NAME,
    bufferCommands: false
  });
};

module.exports = {
  connectToMongoose,
  ...models
};
