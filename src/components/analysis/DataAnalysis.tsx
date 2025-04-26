import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar
} from 'recharts';

// Enhanced color palette for better visualization
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', 
  '#82CA9D', '#FFC658', '#8DD1E1', '#A4DE6C', '#D0ED57'
];

type TimeFrame = 'day' | 'week' | 'month' | 'year';

const DataAnalysis = () => {
  const { deliveries, locations, factories } = useApp();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('month');
  const [chartType, setChartType] = useState<'bar' | 'area' | 'line'>('bar');

  // Filter deliveries based on selected time frame
  const filteredDeliveries = deliveries.filter(delivery => {
    const deliveryDate = delivery.deliveryDate instanceof Date 
      ? delivery.deliveryDate 
      : new Date(delivery.deliveryDate);
    const now = new Date();
    
    switch (timeFrame) {
      case 'day':
        return deliveryDate.toDateString() === now.toDateString();
      case 'week': {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return deliveryDate >= oneWeekAgo;
      }
      case 'month': {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return deliveryDate >= oneMonthAgo;
      }
      case 'year': {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        return deliveryDate >= oneYearAgo;
      }
      default:
        return true;
    }
  });

  // Prepare data for location pie chart
  const locationData = locations.map(location => {
    const locationDeliveries = filteredDeliveries.filter(
      delivery => delivery.locationId === location.id
    );
    
    const totalWeight = locationDeliveries.reduce(
      (sum, delivery) => sum + delivery.sugarcaneWeight,
      0
    );
    
    return {
      name: location.name,
      value: totalWeight
    };
  }).filter(item => item.value > 0);

  // Prepare data for factory pie chart
  const factoryData = factories.map(factory => {
    const factoryDeliveries = filteredDeliveries.filter(
      delivery => delivery.factoryId === factory.id
    );
    
    const totalWeight = factoryDeliveries.reduce(
      (sum, delivery) => sum + delivery.sugarcaneWeight,
      0
    );
    
    return {
      name: factory.name,
      value: totalWeight
    };
  }).filter(item => item.value > 0);

  // Prepare data for monthly bar chart
  const getMonthlyData = () => {
    const monthlyData: { [key: string]: { revenue: number, weight: number } } = {};
    
    filteredDeliveries.forEach(delivery => {
      const deliveryDate = delivery.deliveryDate instanceof Date 
        ? delivery.deliveryDate 
        : new Date(delivery.deliveryDate);
      
      const monthYear = `${deliveryDate.toLocaleString('id-ID', { month: 'short' })} ${deliveryDate.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { revenue: 0, weight: 0 };
      }
      
      monthlyData[monthYear].revenue += delivery.netAmount;
      monthlyData[monthYear].weight += delivery.sugarcaneWeight;
    });
    
    return Object.entries(monthlyData).map(([name, data]) => ({ 
      name, 
      pendapatan: data.revenue,
      berat: data.weight
    }));
  };

  const monthlyData = getMonthlyData();

  // Prepare data for daily trend chart
  const getDailyTrendData = () => {
    const dailyData: { [key: string]: { revenue: number, weight: number } } = {};
    
    // Sort deliveries by date
    const sortedDeliveries = [...filteredDeliveries].sort((a, b) => {
      const dateA = a.deliveryDate instanceof Date ? a.deliveryDate : new Date(a.deliveryDate);
      const dateB = b.deliveryDate instanceof Date ? b.deliveryDate : new Date(b.deliveryDate);
      return dateA.getTime() - dateB.getTime();
    });
    
    sortedDeliveries.forEach(delivery => {
      const deliveryDate = delivery.deliveryDate instanceof Date 
        ? delivery.deliveryDate 
        : new Date(delivery.deliveryDate);
      
      const dateStr = deliveryDate.toLocaleDateString('id-ID');
      
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { revenue: 0, weight: 0 };
      }
      
      dailyData[dateStr].revenue += delivery.netAmount;
      dailyData[dateStr].weight += delivery.sugarcaneWeight;
    });
    
    return Object.entries(dailyData).map(([name, data]) => ({ 
      name, 
      pendapatan: data.revenue,
      berat: data.weight
    }));
  };

  const dailyTrendData = getDailyTrendData();

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('pendapatan') 
                ? `Rp ${entry.value.toLocaleString()}`
                : `${entry.value.toLocaleString()} kwintal`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie charts
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-gray-800">{payload[0].name}</p>
          <p style={{ color: payload[0].color }}>
            Berat: {payload[0].value.toLocaleString()} kwintal
          </p>
          <p style={{ color: payload[0].color }}>
            Persentase: {(payload[0].percent * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Render appropriate chart based on selected type
  const renderRevenueChart = () => {
    switch (chartType) {
      case 'area':
        return (
          <AreaChart
            data={monthlyData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="pendapatan" 
              name="Pendapatan Bersih" 
              stroke="#1E40AF" 
              fillOpacity={1} 
              fill="url(#colorPendapatan)" 
            />
          </AreaChart>
        );
      case 'line':
        return (
          <LineChart
            data={monthlyData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="pendapatan" 
              name="Pendapatan Bersih" 
              stroke="#1E40AF" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        );
      default:
        return (
          <BarChart
            data={monthlyData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="pendapatan" 
              name="Pendapatan Bersih" 
              fill="url(#colorPendapatan)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">Analisis Data</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex space-x-2">
            <TimeFrameButton 
              label="Hari" 
              value="day" 
              current={timeFrame} 
              onClick={() => setTimeFrame('day')} 
            />
            <TimeFrameButton 
              label="Minggu" 
              value="week" 
              current={timeFrame} 
              onClick={() => setTimeFrame('week')} 
            />
            <TimeFrameButton 
              label="Bulan" 
              value="month" 
              current={timeFrame} 
              onClick={() => setTimeFrame('month')} 
            />
            <TimeFrameButton 
              label="Tahun" 
              value="year" 
              current={timeFrame} 
              onClick={() => setTimeFrame('year')} 
            />
          </div>
          <div className="flex space-x-2">
            <ChartTypeButton 
              label="Bar" 
              value="bar" 
              current={chartType} 
              onClick={() => setChartType('bar')} 
            />
            <ChartTypeButton 
              label="Area" 
              value="area" 
              current={chartType} 
              onClick={() => setChartType('area')} 
            />
            <ChartTypeButton 
              label="Line" 
              value="line" 
              current={chartType} 
              onClick={() => setChartType('line')} 
            />
          </div>
        </div>
      </div>

      {filteredDeliveries.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Tidak ada data tersedia untuk rentang waktu yang dipilih
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Pendapatan per Bulan</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {renderRevenueChart()}
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-600 mt-2 italic">
              Grafik menunjukkan pendapatan bersih dari pengiriman tebu per bulan dalam periode yang dipilih
            </p>
          </div>

          {/* Daily Trend Chart */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Tren Harian Pengiriman Tebu</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dailyTrendData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#00C49F" />
                  <YAxis yAxisId="right" orientation="right" stroke="#1E40AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="berat" 
                    name="Berat Tebu (kw)" 
                    stroke="#00C49F" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="pendapatan" 
                    name="Pendapatan (Rp)" 
                    stroke="#1E40AF" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-600 mt-2 italic">
              Grafik menunjukkan tren berat tebu dan pendapatan harian dalam periode yang dipilih
            </p>
          </div>

          {/* Location Distribution Chart */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Distribusi Tebu berdasarkan Lokasi</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={locationData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {locationData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-600 mt-2 italic">
              Diagram menunjukkan persentase berat tebu dari setiap lokasi pertanian
            </p>
          </div>

          {/* Factory Distribution Chart */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Distribusi Tebu berdasarkan Pabrik</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="20%" 
                  outerRadius="80%" 
                  barSize={20} 
                  data={factoryData}
                >
                  <RadialBar
                    label={{ position: 'insideStart', fill: '#fff' }}
                    background
                    dataKey="value"
                  >
                    {factoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </RadialBar>
                  <Tooltip content={<PieTooltip />} />
                  <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-600 mt-2 italic">
              Diagram menunjukkan distribusi pengiriman tebu ke berbagai pabrik gula
            </p>
          </div>

          {/* Summary Statistics */}
          <div className="col-span-1 lg:col-span-2 bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Ringkasan Statistik</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard 
                title="Total Pengiriman" 
                value={filteredDeliveries.length.toString()} 
                color="bg-blue-100 text-blue-800" 
                icon="📦"
              />
              <StatCard 
                title="Total Berat" 
                value={`${filteredDeliveries.reduce((sum, d) => sum + d.sugarcaneWeight, 0).toLocaleString()} kw`} 
                color="bg-green-100 text-green-800" 
                icon="⚖️"
              />
              <StatCard 
                title="Pendapatan Brutto" 
                value={`Rp ${filteredDeliveries.reduce((sum, d) => sum + d.grossAmount, 0).toLocaleString()}`} 
                color="bg-yellow-100 text-yellow-800" 
                icon="💰"
              />
              <StatCard 
                title="Pendapatan Netto" 
                value={`Rp ${filteredDeliveries.reduce((sum, d) => sum + d.netAmount, 0).toLocaleString()}`} 
                color="bg-purple-100 text-purple-800" 
                icon="💸"
              />
            </div>
            <p className="text-sm text-gray-600 mt-4 italic text-center">
              Data diatas menunjukkan ringkasan statistik untuk periode {
                timeFrame === 'day' ? 'hari ini' :
                timeFrame === 'week' ? '7 hari terakhir' :
                timeFrame === 'month' ? '30 hari terakhir' : '12 bulan terakhir'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

interface TimeFrameButtonProps {
  label: string;
  value: TimeFrame;
  current: TimeFrame;
  onClick: () => void;
}

const TimeFrameButton = ({ label, value, current, onClick }: TimeFrameButtonProps) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
      current === value
        ? 'bg-[#1E40AF] text-white shadow-md'
        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:shadow-sm'
    }`}
  >
    {label}
  </button>
);

interface ChartTypeButtonProps {
  label: string;
  value: 'bar' | 'area' | 'line';
  current: 'bar' | 'area' | 'line';
  onClick: () => void;
}

const ChartTypeButton = ({ label, value, current, onClick }: ChartTypeButtonProps) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
      current === value
        ? 'bg-[#1E40AF] text-white shadow-md'
        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:shadow-sm'
    }`}
  >
    {label}
  </button>
);

interface StatCardProps {
  title: string;
  value: string;
  color: string;
  icon: string;
}

const StatCard = ({ title, value, color, icon }: StatCardProps) => (
  <div className={`p-4 rounded-lg ${color} shadow-sm transition-transform duration-200 hover:scale-105`}>
    <div className="flex items-center">
      <span className="text-2xl mr-3">{icon}</span>
      <div>
        <h4 className="text-sm font-medium mb-1">{title}</h4>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

export default DataAnalysis;
