-- Digital Village Website - Complete Database Setup
-- Run this SQL script in phpMyAdmin to create all tables and sample data
-- This includes all configurable content for the admin panel

-- Create database
CREATE DATABASE IF NOT EXISTS desa_digital CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE desa_digital;

-- =============================================
-- CORE TABLES
-- =============================================

-- Create desa_settings table (Village Settings)
CREATE TABLE IF NOT EXISTS desa_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama_desa VARCHAR(255) NOT NULL,
  slogan TEXT,
  alamat TEXT,
  logo VARCHAR(255),
  hero_image VARCHAR(255),
  primary_color VARCHAR(7) DEFAULT '#3B82F6',
  secondary_color VARCHAR(7) DEFAULT '#10B981',
  deskripsi TEXT,
  visi TEXT,
  misi TEXT,
  sejarah TEXT,
  telepon VARCHAR(20),
  email VARCHAR(100),
  website VARCHAR(100),
  facebook VARCHAR(100),
  twitter VARCHAR(100),
  instagram VARCHAR(100),
  youtube VARCHAR(100),
  jam_operasional TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  konten LONGTEXT NOT NULL,
  gambar VARCHAR(255),
  tanggal DATE NOT NULL,
  penulis VARCHAR(255) NOT NULL,
  status ENUM('published', 'draft') DEFAULT 'draft',
  kategori VARCHAR(100),
  tags TEXT,
  views INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_tanggal (tanggal),
  INDEX idx_kategori (kategori),
  INDEX idx_featured (featured)
);

-- Create galleries table
CREATE TABLE IF NOT EXISTS galleries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  gambar VARCHAR(255) NOT NULL,
  kategori VARCHAR(100),
  tanggal DATE NOT NULL,
  photographer VARCHAR(100),
  lokasi VARCHAR(255),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_kategori (kategori),
  INDEX idx_featured (featured)
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  tanggal DATETIME NOT NULL,
  tanggal_selesai DATETIME,
  lokasi VARCHAR(255),
  gambar VARCHAR(255),
  kategori VARCHAR(100),
  penyelenggara VARCHAR(255),
  kontak VARCHAR(100),
  biaya DECIMAL(10,2) DEFAULT 0,
  kapasitas INT,
  status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tanggal (tanggal),
  INDEX idx_status (status),
  INDEX idx_kategori (kategori),
  INDEX idx_featured (featured)
);

-- Create organisasi table
CREATE TABLE IF NOT EXISTS organisasi (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(255) NOT NULL,
  jabatan VARCHAR(255) NOT NULL,
  foto VARCHAR(255),
  urutan INT DEFAULT 0,
  nip VARCHAR(50),
  pendidikan VARCHAR(100),
  alamat TEXT,
  telepon VARCHAR(20),
  email VARCHAR(100),
  masa_jabatan VARCHAR(50),
  tugas_pokok TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_urutan (urutan)
);

-- Create layanan table
CREATE TABLE IF NOT EXISTS layanan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  persyaratan TEXT,
  template_dokumen VARCHAR(255),
  kategori VARCHAR(100),
  biaya DECIMAL(10,2) DEFAULT 0,
  waktu_proses VARCHAR(50),
  jam_layanan TEXT,
  penanggung_jawab VARCHAR(255),
  status ENUM('active', 'inactive') DEFAULT 'active',
  urutan INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_kategori (kategori),
  INDEX idx_status (status)
);

-- Create pengajuan_layanan table
CREATE TABLE IF NOT EXISTS pengajuan_layanan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  layanan_id INT NOT NULL,
  nomor_pengajuan VARCHAR(50) UNIQUE NOT NULL,
  nama VARCHAR(255) NOT NULL,
  nik VARCHAR(16) NOT NULL,
  alamat TEXT,
  telepon VARCHAR(20),
  email VARCHAR(100),
  file_pendukung VARCHAR(255),
  status ENUM('pending', 'diproses', 'selesai', 'ditolak') DEFAULT 'pending',
  catatan TEXT,
  tanggal_selesai DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (layanan_id) REFERENCES layanan(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_nomor (nomor_pengajuan)
);

