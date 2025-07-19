import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

// Pastikan JWT_SECRET diset
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

if (!JWT_SECRET) {
  console.error('Environment variable JWT_SECRET is not set');
  process.exit(1);
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`Login attempt for: ${email}`);

    // Cek apakah admin ada
    const admin = await Admin.findByEmail(email);
    if (!admin) {
      console.log('Admin not found for email:', email);
      return res.status(401).json({
        success: false,
        data: null,
        credentials: { email, password },
        message: 'Email atau password salah'
      });
    }
    console.log('Admin found:', admin.email);

    // Verifikasi password
    const isValidPassword = await Admin.verifyPassword(password, admin.password);
    if (!isValidPassword) {
      console.log('Invalid password for:', admin.email);
      return res.status(401).json({
        success: false,
        data: null,
        credentials: { email, password },
        message: 'Email atau password salah'
      });
    }
    console.log('Password valid for:', admin.email);

    // Update last login
    const updated = await Admin.updateLastLogin(admin.id);
    if (!updated) console.warn('Could not update last_login for admin:', admin.id);

    // Pastikan secret ada sebelum sign
    if (!JWT_SECRET) {
      console.error('Missing JWT_SECRET during token creation');
      return res.status(500).json({
        success: false,
        data: null,
        credentials: { email, password },
        message: 'Internal server error'
      });
    }

    // Buat token JWT
    const payload = { id: admin.id, email: admin.email, nama: admin.nama };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Hapus password dari objek admin sebelum mengirim
    const { password: _, ...adminData } = admin;

    console.log('Login successful for:', admin.email);
    return res.status(200).json({
      success: true,
      data: { admin: adminData, token },
      credentials: { email, password },
      message: 'Login berhasil'
    });
  } catch (error) {
    console.error('Login error:', error);
    const { email, password } = req.body;
    return res.status(500).json({
      success: false,
      data: null,
      credentials: { email, password },
      message: 'Terjadi kesalahan sistem saat login'
    });
  }
};

export const register = async (req, res) => {
  try {
    const { nama, email, password } = req.body;
    console.log(`Register attempt for: ${email}`);

    // Cek apakah email sudah terdaftar
    const existingAdmin = await Admin.findByEmail(email);
    if (existingAdmin) {
      console.log('Email already registered:', email);
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Email sudah terdaftar'
      });
    }

    // Buat admin baru
    const adminId = await Admin.create({ nama, email, password });
    if (!adminId) {
      console.error('Failed to create admin for:', email);
      return res.status(500).json({
        success: false,
        data: null,
        message: 'Gagal membuat admin'
      });
    }

    console.log('Admin created with ID:', adminId);
    return res.status(201).json({
      success: true,
      data: { id: adminId },
      message: 'Admin berhasil dibuat'
    });
  } catch (error) {
    console.error('Error during register:', error);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Terjadi kesalahan sistem saat registrasi'
    });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      console.log('Token not provided');
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Token tidak ditemukan'
      });
    }

    // Decode token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.warn('JWT verify error:', err);
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Token tidak valid'
      });
    }

    // Ambil admin dari database
    const admin = await Admin.findByEmail(decoded.email);
    if (!admin) {
      console.log('Admin not found for token email:', decoded.email);
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Token tidak valid'
      });
    }

    const { password: _, ...adminData } = admin;
    console.log('Token valid for:', admin.email);
    return res.status(200).json({
      success: true,
      data: adminData,
      message: 'Token valid'
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Token tidak valid'
    });
  }
};