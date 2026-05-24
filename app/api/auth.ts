import { auth, db } from '../lib/supabase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  roleType: string;
  tags?: string[];
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: UserProfile;
  error?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Sign in user with email and password
 */
export const signIn = async (credentials: SignInRequest): Promise<AuthResponse> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    const user = userCredential.user;
    
    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userProfile = userDoc.data();
    
    return {
      success: true,
      user: {
        id: user.uid,
        email: user.email!,
        username: userProfile?.username || user.email?.split('@')[0] || 'User',
        roleType: userProfile?.roleType || 'analytics_user',
        tags: userProfile?.tags || [],
        createdAt: userProfile?.createdAt || user.metadata.creationTime,
      },
    };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: error.message || 'Authentication failed',
    };
  }
};

/**
 * Sign up new user
 */
export const signUp = async (userData: SignUpRequest): Promise<AuthResponse> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email!,
      username: `${userData.firstName} ${userData.lastName}`,
      roleType: 'analytics_user',
      tags: [],
      createdAt: new Date().toISOString(),
    });
    
    return {
      success: true,
      user: {
        id: user.uid,
        email: user.email!,
        username: `${userData.firstName} ${userData.lastName}`,
        roleType: 'analytics_user',
        tags: [],
        createdAt: user.metadata.creationTime,
      },
    };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: error.message || 'Registration failed',
    };
  }
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<AuthResponse> => {
  try {
    await firebaseSignOut(auth);
    
    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: error.message || 'Sign out failed',
    };
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        
        if (!user) {
          resolve({
            success: false,
            error: 'No user session found',
          });
          return;
        }

        // Get user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userProfile = userDoc.data();

          resolve({
            success: true,
            user: {
              id: user.uid,
              email: user.email!,
              username: userProfile?.username || user.email?.split('@')[0] || 'User',
              roleType: userProfile?.roleType || 'analytics_user',
              tags: userProfile?.tags || [],
              createdAt: userProfile?.createdAt || user.metadata.creationTime,
            },
          });
        } catch (error) {
          resolve({
            success: false,
            error: 'Failed to fetch user profile',
          });
        }
      });
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get user',
    };
  }
};
