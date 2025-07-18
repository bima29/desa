import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Search, User,
  ArrowUp, ArrowDown
} from 'lucide-react';
import { Organization } from '../../types';
import { getOrganization, createOrganization } from '../../services/api';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import SuccessMessage from '../../components/UI/SuccessMessage';
import ErrorMessage from '../../components/UI/ErrorMessage';

const OrganizationManagement: React.FC = () => {
  const [organization, setOrganization] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Organization | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchOrganization();
  }, []);

  const fetchOrganization = async () => {
    try {
      const data = await getOrganization();
      setOrganization(data.sort((a, b) => a.urutan - b.urutan));
    } catch (error) {
      console.error('Error fetching organization:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
      try {
        // Mock delete
        setOrganization(organization.filter(item => item.id !== id));
        setMessage({ type: 'success', text: 'Anggota berhasil dihapus' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Gagal menghapus anggota' });
      }
    }
  };

  const handleMoveUp = (id: number) => {
    const index = organization.findIndex(item => item.id === id);
    if (index > 0) {
      const newOrganization = [...organization];
      [newOrganization[index], newOrganization[index - 1]] = [newOrganization[index - 1], newOrganization[index]];
      
      // Update urutan
      newOrganization.forEach((item, idx) => {
        item.urutan = idx + 1;
      });
      
      setOrganization(newOrganization);
      setMessage({ type: 'success', text: 'Urutan berhasil diubah' });
    }
  };

  const handleMoveDown = (id: number) => {
    const index = organization.findIndex(item => item.id === id);
    if (index < organization.length - 1) {
      const newOrganization = [...organization];
      [newOrganization[index], newOrganization[index + 1]] = [newOrganization[index + 1], newOrganization[index]];
      
      // Update urutan
      newOrganization.forEach((item, idx) => {
        item.urutan = idx + 1;
      });
      
      setOrganization(newOrganization);
      setMessage({ type: 'success', text: 'Urutan berhasil diubah' });
    }
  };

  const filteredOrganization = organization.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.jabatan.toLowerCase().includes(searchTerm.toLowerCase());
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
            <h1 className="text-xl font-semibold text-gray-900">Kelola Struktur Organisasi</h1>
            <Button
              onClick={() => {
                setEditingMember(null);
                setShowForm(true);
              }}
              icon={Plus}
            >
              Tambah Anggota
            </Button>
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

        {/* Search */}
        <Card className="p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari anggota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </Card>

        {/* Organization List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredOrganization.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center p-6">
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
                      {member.urutan}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.nama}
                </h3>
                <p className="text-indigo-600 font-medium mb-4">
                  {member.jabatan}
                </p>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={ArrowUp}
                      onClick={() => handleMoveUp(member.id)}
                      disabled={index === 0}
                      className="flex-1"
                    >
                      Naik
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      icon={ArrowDown}
                      onClick={() => handleMoveDown(member.id)}
                      disabled={index === filteredOrganization.length - 1}
                      className="flex-1"
                    >
                      Turun
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={Edit}
                      onClick={() => {
                        setEditingMember(member);
                        setShowForm(true);
                      }}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      icon={Trash2}
                      onClick={() => handleDelete(member.id)}
                      className="flex-1"
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredOrganization.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Tidak ada anggota yang ditemukan</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <OrganizationForm
          member={editingMember}
          onClose={() => {
            setShowForm(false);
            setEditingMember(null);
          }}
          onSuccess={() => {
            setMessage({ type: 'success', text: editingMember ? 'Anggota berhasil diupdate' : 'Anggota berhasil ditambahkan' });
            setShowForm(false);
            setEditingMember(null);
            fetchOrganization();
          }}
        />
      )}
    </div>
  );
};

// Organization Form Component
interface OrganizationFormProps {
  member: Organization | null;
  onClose: () => void;
  onSuccess: () => void;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({ member, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nama: member?.nama || '',
    jabatan: member?.jabatan || '',
    foto: member?.foto || '',
    urutan: member?.urutan || 1
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createOrganization(formData);
      onSuccess();
    } catch (error) {
      console.error('Error saving organization member:', error);
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
              {member ? 'Edit Anggota' : 'Tambah Anggota'}
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
                Nama Lengkap
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jabatan
              </label>
              <input
                type="text"
                value={formData.jabatan}
                onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Contoh: Kepala Desa, Sekretaris Desa"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Foto
              </label>
              <input
                type="url"
                value={formData.foto}
                onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="/assets/organization/foto.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urutan
              </label>
              <input
                type="number"
                value={formData.urutan}
                onChange={(e) => setFormData({ ...formData, urutan: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min="1"
                required
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="flex-1"
              >
                {member ? 'Update' : 'Simpan'}
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

export default OrganizationManagement;