-- Digital Village Website Database Setup
-- Run this SQL script to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS desa_digital CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE desa_digital;

-- Create desa_settings table
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_tanggal (tanggal)
);

-- Create galleries table
CREATE TABLE IF NOT EXISTS galleries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  gambar VARCHAR(255) NOT NULL,
  kategori VARCHAR(100),
  tanggal DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_kategori (kategori)
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  tanggal DATETIME NOT NULL,
  lokasi VARCHAR(255),
  gambar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tanggal (tanggal)
);

-- Create organisasi table
CREATE TABLE IF NOT EXISTS organisasi (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(255) NOT NULL,
  jabatan VARCHAR(255) NOT NULL,
  foto VARCHAR(255),
  urutan INT DEFAULT 0,
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create pengajuan_layanan table
CREATE TABLE IF NOT EXISTS pengajuan_layanan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  layanan_id INT NOT NULL,
  nomor_pengajuan VARCHAR(50) UNIQUE NOT NULL,
  nama VARCHAR(255) NOT NULL,
  nik VARCHAR(16) NOT NULL,
  file_pendukung VARCHAR(255),
  status ENUM('pending', 'diproses', 'selesai', 'ditolak') DEFAULT 'pending',
  catatan TEXT,
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_kategori (kategori)
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
-- Insert desa settings
INSERT INTO desa_settings (nama_desa, slogan, alamat, logo, hero_image, primary_color, secondary_color, deskripsi) VALUES
('Desa Maju Sejahtera', 'Menuju Desa Modern dan Sejahtera', 'Jl. Desa Maju No. 123, Kecamatan Sejahtera, Kabupaten Makmur, Provinsi Jaya 12345', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop', '#3B82F6', '#10B981', 'Desa Maju Sejahtera adalah desa yang terletak di kawasan strategis dengan potensi alam yang melimpah. Desa ini memiliki sejarah panjang dan kaya akan budaya lokal yang masih dilestarikan hingga saat ini.');

-- Insert sample news
INSERT INTO news (judul, slug, konten, gambar, tanggal, penulis, status) VALUES
('Pembangunan Jalan Desa Selesai', 'pembangunan-jalan-desa-selesai', '<p>Alhamdulillah, pembangunan jalan desa sepanjang 2 km telah selesai dilaksanakan. Proyek ini menggunakan dana desa tahun 2024 dengan total anggaran Rp 500 juta.</p><p>Jalan ini menghubungkan dusun 1 dan dusun 2 yang selama ini kondisinya rusak parah. Dengan selesainya pembangunan ini, diharapkan dapat memperlancar akses masyarakat dan mendukung kegiatan ekonomi desa.</p>', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', '2024-01-15', 'Admin Desa', 'published'),
('Musyawarah Desa Bahas APBDesa 2024', 'musyawarah-desa-bahas-apbdesa-2024', '<p>Musyawarah Desa (Musdes) untuk membahas APBDesa tahun 2024 telah dilaksanakan pada hari Sabtu, 10 Februari 2024 di Balai Desa.</p><p>Musdes dihadiri oleh perwakilan RT/RW, tokoh masyarakat, dan berbagai elemen masyarakat. Dalam musdes ini dibahas prioritas pembangunan desa untuk tahun 2024.</p>', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', '2024-02-10', 'Sekretaris Desa', 'published'),
('Pelatihan UMKM untuk Ibu-Ibu PKK', 'pelatihan-umkm-untuk-ibu-ibu-pkk', '<p>Desa mengadakan pelatihan UMKM untuk meningkatkan keterampilan ibu-ibu PKK dalam berwirausaha. Pelatihan ini bekerjasama dengan Dinas Koperasi dan UMKM Kabupaten.</p><p>Materi pelatihan meliputi pengelolaan keuangan, pemasaran online, dan pengembangan produk. Diharapkan setelah pelatihan, ibu-ibu dapat mengembangkan usaha mandiri.</p>', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', '2024-02-20', 'Admin Desa', 'published');

-- Insert sample gallery
INSERT INTO galleries (judul, deskripsi, gambar, kategori, tanggal) VALUES
('Kegiatan Gotong Royong', 'Masyarakat bergotong royong membersihkan lingkungan desa', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Kegiatan', '2024-01-20'),
('Pemandangan Sawah', 'Hamparan sawah hijau yang indah di desa', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Pemandangan', '2024-01-25'),
('Balai Desa', 'Gedung balai desa yang baru direnovasi', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Infrastruktur', '2024-02-01'),
('Acara 17 Agustus', 'Perayaan HUT RI ke-79 di desa', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Acara', '2024-08-17'),
('Pasar Desa', 'Aktivitas pasar tradisional desa', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Ekonomi', '2024-02-15'),
('Masjid Desa', 'Masjid jami sebagai pusat kegiatan keagamaan', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Fasilitas', '2024-02-20');

-- Insert sample events
INSERT INTO events (judul, deskripsi, tanggal, lokasi, gambar) VALUES
('Rapat Koordinasi BPD', 'Rapat koordinasi antara BPD dan perangkat desa', '2024-03-15 09:00:00', 'Balai Desa', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'),
('Senam Sehat Bersama', 'Kegiatan senam sehat untuk semua warga', '2024-03-20 06:30:00', 'Lapangan Desa', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'),
('Pelatihan Komputer', 'Pelatihan komputer dasar untuk pemuda desa', '2024-03-25 13:00:00', 'Balai Desa', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'),
('Pengajian Rutin', 'Pengajian rutin bulanan warga', '2024-03-30 19:30:00', 'Masjid Desa', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop');

-- Insert sample organization
INSERT INTO organisasi (nama, jabatan, foto, urutan) VALUES
('Budi Santoso', 'Kepala Desa', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', 1),
('Siti Aminah', 'Sekretaris Desa', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', 2),
('Ahmad Wijaya', 'Bendahara Desa', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', 3),
('Rina Sari', 'Kaur Pemerintahan', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', 4),
('Dedi Kurniawan', 'Kaur Pembangunan', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', 5),
('Maya Indah', 'Kaur Kesejahteraan', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', 6);

-- Insert sample services
INSERT INTO layanan (nama, deskripsi, persyaratan, template_dokumen) VALUES
('Surat Keterangan Tidak Mampu', 'Surat keterangan untuk warga yang tidak mampu secara ekonomi', 'KTP, KK, Surat Pernyataan Tidak Mampu', '/assets/templates/sktm-template.pdf'),
('Surat Keterangan Domisili', 'Surat keterangan tempat tinggal/domisili', 'KTP, KK, Surat Pernyataan Domisili', '/assets/templates/domisili-template.pdf'),
('Surat Keterangan Usaha', 'Surat keterangan untuk yang memiliki usaha', 'KTP, KK, Foto Usaha, Surat Pernyataan Usaha', '/assets/templates/usaha-template.pdf'),
('Surat Pengantar Nikah', 'Surat pengantar untuk pernikahan', 'KTP, KK, Akta Kelahiran, Surat Keterangan Belum Menikah', '/assets/templates/nikah-template.pdf'),
('Surat Keterangan Kematian', 'Surat keterangan kematian warga', 'KTP, KK, Surat Keterangan Dokter/Rumah Sakit', '/assets/templates/kematian-template.pdf');

-- Insert sample documents
INSERT INTO dokumen (judul, deskripsi, file_path, kategori, ukuran) VALUES
('Peraturan Desa No. 1 Tahun 2024', 'Peraturan tentang APBDesa 2024', '/assets/documents/perdes-1-2024.pdf', 'Peraturan', 2048000),
('Profil Desa 2024', 'Profil lengkap desa tahun 2024', '/assets/documents/profil-desa-2024.pdf', 'Profil', 5120000),
('Laporan Realisasi APBDesa 2023', 'Laporan realisasi anggaran tahun 2023', '/assets/documents/laporan-apbdesa-2023.pdf', 'Laporan', 3072000),
('Struktur Organisasi Desa', 'Bagan struktur organisasi pemerintah desa', '/assets/documents/struktur-organisasi.pdf', 'Organisasi', 1024000);

-- Insert sample admin (password: admin123)
INSERT INTO admins (nama, email, password) VALUES
('Administrator', 'admin@desa.go.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewEXvE4KF/5/6EMi');

-- Insert sample service submissions
INSERT INTO pengajuan_layanan (layanan_id, nomor_pengajuan, nama, nik, file_pendukung, status, catatan) VALUES
(1, '240315-ABC123', 'Siti Rahayu', '1234567890123456', '/assets/submissions/siti-rahayu-ktp.jpg', 'pending', ''),
(2, '240316-DEF456', 'Budi Hartono', '1234567890123457', '/assets/submissions/budi-hartono-kk.jpg', 'diproses', 'Sedang diverifikasi'),
(3, '240317-GHI789', 'Rina Sari', '1234567890123458', '/assets/submissions/rina-sari-usaha.jpg', 'selesai', 'Surat sudah dapat diambil');