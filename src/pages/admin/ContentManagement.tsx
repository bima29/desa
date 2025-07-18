import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Search, Settings,
  Sliders, BarChart3, Building, Megaphone,
  Phone, MessageSquare, HelpCircle, Navigation
} from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import SuccessMessage from '../../components/UI/SuccessMessage';
import ErrorMessage from '../../components/UI/ErrorMessage';

const ContentManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('slider');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const contentTypes = [
    { id: 'slider', name: 'Slider Beranda', icon: Sliders, color: 'bg-blue-500' },
    { id: 'statistics', name: 'Statistik Desa', icon: BarChart3, color: 'bg-green-500' },
    { id: 'facilities', name: 'Fasilitas Desa', icon: Building, color: 'bg-purple-500' },
    { id: 'announcements', name: 'Pengumuman', icon: Megaphone, color: 'bg-orange-500' },
    { id: 'emergency', name: 'Kontak Darurat', icon: Phone, color: 'bg-red-500' },
    { id: 'testimonials', name: 'Testimoni', icon: MessageSquare, color: 'bg-indigo-500' },
    { id: 'faq', name: 'FAQ', icon: HelpCircle, color: 'bg-teal-500' },
    { id: 'navigation', name: 'Menu Navigasi', icon: Navigation, color: 'bg-pink-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Kelola Konten Website</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            {message.type === 'success' ? (
              <SuccessMessage message={message.text} />
            ) : (
              <ErrorMessage message={message.text} />
            )}
          </motion.div>
        )}

        {/* Content Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contentTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <div className="text-center">
                  <div className={`w-16 h-16 ${type.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <type.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {type.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Kelola {type.name.toLowerCase()} website
                  </p>
                  <Button
                    onClick={() => setActiveTab(type.id)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Kelola
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Content Management Area */}
        <div className="mt-8">
          <Card className="p-8">
            <div className="text-center">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Sistem Manajemen Konten
              </h3>
              <p className="text-gray-600 mb-6">
                Pilih jenis konten di atas untuk mulai mengelola konten website desa
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Fitur yang Tersedia:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Fitur ini akan tersedia setelah backend content management diimplementasi</li>
                  <li>• Saat ini menggunakan data statis untuk demo</li>
                  <li>• Konten dapat dikelola melalui kode sumber</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;