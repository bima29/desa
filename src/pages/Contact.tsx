import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  MapPin, Phone, Mail, Clock, Send, 
  Facebook, Twitter, Instagram, Youtube 
} from 'lucide-react';
import { ContactForm, DesaSettings } from '../types';
import { getDesaSettings } from '../services/api';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import SuccessMessage from '../components/UI/SuccessMessage';

const Contact: React.FC = () => {
  const [settings, setSettings] = useState<DesaSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [formStatus, setFormStatus] = useState<'idle' | 'success'>('idle');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getDesaSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const onSubmit = async (data: ContactForm) => {
    // Simulate form submission
    console.log('Contact form submitted:', data);
    setFormStatus('success');
    reset();
    
    // Reset success message after 3 seconds
    setTimeout(() => setFormStatus('idle'), 3000);
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
      <section className="bg-gradient-to-r from-teal-600 to-teal-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Hubungi Kami</h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              Kami siap membantu dan mendengarkan aspirasi Anda
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Alamat</h3>
              <p className="text-gray-600 text-sm">
                {settings?.alamat || 'Jl. Desa No. 123, Kecamatan, Kabupaten, Provinsi 12345'}
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Telepon</h3>
              <p className="text-gray-600 text-sm">
                +62 XXX XXXX XXXX
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-600 text-sm">
                info@desa.go.id
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Jam Buka</h3>
              <p className="text-gray-600 text-sm">
                Senin - Jumat<br />
                08:00 - 16:00
              </p>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>
              
              {formStatus === 'success' && (
                <SuccessMessage 
                  message="Pesan berhasil dikirim! Kami akan segera merespons."
                  className="mb-6"
                />
              )}

              <Card className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      {...register('nama', { required: 'Nama harus diisi' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Masukkan nama lengkap"
                    />
                    {errors.nama && (
                      <p className="text-red-500 text-sm mt-1">{errors.nama.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email harus diisi',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Format email tidak valid'
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Masukkan email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subjek
                    </label>
                    <input
                      type="text"
                      {...register('subjek', { required: 'Subjek harus diisi' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Masukkan subjek pesan"
                    />
                    {errors.subjek && (
                      <p className="text-red-500 text-sm mt-1">{errors.subjek.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pesan
                    </label>
                    <textarea
                      {...register('pesan', { required: 'Pesan harus diisi' })}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Tulis pesan Anda..."
                    />
                    {errors.pesan && (
                      <p className="text-red-500 text-sm mt-1">{errors.pesan.message}</p>
                    )}
                  </div>

                  <Button type="submit" icon={Send} className="w-full">
                    Kirim Pesan
                  </Button>
                </form>
              </Card>
            </div>

            {/* Map and Additional Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Lokasi Kami</h2>
              
              {/* Map Placeholder */}
              <Card className="p-6 mb-6">
                <div className="aspect-w-16 aspect-h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">
                      Peta lokasi akan ditampilkan di sini
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Integrasi dengan Google Maps
                    </p>
                  </div>
                </div>
              </Card>

              {/* Social Media */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Ikuti Kami</h3>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pertanyaan Umum</h2>
            <p className="text-lg text-gray-600">Jawaban untuk pertanyaan yang sering diajukan</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Bagaimana cara mengajukan layanan?</h3>
              <p className="text-gray-600">
                Anda bisa mengajukan layanan melalui menu "Layanan" di website ini atau datang langsung ke kantor desa.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Berapa lama proses pengajuan?</h3>
              <p className="text-gray-600">
                Proses pengajuan biasanya memakan waktu 1-3 hari kerja tergantung jenis layanan yang diajukan.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Apakah ada biaya untuk layanan?</h3>
              <p className="text-gray-600">
                Sebagian besar layanan gratis, namun ada beberapa yang dikenakan biaya sesuai peraturan yang berlaku.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Bagaimana cara melacak status pengajuan?</h3>
              <p className="text-gray-600">
                Anda bisa melacak status pengajuan menggunakan nomor pengajuan yang diberikan saat submit.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;