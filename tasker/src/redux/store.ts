
// Redux store configuration using Redux Toolkit

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import taskReducer from './taskSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
  },
});

// ─── TypeScript Helpers───
// RootState infers the type of the entire Redux state tree
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch infers the dispatch type (includes async thunks)
export type AppDispatch = typeof store.dispatch;

// AppStore is the full store type — exported so api.ts can use it in its
// lazy require cast without creating a circular import at module-load time
export type AppStore = typeof store;
