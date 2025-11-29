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

// Customer Survey V2 Interface
interface SurveyResponse {
  id: string;
  timestamp: string;
  // Bagian 1: Profil
  age: string;
  gender: string;
  domicile: string;
  domicile_other?: string;
  haircut_frequency: string;
  // Bagian 2: Kebiasaan
  barbershop_choice: string;
  important_factors: string;
  when_full: string;
  // Bagian 3: Pain Awareness (1-5)
  pain_wa_response: string;
  pain_time_confusion: string;
  pain_still_wait: string;
  pain_queue_overlap: string;
  pain_barber_forget: string;
  pain_unknown_barber: string;
  // Bagian 4: Minat Booking Online
  interest_wait_anywhere: string;
  interest_choose_barber: string;
  interest_queue_time: string;
  interest_notification: string;
  // Bagian 5: Promo & Keuntungan
  promo_types: string;
  will_download_for_promo: string;
  want_comparison_app: string;
  // Bagian 6: Pendapat
  wa_booking_issue?: string;
  important_features?: string;
  will_try_trimly: string;
}

// Barber Survey V2 Interface
interface BarberResponse {
  id: string;
  timestamp: string;
  // Bagian 1: Profil Usaha
  business_name?: string;
  location: string;
  location_other?: string;
  years_operating: string;
  number_of_barbers: string;
  customers_per_day: string;
  // Bagian 2: Sistem Operasional
  customer_arrival_method: string;
  common_problems: string;
  customer_source: string;
  customer_source_other?: string;
  // Bagian 3: Solusi Booking Digital
  interest_no_monthly_fee: string;
  importance_schedule: string;
  importance_wait_anywhere: string;
  importance_queue_app: string;
  want_auto_notification: string;
  // Bagian 4: Promosi & Pertumbuhan
  willing_partnership_promo: string;
  important_promo_features: string;
  // Bagian 5: Pendapat
  biggest_challenge: string;
  must_have_features: string;
  willing_try_trimly: string;
}

