
// Redux Toolkit slice for authentication state management

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../services/api';
import { AuthState, User } from '../types';

// ─── Initial State ──────────────────────
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// ─── Async Thunks ────

// Register a new user via POST /api/auth/register
export const register = createAsyncThunk(
  'auth/register',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.register(email, password);
      return response.data; // { user, token }
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

// Login an existing user via POST /api/auth/login
export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.login(email, password);
      return response.data; // { user, token }
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

// ─── Slice ──
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous logout — clears all auth state
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
    },
    // Clear error messages (e.g., when user navigates away from a screen)
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Register ──
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Login ──
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
