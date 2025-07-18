-- Sample data for testing the Digital Village Website
-- Insert this data after creating the database structure

-- Insert desa settings
INSERT INTO desa_settings (nama_desa, slogan, alamat, logo, hero_image, primary_color, secondary_color, deskripsi) VALUES
('Desa Maju Sejahtera', 'Menuju Desa Modern dan Sejahtera', 'Jl. Desa Maju No. 123, Kecamatan Sejahtera, Kabupaten Makmur, Provinsi Jaya 12345', '/assets/logo-desa.png', '/assets/hero-village.jpg', '#3B82F6', '#10B981', 'Desa Maju Sejahtera adalah desa yang terletak di kawasan strategis dengan potensi alam yang melimpah. Desa ini memiliki sejarah panjang dan kaya akan budaya lokal yang masih dilestarikan hingga saat ini. Dengan semangat gotong royong yang kuat, masyarakat desa terus berjuang untuk memajukan desa dan meningkatkan kesejahteraan bersama.');

-- Insert sample news
INSERT INTO news (judul, slug, konten, gambar, tanggal, penulis, status) VALUES
('Pembangunan Jalan Desa Selesai', 'pembangunan-jalan-desa-selesai', '<p>Alhamdulillah, pembangunan jalan desa sepanjang 2 km telah selesai dilaksanakan. Proyek ini menggunakan dana desa tahun 2024 dengan total anggaran Rp 500 juta.</p><p>Jalan ini menghubungkan dusun 1 dan dusun 2 yang selama ini kondisinya rusak parah. Dengan selesainya pembangunan ini, diharapkan dapat memperlancar akses masyarakat dan mendukung kegiatan ekonomi desa.</p>', '/assets/news/jalan-desa.jpg', '2024-01-15', 'Admin Desa', 'published'),
('Musyawarah Desa Bahas APBDesa 2024', 'musyawarah-desa-bahas-apbdesa-2024', '<p>Musyawarah Desa (Musdes) untuk membahas APBDesa tahun 2024 telah dilaksanakan pada hari Sabtu, 10 Februari 2024 di Balai Desa.</p><p>Musdes dihadiri oleh perwakilan RT/RW, tokoh masyarakat, dan berbagai elemen masyarakat. Dalam musdes ini dibahas prioritas pembangunan desa untuk tahun 2024.</p>', '/assets/news/musdes.jpg', '2024-02-10', 'Sekretaris Desa', 'published'),
('Pelatihan UMKM untuk Ibu-Ibu PKK', 'pelatihan-umkm-untuk-ibu-ibu-pkk', '<p>Desa mengadakan pelatihan UMKM untuk meningkatkan keterampilan ibu-ibu PKK dalam berwirausaha. Pelatihan ini bekerjasama dengan Dinas Koperasi dan UMKM Kabupaten.</p><p>Materi pelatihan meliputi pengelolaan keuangan, pemasaran online, dan pengembangan produk. Diharapkan setelah pelatihan, ibu-ibu dapat mengembangkan usaha mandiri.</p>', '/assets/news/pelatihan-umkm.jpg', '2024-02-20', 'Admin Desa', 'published');

-- Insert sample gallery
INSERT INTO galleries (judul, deskripsi, gambar, kategori, tanggal) VALUES
('Kegiatan Gotong Royong', 'Masyarakat bergotong royong membersihkan lingkungan desa', '/assets/gallery/gotong-royong.jpg', 'Kegiatan', '2024-01-20'),
('Pemandangan Sawah', 'Hamparan sawah hijau yang indah di desa', '/assets/gallery/sawah.jpg', 'Pemandangan', '2024-01-25'),
('Balai Desa', 'Gedung balai desa yang baru direnovasi', '/assets/gallery/balai-desa.jpg', 'Infrastruktur', '2024-02-01'),
('Acara 17 Agustus', 'Perayaan HUT RI ke-79 di desa', '/assets/gallery/17-agustus.jpg', 'Acara', '2024-08-17'),
('Pasar Desa', 'Aktivitas pasar tradisional desa', '/assets/gallery/pasar-desa.jpg', 'Ekonomi', '2024-02-15'),
('Masjid Desa', 'Masjid jami sebagai pusat kegiatan keagamaan', '/assets/gallery/masjid.jpg', 'Fasilitas', '2024-02-20');

-- Insert sample events
INSERT INTO events (judul, deskripsi, tanggal, lokasi, gambar) VALUES
('Rapat Koordinasi BPD', 'Rapat koordinasi antara BPD dan perangkat desa', '2024-03-15 09:00:00', 'Balai Desa', '/assets/events/rapat-bpd.jpg'),
('Senam Sehat Bersama', 'Kegiatan senam sehat untuk semua warga', '2024-03-20 06:30:00', 'Lapangan Desa', '/assets/events/senam.jpg'),
('Pelatihan Komputer', 'Pelatihan komputer dasar untuk pemuda desa', '2024-03-25 13:00:00', 'Balai Desa', '/assets/events/pelatihan-komputer.jpg'),
('Pengajian Rutin', 'Pengajian rutin bulanan warga', '2024-03-30 19:30:00', 'Masjid Desa', '/assets/events/pengajian.jpg');

-- Insert sample organization
INSERT INTO organisasi (nama, jabatan, foto, urutan) VALUES
('Budi Santoso', 'Kepala Desa', '/assets/organization/kepala-desa.jpg', 1),
('Siti Aminah', 'Sekretaris Desa', '/assets/organization/sekretaris.jpg', 2),
('Ahmad Wijaya', 'Bendahara Desa', '/assets/organization/bendahara.jpg', 3),
('Rina Sari', 'Kaur Pemerintahan', '/assets/organization/kaur-pemerintahan.jpg', 4),
('Dedi Kurniawan', 'Kaur Pembangunan', '/assets/organization/kaur-pembangunan.jpg', 5),
('Maya Indah', 'Kaur Kesejahteraan', '/assets/organization/kaur-kesejahteraan.jpg', 6),
('Joko Susilo', 'Kadus 1', '/assets/organization/kadus-1.jpg', 7),
('Wati Sari', 'Kadus 2', '/assets/organization/kadus-2.jpg', 8),
('Bambang Hadi', 'Kadus 3', '/assets/organization/kadus-3.jpg', 9);

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

-- Insert sample admin
INSERT INTO admins (nama, email, password) VALUES
('Administrator', 'admin@desa.go.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewEXvE4KF/5/6EMi'); -- password: admin123

-- Insert sample service submissions
INSERT INTO pengajuan_layanan (layanan_id, nomor_pengajuan, nama, nik, file_pendukung, status, catatan) VALUES
(1, '240315-ABC123', 'Siti Rahayu', '1234567890123456', '/assets/submissions/siti-rahayu-ktp.jpg', 'pending', ''),
(2, '240316-DEF456', 'Budi Hartono', '1234567890123457', '/assets/submissions/budi-hartono-kk.jpg', 'diproses', 'Sedang diverifikasi'),
(3, '240317-GHI789', 'Rina Sari', '1234567890123458', '/assets/submissions/rina-sari-usaha.jpg', 'selesai', 'Surat sudah dapat diambil');