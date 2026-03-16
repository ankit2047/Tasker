
// Redux Toolkit slice for task management state

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { taskAPI } from '../services/api';
import { Task, TaskState, CreateTaskPayload } from '../types';

// ─── Initial State ──────
const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

// ─── Async Thunks ──

// Fetch all tasks for the authenticated user
export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskAPI.getTasks();
      return response.data.tasks as Task[];
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

// Create a new task
export const addTask = createAsyncThunk(
  'tasks/add',
  async (taskData: CreateTaskPayload, { rejectWithValue }) => {
    try {
      const response = await taskAPI.createTask(taskData);
      return response.data.task as Task;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

// Mark a task as completed
export const completeTask = createAsyncThunk(
  'tasks/complete',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await taskAPI.updateTask(taskId, { completed: true });
      return response.data.task as Task;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

// Permanently delete a task
export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (taskId: string, { rejectWithValue }) => {
    try {
      await taskAPI.deleteTask(taskId);
      return taskId; // Return ID so we can remove it from state
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

// ─── Slice ───
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Clear all tasks from state (used on logout)
    clearTasks(state) {
      state.tasks = [];
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Fetch Tasks ──
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Add Task ──
    builder
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        // Prepend new task to the beginning of the list
        state.tasks.unshift(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Complete Task ──
    builder
      .addCase(completeTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          // Update the task in-place with the server response
          state.tasks[index] = action.payload;
        }
      })
      .addCase(completeTask.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // ── Delete Task ──
    builder
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        // Remove the deleted task from state by ID
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearTasks, clearError } = taskSlice.actions;
export default taskSlice.reducer;
