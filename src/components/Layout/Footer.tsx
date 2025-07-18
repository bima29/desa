import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContent } from '../../hooks/useContent';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { DesaSettings } from '../../types';
import { getDesaSettings } from '../../services/api';

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<DesaSettings | null>(null);
  
  // Use global content hook for footer text
  const { getFooter, getNavigation } = useGlobalContent();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getDesaSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              {settings?.logo && (
                <img 
                  src={settings.logo} 
                  alt="Logo" 
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="text-xl font-bold">
                  {settings?.nama_desa || 'Desa Digital'}
                </h3>
                {settings?.slogan && (
                  <p className="text-gray-400">{settings.slogan}</p>
                )}
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              {settings?.deskripsi || 'Website resmi desa yang menyediakan informasi terkini dan layanan publik untuk masyarakat.'}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {getFooter('footer_quick_links_title', 'Tautan Cepat')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/tentang" className="text-gray-400 hover:text-white transition-colors">
                  {getNavigation('nav_about', 'Tentang Desa')}
                </Link>
              </li>
              <li>
                <Link to="/berita" className="text-gray-400 hover:text-white transition-colors">
                  {getNavigation('nav_news', 'Berita')}
                </Link>
              </li>
              <li>
                <Link to="/galeri" className="text-gray-400 hover:text-white transition-colors">
                  {getNavigation('nav_gallery', 'Galeri')}
                </Link>
              </li>
              <li>
                <Link to="/agenda" className="text-gray-400 hover:text-white transition-colors">
                  {getNavigation('nav_events', 'Agenda')}
                </Link>
              </li>
              <li>
                <Link to="/layanan" className="text-gray-400 hover:text-white transition-colors">
                  {getNavigation('nav_services', 'Layanan')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {getFooter('footer_contact_title', 'Kontak')}
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <p className="text-gray-400 text-sm">
                  {settings?.alamat || 'Alamat Desa'}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <p className="text-gray-400 text-sm">+62 XXX XXXX XXXX</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <p className="text-gray-400 text-sm">info@desa.go.id</p>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <p className="text-gray-400 text-sm">Senin - Jumat: 08:00 - 16:00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            {getFooter('footer_copyright', `© ${new Date().getFullYear()} ${settings?.nama_desa || 'Desa Digital'}. All rights reserved.`)}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;