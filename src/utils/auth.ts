// Simple auth utilities for frontend
const AUTH_TOKEN_KEY = 'desa_auth_token';
const ADMIN_KEY = 'desa_admin_data';

// Token management
export const setAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // Simple token validation - in production, verify with backend
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    
    return tokenData.exp > now;
  } catch {
    return false;
  }
};

// Admin data management
export const setAdminData = (admin: any) => {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
};

export const getAdminData = (): any | null => {
  try {
    const adminData = localStorage.getItem(ADMIN_KEY);
    return adminData ? JSON.parse(adminData) : null;
  } catch {
    return null;
  }
};

// Initialize auth check
export const initializeAuth = () => {
  // Check token expiry every 5 minutes
  setInterval(() => {
    if (!isAuthenticated()) {
      removeAuthToken();
    }
  }, 5 * 60 * 1000);
};