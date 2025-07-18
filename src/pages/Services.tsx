import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  FileText, Download, Upload, CheckCircle, 
  Clock, AlertCircle, Search, User, CreditCard 
} from 'lucide-react';
import { Service, ServiceSubmissionForm } from '../types';
import { getServices, createServiceSubmission } from '../services/api';
import { uploadFile, validateFile } from '../utils/fileUpload';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import SuccessMessage from '../components/UI/SuccessMessage';
import ErrorMessage from '../components/UI/ErrorMessage';

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [submissionNumber, setSubmissionNumber] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ServiceSubmissionForm>();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const onSubmit = async (data: ServiceSubmissionForm) => {
    if (!selectedService) return;

    setSubmissionStatus('loading');

    try {
      let filePath = '';
      
      if (data.file_pendukung && data.file_pendukung.length > 0) {
        const file = data.file_pendukung[0];
        validateFile(file, ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'], 5 * 1024 * 1024);
        filePath = await uploadFile(file, 'submissions');
      }

      const submissionData = {
        layanan_id: selectedService.id,
        nama: data.nama,
        nik: data.nik,
        file_pendukung: filePath
      };

      const result = await createServiceSubmission(submissionData);
      
      if (result.success) {
        setSubmissionStatus('success');
        setSubmissionMessage('Pengajuan berhasil disubmit!');
        setSubmissionNumber(result.data?.nomor_pengajuan || '');
        reset();
        setSelectedService(null);
      } else {
        setSubmissionStatus('error');
        setSubmissionMessage(result.message || 'Gagal memproses pengajuan');
      }
    } catch (error) {
      setSubmissionStatus('error');
      setSubmissionMessage(error instanceof Error ? error.message : 'Terjadi kesalahan');
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Layanan Publik</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Berbagai layanan administratif untuk masyarakat
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Daftar Layanan</h2>
            <p className="text-lg text-gray-600">Pilih layanan yang Anda butuhkan</p>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Belum ada layanan yang tersedia</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Card key={service.id} className="p-6" hover>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{service.nama}</h3>
                      <p className="text-gray-600 mb-4">{service.deskripsi}</p>
                      
                      <div className="space-y-2 mb-4">
                        <h4 className="font-medium text-gray-900">Persyaratan:</h4>
                        <p className="text-sm text-gray-600">{service.persyaratan}</p>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button
                          onClick={() => setSelectedService(service)}
                          variant="primary"
                          size="sm"
                          className="w-full"
                        >
                          Ajukan Layanan
                        </Button>
                        
                        {service.template_dokumen && (
                          <Button
                            onClick={() => window.open(service.template_dokumen, '_blank')}
                            variant="outline"
                            size="sm"
                            icon={Download}
                            className="w-full"
                          >
                            Download Template
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Submission Form Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  Pengajuan: {selectedService.nama}
                </h3>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {submissionStatus === 'success' && (
                <SuccessMessage 
                  message={`${submissionMessage} Nomor pengajuan: ${submissionNumber}`}
                  className="mb-4"
                />
              )}

              {submissionStatus === 'error' && (
                <ErrorMessage message={submissionMessage} className="mb-4" />
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    {...register('nama', { required: 'Nama harus diisi' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama lengkap"
                  />
                  {errors.nama && (
                    <p className="text-red-500 text-sm mt-1">{errors.nama.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIK
                  </label>
                  <input
                    type="text"
                    {...register('nik', { 
                      required: 'NIK harus diisi',
                      pattern: {
                        value: /^[0-9]{16}$/,
                        message: 'NIK harus 16 digit angka'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan NIK (16 digit)"
                  />
                  {errors.nik && (
                    <p className="text-red-500 text-sm mt-1">{errors.nik.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File Pendukung (Opsional)
                  </label>
                  <input
                    type="file"
                    {...register('file_pendukung')}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: PDF, JPG, PNG. Maksimal 5MB
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-medium text-blue-900 mb-2">Persyaratan:</h4>
                  <p className="text-sm text-blue-800">{selectedService.persyaratan}</p>
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    loading={submissionStatus === 'loading'}
                    disabled={submissionStatus === 'loading'}
                    className="flex-1"
                  >
                    Submit Pengajuan
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedService(null)}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Track Status Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Lacak Status Pengajuan</h2>
            <p className="text-lg text-gray-600">Cek status pengajuan layanan Anda</p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Masukkan nomor pengajuan"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button className="w-full">
                Cek Status
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Informasi Layanan</h2>
            <p className="text-lg text-gray-600">Ketentuan dan prosedur layanan</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Jam Pelayanan</h3>
              <p className="text-gray-600">Senin - Jumat: 08:00 - 16:00</p>
              <p className="text-gray-600">Sabtu: 08:00 - 12:00</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Proses Cepat</h3>
              <p className="text-gray-600">Proses pengajuan 1-3 hari kerja</p>
              <p className="text-gray-600">Notifikasi melalui nomor pengajuan</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Persyaratan</h3>
              <p className="text-gray-600">Siapkan dokumen yang diperlukan</p>
              <p className="text-gray-600">Pastikan data sesuai KTP</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;