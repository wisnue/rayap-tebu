import { useApp } from '../hooks/useApp';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { deliveries, locations, factories, drivers, isLoading } = useApp();

  // Prepare summary data
  const totalDeliveries = deliveries.length;
  const totalWeight = deliveries.reduce((sum, d) => sum + d.sugarcaneWeight, 0);
  const totalGrossAmount = deliveries.reduce((sum, d) => sum + d.grossAmount, 0);
  const totalNetAmount = deliveries.reduce((sum, d) => sum + d.netAmount, 0);

  // Prepare recent deliveries (last 5)
  const recentDeliveries = [...deliveries]
    .sort((a, b) => {
      const dateA = a.deliveryDate instanceof Date ? a.deliveryDate : new Date(a.deliveryDate);
      const dateB = b.deliveryDate instanceof Date ? b.deliveryDate : new Date(b.deliveryDate);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  // Prepare chart data for last 7 deliveries
  const chartData = [...deliveries]
    .sort((a, b) => {
      const dateA = a.deliveryDate instanceof Date ? a.deliveryDate : new Date(a.deliveryDate);
      const dateB = b.deliveryDate instanceof Date ? b.deliveryDate : new Date(b.deliveryDate);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(-7)
    .map(delivery => {
      const date = delivery.deliveryDate instanceof Date 
        ? delivery.deliveryDate 
        : new Date(delivery.deliveryDate);
      
      return {
        date: date.toLocaleDateString(),
        weight: delivery.sugarcaneWeight,
        gross: delivery.grossAmount,
        net: delivery.netAmount
      };
    });

  if (isLoading) {
    return (
      <div className="container py-6 flex justify-center items-center h-64">
        <p className="text-gray-500">Memuat data dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard 
          title="Total Pengiriman" 
          value={totalDeliveries.toString()} 
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
            </svg>
          }
          iconBg="#dbeafe"
          iconColor="#1E40AF"
        />
        <SummaryCard 
          title="Total Berat" 
          value={`${totalWeight.toLocaleString()} kw`} 
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clipRule="evenodd" />
            </svg>
          }
          iconBg="#dcfce7"
          iconColor="#10b981"
        />
        <SummaryCard 
          title="Pendapatan Kotor" 
          value={`Rp ${totalGrossAmount.toLocaleString()}`} 
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
          }
          iconBg="#fef3c7"
          iconColor="#d97706"
        />
        <SummaryCard 
          title="Pendapatan Bersih" 
          value={`Rp ${totalNetAmount.toLocaleString()}`} 
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          }
          iconBg="#dbeafe"
          iconColor="#3b82f6"
        />
      </div>
      
      {/* Configuration Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ConfigCard 
          title="Lokasi" 
          count={locations.length} 
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          }
          iconBg="#e0f2fe"
          iconColor="#0284c7"
        />
        <ConfigCard 
          title="Pabrik Gula" 
          count={factories.length} 
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
          }
          iconBg="#fef3c7"
          iconColor="#d97706"
        />
        <ConfigCard 
          title="Sopir" 
          count={drivers.length} 
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          }
          iconBg="#dbeafe"
          iconColor="#1E40AF"
        />
      </div>
      
      {/* Recent Activity Chart */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h2>
        <div className="h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="weight" name="Berat (kw)" fill="#1E40AF" />
                <Bar dataKey="net" name="Jumlah Bersih (Rp)" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">Tidak ada data pengiriman tersedia untuk grafik</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Deliveries */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Pengiriman Terbaru</h2>
        {recentDeliveries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pabrik
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Berat
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah Bersih
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-gray-50">
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
                      {delivery.sugarcaneWeight} kw
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rp {delivery.netAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Tidak ada catatan pengiriman ditemukan
          </div>
        )}
      </div>
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const SummaryCard = ({ title, value, icon, iconBg, iconColor }: SummaryCardProps) => (
  <div className="stats-card">
    <div 
      className="stats-card-icon" 
      style={{ 
        backgroundColor: iconBg,
        color: iconColor
      }}
    >
      {icon}
    </div>
    <h3 className="stats-card-title">{title}</h3>
    <p className="stats-card-value">{value}</p>
  </div>
);

interface ConfigCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const ConfigCard = ({ title, count, icon, iconBg, iconColor }: ConfigCardProps) => (
  <div className="stats-card">
    <div 
      className="stats-card-icon" 
      style={{ 
        backgroundColor: iconBg,
        color: iconColor
      }}
    >
      {icon}
    </div>
    <h3 className="stats-card-title">{title}</h3>
    <p className="stats-card-value">{count}</p>
  </div>
);

export default Dashboard;