-- Create dokumen table
CREATE TABLE IF NOT EXISTS dokumen (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  file_path VARCHAR(255) NOT NULL,
  kategori VARCHAR(100),
  ukuran INT,
  tipe_file VARCHAR(50),
  tahun YEAR,
  nomor_dokumen VARCHAR(100),
  tanggal_terbit DATE,
  status ENUM('active', 'archived') DEFAULT 'active',
  download_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_kategori (kategori),
  INDEX idx_tahun (tahun),
  INDEX idx_status (status)
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'admin', 'editor') DEFAULT 'admin',
  foto VARCHAR(255),
  telepon VARCHAR(20),
  status ENUM('active', 'inactive') DEFAULT 'active',
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status)
);

-- =============================================
-- ADDITIONAL CONFIGURABLE CONTENT TABLES
-- =============================================

-- Create menu_navigasi table (Navigation Menu)
CREATE TABLE IF NOT EXISTS menu_navigasi (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  urutan INT DEFAULT 0,
  parent_id INT NULL,
  target ENUM('_self', '_blank') DEFAULT '_self',
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES menu_navigasi(id) ON DELETE CASCADE,
  INDEX idx_urutan (urutan),
  INDEX idx_parent (parent_id)
);

-- Create slider_beranda table (Homepage Slider)
CREATE TABLE IF NOT EXISTS slider_beranda (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(255) NOT NULL,
  subjudul TEXT,
  deskripsi TEXT,
  gambar VARCHAR(255) NOT NULL,
  link_url VARCHAR(255),
  link_text VARCHAR(100),
  urutan INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_urutan (urutan),
  INDEX idx_status (status)
);

-- Create statistik_desa table (Village Statistics)
CREATE TABLE IF NOT EXISTS statistik_desa (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(255) NOT NULL,
  nilai VARCHAR(100) NOT NULL,
  satuan VARCHAR(50),
  icon VARCHAR(100),
  warna VARCHAR(7) DEFAULT '#3B82F6',
  urutan INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_urutan (urutan)
);

-- Create fasilitas_desa table (Village Facilities)
CREATE TABLE IF NOT EXISTS fasilitas_desa (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  alamat TEXT,
  gambar VARCHAR(255),
  kategori VARCHAR(100),
  jam_operasional TEXT,
  kontak VARCHAR(100),
  status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_kategori (kategori),
  INDEX idx_status (status)
);

-- Create pengumuman table (Announcements)
CREATE TABLE IF NOT EXISTS pengumuman (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(255) NOT NULL,
  konten TEXT NOT NULL,
  tipe ENUM('info', 'warning', 'urgent') DEFAULT 'info',
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_tanggal (tanggal_mulai)
);

-- Create kontak_darurat table (Emergency Contacts)
CREATE TABLE IF NOT EXISTS kontak_darurat (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(255) NOT NULL,
  jabatan VARCHAR(255),
  telepon VARCHAR(20) NOT NULL,
  kategori ENUM('kesehatan', 'keamanan', 'pemadam', 'pemerintah', 'lainnya') NOT NULL,
  alamat TEXT,
  jam_layanan TEXT,
  urutan INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_kategori (kategori),
  INDEX idx_urutan (urutan)
);

-- Create testimoni table (Testimonials)
CREATE TABLE IF NOT EXISTS testimoni (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(255) NOT NULL,
  jabatan VARCHAR(255),
  foto VARCHAR(255),
  konten TEXT NOT NULL,
  rating INT DEFAULT 5,
  status ENUM('active', 'inactive') DEFAULT 'active',
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_featured (featured)
);

