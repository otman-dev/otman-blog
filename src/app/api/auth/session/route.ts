import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { getUserById } from '@/lib/auth';
import { sessionOptions, SessionData } from '@/lib/session';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    
    if (!session.isAuthenticated || !session.userId) {
      return NextResponse.json({ 
        isAuthenticated: false,
        user: null 
      });
    }
    
    const user = await getUserById(session.userId);
    
    return NextResponse.json({
      isAuthenticated: true,
      role: session.role,
      user: user ? {
        id: user.id,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      } : null
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({
      isAuthenticated: false,
      user: null
    });
  }
}
