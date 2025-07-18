// Database Models TypeScript Interfaces

export interface DesaSettings {
  id: number;
  nama_desa: string;
  slogan: string;
  alamat: string;
  logo: string;
  hero_image: string;
  primary_color: string;
  secondary_color: string;
  deskripsi: string;
  visi: string;
  misi: string;
  sejarah: string;
  telepon: string;
  email: string;
  website: string;
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  jam_operasional: string;
  created_at: Date;
  updated_at: Date;
}

export interface News {
  id: number;
  judul: string;
  slug: string;
  konten: string;
  gambar: string;
  tanggal: Date;
  penulis: string;
  status: 'published' | 'draft';
  kategori: string;
  tags: string;
  views: number;
  featured: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Gallery {
  id: number;
  judul: string;
  deskripsi: string;
  gambar: string;
  kategori: string;
  tanggal: Date;
  photographer: string;
  lokasi: string;
  featured: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Event {
  id: number;
  judul: string;
  deskripsi: string;
  tanggal: Date;
  tanggal_selesai: Date;
  lokasi: string;
  gambar: string;
  kategori: string;
  penyelenggara: string;
  kontak: string;
  biaya: number;
  kapasitas: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  featured: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Organization {
  id: number;
  nama: string;
  jabatan: string;
  foto: string;
  urutan: number;
  nip: string;
  pendidikan: string;
  alamat: string;
  telepon: string;
  email: string;
  masa_jabatan: string;
  tugas_pokok: string;
  created_at: Date;
  updated_at: Date;
}

export interface Service {
  id: number;
  nama: string;
  deskripsi: string;
  persyaratan: string;
  template_dokumen: string;
  kategori: string;
  biaya: number;
  waktu_proses: string;
  jam_layanan: string;
  penanggung_jawab: string;
  status: 'active' | 'inactive';
  urutan: number;
  created_at: Date;
  updated_at: Date;
}

export interface ServiceSubmission {
  id: number;
  layanan_id: number;
  nomor_pengajuan: string;
  nama: string;
  nik: string;
  alamat: string;
  telepon: string;
  email: string;
  file_pendukung: string;
  status: 'pending' | 'diproses' | 'selesai' | 'ditolak';
  catatan: string;
  tanggal_selesai: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Admin {
  id: number;
  nama: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

// New interfaces for additional configurable content
export interface MenuNavigasi {
  id: number;
  nama: string;
  url: string;
  icon: string;
  urutan: number;
  parent_id: number | null;
  target: '_self' | '_blank';
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

export interface SliderBeranda {
  id: number;
  judul: string;
  subjudul: string;
  deskripsi: string;
  gambar: string;
  link_url: string;
  link_text: string;
  urutan: number;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

export interface StatistikDesa {
  id: number;
  nama: string;
  nilai: string;
  satuan: string;
  icon: string;
  warna: string;
  urutan: number;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

export interface FasilitasDesa {
  id: number;
  nama: string;
  deskripsi: string;
  alamat: string;
  gambar: string;
  kategori: string;
  jam_operasional: string;
  kontak: string;
  status: 'active' | 'inactive' | 'maintenance';
  created_at: Date;
  updated_at: Date;
}

export interface Pengumuman {
  id: number;
  judul: string;
  konten: string;
  tipe: 'info' | 'warning' | 'urgent';
  tanggal_mulai: Date;
  tanggal_selesai: Date;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

export interface KontakDarurat {
  id: number;
  nama: string;
  jabatan: string;
  telepon: string;
  kategori: 'kesehatan' | 'keamanan' | 'pemadam' | 'pemerintah' | 'lainnya';
  alamat: string;
  jam_layanan: string;
  urutan: number;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

export interface Testimoni {
  id: number;
  nama: string;
  jabatan: string;
  foto: string;
  konten: string;
  rating: number;
  status: 'active' | 'inactive';
  featured: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface FAQ {
  id: number;
  pertanyaan: string;
  jawaban: string;
  kategori: string;
  urutan: number;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface NewsForm {
  judul: string;
  konten: string;
  gambar: FileList | null;
  status: 'published' | 'draft';
}

export interface ServiceSubmissionForm {
  layanan_id: number;
  nama: string;
  nik: string;
  file_pendukung: FileList | null;
}

export interface ContactForm {
  nama: string;
  email: string;
  subjek: string;
  pesan: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}