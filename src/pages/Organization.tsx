import React, { useState, useEffect } from 'react';
import { User, Mail, Phone } from 'lucide-react';
import { Organization as OrganizationType } from '../types';
import { getOrganization } from '../services/api';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Organization: React.FC = () => {
  const [organization, setOrganization] = useState<OrganizationType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const data = await getOrganization();
        setOrganization(data);
      } catch (error) {
        console.error('Error fetching organization:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, []);

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
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Struktur Organisasi</h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Profil perangkat desa dan struktur pemerintahan
            </p>
          </div>
        </div>
      </section>

      {/* Organization Chart */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {organization.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Data struktur organisasi belum tersedia</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {organization.map((member) => (
                <Card key={member.id} className="text-center p-6" hover>
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-200">
                      {member.foto ? (
                        <img 
                          src={member.foto} 
                          alt={member.nama}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
                      <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {member.urutan || 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.nama}
                  </h3>
                  <p className="text-indigo-600 font-medium mb-4">
                    {member.jabatan}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>email@desa.go.id</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>+62 XXX XXXX XXXX</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Organizational Structure Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tugas dan Tanggung Jawab</h2>
            <p className="text-lg text-gray-600">
              Setiap perangkat desa memiliki tugas dan tanggung jawab yang jelas
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-600">Kepala Desa</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Memimpin penyelenggaraan pemerintahan desa</li>
                <li>• Mengkoordinasikan kegiatan pembangunan desa</li>
                <li>• Membina kehidupan masyarakat desa</li>
                <li>• Memelihara ketenteraman dan ketertiban</li>
                <li>• Mewakili desa di dalam dan luar pengadilan</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-600">Sekretaris Desa</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Membantu Kepala Desa dalam bidang administrasi</li>
                <li>• Melaksanakan urusan ketatausahaan</li>
                <li>• Menyiapkan bahan rapat dan dokumentasi</li>
                <li>• Mengkoordinasikan program dan kegiatan</li>
                <li>• Membuat laporan pelaksanaan kegiatan</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-600">Bendahara Desa</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Mengelola keuangan desa</li>
                <li>• Menyusun laporan keuangan</li>
                <li>• Melakukan pembayaran yang ditetapkan</li>
                <li>• Menyimpan uang, surat-surat berharga</li>
                <li>• Mempertanggungjawabkan penggunaan dana</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-600">Kepala Urusan</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Melaksanakan urusan sesuai bidangnya</li>
                <li>• Memberikan pelayanan kepada masyarakat</li>
                <li>• Membantu Kepala Desa dalam pelaksanaan tugas</li>
                <li>• Mengkoordinasikan kegiatan di bidangnya</li>
                <li>• Membuat laporan kegiatan secara berkala</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Organization;