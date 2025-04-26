import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { Driver } from '../../lib/db';

const DriverSettings = () => {
  const { drivers, addDriver, updateDriver, deleteDriver } = useApp();
  const [newDriver, setNewDriver] = useState({ name: '', truckNumber: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({ name: '', truckNumber: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDriver.name.trim()) {
      setErrorMessage('Nama sopir tidak boleh kosong');
      return;
    }
    
    if (!newDriver.truckNumber.trim()) {
      setErrorMessage('Nomor truk tidak boleh kosong');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      
      await addDriver({
        name: newDriver.name.trim(),
        truckNumber: newDriver.truckNumber.trim()
      });
      
      setNewDriver({ name: '', truckNumber: '' });
      setSuccessMessage('Sopir berhasil ditambahkan!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error adding driver:', error);
      setErrorMessage('Gagal menambahkan sopir');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingData.name.trim() || !editingId) {
      setErrorMessage('Nama sopir tidak boleh kosong');
      return;
    }
    
    if (!editingData.truckNumber.trim()) {
      setErrorMessage('Nomor truk tidak boleh kosong');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      
      await updateDriver(editingId, {
        name: editingData.name.trim(),
        truckNumber: editingData.truckNumber.trim()
      });
      
      setEditingId(null);
      setEditingData({ name: '', truckNumber: '' });
      setSuccessMessage('Sopir berhasil diperbarui!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating driver:', error);
      setErrorMessage('Gagal memperbarui sopir');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDriver = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus sopir ini?')) {
      try {
        await deleteDriver(id);
        setSuccessMessage('Sopir berhasil dihapus!');
        
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (error) {
        console.error('Error deleting driver:', error);
        setErrorMessage('Gagal menghapus sopir');
      }
    }
  };

  const startEditing = (driver: Driver) => {
    setEditingId(driver.id!);
    setEditingData({
      name: driver.name,
      truckNumber: driver.truckNumber
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingData({ name: '', truckNumber: '' });
  };

  const handleNewDriverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDriver(prev => ({ ...prev, [name]: value }));
  };

  const handleEditingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Pengaturan Sopir</h2>
      
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
        <h3 className="text-lg font-medium text-gray-700 mb-3">Tambah Sopir Baru</h3>
        <form onSubmit={handleAddDriver} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-1">
            <input
              type="text"
              name="name"
              value={newDriver.name}
              onChange={handleNewDriverChange}
              placeholder="Nama sopir"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1E40AF] focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="col-span-1 md:col-span-1">
            <input
              type="text"
              name="truckNumber"
              value={newDriver.truckNumber}
              onChange={handleNewDriverChange}
              placeholder="Nomor truk"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1E40AF] focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="col-span-1 md:col-span-1 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1E40AF] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isSubmitting ? 'Menambahkan...' : 'Tambah Sopir'}
            </button>
          </div>
        </form>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Kelola Sopir</h3>
        {drivers.length > 0 ? (
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
                    Nomor Truk
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {drivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingId === driver.id ? (
                        <input
                          type="text"
                          name="name"
                          value={editingData.name}
                          onChange={handleEditingChange}
                          className="rounded-md border-gray-300 shadow-sm focus:border-[#1E40AF] focus:ring focus:ring-blue-200 w-full"
                          required
                        />
                      ) : (
                        driver.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingId === driver.id ? (
                        <input
                          type="text"
                          name="truckNumber"
                          value={editingData.truckNumber}
                          onChange={handleEditingChange}
                          className="rounded-md border-gray-300 shadow-sm focus:border-[#1E40AF] focus:ring focus:ring-blue-200 w-full"
                          required
                        />
                      ) : (
                        driver.truckNumber
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingId === driver.id ? (
                        <>
                          <button
                            onClick={handleUpdateDriver}
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
                            onClick={() => startEditing(driver)}
                            className="text-[#1E40AF] hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDriver(driver.id!)}
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
            Tidak ada sopir ditemukan. Tambahkan sopir baru di atas.
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverSettings;
