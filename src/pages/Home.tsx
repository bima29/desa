import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { 
  Users, MapPin, Calendar, FileText, 
  Newspaper, ImageIcon, Phone, Award 
} from 'lucide-react';
import { DesaSettings, News, Event } from '../types';
import { getDesaSettings, getNews, getEvents } from '../services/api';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Home: React.FC = () => {
  const [settings, setSettings] = useState<DesaSettings | null>(null);
  const [news, setNews] = useState<News[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  
  // Use content hook for dynamic text
  const { pageContent, loading: contentLoading, getContent } = useContent('homepage');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsData, newsData, eventsData] = await Promise.all([
          getDesaSettings(),
          getNews(1, 3),
          getEvents()
        ]);
        
        setSettings(settingsData);
        setNews(newsData.data);
        setEvents(eventsData.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  if (dataLoading || contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const quickServices = [
    { name: 'Layanan Publik', icon: FileText, href: '/layanan', color: 'bg-blue-500' },
    { name: 'Berita', icon: Newspaper, href: '/berita', color: 'bg-green-500' },
    { name: 'Galeri', icon: ImageIcon, href: '/galeri', color: 'bg-purple-500' },
    { name: 'Kontak', icon: Phone, href: '/kontak', color: 'bg-orange-500' }
  ];

  const statistics = [
    { label: 'Penduduk', value: '2,547', icon: Users },
    { label: 'Keluarga', value: '768', icon: Users },
    { label: 'Dusun', value: '3', icon: MapPin },
    { label: 'RT/RW', value: '12/4', icon: MapPin }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        {settings?.hero_image && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${settings.hero_image})` }}
          >
            <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>
          </div>
        )}
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {getContent('hero', 'hero_title', settings?.nama_desa || 'Desa Digital')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              {getContent('hero', 'hero_subtitle', settings?.slogan || 'Menuju Desa Modern dan Sejahtera')}
            </p>
            <p className="text-lg mb-8 text-blue-200 max-w-3xl mx-auto">
              {getContent('hero', 'hero_description', 'Website resmi desa yang menyediakan informasi terkini dan layanan publik untuk masyarakat')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {quickServices.map((service) => (
                <Link
                  key={service.name}
                  to={service.href}
                  className={`inline-flex items-center px-6 py-3 rounded-lg ${service.color} text-white font-medium hover:opacity-90 transition-opacity`}
                >
                  <service.icon className="w-5 h-5 mr-2" />
                  {service.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat) => (
              <Card key={stat.label} className="text-center p-6">
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {getContent('news_preview', 'news_preview_title', 'Berita Terkini')}
            </h2>
            <p className="text-lg text-gray-600">
              {getContent('news_preview', 'news_preview_subtitle', 'Informasi terbaru dari desa')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {news.map((article) => (
              <Card key={article.id} className="overflow-hidden" hover>
                {article.gambar && (
                  <img 
                    src={article.gambar} 
                    alt={article.judul}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(article.tanggal).toLocaleDateString('id-ID')}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    <Link 
                      to={`/berita/${article.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {article.judul}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.konten.substring(0, 150)}...
                  </p>
                  <Link 
                    to={`/berita/${article.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {getContent('news_preview', 'news_read_more', 'Baca Selengkapnya')}
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/berita"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {getContent('news_preview', 'news_view_all', 'Lihat Semua Berita')}
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {getContent('events_preview', 'events_preview_title', 'Agenda Mendatang')}
            </h2>
            <p className="text-lg text-gray-600">
              {getContent('events_preview', 'events_preview_subtitle', 'Kegiatan dan acara yang akan datang')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card key={event.id} className="p-6" hover>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">
                      {new Date(event.tanggal).toLocaleDateString('id-ID')}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{event.judul}</h3>
                    <p className="text-gray-600 mb-2">{event.deskripsi}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {event.lokasi}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/agenda"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {getContent('events_preview', 'events_view_all', 'Lihat Semua Agenda')}
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {getContent('about_preview', 'about_preview_title', `Tentang ${settings?.nama_desa || 'Desa Kami'}`)}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {getContent('about_preview', 'about_preview_description', settings?.deskripsi || 'Desa modern yang mengutamakan pelayanan publik yang prima dan transparansi dalam pengelolaan pemerintahan.')}
              </p>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{settings?.alamat || 'Alamat Desa'}</span>
                </div>
              </div>
              <Link 
                to="/tentang"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                {getContent('about_preview', 'about_preview_button', 'Selengkapnya')}
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-w-16 aspect-h-12">
                <img 
                  src={settings?.hero_image || '/assets/default-village.jpg'}
                  alt="Desa"
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;