const COLORS = ['#f97316', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function AdminDashboard() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [barberResponses, setBarberResponses] = useState<BarberResponse[]>([]);
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

    console.log(`📈 Calculating stats for ${data.length} customer responses (V2)`);
    console.log('📄 Sample customer data:', data[0]);

    // Bagian 1: Profil
    const ageData = countOccurrences(data, 'age');
    const genderData = countOccurrences(data, 'gender');
    const domicileData = countOccurrences(data, 'domicile');
    const frequencyData = countOccurrences(data, 'haircut_frequency');
    
    // Bagian 2: Kebiasaan
    const barbershopChoiceData = countOccurrences(data, 'barbershop_choice');
    const importantFactorsData = countMultipleChoices(data, 'important_factors');
    const whenFullData = countOccurrences(data, 'when_full');
    
    // Bagian 3: Pain Awareness (Average scores 1-5)
    const painScores = {
      wa_response: calculateAverageScore(data, 'pain_wa_response'),
      time_confusion: calculateAverageScore(data, 'pain_time_confusion'),
      still_wait: calculateAverageScore(data, 'pain_still_wait'),
      queue_overlap: calculateAverageScore(data, 'pain_queue_overlap'),
      barber_forget: calculateAverageScore(data, 'pain_barber_forget'),
      unknown_barber: calculateAverageScore(data, 'pain_unknown_barber'),
    };
    
    // Bagian 4: Minat Booking Online
    const interestWaitData = countOccurrences(data, 'interest_wait_anywhere');
    const interestChooseData = countOccurrences(data, 'interest_choose_barber');
    const interestQueueData = countOccurrences(data, 'interest_queue_time');
    const interestNotifData = countOccurrences(data, 'interest_notification');
    
    // Bagian 5: Promo & Keuntungan
    const promoTypesData = countMultipleChoices(data, 'promo_types');
    const willDownloadData = countOccurrences(data, 'will_download_for_promo');
    const wantComparisonData = countOccurrences(data, 'want_comparison_app');
    
    // Bagian 6: Pendapat
    const willTryTrimlyData = countOccurrences(data, 'will_try_trimly');

    setStats({
      // Profil
      ageData,
      genderData,
      domicileData,
      frequencyData,
      // Kebiasaan
      barbershopChoiceData,
      importantFactorsData,
      whenFullData,
      // Pain Awareness
      painScores,
      // Minat
      interestWaitData,
      interestChooseData,
      interestQueueData,
      interestNotifData,
      // Promo
      promoTypesData,
      willDownloadData,
      wantComparisonData,
      // Willingness
      willTryTrimlyData,
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
      const value = item[field];
      if (value) {
        // Handle both comma-separated string and array
        const values = typeof value === 'string' ? value.split(',').map(v => v.trim()) : value;
        values.forEach((v: string) => {
          if (v) counts[v] = (counts[v] || 0) + 1;
        });
      }
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const calculateAverageScore = (data: any[], field: string) => {
    let total = 0;
    let count = 0;
    data.forEach((item) => {
      const value = parseInt(item[field]);
      if (!isNaN(value)) {
        total += value;
        count++;
      }
    });
    return count > 0 ? (total / count).toFixed(2) : '0';
  };

  const calculateBarberStats = (data: BarberResponse[]) => {
    if (!data || data.length === 0) {
      console.log('⚠️ No barber data to calculate stats');
      return;
    }

    console.log(`📈 Calculating stats for ${data.length} barber responses (V2)`);
    console.log('📄 Sample barber data:', data[0]);

    // Bagian 1: Profil Usaha
    const locationData = countOccurrences(data, 'location');
    const yearsData = countOccurrences(data, 'years_operating');
    const barbersData = countOccurrences(data, 'number_of_barbers');
    const customersPerDayData = countOccurrences(data, 'customers_per_day');
    
    // Bagian 2: Sistem Operasional
    const arrivalMethodData = countMultipleChoices(data, 'customer_arrival_method');
    const problemsData = countMultipleChoices(data, 'common_problems');
    const customerSourceData = countOccurrences(data, 'customer_source');
    
    // Bagian 3: Solusi Booking Digital (KEY METRICS!)
    const interestNoFeeData = countOccurrences(data, 'interest_no_monthly_fee');
    const scheduleImportanceData = countOccurrences(data, 'importance_schedule');
    const waitAnywhereData = countOccurrences(data, 'importance_wait_anywhere');
    const queueAppData = countOccurrences(data, 'importance_queue_app');
    const notificationData = countOccurrences(data, 'want_auto_notification');
    
    // Bagian 4: Promosi & Pertumbuhan
    const partnershipData = countOccurrences(data, 'willing_partnership_promo');
    const promoFeaturesData = countMultipleChoices(data, 'important_promo_features');
    
    // Bagian 5: Pendapat
    const willTryTrimlyData = countOccurrences(data, 'willing_try_trimly');

    console.log('📊 Calculated barber stats (V2):', {
      locationCount: locationData.length,
      yearsCount: yearsData.length,
      willTryCount: willTryTrimlyData.length
    });

    setBarberStats({
      // Profil
      locationData,
      yearsData,
      barbersData,
      customersPerDayData,
      // Operasional
      arrivalMethodData,
      problemsData,
      customerSourceData,
      // Booking Digital (KEY!)
      interestNoFeeData,
      scheduleImportanceData,
      waitAnywhereData,
      queueAppData,
      notificationData,
      // Promosi
      partnershipData,
      promoFeaturesData,
      // Willingness
      willTryTrimlyData,
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
                <p className="text-gray-500 text-sm font-semibold">Mau Coba Trimly</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">
                  {stats.willTryTrimlyData?.filter((d: any) => 
                    d.name === 'Ya, ingin coba' || d.name === 'Mungkin'
                  ).reduce((sum: number, d: any) => sum + d.value, 0) || 0}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold">Faktor Terpenting</p>
                <p className="text-lg font-bold text-gray-800 mt-2">
                  {stats.importantFactorsData?.[0]?.name.substring(0, 25) || 'N/A'}...
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

            {/* Barbershop Choice */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Pilihan Barbershop</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.barbershopChoiceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Important Factors */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Faktor Penting Memilih Barbershop (Max 3)</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats.importantFactorsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={200} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Interest in Waiting Anywhere */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Minat Antre dari Mana Saja</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.interestWaitData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.interestWaitData?.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Download for Promo */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Mau Download Aplikasi Jika Ada Promo</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats.willDownloadData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={250} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Will Try Trimly */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Kesediaan Mencoba Trimly</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.willTryTrimlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#14b8a6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Promo Types */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Jenis Promo yang Diminati (Max 2)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.promoTypesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.promoTypesData?.map((_: any, index: number) => (
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
                    <p className="text-gray-500 text-sm font-semibold">Minat Tertinggi (No Monthly Fee)</p>
                    <p className="text-lg font-bold text-gray-800 mt-2">
                      {barberStats.interestNoFeeData?.[0]?.name || 'N/A'}
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
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Pentingnya Pelanggan Atur Jadwal</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={barberStats.scheduleImportanceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {barberStats.scheduleImportanceData?.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Customers Per Day */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Pelanggan Per Hari</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barberStats.customersPerDayData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#14b8a6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Interest in No Monthly Fee App */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Minat Aplikasi TANPA Biaya Bulanan ⭐</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barberStats.interestNoFeeData}>
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
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Kesediaan Ikut Promosi Kemitraan</h2>
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

                {/* Willing to Try Trimly */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Kesediaan Mencoba Trimly 🚀</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barberStats.willTryTrimlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10b981" />
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
