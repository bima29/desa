import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Search, Calendar as CalendarIcon,
  MapPin, Clock, Image as ImageIcon
} from 'lucide-react';
import { Event } from '../../types';
import { getEvents, createEvent } from '../../services/api';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import SuccessMessage from '../../components/UI/SuccessMessage';
import ErrorMessage from '../../components/UI/ErrorMessage';

const EventsManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus agenda ini?')) {
      try {
        // Mock delete
        setEvents(events.filter(item => item.id !== id));
        setMessage({ type: 'success', text: 'Agenda berhasil dihapus' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Gagal menghapus agenda' });
      }
    }
  };

  const filteredEvents = events.filter(item => {
    const matchesSearch = item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.deskripsi && item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (item.lokasi && item.lokasi.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const upcomingEvents = filteredEvents.filter(event => new Date(event.tanggal) >= new Date());
  const pastEvents = filteredEvents.filter(event => new Date(event.tanggal) < new Date());

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
            <h1 className="text-xl font-semibold text-gray-900">Kelola Agenda</h1>
            <Button
              onClick={() => {
                setEditingEvent(null);
                setShowForm(true);
              }}
              icon={Plus}
            >
              Tambah Agenda
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
              placeholder="Cari agenda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </Card>

        {/* Upcoming Events */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Agenda Mendatang</h2>
          {upcomingEvents.length === 0 ? (
            <Card className="p-8 text-center">
              <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Tidak ada agenda mendatang</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={() => {
                    setEditingEvent(event);
                    setShowForm(true);
                  }}
                  onDelete={() => handleDelete(event.id)}
                  isUpcoming={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Agenda Sebelumnya</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={() => {
                    setEditingEvent(event);
                    setShowForm(true);
                  }}
                  onDelete={() => handleDelete(event.id)}
                  isUpcoming={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <EventForm
          event={editingEvent}
          onClose={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
          onSuccess={() => {
            setMessage({ type: 'success', text: editingEvent ? 'Agenda berhasil diupdate' : 'Agenda berhasil ditambahkan' });
            setShowForm(false);
            setEditingEvent(null);
            fetchEvents();
          }}
        />
      )}
    </div>
  );
};

// Event Card Component
interface EventCardProps {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
  isUpcoming: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete, isUpcoming }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={`overflow-hidden ${!isUpcoming ? 'opacity-75' : ''}`}>
        {event.gambar && (
          <div className="relative">
            <img 
              src={event.gambar} 
              alt={event.judul}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isUpcoming 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-600 text-white'
              }`}>
                {isUpcoming ? 'Mendatang' : 'Selesai'}
              </span>
            </div>
          </div>
        )}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-3">{event.judul}</h3>
          <p className="text-gray-600 mb-4">{event.deskripsi}</p>
          
          <div className="space-y-2 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2" />
              {new Date(event.tanggal).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {new Date(event.tanggal).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            {event.lokasi && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {event.lokasi}
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              icon={Edit}
              onClick={onEdit}
              className="flex-1"
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="danger"
              icon={Trash2}
              onClick={onDelete}
              className="flex-1"
            >
              Hapus
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Event Form Component
interface EventFormProps {
  event: Event | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    judul: event?.judul || '',
    deskripsi: event?.deskripsi || '',
    tanggal: event ? new Date(event.tanggal).toISOString().slice(0, 16) : '',
    lokasi: event?.lokasi || '',
    gambar: event?.gambar || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData = {
        ...formData,
        tanggal: new Date(formData.tanggal)
      };

      await createEvent(eventData);
      onSuccess();
    } catch (error) {
      console.error('Error saving event:', error);
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
              {event ? 'Edit Agenda' : 'Tambah Agenda'}
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
                Judul Agenda
              </label>
              <input
                type="text"
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal & Waktu
              </label>
              <input
                type="datetime-local"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi
              </label>
              <input
                type="text"
                value={formData.lokasi}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Contoh: Balai Desa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Gambar
              </label>
              <input
                type="url"
                value={formData.gambar}
                onChange={(e) => setFormData({ ...formData, gambar: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="/assets/events/gambar.jpg"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="flex-1"
              >
                {event ? 'Update' : 'Simpan'}
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

export default EventsManagement;