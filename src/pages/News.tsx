import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Search } from 'lucide-react';
import { News as NewsType } from '../types';
import { getNews } from '../services/api';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import 'aos/dist/aos.css';

const News: React.FC = () => {
  const [news, setNews] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNews, setFilteredNews] = useState<NewsType[]>([]);

  // Initialize AOS
  useEffect(() => {
    import('aos').then(AOS => {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
      });
    });
  }, []);

  // Fetch data setiap berpindah halaman
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNews(currentPage, 9);
        setNews(data.data);
        setTotalPages(data.totalPages);
        setFilteredNews(data.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage]);

  // Filter berdasarkan kata kunci
  useEffect(() => {
    const filtered = news.filter(article =>
      article.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.konten.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNews(filtered);
  }, [searchTerm, news]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
          >
            Berita Desa
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-blue-100 max-w-3xl"
          >
            Informasi terkini dan terpercaya dari desa
          </motion.p>
        </div>
      </section>

      {/* Search and Info */}
      <section className="py-8 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row gap-4 items-center justify-between"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm"
              />
            </div>
            <div className="text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              Menampilkan {filteredNews.length} dari {news.length} berita
            </div>
          </motion.div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredNews.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-gray-500 text-lg">Tidak ada berita yang ditemukan</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-aos="fade-up">
              {filteredNews.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2" hover>
                    {article.gambar && (
                      <div className="relative overflow-hidden">
                        <img 
                          src={article.gambar} 
                          alt={article.judul}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                          Berita
                        </span>
                      </div>
                    )}
                    <div className="p-6 bg-gradient-to-b from-white to-gray-50 group-hover:from-blue-50 group-hover:to-white transition-all duration-300">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="mr-4">
                          {new Date(article.tanggal).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <User className="w-4 h-4 mr-1" />
                        <span>{article.penulis}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-blue-600">
                        <Link to={`/berita/${article.slug}`} className="hover:text-blue-700">
                          {article.judul}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {article.konten.replace(/<[^>]*>/g, '').slice(0, 150)}...
                      </p>
                      <Link 
                        to={`/berita/${article.slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group-hover:translate-x-2 transition-transform duration-300"
                      >
                        Baca Selengkapnya
                        <span className="ml-1 group-hover:ml-2 transition-all duration-300">→</span>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex justify-center mt-12"
            >
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
                >
                  Sebelumnya
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
                >
                  Selanjutnya
                </button>
              </nav>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default News;
