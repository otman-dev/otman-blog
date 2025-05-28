import mongoose, { Document, Schema } from 'mongoose';
import { Post } from '../lib/types';

export interface PostDocument extends Omit<Post, '_id' | 'id'>, Document {
  id: string; // Document already provides id
}

const PostSchema = new Schema<PostDocument>(
  {
    title: { 
      type: String, 
      required: true 
    },
    slug: { 
      type: String, 
      required: true, 
      unique: true,
      index: true
    },
    content: { 
      type: String, 
      required: true 
    },
    excerpt: { 
      type: String, 
      required: true 
    },
    author: { 
      type: String, 
      required: true 
    },
    category: { 
      type: String, 
      required: true,
      index: true
    },
    categories: { 
      type: [String], 
      required: true,
      index: true
    },
    tags: { 
      type: [String], 
      required: true,
      index: true
    },
    published: { 
      type: Boolean, 
      required: true,
      default: false,
      index: true
    },
    featured: { 
      type: Boolean, 
      required: true,
      default: false
    },
    imageUrl: { 
      type: String, 
      required: false 
    },
    createdAt: { 
      type: String, 
      required: true,
      index: true
    },
    updatedAt: { 
      type: String, 
      required: true 
    },
    publishedAt: { 
      type: String, 
      required: false 
    },
    metaDescription: { 
      type: String, 
      required: false 
    },
    metaKeywords: { 
      type: String, 
      required: false 
    },
    readingTime: { 
      type: Number, 
      required: false 
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret.id || ret._id.toString();
        delete ret.__v;
        return ret;
      }
    }
  }
);

export default mongoose.models.Post || mongoose.model<PostDocument>('Post', PostSchema);
