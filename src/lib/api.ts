import axios from 'axios';

// Retrieve the API base URL from environment variables
// Vite exposes env variables prefixed with VITE_ on import.meta.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("Error: VITE_API_BASE_URL environment variable is not set.");
  // You might want to throw an error here or provide a default
  // depending on how critical this is for your app to function.
}

// Create an Axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // We can add interceptors later to automatically attach the auth token
});

// Request interceptor to attach Firebase ID Token
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from local storage (stored by AuthContext)
    const token = localStorage.getItem('firebaseIdToken');
    if (token) {
      // Attach the token as a Bearer token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      // console.log('[API Interceptor] Token attached:', token.substring(0, 10) + '...'); // Uncomment for debugging
    } else {
      // console.log('[API Interceptor] No token found in localStorage.'); // Uncomment for debugging
    }
    return config;
  },
  (error) => {
    // Log errors during request setup
    console.error('[API Interceptor] Error attaching token:', error);
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor for global error handling
/*
apiClient.interceptors.response.use(
  (response) => response, // Return successful responses directly
  (error) => {
    // Handle common errors globally (e.g., 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      console.error("Unauthorized access - redirecting to login...");
      // window.location.href = '/login'; 
    }
    // Always reject the promise for specific error handling in components
    return Promise.reject(error);
  }
);
*/

export default apiClient; 