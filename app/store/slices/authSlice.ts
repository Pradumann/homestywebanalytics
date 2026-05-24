import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { signIn as authSignIn, signUp as authSignUp, signOut as authSignOut, getCurrentUser as authGetCurrentUser } from '../../api/auth';

// Types
export interface User {
  id: string;
  email: string;
  username: string;
  roleType: string;
  tags?: string[];
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunks
export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authSignIn(credentials);

      if (!response.success) {
        return rejectWithValue(response.error || 'Authentication failed');
      }

      if (!response.user) {
        return rejectWithValue('No user data returned');
      }

      // TODO: Add role validation for Homesty Analytics if needed
      // For now, allow all authenticated users

      return {
        user: response.user,
        token: null, // TODO: Token will be managed by Firebase
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Authentication failed');
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }, { rejectWithValue }) => {
    try {
      const response = await authSignUp(userData);

      if (!response.success) {
        return rejectWithValue(response.error || 'Registration failed');
      }

      if (!response.user) {
        return rejectWithValue('No user data returned');
      }

      return {
        user: response.user,
        token: null, // TODO: Token will be managed by Firebase
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Registration failed');
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authSignOut();
      
      if (!response.success) {
        return rejectWithValue(response.error || 'Sign out failed');
      }
      
      return;
    } catch (error) {
      console.error('Sign out error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Sign out failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authGetCurrentUser();

      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to get user');
      }

      if (!response.user) {
        return rejectWithValue('No user session found');
      }

      // TODO: Add role validation for Homesty Analytics if needed
      // For now, allow all authenticated users
      
      return response.user;
    } catch (error) {
      console.error('Get user error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to get user');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Sign In
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Sign Up
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Sign Out
    builder
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Current User
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