-- Create faq table (Frequently Asked Questions)
CREATE TABLE IF NOT EXISTS faq (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pertanyaan TEXT NOT NULL,
  jawaban TEXT NOT NULL,
  kategori VARCHAR(100),
  urutan INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_kategori (kategori),
  INDEX idx_urutan (urutan)
);

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

-- Insert desa settings
INSERT INTO desa_settings (
  nama_desa, slogan, alamat, logo, hero_image, primary_color, secondary_color, 
  deskripsi, visi, misi, sejarah, telepon, email, website, facebook, twitter, 
  instagram, youtube, jam_operasional
) VALUES (
  'Desa Maju Sejahtera',
  'Menuju Desa Modern dan Sejahtera',
  'Jl. Desa Maju No. 123, Kecamatan Sejahtera, Kabupaten Makmur, Provinsi Jaya 12345',
  'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
  'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
  '#3B82F6',
  '#10B981',
  'Desa Maju Sejahtera adalah desa yang terletak di kawasan strategis dengan potensi alam yang melimpah. Desa ini memiliki sejarah panjang dan kaya akan budaya lokal yang masih dilestarikan hingga saat ini.',
  'Mewujudkan desa yang maju, mandiri, dan sejahtera berdasarkan nilai-nilai gotong royong dan kearifan lokal.',
  'Meningkatkan kualitas pelayanan publik yang prima dan transparan; Mengembangkan potensi ekonomi lokal dan pariwisata desa; Membangun infrastruktur yang mendukung kemajuan desa; Melestarikan budaya dan tradisi lokal yang bernilai positif; Meningkatkan partisipasi masyarakat dalam pembangunan desa',
  'Desa Maju Sejahtera didirikan pada tahun 1945 oleh para pendiri yang memiliki visi untuk menciptakan masyarakat yang sejahtera. Sepanjang sejarahnya, desa ini telah mengalami berbagai perkembangan dan kemajuan yang signifikan.',
  '+62 XXX XXXX XXXX',
  'info@desamajusejahtera.go.id',
  'www.desamajusejahtera.go.id',
  'https://facebook.com/desamajusejahtera',
  'https://twitter.com/desamajusejahtera',
  'https://instagram.com/desamajusejahtera',
  'https://youtube.com/desamajusejahtera',
  'Senin - Jumat: 08:00 - 16:00, Sabtu: 08:00 - 12:00'
);

