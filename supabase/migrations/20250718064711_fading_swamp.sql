-- Dynamic Content Management System for Digital Village Website
-- This SQL creates tables to manage all website text content dynamically
-- Import this file into phpMyAdmin after the main database setup

USE desa_digital;

-- =============================================
-- DYNAMIC CONTENT MANAGEMENT TABLES
-- =============================================

-- Create website_content table for managing all text content
CREATE TABLE IF NOT EXISTS website_content (
  id INT PRIMARY KEY AUTO_INCREMENT,
  content_key VARCHAR(255) UNIQUE NOT NULL,
  content_value TEXT NOT NULL,
  content_type ENUM('text', 'textarea', 'html', 'json') DEFAULT 'text',
  page VARCHAR(100) NOT NULL,
  section VARCHAR(100) NOT NULL,
  label VARCHAR(255) NOT NULL,
  description TEXT,
  is_required BOOLEAN DEFAULT TRUE,
  max_length INT DEFAULT NULL,
  sort_order INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_page (page),
  INDEX idx_section (section),
  INDEX idx_content_key (content_key),
  INDEX idx_status (status)
);

-- Create website_sections table for organizing content
CREATE TABLE IF NOT EXISTS website_sections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  section_key VARCHAR(100) UNIQUE NOT NULL,
  section_name VARCHAR(255) NOT NULL,
  page VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  sort_order INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_page (page),
  INDEX idx_section_key (section_key)
);

-- =============================================
-- INSERT WEBSITE SECTIONS
-- =============================================

INSERT INTO website_sections (section_key, section_name, page, description, icon, sort_order) VALUES
-- Homepage sections
('hero', 'Hero Section', 'homepage', 'Main hero section with title and description', 'Home', 1),
('about_preview', 'About Preview', 'homepage', 'About section preview on homepage', 'Info', 2),
('services_preview', 'Services Preview', 'homepage', 'Services section preview', 'FileText', 3),
('statistics', 'Statistics Section', 'homepage', 'Village statistics display', 'BarChart3', 4),

-- About page sections
('about_hero', 'About Hero', 'about', 'About page hero section', 'Users', 1),
('about_content', 'About Content', 'about', 'Main about content', 'FileText', 2),
('vision_mission', 'Vision & Mission', 'about', 'Village vision and mission', 'Target', 3),
('history', 'Village History', 'about', 'Village history content', 'Clock', 4),
('achievements', 'Achievements', 'about', 'Village achievements and awards', 'Award', 5),

-- Contact page sections
('contact_hero', 'Contact Hero', 'contact', 'Contact page hero section', 'Phone', 1),
('contact_info', 'Contact Information', 'contact', 'Contact details and office hours', 'MapPin', 2),
('contact_form', 'Contact Form', 'contact', 'Contact form labels and messages', 'Mail', 3),

-- Services page sections
('services_hero', 'Services Hero', 'services', 'Services page hero section', 'FileText', 1),
('services_info', 'Services Information', 'services', 'Services information and guidelines', 'Info', 2),

-- News page sections
('news_hero', 'News Hero', 'news', 'News page hero section', 'Newspaper', 1),

-- Gallery page sections
('gallery_hero', 'Gallery Hero', 'gallery', 'Gallery page hero section', 'Image', 1),

-- Events page sections
('events_hero', 'Events Hero', 'events', 'Events page hero section', 'Calendar', 1),

-- Organization page sections
('organization_hero', 'Organization Hero', 'organization', 'Organization page hero section', 'Users', 1),
('organization_info', 'Organization Info', 'organization', 'Organization information and duties', 'Building', 2),

-- Global sections
('navigation', 'Navigation', 'global', 'Navigation menu items and labels', 'Navigation', 1),
('footer', 'Footer', 'global', 'Footer content and links', 'Layout', 2),
('buttons', 'Buttons & Labels', 'global', 'Common buttons and labels', 'MousePointer', 3),
('messages', 'Messages & Notifications', 'global', 'System messages and notifications', 'MessageSquare', 4);

