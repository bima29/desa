import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Eye } from 'lucide-react';
import { News as NewsType } from '../types';
import { getNewsBySlug } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [news, setNews] = useState<NewsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      if (!slug) return;
      
      try {
        const data = await getNewsBySlug(slug);
        if (data) {
          setNews(data);
        } else {
          setError('Berita tidak ditemukan');
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Gagal memuat berita');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ErrorMessage message={error || 'Berita tidak ditemukan'} />
          <Link 
            to="/berita" 
            className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Berita
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareText = `${news.judul} - ${window.location.host}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.judul,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert('Link berhasil disalin ke clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-800">Beranda</Link>
            <span className="text-gray-500">/</span>
            <Link to="/berita" className="text-blue-600 hover:text-blue-800">Berita</Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-500 truncate">{news.judul}</span>
          </nav>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Article Header */}
            <div className="p-8 pb-6">
              <div className="flex items-center justify-between mb-6">
                <Link 
                  to="/berita"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Berita
                </Link>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Bagikan
                </button>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {news.judul}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(news.tanggal).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {news.penulis}
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Dipublikasikan
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {news.gambar && (
              <div className="px-8 pb-6">
                <img 
                  src={news.gambar} 
                  alt={news.judul}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="px-8 pb-8">
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:hover:text-blue-800"
                dangerouslySetInnerHTML={{ __html: news.konten }}
              />
            </div>

            {/* Article Footer */}
            <div className="px-8 pb-8 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Bagikan artikel ini:</span>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    <Share2 className="w-3 h-3 mr-1" />
                    Bagikan
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Dipublikasikan: {new Date(news.created_at).toLocaleDateString('id-ID')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetail;