import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Search, FileText,
  Download, Users, Clock
} from 'lucide-react';
import { Service, ServiceSubmission } from '../../types';
import { getServices, createService, getServiceSubmissions } from '../../services/api';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import SuccessMessage from '../../components/UI/SuccessMessage';
import ErrorMessage from '../../components/UI/ErrorMessage';

const ServicesManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [submissions, setSubmissions] = useState<ServiceSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'services' | 'submissions'>('services');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesData, submissionsData] = await Promise.all([
        getServices(),
        getServiceSubmissions()
      ]);
      setServices(servicesData);
      setSubmissions(submissionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
      try {
        // Mock delete
        setServices(services.filter(item => item.id !== id));
        setMessage({ type: 'success', text: 'Layanan berhasil dihapus' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Gagal menghapus layanan' });
      }
    }
  };

  const handleUpdateSubmissionStatus = async (id: number, status: string) => {
    try {
      // Mock update
      setSubmissions(submissions.map(item => 
        item.id === id ? { ...item, status: status as any } : item
      ));
      setMessage({ type: 'success', text: 'Status pengajuan berhasil diupdate' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal mengupdate status' });
    }
  };

  const filteredServices = services.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.deskripsi && item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const filteredSubmissions = submissions.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.nik.includes(searchTerm) ||
                         item.nomor_pengajuan.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
            <h1 className="text-xl font-semibold text-gray-900">Kelola Layanan</h1>
            {activeTab === 'services' && (
              <Button
                onClick={() => {
                  setEditingService(null);
                  setShowForm(true);
                }}
                icon={Plus}
              >
                Tambah Layanan
              </Button>
            )}
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

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('services')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'services'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Daftar Layanan ({services.length})
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'submissions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pengajuan Layanan ({submissions.length})
            </button>
          </nav>
        </div>

        {/* Search */}
        <Card className="p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={activeTab === 'services' ? 'Cari layanan...' : 'Cari pengajuan...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </Card>

        {/* Content */}
        {activeTab === 'services' ? (
          <ServicesTab
            services={filteredServices}
            onEdit={(service) => {
              setEditingService(service);
              setShowForm(true);
            }}
            onDelete={handleDeleteService}
          />
        ) : (
          <SubmissionsTab
            submissions={filteredSubmissions}
            services={services}
            onUpdateStatus={handleUpdateSubmissionStatus}
          />
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <ServiceForm
          service={editingService}
          onClose={() => {
            setShowForm(false);
            setEditingService(null);
          }}
          onSuccess={() => {
            setMessage({ type: 'success', text: editingService ? 'Layanan berhasil diupdate' : 'Layanan berhasil ditambahkan' });
            setShowForm(false);
            setEditingService(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

// Services Tab Component
interface ServicesTabProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: number) => void;
}

const ServicesTab: React.FC<ServicesTabProps> = ({ services, onEdit, onDelete }) => {
  return (
    <div className="grid gap-6">
      {services.map((service) => (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.nama}
                </h3>
                <p className="text-gray-600 mb-4">{service.deskripsi}</p>
                
                <div className="space-y-2 mb-4">
                  <h4 className="font-medium text-gray-900">Persyaratan:</h4>
                  <p className="text-sm text-gray-600">{service.persyaratan}</p>
                </div>

                {service.template_dokumen && (
                  <div className="flex items-center text-sm text-blue-600">
                    <Download className="w-4 h-4 mr-1" />
                    <span>Template tersedia</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit}
                  onClick={() => onEdit(service)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={() => onDelete(service.id)}
                >
                  Hapus
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}

      {services.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Tidak ada layanan yang ditemukan</p>
        </div>
      )}
    </div>
  );
};

// Submissions Tab Component
interface SubmissionsTabProps {
  submissions: ServiceSubmission[];
  services: Service[];
  onUpdateStatus: (id: number, status: string) => void;
}

const SubmissionsTab: React.FC<SubmissionsTabProps> = ({ submissions, services, onUpdateStatus }) => {
  const getServiceName = (layananId: number) => {
    const service = services.find(s => s.id === layananId);
    return service?.nama || 'Layanan tidak ditemukan';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'diproses': return 'bg-blue-100 text-blue-800';
      case 'selesai': return 'bg-green-100 text-green-800';
      case 'ditolak': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'diproses': return 'Diproses';
      case 'selesai': return 'Selesai';
      case 'ditolak': return 'Ditolak';
      default: return status;
    }
  };

  return (
    <div className="grid gap-6">
      {submissions.map((submission) => (
        <motion.div
          key={submission.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {submission.nomor_pengajuan}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                    {getStatusText(submission.status)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Nama: <span className="font-medium text-gray-900">{submission.nama}</span></p>
                    <p className="text-sm text-gray-600">NIK: <span className="font-medium text-gray-900">{submission.nik}</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Layanan: <span className="font-medium text-gray-900">{getServiceName(submission.layanan_id)}</span></p>
                    <p className="text-sm text-gray-600">Tanggal: <span className="font-medium text-gray-900">{new Date(submission.created_at).toLocaleDateString('id-ID')}</span></p>
                  </div>
                </div>

                {submission.file_pendukung && (
                  <div className="flex items-center text-sm text-blue-600 mb-4">
                    <FileText className="w-4 h-4 mr-1" />
                    <span>File pendukung tersedia</span>
                  </div>
                )}

                {submission.catatan && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Catatan:</span> {submission.catatan}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col space-y-2 ml-4">
                <select
                  value={submission.status}
                  onChange={(e) => onUpdateStatus(submission.id, e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Menunggu</option>
                  <option value="diproses">Diproses</option>
                  <option value="selesai">Selesai</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}

      {submissions.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Tidak ada pengajuan yang ditemukan</p>
        </div>
      )}
    </div>
  );
};

// Service Form Component
interface ServiceFormProps {
  service: Service | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nama: service?.nama || '',
    deskripsi: service?.deskripsi || '',
    persyaratan: service?.persyaratan || '',
    template_dokumen: service?.template_dokumen || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createService(formData);
      onSuccess();
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              {service ? 'Edit Layanan' : 'Tambah Layanan'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Layanan
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Persyaratan
              </label>
              <textarea
                value={formData.persyaratan}
                onChange={(e) => setFormData({ ...formData, persyaratan: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: KTP, KK, Surat Pernyataan"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Dokumen (URL)
              </label>
              <input
                type="url"
                value={formData.template_dokumen}
                onChange={(e) => setFormData({ ...formData, template_dokumen: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/assets/templates/template.pdf"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="flex-1"
              >
                {service ? 'Update' : 'Simpan'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Batal
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServicesManagement;