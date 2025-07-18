import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database file path
const dbPath = join(__dirname, '../../data/database.sqlite');

// Ensure data directory exists
const dataDir = dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db = null;

// Initialize SQLite database
export const initializeDatabase = async () => {
  try {
    db = new Database(dbPath);
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // Create tables
    createTables();
    
    // Insert default data if tables are empty
    insertDefaultData();
    
    console.log('✅ SQLite database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

// Create database tables
const createTables = () => {
  // Desa Settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS desa_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama_desa TEXT NOT NULL DEFAULT 'Desa Digital',
      alamat TEXT DEFAULT '',
      telepon TEXT DEFAULT '',
      email TEXT DEFAULT '',
      website TEXT DEFAULT '',
      logo_url TEXT DEFAULT '',
      hero_image_url TEXT DEFAULT '',
      visi TEXT DEFAULT '',
      misi TEXT DEFAULT '',
      sejarah TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // News table
  db.exec(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      judul TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      konten TEXT NOT NULL,
      excerpt TEXT,
      gambar_url TEXT,
      status TEXT DEFAULT 'published' CHECK(status IN ('draft', 'published')),
      tanggal_publikasi DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Gallery table
  db.exec(`
    CREATE TABLE IF NOT EXISTS galleries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      judul TEXT NOT NULL,
      deskripsi TEXT,
      gambar_url TEXT NOT NULL,
      kategori TEXT DEFAULT 'umum',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Events table
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      judul TEXT NOT NULL,
      deskripsi TEXT,
      tanggal_mulai DATETIME NOT NULL,
      tanggal_selesai DATETIME,
      lokasi TEXT,
      gambar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Organization table
  db.exec(`
    CREATE TABLE IF NOT EXISTS organization (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      jabatan TEXT NOT NULL,
      foto_url TEXT,
      urutan INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Services table
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      deskripsi TEXT,
      persyaratan TEXT,
      biaya TEXT DEFAULT 'Gratis',
      waktu_proses TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Service Submissions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS service_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_id INTEGER NOT NULL,
      nama_pemohon TEXT NOT NULL,
      nik TEXT NOT NULL,
      alamat TEXT NOT NULL,
      telepon TEXT NOT NULL,
      email TEXT,
      keperluan TEXT NOT NULL,
      berkas_pendukung TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'diproses', 'selesai', 'ditolak')),
      catatan TEXT,
      tanggal_pengajuan DATETIME DEFAULT CURRENT_TIMESTAMP,
      tanggal_selesai DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (service_id) REFERENCES services (id)
    )
  `);

  // Admin table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nama TEXT NOT NULL,
      role TEXT DEFAULT 'admin' CHECK(role IN ('admin', 'super_admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

// Insert default data
const insertDefaultData = () => {
  // Check if desa_settings exists
  const desaSettings = db.prepare('SELECT COUNT(*) as count FROM desa_settings').get();
  if (desaSettings.count === 0) {
    db.prepare(`
      INSERT INTO desa_settings (nama_desa, alamat, telepon, email, visi, misi, sejarah)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Desa Maju Bersama',
      'Jl. Raya Desa No. 123, Kecamatan Contoh, Kabupaten Contoh',
      '(021) 1234-5678',
      'info@desamajubersama.id',
      'Menjadi desa yang maju, mandiri, dan sejahtera berbasis teknologi digital',
      'Meningkatkan pelayanan publik melalui digitalisasi, Memberdayakan masyarakat dalam bidang ekonomi dan sosial, Melestarikan budaya dan lingkungan hidup',
      'Desa Maju Bersama didirikan pada tahun 1945 dan telah berkembang menjadi desa yang modern dengan tetap mempertahankan nilai-nilai tradisional.'
    );
  }

  // Check if admin exists
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get();
  if (adminCount.count === 0) {
    // Default admin: username=admin, password=admin123
    const bcrypt = require('bcryptjs');
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    
    db.prepare(`
      INSERT INTO admins (username, email, password, nama, role)
      VALUES (?, ?, ?, ?, ?)
    `).run('admin', 'admin@desa.id', hashedPassword, 'Administrator', 'super_admin');
  }

  // Insert sample news if empty
  const newsCount = db.prepare('SELECT COUNT(*) as count FROM news').get();
  if (newsCount.count === 0) {
    const sampleNews = [
      {
        judul: 'Pembangunan Jalan Desa Tahap II Dimulai',
        slug: 'pembangunan-jalan-desa-tahap-ii-dimulai',
        konten: 'Pembangunan jalan desa tahap II telah dimulai pada hari ini. Proyek ini diharapkan dapat meningkatkan aksesibilitas dan mobilitas warga desa.',
        excerpt: 'Pembangunan jalan desa tahap II telah dimulai untuk meningkatkan aksesibilitas warga.',
        gambar_url: '/assets/news/jalan-desa.jpg'
      },
      {
        judul: 'Musyawarah Desa Membahas APBDES 2024',
        slug: 'musyawarah-desa-membahas-apbdes-2024',
        konten: 'Musyawarah desa telah dilaksanakan untuk membahas Anggaran Pendapatan dan Belanja Desa (APBDES) tahun 2024.',
        excerpt: 'Musyawarah desa membahas APBDES 2024 dengan partisipasi aktif warga.',
        gambar_url: '/assets/news/musdes.jpg'
      }
    ];

    const insertNews = db.prepare(`
      INSERT INTO news (judul, slug, konten, excerpt, gambar_url)
      VALUES (?, ?, ?, ?, ?)
    `);

    sampleNews.forEach(news => {
      insertNews.run(news.judul, news.slug, news.konten, news.excerpt, news.gambar_url);
    });
  }
};

// Execute query
export const executeQuery = (query, params = []) => {
  try {
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      const stmt = db.prepare(query);
      return stmt.all(params);
    } else {
      const stmt = db.prepare(query);
      return stmt.run(params);
    }
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
};

// Execute single query
export const executeQuerySingle = (query, params = []) => {
  try {
    const stmt = db.prepare(query);
    return stmt.get(params);
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
};

// Get database instance
export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

// Test connection
export const testConnection = async () => {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    // Test with a simple query
    db.prepare('SELECT 1').get();
    console.log('✅ Database connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
};

export default {
  initializeDatabase,
  executeQuery,
  executeQuerySingle,
  getDatabase,
  testConnection
};