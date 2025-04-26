import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { Delivery } from '../../lib/db';

const DeliveryTable = () => {
  const { deliveries, locations, factories, drivers, deleteDelivery } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Delivery>('deliveryDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(10);
  const itemsPerPageOptions = [5, 10, 25, 50];
  
  // Filter states
  const [locationFilter, setLocationFilter] = useState<number | ''>('');
  const [factoryFilter, setFactoryFilter] = useState<number | ''>('');
  const [driverFilter, setDriverFilter] = useState<number | ''>('');
  const [dateRangeStart, setDateRangeStart] = useState<string>('');
  const [dateRangeEnd, setDateRangeEnd] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter deliveries based on all filters
  const filteredDeliveries = deliveries.filter(delivery => {
    // Text search filter
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = 
      !searchTerm ||
      delivery.locationName?.toLowerCase().includes(searchTermLower) ||
      delivery.factoryName?.toLowerCase().includes(searchTermLower) ||
      delivery.driverName?.toLowerCase().includes(searchTermLower) ||
      delivery.truckNumber?.toLowerCase().includes(searchTermLower) ||
      delivery.deliveryDate.toLocaleDateString().includes(searchTerm);
    
    if (!matchesSearch) return false;
    
    // Location filter
    if (locationFilter !== '' && delivery.locationId !== locationFilter) {
      return false;
    }
    
    // Factory filter
    if (factoryFilter !== '' && delivery.factoryId !== factoryFilter) {
      return false;
    }
    
    // Driver filter
    if (driverFilter !== '' && delivery.driverId !== driverFilter) {
      return false;
    }
    
    // Date range filter
    if (dateRangeStart || dateRangeEnd) {
      const deliveryDate = delivery.deliveryDate instanceof Date 
        ? delivery.deliveryDate 
        : new Date(delivery.deliveryDate);
      
      if (dateRangeStart) {
        const startDate = new Date(dateRangeStart);
        startDate.setHours(0, 0, 0, 0);
        if (deliveryDate < startDate) {
          return false;
        }
      }
      
      if (dateRangeEnd) {
        const endDate = new Date(dateRangeEnd);
        endDate.setHours(23, 59, 59, 999);
        if (deliveryDate > endDate) {
          return false;
        }
      }
    }
    
    return true;
  });

  // Sort deliveries
  const sortedDeliveries = [...filteredDeliveries].sort((a, b) => {
    if (a[sortField] === undefined || b[sortField] === undefined) return 0;
    
    let comparison = 0;
    if (typeof a[sortField] === 'string' && typeof b[sortField] === 'string') {
      comparison = (a[sortField] as string).localeCompare(b[sortField] as string);
    } else if (a[sortField] instanceof Date && b[sortField] instanceof Date) {
      comparison = (a[sortField] as Date).getTime() - (b[sortField] as Date).getTime();
    } else {
      comparison = (a[sortField] as number) - (b[sortField] as number);
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Paginate deliveries
  const totalPages = Math.ceil(sortedDeliveries.length / selectedItemsPerPage);
  const paginatedDeliveries = sortedDeliveries.slice(
    (currentPage - 1) * selectedItemsPerPage,
    currentPage * selectedItemsPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value);
    setSelectedItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSort = (field: keyof Delivery) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data pengiriman ini?')) {
      try {
        await deleteDelivery(id);
      } catch (error) {
        console.error('Error deleting delivery:', error);
        alert('Gagal menghapus data pengiriman');
      }
    }
  };
  
  const resetFilters = () => {
    setLocationFilter('');
    setFactoryFilter('');
    setDriverFilter('');
    setDateRangeStart('');
    setDateRangeEnd('');
    setSearchTerm('');
    setCurrentPage(1);
  };
  
  // Export to Excel/CSV
  const exportToExcel = () => {
    // Create CSV content
    let csvContent = "No,Tanggal,Lokasi,Pabrik Gula,Sopir,No Truk,Berat (kw),Brutto (Rp),Netto (Rp)\n";
    
    sortedDeliveries.forEach(delivery => {
      const date = delivery.deliveryDate instanceof Date 
        ? delivery.deliveryDate.toLocaleDateString() 
        : new Date(delivery.deliveryDate).toLocaleDateString();
      
      csvContent += `${delivery.id},${date},${delivery.locationName},${delivery.factoryName},${delivery.driverName},${delivery.truckNumber},${delivery.sugarcaneWeight},${delivery.grossAmount},${delivery.netAmount}\n`;
    });
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pengiriman-tebu-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show at most 5 page numbers
    
    if (totalPages <= maxPagesToShow) {
      // If total pages is less than max pages to show, display all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate start and end of page range
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're at the beginning or end
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">Data Pengiriman Tebu</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-[#1E40AF] text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
          </button>
          <button 
            onClick={exportToExcel}
            className="px-4 py-2 bg-[rgb(37,99,235)] text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Export ke Excel
          </button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Cari data pengiriman..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-[#e5e7eb] rounded-md"
            />
          </div>
          
          {showFilters && (
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-2/3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
        
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-[#e5e7eb]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lokasi
                </label>
                <select
                  value={locationFilter}
                  onChange={(e) => {
                    setLocationFilter(e.target.value ? parseInt(e.target.value) : '');
                    setCurrentPage(1);
                  }}
                  className="w-full border border-[#e5e7eb] rounded-md"
                >
                  <option value="">Semua Lokasi</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pabrik Gula
                </label>
                <select
                  value={factoryFilter}
                  onChange={(e) => {
                    setFactoryFilter(e.target.value ? parseInt(e.target.value) : '');
                    setCurrentPage(1);
                  }}
                  className="w-full border border-[#e5e7eb] rounded-md"
                >
                  <option value="">Semua Pabrik</option>
                  {factories.map(factory => (
                    <option key={factory.id} value={factory.id}>
                      {factory.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sopir
                </label>
                <select
                  value={driverFilter}
                  onChange={(e) => {
                    setDriverFilter(e.target.value ? parseInt(e.target.value) : '');
                    setCurrentPage(1);
                  }}
                  className="w-full border border-[#e5e7eb] rounded-md"
                >
                  <option value="">Semua Sopir</option>
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} ({driver.truckNumber})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={dateRangeStart}
                  onChange={(e) => {
                    setDateRangeStart(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full border border-[#e5e7eb] rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Akhir
                </label>
                <input
                  type="date"
                  value={dateRangeEnd}
                  onChange={(e) => {
                    setDateRangeEnd(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full border border-[#e5e7eb] rounded-md"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#e5e7eb]">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('id')}
              >
                No
                {sortField === 'id' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('deliveryDate')}
              >
                Tanggal
                {sortField === 'deliveryDate' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('locationId')}
              >
                Lokasi
                {sortField === 'locationId' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('factoryId')}
              >
                Pabrik Gula
                {sortField === 'factoryId' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('driverId')}
              >
                Sopir
                {sortField === 'driverId' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('sugarcaneWeight')}
              >
                Berat
                {sortField === 'sugarcaneWeight' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('grossAmount')}
              >
                Brutto
                {sortField === 'grossAmount' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('netAmount')}
              >
                Netto
                {sortField === 'netAmount' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#e5e7eb]">
            {paginatedDeliveries.length > 0 ? (
              paginatedDeliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.deliveryDate instanceof Date 
                      ? delivery.deliveryDate.toLocaleDateString() 
                      : new Date(delivery.deliveryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.locationName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.factoryName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.driverName} ({delivery.truckNumber})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.sugarcaneWeight} kw
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rp {delivery.grossAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rp {delivery.netAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(delivery.id!)}
                      className="text-red-600 hover:text-red-900 ml-4"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                  Tidak ada data pengiriman yang ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6">
        <div className="flex items-center mb-4 md:mb-0">
          <span className="text-sm text-gray-700 mr-2">Tampilkan:</span>
          <select
            value={selectedItemsPerPage}
            onChange={handleItemsPerPageChange}
            className="form-select text-sm border-[#e5e7eb] rounded-md"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700 ml-2">per halaman</span>
        </div>
        
        <div className="text-sm text-gray-700 mb-4 md:mb-0">
          Menampilkan <span className="font-medium">{filteredDeliveries.length === 0 ? 0 : (currentPage - 1) * selectedItemsPerPage + 1}</span> sampai{' '}
          <span className="font-medium">
            {Math.min(currentPage * selectedItemsPerPage, filteredDeliveries.length)}
          </span>{' '}
          dari <span className="font-medium">{filteredDeliveries.length}</span> hasil
        </div>
        
        {totalPages > 1 && (
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#e5e7eb] hover:shadow-sm'
              }`}
              aria-label="First Page"
            >
              &laquo;
            </button>
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#e5e7eb] hover:shadow-sm'
              }`}
            >
              Sebelumnya
            </button>
            
            {getPageNumbers().map((page, index) => (
              typeof page === 'number' ? (
                <button
                  key={index}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? 'bg-[#1E40AF] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#e5e7eb] hover:shadow-sm'
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="px-2 py-1 text-gray-500">
                  {page}
                </span>
              )
            ))}
            
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#e5e7eb] hover:shadow-sm'
              }`}
            >
              Selanjutnya
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-[#e5e7eb] hover:shadow-sm'
              }`}
              aria-label="Last Page"
            >
              &raquo;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryTable;
