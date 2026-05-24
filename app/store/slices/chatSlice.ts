import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface Chat {
  id: string;
  name: string;
  email: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
  user_id: string;
  active_until: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
  chatId: string;
}

export interface ChatState {
  chats: Chat[];
  messages: Message[];
  selectedChat: Chat | null;
  isLoadingChats: boolean;
  isLoadingMessages: boolean;
  error: string | null;
  unreadCount: number;
  searchQuery: string;
  filteredChats: Chat[];
}

// Initial state
const initialState: ChatState = {
  chats: [],
  messages: [],
  selectedChat: null,
  isLoadingChats: false,
  isLoadingMessages: false,
  error: null,
  unreadCount: 0,
  searchQuery: '',
  filteredChats: [],
};

// Mock data
const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    lastMessage: 'Thank you for your help today, I feel much better.',
    time: '10:30 AM',
    unread: 2,
    avatar: 'SJ',
    online: true,
    user_id: 'user_1',
    active_until: '2024-12-31',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    lastMessage: 'Can we schedule our session for tomorrow?',
    time: '9:45 AM',
    unread: 0,
    avatar: 'MC',
    online: false,
    user_id: 'user_2',
    active_until: '2024-11-30',
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    lastMessage: 'The breathing exercises really helped!',
    time: 'Yesterday',
    unread: 1,
    avatar: 'ED',
    online: true,
    user_id: 'user_3',
    active_until: '2024-12-15',
  },
  {
    id: '4',
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    lastMessage: 'I\'ve been practicing the techniques you suggested.',
    time: 'Monday',
    unread: 0,
    avatar: 'RW',
    online: false,
    user_id: 'user_4',
    active_until: '2024-10-31',
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    lastMessage: 'Looking forward to our next session.',
    time: 'Last week',
    unread: 3,
    avatar: 'LA',
    online: true,
    user_id: 'user_5',
    active_until: '2024-12-20',
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hi! How are you feeling today?',
    sender: 'other',
    time: '10:00 AM',
    chatId: '1',
  },
  {
    id: '2',
    text: 'I\'m feeling much better, thank you for asking!',
    sender: 'me',
    time: '10:05 AM',
    chatId: '1',
  },
  {
    id: '3',
    text: 'That\'s wonderful to hear! Have you been practicing the breathing exercises we discussed?',
    sender: 'other',
    time: '10:10 AM',
    chatId: '1',
  },
  {
    id: '4',
    text: 'Yes, every morning. They really help me start my day with a calm mindset.',
    sender: 'me',
    time: '10:15 AM',
    chatId: '1',
  },
  {
    id: '5',
    text: 'Thank you for your help today, I feel much better.',
    sender: 'other',
    time: '10:30 AM',
    chatId: '1',
  },
];

// Async thunks
export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockChats;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch chats');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (chatId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockMessages.filter(msg => msg.chatId === chatId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageData: { text: string; chatId: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageData.text,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chatId: messageData.chatId,
      };
      
      return newMessage;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to send message');
    }
  }
);

export const markChatAsRead = createAsyncThunk(
  'chat/markChatAsRead',
  async (chatId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      return chatId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to mark chat as read');
    }
  }
);

// Slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    selectChat: (state, action: PayloadAction<Chat>) => {
      state.selectedChat = action.payload;
    },
    clearSelectedChat: (state) => {
      state.selectedChat = null;
      state.messages = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateChatLastMessage: (state, action: PayloadAction<{ chatId: string; lastMessage: string; time: string }>) => {
      const chat = state.chats.find(c => c.id === action.payload.chatId);
      if (chat) {
        chat.lastMessage = action.payload.lastMessage;
        chat.time = action.payload.time;
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      // Filter chats based on search query
      if (action.payload.trim() === '') {
        state.filteredChats = state.chats;
      } else {
        const query = action.payload.toLowerCase();
        state.filteredChats = state.chats.filter(chat =>
          chat.name.toLowerCase().includes(query) ||
          chat.email.toLowerCase().includes(query) ||
          chat.lastMessage.toLowerCase().includes(query)
        );
      }
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.filteredChats = state.chats;
    },
  },
  extraReducers: (builder) => {
    // Fetch Chats
    builder
      .addCase(fetchChats.pending, (state) => {
        state.isLoadingChats = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.isLoadingChats = false;
        state.chats = action.payload;
        state.filteredChats = action.payload; // Initialize filtered chats
        state.unreadCount = action.payload.reduce((total, chat) => total + chat.unread, 0);
        state.error = null;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.isLoadingChats = false;
        state.error = action.payload as string;
      });

    // Fetch Messages
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.isLoadingMessages = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoadingMessages = false;
        state.messages = action.payload;
        state.error = null;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoadingMessages = false;
        state.error = action.payload as string;
      });

    // Send Message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
        // Update chat's last message
        const chat = state.chats.find(c => c.id === action.payload.chatId);
        if (chat) {
          chat.lastMessage = action.payload.text;
          chat.time = action.payload.time;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Mark Chat as Read
    builder
      .addCase(markChatAsRead.fulfilled, (state, action) => {
        const chat = state.chats.find(c => c.id === action.payload);
        if (chat) {
          chat.unread = 0;
        }
        // Recalculate unread count
        state.unreadCount = state.chats.reduce((total, chat) => total + chat.unread, 0);
      });
  },
});

export const {
  selectChat,
  clearSelectedChat,
  clearError,
  addMessage,
  updateChatLastMessage,
  setSearchQuery,
  clearSearch,
} = chatSlice.actions;

export default chatSlice.reducer;
