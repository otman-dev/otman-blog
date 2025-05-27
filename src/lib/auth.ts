import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getUsersCollection, initializeDatabase } from './mongodb';
import { User } from './types';

export interface AuthResult {
  success: boolean;
  user?: Omit<User, 'passwordHash'>;
  error?: string;
}

export async function authenticateUser(username: string, password: string): Promise<AuthResult> {
  try {
    await initializeDatabase();
    const usersCollection = await getUsersCollection();
    
    const user = await usersCollection.findOne({ 
      $or: [{ username }, { email: username }] 
    });
    
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    // Update last login
    await usersCollection.updateOne(
      { id: user.id },
      { $set: { lastLogin: new Date().toISOString() } }
    );
    
    const { passwordHash, ...userWithoutPassword } = user;
    return { 
      success: true, 
      user: userWithoutPassword
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

export async function createUser(userData: {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'editor' | 'author';
}): Promise<AuthResult> {
  try {
    await initializeDatabase();
    const usersCollection = await getUsersCollection();
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      $or: [{ username: userData.username }, { email: userData.email }]
    });
    
    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 12);
    
    const newUser: User = {
      id: uuidv4(),
      username: userData.username,
      email: userData.email,
      passwordHash,
      role: userData.role || 'author',
      firstName: userData.firstName,
      lastName: userData.lastName,
      createdAt: new Date().toISOString(),
    };
    
    await usersCollection.insertOne(newUser);
    
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return {
      success: true,
      user: userWithoutPassword
    };
  } catch (error) {
    console.error('User creation error:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

export async function getUserById(id: string): Promise<Omit<User, 'passwordHash'> | null> {
  try {
    await initializeDatabase();
    const usersCollection = await getUsersCollection();
    
    const user = await usersCollection.findOne({ id });
    if (!user) {
      return null;
    }
    
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}
