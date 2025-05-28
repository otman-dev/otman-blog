import mongoose, { Document, Schema } from 'mongoose';
import { Tag } from '../lib/types';

export interface TagDocument extends Omit<Tag, '_id' | 'id'>, Document {
  id: string; // Document already provides id
}

const TagSchema = new Schema<TagDocument>(
  {
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
      required: false 
    },
    color: { 
      type: String, 
      required: false 
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

export default mongoose.models.Tag || mongoose.model<TagDocument>('Tag', TagSchema);
