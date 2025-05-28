import mongoose, { Document, Schema } from 'mongoose';
import { Category } from '../lib/types';

export interface CategoryDocument extends Omit<Category, '_id' | 'id'>, Document {
  id: string; // Document already provides id
}

const CategorySchema = new Schema<CategoryDocument>(
  {
    id: { 
      type: String, 
      required: true,
      unique: true
    },
    name: { 
      type: String, 
      required: true 
    },
    slug: { 
      type: String, 
      required: true, 
      unique: true,
      index: true
    },
    description: { 
      type: String, 
      required: true 
    },
    color: { 
      type: String, 
      required: true 
    },
    createdAt: { 
      type: String, 
      required: true 
    },
    postCount: { 
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

export default mongoose.models.Category || mongoose.model<CategoryDocument>('Category', CategorySchema);
