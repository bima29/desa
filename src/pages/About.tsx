import React, { useState, useEffect } from 'react';
import { MapPin, Users, Phone, Mail, Clock, Award } from 'lucide-react';
import { DesaSettings } from '../types';
import { getDesaSettings } from '../services/api';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const About: React.FC = () => {
  const [settings, setSettings] = useState<DesaSettings | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const achievements = [
    { title: 'Desa Terbaik 2023', description: 'Penghargaan dari Kabupaten' },
    { title: 'Pelayanan Prima', description: 'Sertifikat ISO 9001:2015' },
    { title: 'Desa Digital', description: 'Program Digitalisasi Desa' },
    { title: 'Lingkungan Bersih', description: 'Adipura Tingkat Desa' }
  ];

  const visionMission = {
    vision: "Mewujudkan desa yang maju, mandiri, dan sejahtera berdasarkan nilai-nilai gotong royong dan kearifan lokal.",
    mission: [
      "Meningkatkan kualitas pelayanan publik yang prima dan transparan",
      "Mengembangkan potensi ekonomi lokal dan pariwisata desa",
      "Membangun infrastruktur yang mendukung kemajuan desa",
      "Melestarikan budaya dan tradisi lokal yang bernilai positif",
      "Meningkatkan partisipasi masyarakat dalam pembangunan desa"
    ]
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tentang {settings?.nama_desa || 'Desa Kami'}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {settings?.slogan || 'Menuju Desa Modern dan Sejahtera'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Description */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Sejarah & Profil Desa</h2>
              <div className="prose prose-lg text-gray-600">
                <p className="mb-6">
                  {settings?.deskripsi || 'Desa yang terletak di kawasan strategis dengan potensi alam yang melimpah. Desa ini memiliki sejarah panjang dan kaya akan budaya lokal yang masih dilestarikan hingga saat ini.'}
                </p>
                <p className="mb-6">
                  Dengan semangat gotong royong yang kuat, masyarakat desa terus berjuang untuk memajukan desa dan meningkatkan kesejahteraan bersama. Berbagai program pembangunan telah dilaksanakan untuk mendukung kemajuan desa.
                </p>
                <p>
                  Saat ini, desa terus berbenah dan mengembangkan berbagai sektor mulai dari pertanian, pariwisata, hingga digitalisasi pelayanan publik untuk memberikan layanan terbaik kepada masyarakat.
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <Card className="p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Informasi Kontak</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Alamat</p>
                      <p className="text-gray-600">{settings?.alamat || 'Alamat Kantor Desa'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Telepon</p>
                      <p className="text-gray-600">+62 XXX XXXX XXXX</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">info@desa.go.id</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Jam Operasional</p>
                      <p className="text-gray-600">Senin - Jumat: 08:00 - 16:00</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Statistics */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Statistik Desa</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2,547</div>
                    <div className="text-sm text-gray-600">Total Penduduk</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">768</div>
                    <div className="text-sm text-gray-600">Kepala Keluarga</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">3</div>
                    <div className="text-sm text-gray-600">Dusun</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">12/4</div>
                    <div className="text-sm text-gray-600">RT/RW</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visi & Misi</h2>
            <p className="text-lg text-gray-600">Komitmen kami untuk memajukan desa</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">Visi</h3>
              <p className="text-gray-700 leading-relaxed">{visionMission.vision}</p>
            </Card>

            <Card className="p-8">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">Misi</h3>
              <ul className="space-y-3">
                {visionMission.mission.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Prestasi & Penghargaan</h2>
            <p className="text-lg text-gray-600">Pencapaian yang membanggakan</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="p-6 text-center" hover>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{achievement.title}</h3>
                <p className="text-gray-600 text-sm">{achievement.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;