import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, Palette, Globe } from 'lucide-react';
import { DesaSettings } from '../../types';
import { getDesaSettings, updateDesaSettings } from '../../services/api';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import SuccessMessage from '../../components/UI/SuccessMessage';
import ErrorMessage from '../../components/UI/ErrorMessage';

const SettingsManagement: React.FC = () => {
  const [settings, setSettings] = useState<DesaSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const result = await updateDesaSettings(settings);
      if (result.success) {
        setMessage({ type: 'success', text: 'Pengaturan berhasil disimpan' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Gagal menyimpan pengaturan' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan sistem' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof DesaSettings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="Gagal memuat pengaturan" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Pengaturan Desa</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <Globe className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Informasi Dasar</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Desa
                </label>
                <input
                  type="text"
                  value={settings.nama_desa}
                  onChange={(e) => handleInputChange('nama_desa', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slogan
                </label>
                <input
                  type="text"
                  value={settings.slogan}
                  onChange={(e) => handleInputChange('slogan', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat
              </label>
              <textarea
                value={settings.alamat}
                onChange={(e) => handleInputChange('alamat', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Desa
              </label>
              <textarea
                value={settings.deskripsi}
                onChange={(e) => handleInputChange('deskripsi', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </Card>

          {/* Media Settings */}
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <Upload className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Media & Gambar</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Logo Desa
                </label>
                <input
                  type="url"
                  value={settings.logo}
                  onChange={(e) => handleInputChange('logo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/assets/logo-desa.png"
                />
                {settings.logo && (
                  <div className="mt-2">
                    <img 
                      src={settings.logo} 
                      alt="Logo Preview" 
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Hero Image
                </label>
                <input
                  type="url"
                  value={settings.hero_image}
                  onChange={(e) => handleInputChange('hero_image', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/assets/hero-village.jpg"
                />
                {settings.hero_image && (
                  <div className="mt-2">
                    <img 
                      src={settings.hero_image} 
                      alt="Hero Preview" 
                      className="w-32 h-20 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Color Settings */}
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <Palette className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Tema Warna</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warna Primer
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warna Sekunder
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#10B981"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Preview Warna</h3>
              <div className="flex space-x-4">
                <div 
                  className="w-16 h-16 rounded-lg shadow-sm border"
                  style={{ backgroundColor: settings.primary_color }}
                ></div>
                <div 
                  className="w-16 h-16 rounded-lg shadow-sm border"
                  style={{ backgroundColor: settings.secondary_color }}
                ></div>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              loading={saving}
              disabled={saving}
              icon={Save}
              size="lg"
            >
              Simpan Pengaturan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsManagement;