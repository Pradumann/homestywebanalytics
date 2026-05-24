import { db } from '../lib/supabase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore';

// TypeScript interfaces for chat data structure
export interface ChatMessage {
  id?: string;
  sender: 'user' | 'homesty';
  text: string;
  timestamp: Timestamp;
  read?: boolean;
}

export interface Chat {
  id: string;
  isHomestyActive: boolean;
  isUserActive: boolean;
  lastMessage: string;
  lastMessageTimestamp: Timestamp;
  matchId: string;
  messages: ChatMessage[];
  unreadMessagesAsHomesty: number;
  unreadMessagesAsUser: number;
  userFullName: string;
  userId: string;
}

export interface ChatResponse {
  success: boolean;
  chats?: Chat[];
  error?: string;
}

/**
 * Fetch all chats from the chatWithHomesty collection
 */
export const fetchChats = async (): Promise<ChatResponse> => {
  try {
    const chatsCollection = collection(db, 'chatWithHomesty');
    const q = query(chatsCollection, orderBy('lastMessageTimestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const chats: Chat[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Chat, 'id'>;
      chats.push({
        id: doc.id,
        ...data
      });
    });
    
    return {
      success: true,
      chats
    };
  } catch (error: any) {
    console.error('Error fetching chats:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch chats'
    };
  }
};

/**
 * Fetch a specific chat by ID
 */
export const fetchChatById = async (chatId: string): Promise<ChatResponse> => {
  try {
    const chatDoc = doc(db, 'chatWithHomesty', chatId);
    const chatSnapshot = await getDoc(chatDoc);
    
    if (!chatSnapshot.exists()) {
      return {
        success: false,
        error: 'Chat not found'
      };
    }
    
    const chatData = chatSnapshot.data() as Omit<Chat, 'id'>;
    const chat: Chat = {
      id: chatSnapshot.id,
      ...chatData
    };
    
    return {
      success: true,
      chats: [chat]
    };
  } catch (error: any) {
    console.error('Error fetching chat:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch chat'
    };
  }
};

/**
 * Get chats for a specific user
 */
export const fetchChatsByUserId = async (userId: string): Promise<ChatResponse> => {
  try {
    const chatsCollection = collection(db, 'chatWithHomesty');
    const q = query(
      chatsCollection, 
      where('userId', '==', userId),
      orderBy('lastMessageTimestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const chats: Chat[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Chat, 'id'>;
      chats.push({
        id: doc.id,
        ...data
      });
    });
    
    return {
      success: true,
      chats
    };
  } catch (error: any) {
    console.error('Error fetching user chats:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch user chats'
    };
  }
};

/**
 * Format timestamp to readable time
 */
export const formatTimestamp = (timestamp: Timestamp | any): string => {
  let date: Date;
  
  // Handle different timestamp formats from Firestore
  if (timestamp && typeof timestamp === 'object') {
    // If it's a Firestore Timestamp with toDate method
    if (typeof timestamp.toDate === 'function') {
      date = timestamp.toDate();
    }
    // If it's a Firestore Timestamp with seconds property
    else if (timestamp.seconds !== undefined) {
      date = new Date(timestamp.seconds * 1000);
    }
    // If it's already a Date object
    else if (timestamp instanceof Date) {
      date = timestamp;
    }
    // If it's a number (milliseconds)
    else if (typeof timestamp.getTime === 'function') {
      date = timestamp;
    }
    // If it's a plain number (timestamp in milliseconds)
    else if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    }
    // Fallback: try to create date from the object
    else {
      date = new Date(timestamp);
    }
  } else {
    // Fallback for invalid timestamp
    return 'Unknown time';
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Unknown time';
  }
  
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInMins < 1) {
    return 'Just now';
  } else if (diffInMins < 60) {
    return `${diffInMins} min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

/**
 * Get user initials from full name
 */
export const getUserInitials = (fullName: string): string => {
  const names = fullName.trim().split(' ');
  if (names.length >= 2) {
    return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
  } else if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase();
  }
  return 'U';
};