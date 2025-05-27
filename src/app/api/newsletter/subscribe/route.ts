import { NextRequest, NextResponse } from 'next/server';
import { getEmailSubscriptionsCollection } from '@/lib/mongodb';
import { EmailSubscription } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const emailSubscriptionsCollection = await getEmailSubscriptionsCollection();

    // Check if email already exists
    const existingSubscription = await emailSubscriptionsCollection.findOne({ email });
    
    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return NextResponse.json(
          { success: false, error: 'Email already subscribed' },
          { status: 409 }
        );
      } else {
        // Reactivate subscription
        await emailSubscriptionsCollection.updateOne(
          { email },
          { 
            $set: { 
              isActive: true,
              subscribedAt: new Date().toISOString()
            }
          }
        );
        return NextResponse.json({ 
          success: true, 
          message: 'Subscription reactivated successfully' 
        });
      }
    }

    // Create new subscription
    const subscription: EmailSubscription = {
      id: uuidv4(),
      email: email.toLowerCase().trim(),
      subscribedAt: new Date().toISOString(),
      isActive: true,
      source: 'coming_soon',
      ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    };

    await emailSubscriptionsCollection.insertOne(subscription);

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed for notifications' 
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const emailSubscriptionsCollection = await getEmailSubscriptionsCollection();
    
    const totalSubscriptions = await emailSubscriptionsCollection.countDocuments({ isActive: true });
    const recentSubscriptions = await emailSubscriptionsCollection
      .find({ isActive: true })
      .sort({ subscribedAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({
      success: true,
      data: {
        total: totalSubscriptions,
        recent: recentSubscriptions
      }
    });

  } catch (error) {
    console.error('Get subscriptions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}
