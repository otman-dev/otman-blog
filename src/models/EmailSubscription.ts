import mongoose, { Document, Schema } from 'mongoose';
import { EmailSubscription } from '../lib/types';

export interface EmailSubscriptionDocument extends Omit<EmailSubscription, '_id' | 'id'>, Document {
  id: string; // Document already provides id
}

const EmailSubscriptionSchema = new Schema<EmailSubscriptionDocument>(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true,
      index: true
    },
    subscribedAt: { 
      type: String, 
      required: true,
      index: true
    },
    isActive: { 
      type: Boolean, 
      required: true,
      default: true
    },
    source: { 
      type: String, 
      required: true,
      enum: ['coming_soon', 'newsletter', 'blog'],
      index: true
    },
    ipAddress: { 
      type: String, 
      required: false 
    },
    userAgent: { 
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
        delete ret.__v;
        return ret;
      }
    }
  }
);

export default mongoose.models.EmailSubscription || mongoose.model<EmailSubscriptionDocument>('EmailSubscription', EmailSubscriptionSchema);
