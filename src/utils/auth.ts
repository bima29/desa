// utils/auth.ts

const AUTH_TOKEN_KEY = "desa_auth_token";
const ADMIN_KEY = "desa_admin_data";

/**
 * Simpan token autentikasi ke localStorage.
 * @param token - JWT token
 */
export const setAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

/**
 * Ambil token autentikasi dari localStorage.
 * @returns JWT token atau null
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Hapus token dan data admin dari localStorage (logout).
 */
export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
};

/**
 * Cek apakah user masih dalam kondisi login berdasarkan token JWT.
 * Validasi: token ada, dan belum expired (cek `exp`).
 * @returns true jika login masih valid, false jika tidak
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));
    const now = Math.floor(Date.now() / 1000);

    return payload.exp && payload.exp > now;
  } catch (error) {
    console.error("Token parsing error:", error);
    return false;
  }
};

/**
 * Simpan data admin ke localStorage.
 * @param admin - Object data admin
 */
export const setAdminData = (admin: any) => {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
};

/**
 * Ambil data admin dari localStorage.
 * @returns Object admin atau null jika tidak ditemukan
 */
export const getAdminData = (): any | null => {
  try {
    const adminData = localStorage.getItem(ADMIN_KEY);
    return adminData ? JSON.parse(adminData) : null;
  } catch (error) {
    console.error("Failed to parse admin data:", error);
    return null;
  }
};

/**
 * Inisialisasi pengecekan token kadaluarsa secara berkala (opsional).
 * Bisa dipanggil di root App (misalnya saat mount App).
 */
export const initializeAuth = () => {
  setInterval(() => {
    if (!isAuthenticated()) {
      removeAuthToken();
    }
  }, 5 * 60 * 1000); // setiap 5 menit
};