-- Insert sample news
INSERT INTO news (judul, slug, konten, gambar, tanggal, penulis, status, kategori, tags, featured) VALUES
('Pembangunan Jalan Desa Selesai', 'pembangunan-jalan-desa-selesai', '<p>Alhamdulillah, pembangunan jalan desa sepanjang 2 km telah selesai dilaksanakan. Proyek ini menggunakan dana desa tahun 2024 dengan total anggaran Rp 500 juta.</p><p>Jalan ini menghubungkan dusun 1 dan dusun 2 yang selama ini kondisinya rusak parah. Dengan selesainya pembangunan ini, diharapkan dapat memperlancar akses masyarakat dan mendukung kegiatan ekonomi desa.</p>', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', '2024-01-15', 'Admin Desa', 'published', 'Pembangunan', 'jalan,infrastruktur,pembangunan', TRUE),
('Musyawarah Desa Bahas APBDesa 2024', 'musyawarah-desa-bahas-apbdesa-2024', '<p>Musyawarah Desa (Musdes) untuk membahas APBDesa tahun 2024 telah dilaksanakan pada hari Sabtu, 10 Februari 2024 di Balai Desa.</p><p>Musdes dihadiri oleh perwakilan RT/RW, tokoh masyarakat, dan berbagai elemen masyarakat. Dalam musdes ini dibahas prioritas pembangunan desa untuk tahun 2024.</p>', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', '2024-02-10', 'Sekretaris Desa', 'published', 'Pemerintahan', 'musdes,apbdesa,anggaran', FALSE),
('Pelatihan UMKM untuk Ibu-Ibu PKK', 'pelatihan-umkm-untuk-ibu-ibu-pkk', '<p>Desa mengadakan pelatihan UMKM untuk meningkatkan keterampilan ibu-ibu PKK dalam berwirausaha. Pelatihan ini bekerjasama dengan Dinas Koperasi dan UMKM Kabupaten.</p><p>Materi pelatihan meliputi pengelolaan keuangan, pemasaran online, dan pengembangan produk. Diharapkan setelah pelatihan, ibu-ibu dapat mengembangkan usaha mandiri.</p>', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', '2024-02-20', 'Admin Desa', 'published', 'Ekonomi', 'umkm,pelatihan,pkk', TRUE);

-- Insert sample gallery
INSERT INTO galleries (judul, deskripsi, gambar, kategori, tanggal, photographer, lokasi, featured) VALUES
('Kegiatan Gotong Royong', 'Masyarakat bergotong royong membersihkan lingkungan desa', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Kegiatan', '2024-01-20', 'Admin Desa', 'Seluruh Desa', TRUE),
('Pemandangan Sawah', 'Hamparan sawah hijau yang indah di desa', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Pemandangan', '2024-01-25', 'Fotografer Desa', 'Area Persawahan', FALSE),
('Balai Desa', 'Gedung balai desa yang baru direnovasi', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Infrastruktur', '2024-02-01', 'Admin Desa', 'Balai Desa', TRUE),
('Acara 17 Agustus', 'Perayaan HUT RI ke-79 di desa', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Acara', '2024-08-17', 'Panitia 17 Agustus', 'Lapangan Desa', FALSE),
('Pasar Desa', 'Aktivitas pasar tradisional desa', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Ekonomi', '2024-02-15', 'Admin Desa', 'Pasar Desa', FALSE),
('Masjid Desa', 'Masjid jami sebagai pusat kegiatan keagamaan', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Fasilitas', '2024-02-20', 'Admin Desa', 'Masjid Al-Ikhlas', TRUE);

-- Insert sample events
INSERT INTO events (judul, deskripsi, tanggal, tanggal_selesai, lokasi, gambar, kategori, penyelenggara, kontak, biaya, kapasitas, status, featured) VALUES
('Rapat Koordinasi BPD', 'Rapat koordinasi antara BPD dan perangkat desa', '2024-03-15 09:00:00', '2024-03-15 12:00:00', 'Balai Desa', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', 'Pemerintahan', 'BPD Desa', '+62 XXX XXXX XXXX', 0, 50, 'upcoming', TRUE),
('Senam Sehat Bersama', 'Kegiatan senam sehat untuk semua warga', '2024-03-20 06:30:00', '2024-03-20 08:00:00', 'Lapangan Desa', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', 'Kesehatan', 'PKK Desa', '+62 XXX XXXX XXXX', 0, 100, 'upcoming', FALSE),
('Pelatihan Komputer', 'Pelatihan komputer dasar untuk pemuda desa', '2024-03-25 13:00:00', '2024-03-25 16:00:00', 'Balai Desa', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', 'Pendidikan', 'Karang Taruna', '+62 XXX XXXX XXXX', 50000, 30, 'upcoming', TRUE),
('Pengajian Rutin', 'Pengajian rutin bulanan warga', '2024-03-30 19:30:00', '2024-03-30 21:00:00', 'Masjid Desa', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', 'Keagamaan', 'Takmir Masjid', '+62 XXX XXXX XXXX', 0, 200, 'upcoming', FALSE);

-- Insert sample organization
INSERT INTO organisasi (nama, jabatan, foto, urutan, nip, pendidikan, alamat, telepon, email, masa_jabatan, tugas_pokok) VALUES
('Budi Santoso', 'Kepala Desa', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', 1, '196501011990031001', 'S1 Administrasi Negara', 'Dusun 1 RT 01 RW 01', '+62 XXX XXXX XXXX', 'kades@desa.go.id', '2019-2025', 'Memimpin penyelenggaraan pemerintahan desa'),
('Siti Aminah', 'Sekretaris Desa', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', 2, '197002021992032001', 'S1 Ilmu Pemerintahan', 'Dusun 2 RT 02 RW 01', '+62 XXX XXXX XXXX', 'sekdes@desa.go.id', '2020-2026', 'Membantu Kepala Desa dalam bidang administrasi'),
('Ahmad Wijaya', 'Bendahara Desa', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', 3, '198003031995031002', 'S1 Akuntansi', 'Dusun 1 RT 03 RW 02', '+62 XXX XXXX XXXX', 'bendahara@desa.go.id', '2020-2026', 'Mengelola keuangan dan aset desa'),
('Rina Sari', 'Kaur Pemerintahan', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', 4, '198505051998032001', 'D3 Administrasi', 'Dusun 3 RT 01 RW 02', '+62 XXX XXXX XXXX', 'kaur.pem@desa.go.id', '2021-2027', 'Mengelola administrasi pemerintahan'),
('Dedi Kurniawan', 'Kaur Pembangunan', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', 5, '199001012000031001', 'S1 Teknik Sipil', 'Dusun 2 RT 04 RW 02', '+62 XXX XXXX XXXX', 'kaur.bangun@desa.go.id', '2021-2027', 'Mengelola pembangunan infrastruktur desa'),
('Maya Indah', 'Kaur Kesejahteraan', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', 6, '199203032001032001', 'S1 Kesejahteraan Sosial', 'Dusun 1 RT 02 RW 03', '+62 XXX XXXX XXXX', 'kaur.kesra@desa.go.id', '2022-2028', 'Mengelola program kesejahteraan masyarakat');

-- Insert sample services
INSERT INTO layanan (nama, deskripsi, persyaratan, template_dokumen, kategori, biaya, waktu_proses, jam_layanan, penanggung_jawab, status, urutan) VALUES
('Surat Keterangan Tidak Mampu', 'Surat keterangan untuk warga yang tidak mampu secara ekonomi', 'KTP, KK, Surat Pernyataan Tidak Mampu', '/assets/templates/sktm-template.pdf', 'Administrasi', 0, '1-2 hari kerja', 'Senin-Jumat 08:00-15:00', 'Kaur Pemerintahan', 'active', 1),
('Surat Keterangan Domisili', 'Surat keterangan tempat tinggal/domisili', 'KTP, KK, Surat Pernyataan Domisili', '/assets/templates/domisili-template.pdf', 'Administrasi', 0, '1 hari kerja', 'Senin-Jumat 08:00-15:00', 'Kaur Pemerintahan', 'active', 2),
('Surat Keterangan Usaha', 'Surat keterangan untuk yang memiliki usaha', 'KTP, KK, Foto Usaha, Surat Pernyataan Usaha', '/assets/templates/usaha-template.pdf', 'Ekonomi', 10000, '2-3 hari kerja', 'Senin-Jumat 08:00-15:00', 'Kaur Kesejahteraan', 'active', 3),
('Surat Pengantar Nikah', 'Surat pengantar untuk pernikahan', 'KTP, KK, Akta Kelahiran, Surat Keterangan Belum Menikah', '/assets/templates/nikah-template.pdf', 'Administrasi', 0, '1-2 hari kerja', 'Senin-Jumat 08:00-15:00', 'Kaur Pemerintahan', 'active', 4),
('Surat Keterangan Kematian', 'Surat keterangan kematian warga', 'KTP, KK, Surat Keterangan Dokter/Rumah Sakit', '/assets/templates/kematian-template.pdf', 'Administrasi', 0, '1 hari kerja', 'Senin-Jumat 08:00-15:00', 'Kaur Pemerintahan', 'active', 5);

-- Insert sample documents
INSERT INTO dokumen (judul, deskripsi, file_path, kategori, ukuran, tipe_file, tahun, nomor_dokumen, tanggal_terbit, status) VALUES
('Peraturan Desa No. 1 Tahun 2024', 'Peraturan tentang APBDesa 2024', '/assets/documents/perdes-1-2024.pdf', 'Peraturan', 2048000, 'PDF', 2024, 'PERDES/01/2024', '2024-01-01', 'active'),
('Profil Desa 2024', 'Profil lengkap desa tahun 2024', '/assets/documents/profil-desa-2024.pdf', 'Profil', 5120000, 'PDF', 2024, 'PROFIL/2024', '2024-01-15', 'active'),
('Laporan Realisasi APBDesa 2023', 'Laporan realisasi anggaran tahun 2023', '/assets/documents/laporan-apbdesa-2023.pdf', 'Laporan', 3072000, 'PDF', 2023, 'LAP/APB/2023', '2024-01-31', 'active'),
('Struktur Organisasi Desa', 'Bagan struktur organisasi pemerintah desa', '/assets/documents/struktur-organisasi.pdf', 'Organisasi', 1024000, 'PDF', 2024, 'SO/2024', '2024-02-01', 'active');

-- Insert sample admin (password: admin123 - hashed with bcrypt)
INSERT INTO admins (nama, email, password, role, foto, telepon, status) VALUES
('Administrator', 'admin@desa.go.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewEXvE4KF/5/6EMi', 'super_admin', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', '+62 XXX XXXX XXXX', 'active'),
('Editor Desa', 'editor@desa.go.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewEXvE4KF/5/6EMi', 'editor', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', '+62 XXX XXXX XXXX', 'active');

-- Insert sample service submissions
INSERT INTO pengajuan_layanan (layanan_id, nomor_pengajuan, nama, nik, alamat, telepon, email, file_pendukung, status, catatan) VALUES
(1, '240315-ABC123', 'Siti Rahayu', '1234567890123456', 'Dusun 1 RT 01 RW 01', '+62 XXX XXXX XXXX', 'siti@email.com', '/assets/submissions/siti-rahayu-ktp.jpg', 'pending', ''),
(2, '240316-DEF456', 'Budi Hartono', '1234567890123457', 'Dusun 2 RT 02 RW 01', '+62 XXX XXXX XXXX', 'budi@email.com', '/assets/submissions/budi-hartono-kk.jpg', 'diproses', 'Sedang diverifikasi'),
(3, '240317-GHI789', 'Rina Sari', '1234567890123458', 'Dusun 3 RT 01 RW 02', '+62 XXX XXXX XXXX', 'rina@email.com', '/assets/submissions/rina-sari-usaha.jpg', 'selesai', 'Surat sudah dapat diambil');

-- Insert navigation menu
INSERT INTO menu_navigasi (nama, url, icon, urutan, parent_id, target, status) VALUES
('Beranda', '/', 'Home', 1, NULL, '_self', 'active'),
('Tentang', '/tentang', 'Info', 2, NULL, '_self', 'active'),
('Berita', '/berita', 'Newspaper', 3, NULL, '_self', 'active'),
('Galeri', '/galeri', 'ImageIcon', 4, NULL, '_self', 'active'),
('Agenda', '/agenda', 'Calendar', 5, NULL, '_self', 'active'),
('Struktur', '/struktur', 'Users', 6, NULL, '_self', 'active'),
('Layanan', '/layanan', 'FileText', 7, NULL, '_self', 'active'),
('Kontak', '/kontak', 'Phone', 8, NULL, '_self', 'active');

-- Insert homepage slider
INSERT INTO slider_beranda (judul, subjudul, deskripsi, gambar, link_url, link_text, urutan, status) VALUES
('Selamat Datang di Desa Maju Sejahtera', 'Menuju Desa Modern dan Sejahtera', 'Desa yang mengutamakan pelayanan prima dan transparansi dalam pengelolaan pemerintahan', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop', '/tentang', 'Selengkapnya', 1, 'active'),
('Pelayanan Publik Terbaik', 'Mudah, Cepat, dan Transparan', 'Nikmati berbagai layanan administrasi desa dengan sistem online yang mudah dan cepat', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop', '/layanan', 'Lihat Layanan', 2, 'active'),
('Potensi Desa yang Melimpah', 'Alam Indah, Budaya Kaya', 'Jelajahi keindahan alam dan kekayaan budaya desa melalui galeri foto dan agenda kegiatan', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop', '/galeri', 'Lihat Galeri', 3, 'active');

-- Insert village statistics
INSERT INTO statistik_desa (nama, nilai, satuan, icon, warna, urutan, status) VALUES
('Total Penduduk', '2547', 'Jiwa', 'Users', '#3B82F6', 1, 'active'),
('Kepala Keluarga', '768', 'KK', 'Home', '#10B981', 2, 'active'),
('Jumlah Dusun', '3', 'Dusun', 'MapPin', '#F59E0B', 3, 'active'),
('RT/RW', '12/4', 'Unit', 'Building', '#EF4444', 4, 'active'),
('Luas Wilayah', '15.5', 'Km²', 'Map', '#8B5CF6', 5, 'active'),
('Fasilitas Umum', '25', 'Unit', 'Building2', '#06B6D4', 6, 'active');

-- Insert village facilities
INSERT INTO fasilitas_desa (nama, deskripsi, alamat, gambar, kategori, jam_operasional, kontak, status) VALUES
('Balai Desa', 'Pusat pemerintahan dan pelayanan masyarakat', 'Jl. Desa Maju No. 123', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Pemerintahan', 'Senin-Jumat 08:00-16:00', '+62 XXX XXXX XXXX', 'active'),
('Puskesmas Desa', 'Fasilitas kesehatan masyarakat', 'Jl. Sehat No. 45', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Kesehatan', '24 Jam', '+62 XXX XXXX XXXX', 'active'),
('SD Negeri 1', 'Sekolah dasar negeri', 'Jl. Pendidikan No. 67', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Pendidikan', 'Senin-Sabtu 07:00-12:00', '+62 XXX XXXX XXXX', 'active'),
('Masjid Al-Ikhlas', 'Tempat ibadah umat Islam', 'Jl. Masjid No. 89', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Keagamaan', '24 Jam', '+62 XXX XXXX XXXX', 'active'),
('Pasar Desa', 'Pusat perdagangan tradisional', 'Jl. Pasar No. 12', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Ekonomi', 'Setiap Hari 05:00-17:00', '+62 XXX XXXX XXXX', 'active');

-- Insert announcements
INSERT INTO pengumuman (judul, konten, tipe, tanggal_mulai, tanggal_selesai, status) VALUES
('Pembayaran PBB Tahun 2024', 'Diberitahukan kepada seluruh warga bahwa pembayaran PBB tahun 2024 dapat dilakukan di Kantor Desa setiap hari kerja.', 'info', '2024-01-01', '2024-12-31', 'active'),
('Perbaikan Jalan Desa', 'Mohon perhatian warga, akan dilakukan perbaikan jalan di Dusun 2 mulai tanggal 15 Maret 2024. Harap berhati-hati saat melewati area tersebut.', 'warning', '2024-03-10', '2024-03-25', 'active'),
('Vaksinasi COVID-19 Booster', 'URGENT: Vaksinasi COVID-19 booster akan dilaksanakan di Puskesmas Desa pada tanggal 20 Maret 2024. Daftar segera!', 'urgent', '2024-03-15', '2024-03-20', 'active');

-- Insert emergency contacts
INSERT INTO kontak_darurat (nama, jabatan, telepon, kategori, alamat, jam_layanan, urutan, status) VALUES
('Dr. Ahmad Sehat', 'Dokter Puskesmas', '+62 XXX XXXX XXXX', 'kesehatan', 'Puskesmas Desa', '24 Jam', 1, 'active'),
('Bripka Joko Aman', 'Bhabinkamtibmas', '+62 XXX XXXX XXXX', 'keamanan', 'Pos Kamling Desa', '24 Jam', 2, 'active'),
('Regu Pemadam Desa', 'Tim Pemadam Kebakaran', '+62 XXX XXXX XXXX', 'pemadam', 'Pos Pemadam Desa', '24 Jam', 3, 'active'),
('Kepala Desa', 'Budi Santoso', '+62 XXX XXXX XXXX', 'pemerintah', 'Balai Desa', 'Senin-Jumat 08:00-16:00', 4, 'active'),
('PLN Rayon', 'Petugas Listrik', '123', 'lainnya', 'Kantor PLN', '24 Jam', 5, 'active');

-- Insert testimonials
INSERT INTO testimoni (nama, jabatan, foto, konten, rating, status, featured) VALUES
('Ibu Sari Wati', 'Warga Dusun 1', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', 'Pelayanan di desa sangat memuaskan. Proses pengurusan surat-surat sangat cepat dan mudah. Terima kasih kepada seluruh perangkat desa.', 5, 'active', TRUE),
('Pak Budi Santoso', 'Pengusaha Lokal', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', 'Dengan adanya sistem online ini, saya bisa mengurus surat keterangan usaha tanpa harus menunggu lama. Sangat membantu untuk perkembangan usaha saya.', 5, 'active', TRUE),
('Ibu Rina Indah', 'Ketua PKK', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', 'Program-program desa sangat bermanfaat untuk masyarakat. Pelatihan UMKM yang diadakan sangat membantu ibu-ibu untuk mengembangkan usaha rumahan.', 5, 'active', FALSE);

-- Insert FAQ
INSERT INTO faq (pertanyaan, jawaban, kategori, urutan, status) VALUES
('Bagaimana cara mengajukan layanan administrasi?', 'Anda dapat mengajukan layanan melalui website ini dengan mengklik menu "Layanan" atau datang langsung ke kantor desa pada jam kerja.', 'Layanan', 1, 'active'),
('Berapa lama proses pengurusan surat?', 'Waktu proses bervariasi tergantung jenis surat. Umumnya 1-3 hari kerja. Informasi detail dapat dilihat di halaman layanan masing-masing.', 'Layanan', 2, 'active'),
('Apakah ada biaya untuk layanan administrasi?', 'Sebagian besar layanan gratis. Untuk layanan tertentu yang dikenakan biaya, informasinya sudah tercantum di halaman layanan.', 'Layanan', 3, 'active'),
('Bagaimana cara melacak status pengajuan?', 'Anda dapat melacak status pengajuan menggunakan nomor pengajuan yang diberikan saat submit atau menghubungi kantor desa.', 'Layanan', 4, 'active'),
('Jam operasional kantor desa?', 'Kantor desa buka Senin-Jumat pukul 08:00-16:00 dan Sabtu pukul 08:00-12:00.', 'Umum', 5, 'active'),
('Bagaimana cara menghubungi perangkat desa?', 'Anda dapat menghubungi melalui telepon, email, atau datang langsung ke kantor desa. Kontak lengkap tersedia di halaman "Kontak".', 'Umum', 6, 'active');

-- =============================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- =============================================

-- Additional indexes for better query performance
CREATE INDEX idx_news_kategori_status ON news(kategori, status);
CREATE INDEX idx_events_kategori_status ON events(kategori, status);
CREATE INDEX idx_galleries_kategori_featured ON galleries(kategori, featured);
CREATE INDEX idx_pengajuan_created_at ON pengajuan_layanan(created_at);
CREATE INDEX idx_dokumen_kategori_status ON dokumen(kategori, status);

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

SELECT 'Database setup completed successfully!' as message;
SELECT 'You can now import this file into phpMyAdmin' as instruction;
SELECT 'Default admin login: admin@desa.go.id / admin123' as admin_info;