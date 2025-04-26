import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { SugarFactory } from '../../lib/db';

const FactorySettings = () => {
  const { factories, addFactory, updateFactory, deleteFactory } = useApp();
  const [newFactory, setNewFactory] = useState({ name: '', transportPrice: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({ name: '', transportPrice: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddFactory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newFactory.name.trim()) {
      setErrorMessage('Nama pabrik tidak boleh kosong');
      return;
    }
    
    if (newFactory.transportPrice <= 0) {
      setErrorMessage('Harga transportasi harus lebih besar dari 0');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      
      await addFactory({
        name: newFactory.name.trim(),
        transportPrice: newFactory.transportPrice
      });
      
      setNewFactory({ name: '', transportPrice: 0 });
      setSuccessMessage('Pabrik berhasil ditambahkan!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error adding factory:', error);
      setErrorMessage('Gagal menambahkan pabrik');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateFactory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingData.name.trim() || !editingId) {
      setErrorMessage('Nama pabrik tidak boleh kosong');
      return;
    }
    
    if (editingData.transportPrice <= 0) {
      setErrorMessage('Harga transportasi harus lebih besar dari 0');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      
      await updateFactory(editingId, {
        name: editingData.name.trim(),
        transportPrice: editingData.transportPrice
      });
      
      setEditingId(null);
      setEditingData({ name: '', transportPrice: 0 });
      setSuccessMessage('Pabrik berhasil diperbarui!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating factory:', error);
      setErrorMessage('Gagal memperbarui pabrik');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFactory = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pabrik ini?')) {
      try {
        await deleteFactory(id);
        setSuccessMessage('Pabrik berhasil dihapus!');
        
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (error) {
        console.error('Error deleting factory:', error);
        setErrorMessage('Gagal menghapus pabrik');
      }
    }
  };

  const startEditing = (factory: SugarFactory) => {
    setEditingId(factory.id!);
    setEditingData({
      name: factory.name,
      transportPrice: factory.transportPrice
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingData({ name: '', transportPrice: 0 });
  };

  const handleNewFactoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'transportPrice') {
      setNewFactory(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setNewFactory(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'transportPrice') {
      setEditingData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setEditingData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Pengaturan Pabrik Gula</h2>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Tambah Pabrik Gula Baru</h3>
        <form onSubmit={handleAddFactory} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <input
              type="text"
              name="name"
              value={newFactory.name}
              onChange={handleNewFactoryChange}
              placeholder="Masukkan nama pabrik"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1E40AF] focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="col-span-1">
            <input
              type="number"
              name="transportPrice"
              value={newFactory.transportPrice || ''}
              onChange={handleNewFactoryChange}
              placeholder="Harga transportasi"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1E40AF] focus:ring focus:ring-blue-200"
              required
              min="1"
            />
          </div>
          <div className="col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1E40AF] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isSubmitting ? 'Menambahkan...' : 'Tambah Pabrik'}
            </button>
          </div>
        </form>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Kelola Pabrik Gula</h3>
        {factories.length > 0 ? (
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga Transportasi
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {factories.map((factory) => (
                  <tr key={factory.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {factory.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingId === factory.id ? (
                        <input
                          type="text"
                          name="name"
                          value={editingData.name}
                          onChange={handleEditingChange}
                          className="rounded-md border-gray-300 shadow-sm focus:border-[#1E40AF] focus:ring focus:ring-blue-200 w-full"
                          required
                        />
                      ) : (
                        factory.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingId === factory.id ? (
                        <input
                          type="number"
                          name="transportPrice"
                          value={editingData.transportPrice || ''}
                          onChange={handleEditingChange}
                          className="rounded-md border-gray-300 shadow-sm focus:border-[#1E40AF] focus:ring focus:ring-blue-200 w-full"
                          required
                          min="1"
                        />
                      ) : (
                        `Rp ${factory.transportPrice.toLocaleString()}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingId === factory.id ? (
                        <>
                          <button
                            onClick={handleUpdateFactory}
                            disabled={isSubmitting}
                            className="text-[#1E40AF] hover:text-blue-900 mr-4"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Batal
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(factory)}
                            className="text-[#1E40AF] hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteFactory(factory.id!)}
                            className="text-red-600 hover:text-red-900"
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
            Tidak ada pabrik ditemukan. Tambahkan pabrik baru di atas.
          </div>
        )}
      </div>
    </div>
  );
};

export default FactorySettings;
