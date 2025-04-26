import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { Location } from '../../lib/db';
import Notification from '../ui/Notification';

const LocationSettings = () => {
  const { locations, addLocation, updateLocation, deleteLocation } = useApp();
  const [newLocation, setNewLocation] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLocation.trim()) {
      setErrorMessage('Nama lokasi tidak boleh kosong');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      
      await addLocation({ name: newLocation.trim() });
      
      setNewLocation('');
      setSuccessMessage('Lokasi berhasil ditambahkan!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error adding location:', error);
      setErrorMessage('Gagal menambahkan lokasi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingName.trim() || !editingId) {
      setErrorMessage('Nama lokasi tidak boleh kosong');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      
      await updateLocation(editingId, { name: editingName.trim() });
      
      setEditingId(null);
      setEditingName('');
      setSuccessMessage('Lokasi berhasil diperbarui!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating location:', error);
      setErrorMessage('Gagal memperbarui lokasi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLocation = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus lokasi ini?')) {
      try {
        await deleteLocation(id);
        setSuccessMessage('Lokasi berhasil dihapus!');
        
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (error) {
        console.error('Error deleting location:', error);
        setErrorMessage('Gagal menghapus lokasi');
      }
    }
  };

  const startEditing = (location: Location) => {
    setEditingId(location.id!);
    setEditingName(location.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Pengaturan Lokasi</h2>
      
      {successMessage && (
        <Notification 
          message={successMessage} 
          type="success" 
          onClose={() => setSuccessMessage('')}
        />
      )}
      
      {errorMessage && (
        <Notification 
          message={errorMessage} 
          type="error" 
          onClose={() => setErrorMessage('')}
        />
      )}
      
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Tambah Lokasi Baru</h3>
        <form onSubmit={handleAddLocation} className="form-row">
          <div className="form-input">
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Masukkan nama lokasi"
              className="form-input w-full"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary whitespace-nowrap"
          >
            {isSubmitting ? 'Menambahkan...' : 'Tambah Lokasi'}
          </button>
        </form>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Kelola Lokasi</h3>
        {locations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {locations.map((location) => (
                  <tr key={location.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {location.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingId === location.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="form-input w-full"
                          required
                        />
                      ) : (
                        location.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingId === location.id ? (
                        <>
                          <button
                            onClick={handleUpdateLocation}
                            disabled={isSubmitting}
                            className="btn btn-primary btn-sm mr-2"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="btn btn-secondary btn-sm"
                          >
                            Batal
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(location)}
                            className="btn btn-secondary btn-sm mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteLocation(location.id!)}
                            className="btn btn-danger btn-sm"
                          >
                            Hapus
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Tidak ada lokasi ditemukan. Tambahkan lokasi baru di atas.
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSettings;