-- =============================================
-- INSERT WEBSITE CONTENT
-- =============================================

-- Homepage Content
INSERT INTO website_content (content_key, content_value, content_type, page, section, label, description, sort_order) VALUES
-- Hero Section
('hero_title', 'Selamat Datang di {village_name}', 'text', 'homepage', 'hero', 'Hero Title', 'Main title on homepage hero section', 1),
('hero_subtitle', '{village_slogan}', 'text', 'homepage', 'hero', 'Hero Subtitle', 'Subtitle on homepage hero section', 2),
('hero_description', 'Website resmi desa yang menyediakan informasi terkini dan layanan publik untuk masyarakat', 'textarea', 'homepage', 'hero', 'Hero Description', 'Description text on hero section', 3),

-- About Preview Section
('about_preview_title', 'Tentang {village_name}', 'text', 'homepage', 'about_preview', 'About Preview Title', 'Title for about preview section', 1),
('about_preview_description', 'Desa modern yang mengutamakan pelayanan publik yang prima dan transparansi dalam pengelolaan pemerintahan.', 'textarea', 'homepage', 'about_preview', 'About Preview Description', 'Description for about preview', 2),
('about_preview_button', 'Selengkapnya', 'text', 'homepage', 'about_preview', 'About Preview Button', 'Button text for about preview', 3),

-- Services Preview Section
('services_preview_title', 'Layanan Publik', 'text', 'homepage', 'services_preview', 'Services Preview Title', 'Title for services preview section', 1),
('services_preview_description', 'Berbagai layanan administratif untuk masyarakat', 'textarea', 'homepage', 'services_preview', 'Services Preview Description', 'Description for services preview', 2),
('services_preview_button', 'Lihat Semua Layanan', 'text', 'homepage', 'services_preview', 'Services Preview Button', 'Button text for services preview', 3),

-- Statistics Section
('statistics_title', 'Data Statistik Desa', 'text', 'homepage', 'statistics', 'Statistics Title', 'Title for statistics section', 1),

-- About Page Content
('about_hero_title', 'Tentang {village_name}', 'text', 'about', 'about_hero', 'About Hero Title', 'Main title on about page', 1),
('about_hero_subtitle', '{village_slogan}', 'text', 'about', 'about_hero', 'About Hero Subtitle', 'Subtitle on about page', 2),

('about_content_title', 'Sejarah & Profil Desa', 'text', 'about', 'about_content', 'About Content Title', 'Title for main about content', 1),
('about_content_text', 'Desa yang terletak di kawasan strategis dengan potensi alam yang melimpah. Desa ini memiliki sejarah panjang dan kaya akan budaya lokal yang masih dilestarikan hingga saat ini.', 'html', 'about', 'about_content', 'About Content Text', 'Main about content text', 2),

('vision_title', 'Visi', 'text', 'about', 'vision_mission', 'Vision Title', 'Title for vision section', 1),
('vision_text', 'Mewujudkan desa yang maju, mandiri, dan sejahtera berdasarkan nilai-nilai gotong royong dan kearifan lokal.', 'textarea', 'about', 'vision_mission', 'Vision Text', 'Village vision statement', 2),
('mission_title', 'Misi', 'text', 'about', 'vision_mission', 'Mission Title', 'Title for mission section', 3),
('mission_text', '["Meningkatkan kualitas pelayanan publik yang prima dan transparan", "Mengembangkan potensi ekonomi lokal dan pariwisata desa", "Membangun infrastruktur yang mendukung kemajuan desa", "Melestarikan budaya dan tradisi lokal yang bernilai positif", "Meningkatkan partisipasi masyarakat dalam pembangunan desa"]', 'json', 'about', 'vision_mission', 'Mission Text', 'Village mission statements (JSON array)', 4),

