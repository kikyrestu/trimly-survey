'use client';

import { useState } from 'react';
import { Scissors, Briefcase } from 'lucide-react';

export default function BarberSurvey() {
  const [formData, setFormData] = useState({
    // Bagian 1
    business_name: '',
    location: '',
    locationOther: '',
    years_operating: '',
    number_of_barbers: '',
    
    // Bagian 2
    customer_method: '',
    challenges: [] as string[],
    challengesOther: '',
    customer_source: '',
    
    // Bagian 3
    app_interest: '',
    commission_agreement: '',
    commission_rate: '',
    partnership_willingness: '',
    
    // Bagian 4
    important_features: [] as string[],
    notification_need: '',
    payment_method: '',
    
    // Bagian 5
    expectations: '',
    concerns: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, value: string) => {
    setFormData(prev => {
      const currentValues = prev[name as keyof typeof prev] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [name]: newValues };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/submit-barber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Terjadi kesalahan saat mengirim data. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat mengirim data. Silakan coba lagi.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Terima Kasih! 🎉</h2>
          <p className="text-gray-600 mb-6">
            Data Anda telah berhasil tersimpan. Kontribusi Anda sangat membantu pengembangan Trimly!
            Semoga usaha Anda makin ramai & modern! 💈🚀
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                business_name: '', location: '', locationOther: '', years_operating: '',
                number_of_barbers: '', customer_method: '', challenges: [], challengesOther: '',
                customer_source: '', app_interest: '', commission_agreement: '',
                commission_rate: '', partnership_willingness: '', important_features: [],
                notification_need: '', payment_method: '', expectations: '', concerns: '',
              });
            }}
            className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Isi Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 text-center border-t-8 border-blue-500">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-500 p-4 rounded-full">
              <Briefcase className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Survey Minat dan Kebutuhan Barbershop/Salon
          </h1>
          <p className="text-lg text-gray-700 mb-2 font-semibold">
            Sistem Booking Berbasis Komisi – Trimly
          </p>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Survei ini bertujuan untuk memahami kebutuhan barbershop/salon dalam penggunaan sistem 
            booking online berbasis komisi <strong>tanpa biaya bulanan</strong>. Data digunakan untuk 
            riset pengembangan startup Trimly. Terima kasih telah berpartisipasi! 💈✨
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Bagian 1 - Profil Usaha */}
          <section className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-blue-500 flex items-center gap-2">
              <Scissors className="w-6 h-6 text-blue-500" />
              Bagian 1 — Profil Usaha
            </h2>

            {/* Nama Barbershop */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                1. Nama Barbershop/Salon <span className="text-gray-500 text-sm font-normal">(opsional)</span>
              </label>
              <input
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                placeholder="Nama usaha Anda..."
                className="w-full border-2 border-gray-300 rounded-lg p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>

            {/* Lokasi Usaha */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                2. Lokasi Usaha <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['Banyuwangi', 'Bali', 'Surabaya', 'Malang'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="location"
                      value={option}
                      checked={formData.location === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
                  <input
                    type="radio"
                    name="location"
                    value="Lainnya"
                    checked={formData.location === 'Lainnya'}
                    onChange={handleChange}
                    required
                    className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">Kota lain:</span>
                  <input
                    type="text"
                    name="locationOther"
                    value={formData.locationOther}
                    onChange={handleChange}
                    placeholder="Sebutkan kota"
                    className="ml-3 flex-1 border-b-2 border-gray-300 focus:border-blue-500 outline-none px-2 py-1"
                    disabled={formData.location !== 'Lainnya'}
                  />
                </label>
              </div>
            </div>

            {/* Lama Usaha */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                3. Lama Usaha Beroperasi <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['< 1 tahun', '1–3 tahun', '3–5 tahun', '> 5 tahun'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="years_operating"
                      value={option}
                      checked={formData.years_operating === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Jumlah Barber */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                4. Jumlah Barber/Stylist Aktif <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['1 orang', '2 orang', '3 orang', '> 3 orang'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="number_of_barbers"
                      value={option}
                      checked={formData.number_of_barbers === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Bagian 2 - Operasional & Tantangan */}
          <section className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-blue-500">
              Bagian 2 — Operasional & Tantangan
            </h2>

            {/* Metode Kedatangan */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                5. Bagaimana metode kedatangan pelanggan saat ini? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {[
                  'Walk-in (datang langsung)',
                  'Booking WhatsApp/DM',
                  'Sistem antrean manual',
                  'Aplikasi khusus (sebutkan)'
                ].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="customer_method"
                      value={option}
                      checked={formData.customer_method === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Kendala */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                6. Kendala apa saja yang sering terjadi? <span className="text-red-500">*</span>
                <span className="block text-sm font-normal text-gray-500 mt-1">(pilih semua yang sesuai)</span>
              </label>
              <div className="space-y-3">
                {[
                  'Pelanggan menunggu terlalu lama',
                  'Kursi kosong di jam tertentu',
                  'Pelanggan batal mendadak',
                  'Promosi kurang efektif',
                  'Sulit mendapatkan pelanggan baru'
                ].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.challenges.includes(option)}
                      onChange={() => handleCheckboxChange('challenges', option)}
                      className="w-5 h-5 text-blue-500 focus:ring-blue-500 rounded"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
                <div className="flex items-start p-4 border-2 border-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    checked={formData.challenges.includes('Lainnya')}
                    onChange={() => handleCheckboxChange('challenges', 'Lainnya')}
                    className="w-5 h-5 text-blue-500 focus:ring-blue-500 rounded mt-1"
                  />
                  <div className="ml-3 flex-1">
                    <span className="text-gray-700">Lainnya:</span>
                    <input
                      type="text"
                      name="challengesOther"
                      value={formData.challengesOther}
                      onChange={handleChange}
                      placeholder="Sebutkan kendala lain..."
                      className="w-full mt-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none px-2 py-1"
                      disabled={!formData.challenges.includes('Lainnya')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sumber Pelanggan */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                7. Sumber pelanggan terbanyak datang dari: <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {[
                  'Walk-in / lewat jalan',
                  'Pelanggan tetap',
                  'Sosial media',
                  'Rekomendasi teman',
                  'Lainnya'
                ].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="customer_source"
                      value={option}
                      checked={formData.customer_source === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Bagian 3 - Minat terhadap Aplikasi */}
          <section className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-blue-500">
              Bagian 3 — Minat terhadap Aplikasi Booking Komisi
            </h2>

            {/* Minat Aplikasi */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                8. Jika ada aplikasi booking yang membantu mendatangkan pelanggan baru tanpa biaya bulanan, apakah Anda tertarik? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['Sangat tertarik', 'Tertarik', 'Ragu', 'Tidak tertarik'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="app_interest"
                      value={option}
                      checked={formData.app_interest === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Setuju Komisi */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                9. Seberapa setuju dengan pernyataan ini: <span className="text-red-500">*</span>
                <span className="block text-base font-normal text-gray-600 mt-2 italic">
                  "Saya bersedia membayar komisi hanya jika pelanggan datang melalui aplikasi."
                </span>
              </label>
              <div className="space-y-3">
                {['Sangat setuju', 'Setuju', 'Kurang setuju', 'Tidak setuju'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="commission_agreement"
                      value={option}
                      checked={formData.commission_agreement === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rate Komisi */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                10. Komisi yang menurut Anda masih masuk akal: <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['5%', '10%', '15%', '> 15%', 'Tidak mau ada komisi'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="commission_rate"
                      value={option}
                      checked={formData.commission_rate === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Kesediaan Kerja Sama */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                11. Jika aplikasi bisa meningkatkan pelanggan 20–50% per bulan, apakah Anda mau bekerja sama? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['Ya', 'Mungkin', 'Tidak'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="partnership_willingness"
                      value={option}
                      checked={formData.partnership_willingness === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Bagian 4 - Kebutuhan Fitur */}
          <section className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-blue-500">
              Bagian 4 — Kebutuhan Fitur
            </h2>

            {/* Fitur Penting */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                12. Fitur apa yang paling penting untuk usaha Anda? <span className="text-red-500">*</span>
                <span className="block text-sm font-normal text-gray-500 mt-1">(maksimal 3 pilihan)</span>
              </label>
              <div className="space-y-3">
                {[
                  'Booking otomatis (tanpa antre)',
                  'Manajemen jadwal barber',
                  'Rating & review untuk tingkatkan reputasi',
                  'Profil barber & portofolio',
                  'Statistik pendapatan/usaha',
                  'Promo/penawaran khusus',
                  'Verifikasi pelanggan'
                ].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.important_features.includes(option)}
                      onChange={() => {
                        if (formData.important_features.includes(option)) {
                          handleCheckboxChange('important_features', option);
                        } else if (formData.important_features.length < 3) {
                          handleCheckboxChange('important_features', option);
                        }
                      }}
                      className="w-5 h-5 text-blue-500 focus:ring-blue-500 rounded"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Terpilih: {formData.important_features.length}/3
              </p>
            </div>

            {/* Notifikasi */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                13. Apakah Anda butuh notifikasi pelanggan sebelum jadwal agar mengurangi pembatalan? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['Ya', 'Mungkin', 'Tidak'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="notification_need"
                      value={option}
                      checked={formData.notification_need === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Metode Pembayaran Komisi */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                14. Metode pembayaran paling nyaman untuk komisi: <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {[
                  'Pemotongan otomatis setelah transaksi',
                  'Transfer per minggu',
                  'Transfer per bulan',
                  'Lainnya'
                ].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value={option}
                      checked={formData.payment_method === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Bagian 5 - Pendapat & Insight */}
          <section className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-blue-500">
              Bagian 5 — Pendapat & Insight Usaha
            </h2>

            {/* Harapan */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                15. Apa harapan Anda jika memakai aplikasi booking seperti Trimly?
              </label>
              <textarea
                name="expectations"
                value={formData.expectations}
                onChange={handleChange}
                rows={4}
                placeholder="Tuliskan harapan Anda di sini..."
                className="w-full border-2 border-gray-300 rounded-lg p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>

            {/* Concerns */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                16. Hal apa yang bisa membuat Anda tidak ingin memakai aplikasi booking?
              </label>
              <textarea
                name="concerns"
                value={formData.concerns}
                onChange={handleChange}
                rows={4}
                placeholder="Tuliskan kekhawatiran Anda di sini..."
                className="w-full border-2 border-gray-300 rounded-lg p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>
          </section>

          {/* Submit Button */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xl font-bold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02] transition-all shadow-lg"
            >
              Kirim Jawaban
            </button>
            <p className="text-center text-gray-500 text-sm mt-4">
              * Wajib diisi
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 text-white">
          <p className="text-sm mb-2">
            © 2025 Trimly - Startup Booking Barbershop Banyuwangi
          </p>
          <div className="flex justify-center gap-4 text-xs">
            <a href="/" className="text-gray-300 hover:text-white transition">
              Survey Pelanggan
            </a>
            <a href="/admin" className="text-gray-300 hover:text-white transition">
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
