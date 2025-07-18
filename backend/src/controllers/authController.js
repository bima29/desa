import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin by email
    const admin = await Admin.findByEmail(email);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }
    
    // Verify password
    const isValidPassword = await Admin.verifyPassword(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }
    
    // Update last login
    await Admin.updateLastLogin(admin.id);
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email,
        nama: admin.nama 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    // Remove password from response
    const { password: _, ...adminData } = admin;
    
    res.json({
      success: true,
      data: {
        admin: adminData,
        token
      },
      message: 'Login berhasil'
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan sistem'
    });
  }
};

export const register = async (req, res) => {
  try {
    const { nama, email, password } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await Admin.findByEmail(email);
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }
    
    // Create new admin
    const adminId = await Admin.create({ nama, email, password });
    
    res.status(201).json({
      success: true,
      data: { id: adminId },
      message: 'Admin berhasil dibuat'
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({
      success: false,
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
        message: 'Token tidak ditemukan'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findByEmail(decoded.email);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid'
      });
    }
    
    const { password: _, ...adminData } = admin;
    
    res.json({
      success: true,
      data: adminData
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({
      success: false,
      message: 'Token tidak valid'
    });
  }
};