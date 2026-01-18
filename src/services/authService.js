import axios from 'axios';

const API_URL = '/api';

export const authService = {
  login: async (email, password) => {
    // Placeholder API call - no real backend
    console.log('Login attempt:', { email });
    return axios.post(`${API_URL}/login`, { email, password })
      .catch(() => {
        // Simulate successful login for demo
        return { data: { user: { email }, token: 'fake-token-123' } };
      });
  },

  signup: async (email, password) => {
    // Placeholder API call - no real backend
    console.log('Signup attempt:', { email });
    return axios.post(`${API_URL}/signup`, { email, password })
      .catch(() => {
        // Simulate successful signup for demo
        return { data: { user: { email }, token: 'fake-token-123' } };
      });
  },

  logout: async () => {
    // Placeholder API call
    console.log('Logout');
    return Promise.resolve({ success: true });
  },

  getCurrentUser: () => {
    // Simulate getting current user from localStorage
    const user = localStorage.getItem('cloudnest_user');
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user) => {
    localStorage.setItem('cloudnest_user', JSON.stringify(user));
  },

  clearCurrentUser: () => {
    localStorage.removeItem('cloudnest_user');
  }
};

export default authService;