('achievements_title', 'Prestasi & Penghargaan', 'text', 'about', 'achievements', 'Achievements Title', 'Title for achievements section', 1),
('achievements_subtitle', 'Pencapaian yang membanggakan', 'text', 'about', 'achievements', 'Achievements Subtitle', 'Subtitle for achievements section', 2),

-- Contact Page Content
('contact_hero_title', 'Hubungi Kami', 'text', 'contact', 'contact_hero', 'Contact Hero Title', 'Main title on contact page', 1),
('contact_hero_subtitle', 'Kami siap membantu dan mendengarkan aspirasi Anda', 'text', 'contact', 'contact_hero', 'Contact Hero Subtitle', 'Subtitle on contact page', 2),

('contact_form_title', 'Kirim Pesan', 'text', 'contact', 'contact_form', 'Contact Form Title', 'Title for contact form', 1),
('contact_form_name_label', 'Nama Lengkap', 'text', 'contact', 'contact_form', 'Name Label', 'Label for name field', 2),
('contact_form_email_label', 'Email', 'text', 'contact', 'contact_form', 'Email Label', 'Label for email field', 3),
('contact_form_subject_label', 'Subjek', 'text', 'contact', 'contact_form', 'Subject Label', 'Label for subject field', 4),
('contact_form_message_label', 'Pesan', 'text', 'contact', 'contact_form', 'Message Label', 'Label for message field', 5),
('contact_form_submit_button', 'Kirim Pesan', 'text', 'contact', 'contact_form', 'Submit Button', 'Submit button text', 6),
('contact_form_success_message', 'Pesan berhasil dikirim! Kami akan segera merespons.', 'text', 'contact', 'contact_form', 'Success Message', 'Success message after form submission', 7),

('contact_info_title', 'Informasi Kontak', 'text', 'contact', 'contact_info', 'Contact Info Title', 'Title for contact information section', 1),
('contact_address_label', 'Alamat', 'text', 'contact', 'contact_info', 'Address Label', 'Label for address', 2),
('contact_phone_label', 'Telepon', 'text', 'contact', 'contact_info', 'Phone Label', 'Label for phone', 3),
('contact_email_label', 'Email', 'text', 'contact', 'contact_info', 'Email Label', 'Label for email', 4),
('contact_hours_label', 'Jam Operasional', 'text', 'contact', 'contact_info', 'Hours Label', 'Label for operating hours', 5),

-- Services Page Content
('services_hero_title', 'Layanan Publik', 'text', 'services', 'services_hero', 'Services Hero Title', 'Main title on services page', 1),
('services_hero_subtitle', 'Berbagai layanan administratif untuk masyarakat', 'text', 'services', 'services_hero', 'Services Hero Subtitle', 'Subtitle on services page', 2),

('services_list_title', 'Daftar Layanan', 'text', 'services', 'services_info', 'Services List Title', 'Title for services list', 1),
('services_list_subtitle', 'Pilih layanan yang Anda butuhkan', 'text', 'services', 'services_info', 'Services List Subtitle', 'Subtitle for services list', 2),
('services_track_title', 'Lacak Status Pengajuan', 'text', 'services', 'services_info', 'Track Title', 'Title for tracking section', 3),
('services_track_subtitle', 'Cek status pengajuan layanan Anda', 'text', 'services', 'services_info', 'Track Subtitle', 'Subtitle for tracking section', 4),
('services_track_placeholder', 'Masukkan nomor pengajuan', 'text', 'services', 'services_info', 'Track Placeholder', 'Placeholder for tracking input', 5),
('services_track_button', 'Cek Status', 'text', 'services', 'services_info', 'Track Button', 'Button text for tracking', 6),

