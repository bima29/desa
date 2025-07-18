import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGlobalContent } from '../../hooks/useContent';
import { Menu, X, Home, Info, Newspaper, ImageIcon, Calendar, Users, Phone, FileText } from 'lucide-react';
import { DesaSettings } from '../../types';
import { getDesaSettings } from '../../services/api';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState<DesaSettings | null>(null);
  const location = useLocation();
  
  // Use global content hook for navigation
  const { getNavigation } = useGlobalContent();

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

  const navigation = [
    { name: getNavigation('nav_home', 'Beranda'), href: '/', icon: Home },
    { name: getNavigation('nav_about', 'Tentang'), href: '/tentang', icon: Info },
    { name: getNavigation('nav_news', 'Berita'), href: '/berita', icon: Newspaper },
    { name: getNavigation('nav_gallery', 'Galeri'), href: '/galeri', icon: ImageIcon },
    { name: getNavigation('nav_events', 'Agenda'), href: '/agenda', icon: Calendar },
    { name: getNavigation('nav_organization', 'Struktur'), href: '/struktur', icon: Users },
    { name: getNavigation('nav_services', 'Layanan'), href: '/layanan', icon: FileText },
    { name: getNavigation('nav_contact', 'Kontak'), href: '/kontak', icon: Phone },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            {settings?.logo && (
              <img 
                src={settings.logo} 
                alt="Logo" 
                className="h-10 w-10 rounded-full object-cover"
              />
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {settings?.nama_desa || 'Desa Digital'}
              </h1>
              {settings?.slogan && (
                <p className="text-xs text-gray-600">{settings.slogan}</p>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;