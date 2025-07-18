// src/config/database.js
import mysql from 'mysql2/promise';

// Konfigurasi koneksi ke MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'desa', 
};

let db = null;

// Inisialisasi koneksi database
export const initializeDatabase = async () => {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('✅ MySQL database connected');

    await createTables();
    await insertDefaultData();

    return true;
  } catch (error) {
    console.error('❌ Failed to initialize MySQL connection:', error);
    throw error;
  }
};

// Membuat tabel jika belum ada
const createTables = async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS desa_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama_desa VARCHAR(255) NOT NULL DEFAULT 'Desa Digital',
      alamat TEXT,
      telepon VARCHAR(50),
      email VARCHAR(100),
      website VARCHAR(255),
      logo_url VARCHAR(255),
      hero_image_url VARCHAR(255),
      visi TEXT,
      misi TEXT,
      sejarah TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      nama VARCHAR(100) NOT NULL,
      role ENUM('admin','super_admin') DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS news (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      konten TEXT NOT NULL,
      excerpt TEXT,
      gambar_url TEXT,
      status ENUM('draft', 'published') DEFAULT 'published',
      tanggal_publikasi DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS galleries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul TEXT NOT NULL,
      deskripsi TEXT,
      gambar_url TEXT NOT NULL,
      kategori TEXT DEFAULT 'umum',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul TEXT NOT NULL,
      deskripsi TEXT,
      tanggal_mulai DATETIME NOT NULL,
      tanggal_selesai DATETIME,
      lokasi TEXT,
      gambar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS organization (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama TEXT NOT NULL,
      jabatan TEXT NOT NULL,
      foto_url TEXT,
      urutan INT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS services (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama TEXT NOT NULL,
      deskripsi TEXT,
      persyaratan TEXT,
      biaya TEXT DEFAULT 'Gratis',
      waktu_proses TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS service_submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      service_id INT NOT NULL,
      nama_pemohon TEXT NOT NULL,
      nik TEXT NOT NULL,
      alamat TEXT NOT NULL,
      telepon TEXT NOT NULL,
      email TEXT,
      keperluan TEXT NOT NULL,
      berkas_pendukung TEXT,
      status ENUM('pending', 'diproses', 'selesai', 'ditolak') DEFAULT 'pending',
      catatan TEXT,
      tanggal_pengajuan DATETIME DEFAULT CURRENT_TIMESTAMP,
      tanggal_selesai DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    )
  `);
};

// Data awal jika kosong
const insertDefaultData = async () => {
  const [desaRows] = await db.execute('SELECT COUNT(*) AS count FROM desa_settings');
  if (desaRows[0].count === 0) {
    await db.execute(`
      INSERT INTO desa_settings (nama_desa, alamat, telepon, email, visi, misi, sejarah)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      'Desa Maju Bersama',
      'Jl. Raya Desa No. 123, Kecamatan Contoh, Kabupaten Contoh',
      '(021) 1234-5678',
      'info@desamajubersama.id',
      'Menjadi desa yang maju, mandiri, dan sejahtera berbasis teknologi digital',
      'Meningkatkan pelayanan publik melalui digitalisasi, Memberdayakan masyarakat dalam bidang ekonomi dan sosial, Melestarikan budaya dan lingkungan hidup',
      'Desa Maju Bersama didirikan pada tahun 1945 dan telah berkembang menjadi desa yang modern dengan tetap mempertahankan nilai-nilai tradisional.'
    ]);
  }

  const [adminRows] = await db.execute('SELECT COUNT(*) AS count FROM admins');
  if (adminRows[0].count === 0) {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = bcrypt.default.hashSync('admin123', 10);
    await db.execute(`
      INSERT INTO admins (username, email, password, nama, role)
      VALUES (?, ?, ?, ?, ?)
    `, ['admin', 'admin@desa.id', hashedPassword, 'Administrator', 'super_admin']);
  }

  const [newsRows] = await db.execute('SELECT COUNT(*) AS count FROM news');
  if (newsRows[0].count === 0) {
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

    for (const news of sampleNews) {
      await db.execute(`
        INSERT INTO news (judul, slug, konten, excerpt, gambar_url)
        VALUES (?, ?, ?, ?, ?)
      `, [news.judul, news.slug, news.konten, news.excerpt, news.gambar_url]);
    }
  }
};

// Jalankan query biasa (SELECT/INSERT/UPDATE)
export const executeQuery = async (query, params = []) => {
  try {
    const [rows] = await db.execute(query, params);
    return rows;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
};

// Jalankan query tunggal (SELECT 1 data saja)
export const executeQuerySingle = async (query, params = []) => {
  try {
    const [rows] = await db.execute(query, params);
    return rows[0] || null;
  } catch (error) {
    console.error('❌ Single query error:', error);
    throw error;
  }
};

// Ambil koneksi database
export const getDatabase = () => {
  if (!db) throw new Error('Database not initialized');
  return db;
};

// Test koneksi database
export const testConnection = async () => {
  try {
    if (!db) throw new Error('Database not initialized');
    await db.query('SELECT 1');
    console.log('✅ MySQL connection test successful');
    return true;
  } catch (error) {
    console.error('❌ MySQL test connection failed:', error);
    return false;
  }
};

export default {
  initializeDatabase,
  executeQuery,
  executeQuerySingle,
  getDatabase,
  testConnection,
};
