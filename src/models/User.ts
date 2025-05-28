import mongoose, { Document, Schema } from 'mongoose';
import { User } from '../lib/types';

export interface UserDocument extends Omit<User, '_id' | 'id'>, Document {
  id: string; // Document already provides id
}

const UserSchema = new Schema<UserDocument>(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true,
      index: true
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      index: true
    },
    passwordHash: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      required: true,
      enum: ['admin', 'editor', 'author']
    },
    firstName: { 
      type: String, 
      required: true 
    },
    lastName: { 
      type: String, 
      required: true 
    },
    avatar: { 
      type: String, 
      required: false 
    },
    createdAt: { 
      type: String, 
      required: true 
    },
    lastLogin: { 
      type: String, 
      required: false 
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret.id || ret._id.toString();
        delete ret.passwordHash; // Don't expose passwordHash in JSON
        delete ret.__v;
        return ret;
      }
    }
  }
);

export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
