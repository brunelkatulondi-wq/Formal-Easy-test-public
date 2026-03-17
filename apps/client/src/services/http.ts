import axios from 'axios';
import toast from 'react-hot-toast';

// Base config (use absolute paths already prefixed with /api in code)
axios.defaults.withCredentials = true;

// Inject access token from localStorage
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

function processQueue() {
  pendingQueue.forEach((resolve) => resolve());
  pendingQueue = [];
}

// Response interceptor to refresh on 401
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        await new Promise<void>((resolve) => pendingQueue.push(resolve));
        originalRequest._retry = true;
        return axios(originalRequest);
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const { data } = await axios.post('/api/auth/refresh');
        localStorage.setItem('accessToken', data.accessToken);
        processQueue();
        return axios(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem('accessToken');
        toast.error("Session expirée, veuillez vous reconnecter.");
        window.location.href = '/login';
        throw refreshErr;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  }
);