-- News Page Content
('news_hero_title', 'Berita Desa', 'text', 'news', 'news_hero', 'News Hero Title', 'Main title on news page', 1),
('news_hero_subtitle', 'Informasi terkini dan terpercaya dari desa', 'text', 'news', 'news_hero', 'News Hero Subtitle', 'Subtitle on news page', 2),
('news_search_placeholder', 'Cari berita...', 'text', 'news', 'news_hero', 'Search Placeholder', 'Placeholder for news search', 3),
('news_read_more', 'Baca Selengkapnya', 'text', 'news', 'news_hero', 'Read More Button', 'Read more button text', 4),
('news_view_all', 'Lihat Semua Berita', 'text', 'news', 'news_hero', 'View All Button', 'View all news button text', 5),

-- Gallery Page Content
('gallery_hero_title', 'Galeri Foto', 'text', 'gallery', 'gallery_hero', 'Gallery Hero Title', 'Main title on gallery page', 1),
('gallery_hero_subtitle', 'Dokumentasi kegiatan dan momen berharga di desa', 'text', 'gallery', 'gallery_hero', 'Gallery Hero Subtitle', 'Subtitle on gallery page', 2),
('gallery_search_placeholder', 'Cari foto...', 'text', 'gallery', 'gallery_hero', 'Search Placeholder', 'Placeholder for gallery search', 3),
('gallery_all_categories', 'Semua Kategori', 'text', 'gallery', 'gallery_hero', 'All Categories', 'All categories option text', 4),

-- Events Page Content
('events_hero_title', 'Agenda Kegiatan', 'text', 'events', 'events_hero', 'Events Hero Title', 'Main title on events page', 1),
('events_hero_subtitle', 'Jadwal kegiatan dan acara di desa', 'text', 'events', 'events_hero', 'Events Hero Subtitle', 'Subtitle on events page', 2),
('events_upcoming_title', 'Kegiatan Mendatang', 'text', 'events', 'events_hero', 'Upcoming Title', 'Title for upcoming events', 3),
('events_past_title', 'Kegiatan Sebelumnya', 'text', 'events', 'events_hero', 'Past Title', 'Title for past events', 4),
('events_search_placeholder', 'Cari kegiatan...', 'text', 'events', 'events_hero', 'Search Placeholder', 'Placeholder for events search', 5),

-- Organization Page Content
('organization_hero_title', 'Struktur Organisasi', 'text', 'organization', 'organization_hero', 'Organization Hero Title', 'Main title on organization page', 1),
('organization_hero_subtitle', 'Profil perangkat desa dan struktur pemerintahan', 'text', 'organization', 'organization_hero', 'Organization Hero Subtitle', 'Subtitle on organization page', 2),
('organization_duties_title', 'Tugas dan Tanggung Jawab', 'text', 'organization', 'organization_info', 'Duties Title', 'Title for duties section', 1),
('organization_duties_subtitle', 'Setiap perangkat desa memiliki tugas dan tanggung jawab yang jelas', 'text', 'organization', 'organization_info', 'Duties Subtitle', 'Subtitle for duties section', 2),

-- Global Navigation
('nav_home', 'Beranda', 'text', 'global', 'navigation', 'Home Navigation', 'Home menu item', 1),
('nav_about', 'Tentang', 'text', 'global', 'navigation', 'About Navigation', 'About menu item', 2),
('nav_news', 'Berita', 'text', 'global', 'navigation', 'News Navigation', 'News menu item', 3),
('nav_gallery', 'Galeri', 'text', 'global', 'navigation', 'Gallery Navigation', 'Gallery menu item', 4),
('nav_events', 'Agenda', 'text', 'global', 'navigation', 'Events Navigation', 'Events menu item', 5),
('nav_organization', 'Struktur', 'text', 'global', 'navigation', 'Organization Navigation', 'Organization menu item', 6),
('nav_services', 'Layanan', 'text', 'global', 'navigation', 'Services Navigation', 'Services menu item', 7),
('nav_contact', 'Kontak', 'text', 'global', 'navigation', 'Contact Navigation', 'Contact menu item', 8),

