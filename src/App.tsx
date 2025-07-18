import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeAuth } from './utils/auth';

import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Gallery from './pages/Gallery';
import Events from './pages/Events';
import Organization from './pages/Organization';
import Services from './pages/Services';
import Contact from './pages/Contact';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import NewsManagement from './pages/admin/NewsManagement';
import GalleryManagement from './pages/admin/GalleryManagement';
import EventsManagement from './pages/admin/EventsManagement';
import OrganizationManagement from './pages/admin/OrganizationManagement';
import ServicesManagement from './pages/admin/ServicesManagement';
import SettingsManagement from './pages/admin/SettingsManagement';
import ContentManagement from './pages/admin/ContentManagement';
import ContentTextManagement from './pages/admin/ContentTextManagement';

function App() {
  useEffect(() => {
    // Initialize authentication
    initializeAuth();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/tentang" element={<Layout><About /></Layout>} />
        <Route path="/berita" element={<Layout><News /></Layout>} />
        <Route path="/berita/:slug" element={<Layout><NewsDetail /></Layout>} />
        <Route path="/galeri" element={<Layout><Gallery /></Layout>} />
        <Route path="/agenda" element={<Layout><Events /></Layout>} />
        <Route path="/struktur" element={<Layout><Organization /></Layout>} />
        <Route path="/layanan" element={<Layout><Services /></Layout>} />
        <Route path="/kontak" element={<Layout><Contact /></Layout>} />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/berita" element={<ProtectedRoute><NewsManagement /></ProtectedRoute>} />
        <Route path="/admin/galeri" element={<ProtectedRoute><GalleryManagement /></ProtectedRoute>} />
        <Route path="/admin/agenda" element={<ProtectedRoute><EventsManagement /></ProtectedRoute>} />
        <Route path="/admin/struktur" element={<ProtectedRoute><OrganizationManagement /></ProtectedRoute>} />
        <Route path="/admin/layanan" element={<ProtectedRoute><ServicesManagement /></ProtectedRoute>} />
        <Route path="/admin/pengaturan" element={<ProtectedRoute><SettingsManagement /></ProtectedRoute>} />
        <Route path="/admin/konten" element={<ProtectedRoute><ContentManagement /></ProtectedRoute>} />
        <Route path="/admin/teks" element={<ProtectedRoute><ContentTextManagement /></ProtectedRoute>} />
        
        {/* 404 Page */}
        <Route path="*" element={
          <Layout>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Halaman tidak ditemukan</p>
                <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Kembali ke Beranda
                </a>
              </div>
            </div>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;