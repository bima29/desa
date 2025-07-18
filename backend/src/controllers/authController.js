import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cek apakah admin ada berdasarkan email
    const admin = await Admin.findByEmail(email);
    if (!admin) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Email atau password salah'
      });
    }

    // Verifikasi password
    const isValidPassword = await Admin.verifyPassword(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Email atau password salah'
      });
    }

    // Update last login (pastikan method tersedia di model)
    await Admin.updateLastLogin(admin.id);

    // Buat token JWT
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        nama: admin.nama
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Hapus password dari objek admin
    const { password: _, ...adminData } = admin;

    return res.status(200).json({
      success: true,
      data: {
        admin: adminData,
        token
      },
      message: 'Login berhasil'
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Terjadi kesalahan sistem saat login'
    });
  }
};

export const register = async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    // Cek apakah email sudah dipakai
    const existingAdmin = await Admin.findByEmail(email);
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Email sudah terdaftar'
      });
    }

    // Buat admin baru
    const adminId = await Admin.create({ nama, email, password });

    return res.status(201).json({
      success: true,
      data: { id: adminId },
      message: 'Admin berhasil dibuat'
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Gagal membuat admin'
    });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Token tidak ditemukan'
      });
    }

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ambil admin dari database
    const admin = await Admin.findByEmail(decoded.email);
    if (!admin) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Token tidak valid'
      });
    }

    const { password: _, ...adminData } = admin;

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