-- Global Footer
('footer_quick_links_title', 'Tautan Cepat', 'text', 'global', 'footer', 'Quick Links Title', 'Title for quick links in footer', 1),
('footer_contact_title', 'Kontak', 'text', 'global', 'footer', 'Contact Title', 'Title for contact section in footer', 2),
('footer_follow_us', 'Ikuti Kami', 'text', 'global', 'footer', 'Follow Us', 'Follow us text in footer', 3),
('footer_copyright', '© {year} {village_name}. All rights reserved.', 'text', 'global', 'footer', 'Copyright', 'Copyright text in footer', 4),

-- Global Buttons & Labels
('btn_submit', 'Kirim', 'text', 'global', 'buttons', 'Submit Button', 'Generic submit button', 1),
('btn_cancel', 'Batal', 'text', 'global', 'buttons', 'Cancel Button', 'Generic cancel button', 2),
('btn_save', 'Simpan', 'text', 'global', 'buttons', 'Save Button', 'Generic save button', 3),
('btn_edit', 'Edit', 'text', 'global', 'buttons', 'Edit Button', 'Generic edit button', 4),
('btn_delete', 'Hapus', 'text', 'global', 'buttons', 'Delete Button', 'Generic delete button', 5),
('btn_view', 'Lihat', 'text', 'global', 'buttons', 'View Button', 'Generic view button', 6),
('btn_download', 'Download', 'text', 'global', 'buttons', 'Download Button', 'Generic download button', 7),
('btn_back', 'Kembali', 'text', 'global', 'buttons', 'Back Button', 'Generic back button', 8),
('btn_next', 'Selanjutnya', 'text', 'global', 'buttons', 'Next Button', 'Generic next button', 9),
('btn_previous', 'Sebelumnya', 'text', 'global', 'buttons', 'Previous Button', 'Generic previous button', 10),
('btn_search', 'Cari', 'text', 'global', 'buttons', 'Search Button', 'Generic search button', 11),
('btn_filter', 'Filter', 'text', 'global', 'buttons', 'Filter Button', 'Generic filter button', 12),

-- Global Messages
('msg_loading', 'Memuat...', 'text', 'global', 'messages', 'Loading Message', 'Loading message', 1),
('msg_no_data', 'Tidak ada data yang ditemukan', 'text', 'global', 'messages', 'No Data Message', 'No data found message', 2),
('msg_error', 'Terjadi kesalahan. Silakan coba lagi.', 'text', 'global', 'messages', 'Error Message', 'Generic error message', 3),
('msg_success', 'Berhasil!', 'text', 'global', 'messages', 'Success Message', 'Generic success message', 4),
('msg_confirm_delete', 'Apakah Anda yakin ingin menghapus item ini?', 'text', 'global', 'messages', 'Confirm Delete', 'Delete confirmation message', 5),
('msg_required_field', 'Field ini wajib diisi', 'text', 'global', 'messages', 'Required Field', 'Required field validation message', 6),
('msg_invalid_email', 'Format email tidak valid', 'text', 'global', 'messages', 'Invalid Email', 'Invalid email validation message', 7),
('msg_file_too_large', 'Ukuran file terlalu besar', 'text', 'global', 'messages', 'File Too Large', 'File size validation message', 8),
('msg_invalid_file_type', 'Tipe file tidak didukung', 'text', 'global', 'messages', 'Invalid File Type', 'File type validation message', 9);

-- =============================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- =============================================

CREATE INDEX idx_website_content_page_section ON website_content(page, section);
CREATE INDEX idx_website_content_sort ON website_content(page, section, sort_order);
CREATE INDEX idx_website_sections_page_sort ON website_sections(page, sort_order);

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

SELECT 'Dynamic content management system setup completed!' as message;
SELECT 'All website text content can now be managed through admin panel' as info;
SELECT 'Content supports text, textarea, HTML, and JSON formats' as feature;