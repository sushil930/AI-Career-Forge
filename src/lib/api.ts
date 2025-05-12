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
});

// Request interceptor to attach Firebase ID Token
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from local storage (stored by AuthContext)
    const token = localStorage.getItem('firebaseIdToken');
    if (token) {
      // Attach the token as a Bearer token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[API Interceptor] Token attached to request');
    } else {
      console.log('[API Interceptor] No token found in localStorage.');
    }
    return config;
  },
  (error) => {
    // Log errors during request setup
    console.error('[API Interceptor] Error attaching token:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response, // Return successful responses directly
  (error) => {
    // Handle common errors globally
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        console.error("[API Interceptor] 401 Unauthorized response");
        
        // Don't redirect from login page
        const isOnAuthPage = window.location.pathname.includes('/login') || 
                             window.location.pathname.includes('/signup');
        
        // Check if user was previously logged in
        const hadToken = localStorage.getItem('firebaseIdToken');
        
        if (hadToken && !isOnAuthPage) {
          console.log("[API Interceptor] Token invalid or expired. Clearing localStorage.");
          localStorage.removeItem('firebaseIdToken');
          
          // Avoid redirecting if already on an auth page
          if (!isOnAuthPage) {
            console.log("[API Interceptor] Redirecting to login...");
            // Store the current location to redirect back after login
            localStorage.setItem('authRedirectPath', window.location.pathname);
            window.location.href = '/login';
          }
        }
      } else if (status === 403) {
        console.error("[API Interceptor] 403 Forbidden - User doesn't have sufficient permissions");
      } else if (status >= 500) {
        console.error("[API Interceptor] Server error:", status, error.response.data);
      }
    } else if (error.request) {
      // Request was made but no response was received
      console.error("[API Interceptor] Network error - no response received:", error.request);
    } else {
      // Something else happened while setting up the request
      console.error("[API Interceptor] Error:", error.message);
    }
    
    // Always reject the promise for specific error handling in components
    return Promise.reject(error);
  }
);

export default apiClient; 