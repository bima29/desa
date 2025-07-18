import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, Search, Filter, Edit, Type, 
  FileText, Code, List, Eye, EyeOff
} from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import SuccessMessage from '../../components/UI/SuccessMessage';
import ErrorMessage from '../../components/UI/ErrorMessage';

// Mock interfaces for content management
interface WebsiteContent {
  id: number;
  content_key: string;
  content_value: string;
  content_type: 'text' | 'textarea' | 'html' | 'json';
  page: string;
  section: string;
  label: string;
  description: string;
  max_length?: number;
  sort_order: number;
  status: 'active' | 'inactive';
}

interface WebsiteSection {
  id: number;
  section_key: string;
  section_name: string;
  page: string;
  description: string;
  icon?: string;
  sort_order: number;
  status: 'active' | 'inactive';
}

const ContentTextManagement: React.FC = () => {
  const [contents, setContents] = useState<WebsiteContent[]>([]);
  const [sections, setSections] = useState<WebsiteSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPage, setSelectedPage] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [editingContent, setEditingContent] = useState<WebsiteContent | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API calls when backend is ready
      setContents([]);
      setSections([]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Gagal memuat data konten' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async (content: WebsiteContent) => {
    setSaving(content.id);
    try {
      // Mock save - replace with actual API call
      setMessage({ type: 'success', text: 'Konten berhasil disimpan (demo)' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menyimpan' });
    } finally {
      setSaving(null);
    }
  };

  const handleContentChange = (id: number, field: keyof WebsiteContent, value: any) => {
    setContents(contents.map(content => 
      content.id === id ? { ...content, [field]: value } : content
    ));
  };

  // Get unique pages
  const pages = Array.from(new Set(sections.map(section => section.page)));

  // Filter contents based on search and filters
  const filteredContents = contents.filter(content => {
    const matchesSearch = content.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.content_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.content_value.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPage = !selectedPage || content.page === selectedPage;
    const matchesSection = !selectedSection || content.section === selectedSection;
    const matchesStatus = showInactive || content.status === 'active';
    
    return matchesSearch && matchesPage && matchesSection && matchesStatus;
  });

  // Group contents by page and section
  const groupedContents = filteredContents.reduce((acc, content) => {
    if (!acc[content.page]) acc[content.page] = {};
    if (!acc[content.page][content.section]) acc[content.page][content.section] = [];
    acc[content.page][content.section].push(content);
    return acc;
  }, {} as Record<string, Record<string, WebsiteContent[]>>);

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return Type;
      case 'textarea': return FileText;
      case 'html': return Code;
      case 'json': return List;
      default: return Type;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'text': return 'bg-blue-100 text-blue-800';
      case 'textarea': return 'bg-green-100 text-green-800';
      case 'html': return 'bg-purple-100 text-purple-800';
      case 'json': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Kelola Teks Website</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowInactive(!showInactive)}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  showInactive 
                    ? 'bg-gray-200 text-gray-800' 
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {showInactive ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showInactive ? 'Sembunyikan Nonaktif' : 'Tampilkan Nonaktif'}
              </button>
            </div>
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

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari konten..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Halaman</option>
              {pages.map(page => (
                <option key={page} value={page}>
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Bagian</option>
              {sections
                .filter(section => !selectedPage || section.page === selectedPage)
                .map(section => (
                  <option key={section.section_key} value={section.section_key}>
                    {section.section_name}
                  </option>
                ))}
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              Total: {filteredContents.length} konten
            </div>
          </div>
        </Card>

        {/* Content Groups */}
        <div className="space-y-8">
          {Object.entries(groupedContents).map(([page, pageContents]) => (
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
                {page === 'global' ? 'Konten Global' : `Halaman ${page.charAt(0).toUpperCase() + page.slice(1)}`}
              </h2>
              
              {Object.entries(pageContents).map(([section, sectionContents]) => {
                const sectionInfo = sections.find(s => s.section_key === section);
                
                return (
                  <Card key={section} className="p-6 mb-6">
                    <div className="flex items-center mb-6">
                      {sectionInfo?.icon && (
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-blue-600 text-sm">📝</span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {sectionInfo?.section_name || section}
                        </h3>
                        {sectionInfo?.description && (
                          <p className="text-sm text-gray-600">{sectionInfo.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-6">
                      {sectionContents
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((content) => {
                          const IconComponent = getContentTypeIcon(content.content_type);
                          
                          return (
                            <div key={content.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <IconComponent className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <h4 className="font-medium text-gray-900">{content.label}</h4>
                                    <p className="text-sm text-gray-500">{content.content_key}</p>
                                    {content.description && (
                                      <p className="text-xs text-gray-400 mt-1">{content.description}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContentTypeColor(content.content_type)}`}>
                                    {content.content_type.toUpperCase()}
                                  </span>
                                  <select
                                    value={content.status}
                                    onChange={(e) => handleContentChange(content.id, 'status', e.target.value)}
                                    className="text-xs border border-gray-300 rounded px-2 py-1"
                                  >
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Nonaktif</option>
                                  </select>
                                </div>
                              </div>

                              <div className="mb-3">
                                {content.content_type === 'textarea' || content.content_type === 'html' ? (
                                  <textarea
                                    value={content.content_value}
                                    onChange={(e) => handleContentChange(content.id, 'content_value', e.target.value)}
                                    rows={content.content_type === 'html' ? 6 : 3}
                                    maxLength={content.max_length || undefined}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder={`Masukkan ${content.label.toLowerCase()}...`}
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={content.content_value}
                                    onChange={(e) => handleContentChange(content.id, 'content_value', e.target.value)}
                                    maxLength={content.max_length || undefined}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder={`Masukkan ${content.label.toLowerCase()}...`}
                                  />
                                )}
                                
                                {content.max_length && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {content.content_value.length}/{content.max_length} karakter
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-end">
                                <Button
                                  onClick={() => handleSaveContent(content)}
                                  loading={saving === content.id}
                                  disabled={saving === content.id}
                                  size="sm"
                                  icon={Save}
                                >
                                  Simpan
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </Card>
                );
              })}
            </motion.div>
          ))}
        </div>

        {filteredContents.length === 0 && (
          <div className="text-center py-12">
            <Type className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Fitur Manajemen Teks</p>
            <p className="text-gray-400 text-sm">Fitur ini akan tersedia setelah backend content management diimplementasi</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentTextManagement;