import { NextRequest, NextResponse } from 'next/server';
import { getEmailSubscriptionsCollection } from '@/lib/mongodb';
import { EmailSubscription } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Get MongoDB collection
    let emailSubscriptionsCollection;
    try {
      emailSubscriptionsCollection = await getEmailSubscriptionsCollection();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

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
    }    // Create new subscription
    const subscription: EmailSubscription = {
      id: uuidv4(),
      email: email.toLowerCase().trim(),
      subscribedAt: new Date().toISOString(),
      isActive: true,
      source: 'coming_soon',
      ipAddress: request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 request.headers.get('cf-connecting-ip') || 
                 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    };    await emailSubscriptionsCollection.insertOne(subscription);

    const response = NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed for notifications' 
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;

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
    // Get MongoDB collection
    let emailSubscriptionsCollection;
    try {
      emailSubscriptionsCollection = await getEmailSubscriptionsCollection();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    const totalSubscriptions = await emailSubscriptionsCollection.countDocuments({ isActive: true });
    const recentSubscriptions = await emailSubscriptionsCollection
      .find({ isActive: true })
      .sort({ subscribedAt: -1 })
      .limit(10)
      .toArray();

    const response = NextResponse.json({
      success: true,
      data: {
        total: totalSubscriptions,
        recent: recentSubscriptions
      }
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;

  } catch (error) {
    console.error('Get subscriptions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
