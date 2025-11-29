'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Users, TrendingUp, LogOut, Download, RefreshCw, 
  BarChart3, PieChart as PieChartIcon 
} from 'lucide-react';

interface SurveyResponse {
  id: string;
  timestamp: string;
  age: string;
  gender: string;
  domicile: string;
  haircut_frequency: string;
  price_range: string;
  problems: string[];
  review_importance: string;
  app_interest: string;
  needed_features: string[];
  booking_fee: string;
  payment_method: string;
  willing_to_review: string;
  barber_selection_importance: string;
  booking_channel: string;
  improvement_suggestion?: string;
  favorite_barbershop?: string;
}

const COLORS = ['#f97316', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function AdminDashboard() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [barberResponses, setBarberResponses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'customer' | 'barber'>('customer');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [barberStats, setBarberStats] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
      return;
    }

    loadResponses();
  }, []);

  const loadResponses = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading responses from API...');
      
      // Load customer responses
      const customerResponse = await fetch('/api/submit-with-storage');
      const customerData = await customerResponse.json();
      
      console.log('📊 Customer API response:', customerData);
      
      if (customerData.success) {
        console.log(`✅ Loaded ${customerData.responses.length} customer responses`);
        setResponses(customerData.responses);
        calculateStats(customerData.responses);
      } else {
        console.error('❌ Failed to load customer responses:', customerData);
      }

      // Load barber responses
      const barberResponse = await fetch('/api/submit-barber');
      const barberData = await barberResponse.json();
      
      console.log('📊 Barber API response:', barberData);
      
      if (barberData.success) {
        console.log(`✅ Loaded ${barberData.responses.length} barber responses`);
        setBarberResponses(barberData.responses);
        calculateBarberStats(barberData.responses);
      } else {
        console.error('❌ Failed to load barber responses:', barberData);
      }
    } catch (error) {
      console.error('❌ Error loading responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: SurveyResponse[]) => {
    if (!data || data.length === 0) {
      console.log('⚠️ No customer data to calculate stats');
      return;
    }

    console.log(`📈 Calculating stats for ${data.length} customer responses`);
    console.log('📄 Sample customer data:', data[0]);

    // Age distribution
    const ageData = countOccurrences(data, 'age');
    
    // Gender distribution
    const genderData = countOccurrences(data, 'gender');
    
    // Domicile distribution
    const domicileData = countOccurrences(data, 'domicile');
    
    // Haircut frequency
    const frequencyData = countOccurrences(data, 'frequency');
    
    // Price range
    const priceData = countOccurrences(data, 'price');
    
    // Problems (multiple choice)
    const problemsData = countMultipleChoices(data, 'problems');
    
    // App interest
    const interestData = countOccurrences(data, 'interest');
    
    // Needed features (multiple choice)
    const featuresData = countMultipleChoices(data, 'features');
    
    // Booking fee
    const bookingFeeData = countOccurrences(data, 'bookingFee');
    
    // Payment method
    const paymentData = countOccurrences(data, 'paymentMethod');
    
    // Review importance
    const reviewData = countOccurrences(data, 'reviewImportance');
    
    // Booking channel
    const channelData = countOccurrences(data, 'channel');

    setStats({
      ageData,
      genderData,
      domicileData,
      frequencyData,
      priceData,
      problemsData,
      interestData,
      featuresData,
      bookingFeeData,
      paymentData,
      reviewData,
      channelData,
    });
  };

  const countOccurrences = (data: any[], field: string) => {
    const counts: { [key: string]: number } = {};
    data.forEach((item) => {
      const value = item[field];
      if (value) {
        counts[value] = (counts[value] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const countMultipleChoices = (data: any[], field: string) => {
    const counts: { [key: string]: number } = {};
    data.forEach((item) => {
      const values = item[field] || [];
      values.forEach((value: string) => {
        counts[value] = (counts[value] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const calculateBarberStats = (data: any[]) => {
    if (!data || data.length === 0) {
      console.log('⚠️ No barber data to calculate stats');
      return;
    }

    console.log(`📈 Calculating stats for ${data.length} barber responses`);
    console.log('📄 Sample barber data:', data[0]);

    const locationData = countOccurrences(data, 'location');
    const yearsData = countOccurrences(data, 'yearsOperating');
    const barbersData = countOccurrences(data, 'numberOfBarbers');
    const customerMethodData = countMultipleChoices(data, 'customerMethods');
    const challengesData = countMultipleChoices(data, 'challenges');
    const customerSourceData = countOccurrences(data, 'customerSource');
    const appInterestData = countOccurrences(data, 'appInterest');
    const commissionAgreementData = countOccurrences(data, 'commissionAgreement');
    const commissionRateData = countOccurrences(data, 'commissionRate');
    const partnershipData = countOccurrences(data, 'partnership');
    const featuresData = countMultipleChoices(data, 'features');
    const notificationData = countOccurrences(data, 'notification');
    const paymentMethodData = countMultipleChoices(data, 'paymentMethods');

    console.log('📊 Calculated barber stats:', {
      locationCount: locationData.length,
      yearsCount: yearsData.length,
      featuresCount: featuresData.length
    });

    setBarberStats({
      locationData,
      yearsData,
      barbersData,
      customerMethodData,
      challengesData,
      customerSourceData,
      appInterestData,
      commissionAgreementData,
      commissionRateData,
      partnershipData,
      featuresData,
      notificationData,
      paymentMethodData,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(responses, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trimly-survey-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Dashboard Admin Trimly
              </h1>
              <p className="text-gray-600 mt-1">
                Analisis Hasil Survey Barbershop Booking App
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadResponses}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-t pt-4">
            <button
              onClick={() => setActiveTab('customer')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'customer'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              👤 Survey Pelanggan ({responses.length})
            </button>
            <button
              onClick={() => setActiveTab('barber')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'barber'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              💼 Survey Barbershop ({barberResponses.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Customer Survey Dashboard */}
        {activeTab === 'customer' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold">Total Responden</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{responses.length}</p>
              </div>
              <Users className="w-12 h-12 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold">Tertarik dengan App</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">
                  {stats.interestData?.filter((d: any) => 
                    d.name === 'Sangat tertarik' || d.name === 'Tertarik'
                  ).reduce((sum: number, d: any) => sum + d.value, 0) || 0}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold">Fitur Paling Dibutuhkan</p>
                <p className="text-lg font-bold text-gray-800 mt-2">
                  {stats.featuresData?.[0]?.name.substring(0, 25) || 'N/A'}...
                </p>
              </div>
              <BarChart3 className="w-12 h-12 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Charts */}
        {responses.length > 0 ? (
          <div className="space-y-8">
            {/* Age Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <PieChartIcon className="w-6 h-6 text-orange-500" />
                Distribusi Usia
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.ageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.ageData?.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Gender Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Jenis Kelamin</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.genderData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Domicile Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Domisili Responden</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.domicileData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Haircut Frequency */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Frekuensi Potong Rambut</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.frequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Range Harga yang Dibayar</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.priceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Problems */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Permasalahan yang Dialami (Multiple)</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats.problemsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={200} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* App Interest */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Minat Menggunakan Aplikasi</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.interestData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.interestData?.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Needed Features */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Fitur yang Paling Dibutuhkan (Top 3 Choices)</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats.featuresData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={250} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Booking Fee */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Kesediaan Bayar Biaya Booking</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.bookingFeeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#14b8a6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Preferensi Metode Pembayaran</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.paymentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.paymentData?.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Booking Channel */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Channel Booking yang Disukai</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.channelData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Review Importance */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Pentingnya Review & Rating</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.reviewData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">Belum ada data responden</p>
            <p className="text-gray-400 mt-2">Data akan muncul setelah ada yang mengisi survey</p>
          </div>
        )}
        </>
        )}

        {/* Barber Survey Dashboard */}
        {activeTab === 'barber' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Total Barbershop</p>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{barberResponses.length}</p>
                  </div>
                  <Users className="w-12 h-12 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Tertarik Bermitra</p>
                    <p className="text-4xl font-bold text-gray-800 mt-2">
                      {barberStats.partnershipData?.filter((d: any) => 
                        d.name === 'Sangat bersedia' || d.name === 'Bersedia'
                      ).reduce((sum: number, d: any) => sum + d.value, 0) || 0}
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Komisi Paling Diminati</p>
                    <p className="text-lg font-bold text-gray-800 mt-2">
                      {barberStats.commissionRateData?.[0]?.name || 'N/A'}
                    </p>
                  </div>
                  <BarChart3 className="w-12 h-12 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Charts */}
            {barberResponses.length > 0 ? (
              <div className="space-y-8">
                {/* Location Distribution */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <PieChartIcon className="w-6 h-6 text-blue-500" />
                    Distribusi Lokasi Barbershop
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={barberStats.locationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {barberStats.locationData?.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Years Operating */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Lama Beroperasi</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barberStats.yearsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Number of Barbers */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Jumlah Barber/Stylist</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barberStats.barbersData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Customer Acquisition Methods */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Cara Mendapatkan Pelanggan (Multiple)</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={barberStats.customerMethodData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={200} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Challenges Faced */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Tantangan yang Dihadapi (Multiple)</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={barberStats.challengesData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={250} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#ec4899" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Customer Source */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Asal Pelanggan Saat Ini</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={barberStats.customerSourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {barberStats.customerSourceData?.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* App Interest */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Minat Menggunakan Aplikasi Booking</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={barberStats.appInterestData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {barberStats.appInterestData?.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Commission Agreement */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Kesediaan Sistem Komisi</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barberStats.commissionAgreementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#14b8a6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Commission Rate Preference */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Preferensi Rate Komisi</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barberStats.commissionRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Partnership Willingness */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Kesediaan Bermitra dengan Trimly</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barberStats.partnershipData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Important Features */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Fitur Penting dalam Aplikasi (Top 3)</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={barberStats.featuresData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={250} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Notification Preference */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Preferensi Pemberitahuan Booking</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={barberStats.notificationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {barberStats.notificationData?.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Metode Pembayaran yang Diterima (Multiple)</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={barberStats.paymentMethodData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <p className="text-gray-500 text-lg">Belum ada data barbershop</p>
                <p className="text-gray-400 mt-2">Data akan muncul setelah ada yang mengisi survey barbershop</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
