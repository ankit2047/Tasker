
// Shared TypeScript types used across the app

// ─── Auth Types ───────

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

// ─── Task Types ────

export type Priority = 'Low' | 'Medium' | 'High';

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description: string;
  dateTime: string;
  deadline: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  dateTime: string;
  deadline: string;
  priority: Priority;
}

export interface UpdateTaskPayload {
  id: string;
  updates: Partial<Omit<Task, '_id' | 'userId' | 'createdAt'>>;
}

// ─── Navigation Types──

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  AddTask: undefined;
};
