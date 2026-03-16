
// Axios instance configured to communicate with the Node.js backend.
// NOTE: We intentionally do NOT import `store` at the top level here.
// Doing so creates a require cycle:
//   store.ts → authSlice.ts → api.ts → store.ts
// Instead we use a lazy getToken() helper that reads the store only at
// request time (after all modules have fully initialised).

import axios from 'axios';

// ⚠️  Update BASE_URL to your backend server address:
//    - Local dev (Android Emulator): http://10.0.2.2:5000/api
//    - Local dev (iOS Simulator):    http://localhost:5000/api
//    - Physical device:              http://<your-local-IP>:5000/api
//    - Production:                   https://your-deployed-backend.com/api
const BASE_URL = 'http://10.43.168.226:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Lazy store accessor ────
// Requiring the store lazily inside the interceptor means the store module has
// already finished initialising by the time this runs — no circular dependency.
const getToken = (): string | null => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { store } = require('../redux/store') as { store: import('../redux/store').AppStore };
  return store.getState().auth.token;
};

// ─── Request Int
// Automatically attach the JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ────
// Normalize error responses so slices always receive a string message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

// ─── Auth API Calls ────────
export const authAPI = {
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

// ─── Task API Calls ───────
export const taskAPI = {
  getTasks: () => api.get('/tasks'),

  createTask: (taskData: {
    title: string;
    description: string;
    dateTime: string;
    deadline: string;
    priority: string;
  }) => api.post('/tasks', taskData),

  updateTask: (id: string, updates: Record<string, unknown>) =>
    api.put(`/tasks/${id}`, updates),

  deleteTask: (id: string) => api.delete(`/tasks/${id}`),
};

export default api;
