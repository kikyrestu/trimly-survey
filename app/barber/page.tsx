'use client';

import { useState } from 'react';
import { Scissors, Briefcase } from 'lucide-react';

export default function BarberSurvey() {
  const [formData, setFormData] = useState({
    business_name: '',
    location: '',
    locationOther: '',
    years_operating: '',
    number_of_barbers: '',
    customers_per_day: '',
    customer_arrival_method: [] as string[],
    common_problems: [] as string[],
    customer_source: '',
    customerSourceOther: '',
    interest_no_monthly_fee: '',
    importance_schedule: '',
    importance_wait_anywhere: '',
    importance_queue_app: '',
    want_auto_notification: '',
    willing_partnership_promo: '',
    important_promo_features: [] as string[],
    biggest_challenge: '',
    must_have_features: '',
    willing_try_trimly: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, value: string, maxSelect?: number) => {
    setFormData(prev => {
      const currentValues = prev[name as keyof typeof prev] as string[];
      if (currentValues.includes(value)) {
        return { ...prev, [name]: currentValues.filter(v => v !== value) };
      } else {
        if (maxSelect && currentValues.length >= maxSelect) {
          return prev;
        }
        return { ...prev, [name]: [...currentValues, value] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/submit-barber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
            Terima kasih banyak! Semoga barbershop Anda makin rame, jadwal makin rapi, promosi makin mudah 🚀💈
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                business_name: '', location: '', locationOther: '', years_operating: '',
                number_of_barbers: '', customers_per_day: '', customer_arrival_method: [],
                common_problems: [], customer_source: '', customerSourceOther: '',
                interest_no_monthly_fee: '', importance_schedule: '', importance_wait_anywhere: '',
                importance_queue_app: '', want_auto_notification: '', willing_partnership_promo: '',
                important_promo_features: [], biggest_challenge: '', must_have_features: '',
                willing_try_trimly: '',
              });
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
          >
            Isi Survey Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-full shadow-xl mb-4">
            <Briefcase className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Survey Kebutuhan Barbershop</h1>
          <p className="text-blue-200 text-lg">Layanan Booking Digital – Trimly</p>
          <p className="text-blue-100 mt-4 max-w-2xl mx-auto">
            Formulir ini dibuat untuk riset kuliah mengenai kebutuhan barbershop dalam mengatur booking pelanggan dan promosi usaha secara digital. 
            Semua jawaban bersifat rahasia dan hanya untuk penelitian akademik. Terima kasih atas partisipasi Anda! 🙌
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Profil Usaha
            </h2>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">1. Nama barbershop/salon (opsional)</label>
              <input type="text" name="business_name" value={formData.business_name} onChange={handleChange}
                placeholder="Nama barbershop Anda"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">2. Lokasi usaha <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {['Banyuwangi', 'Bali', 'Surabaya', 'Malang'].map((loc) => (
                  <label key={loc} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                    <input type="radio" name="location" value={loc} checked={formData.location === loc} onChange={handleChange} required
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                    <span className="text-gray-700">{loc}</span>
                  </label>
                ))}
                <label className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                  <input type="radio" name="location" value="Lainnya" checked={formData.location === 'Lainnya'} onChange={handleChange} required
                    className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                  <span className="text-gray-700">Kota lain (isi sendiri)</span>
                </label>
              </div>
              {formData.location === 'Lainnya' && (
                <input type="text" name="locationOther" value={formData.locationOther} onChange={handleChange}
                  placeholder="Sebutkan kota..." required
                  className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">3. Lama usaha beroperasi <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {['< 1 tahun', '1–3 tahun', '3–5 tahun', '> 5 tahun'].map((years) => (
                  <label key={years} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                    <input type="radio" name="years_operating" value={years} checked={formData.years_operating === years} onChange={handleChange} required
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                    <span className="text-gray-700">{years}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">4. Jumlah barber/stylist aktif <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {['1 orang', '2 orang', '3 orang', '> 3 orang'].map((count) => (
                  <label key={count} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                    <input type="radio" name="number_of_barbers" value={count} checked={formData.number_of_barbers === count} onChange={handleChange} required
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                    <span className="text-gray-700">{count}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">5. Rata-rata pelanggan per hari <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {['< 10', '10–20', '21–40', '> 40'].map((count) => (
                  <label key={count} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                    <input type="radio" name="customers_per_day" value={count} checked={formData.customers_per_day === count} onChange={handleChange} required
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                    <span className="text-gray-700">{count}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Sistem Operasional & Masalah Umum
            </h2>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">6. Cara kedatangan pelanggan saat ini? (boleh pilih lebih dari 1) <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {['Walk-in (datang langsung)', 'Booking lewat WhatsApp/DM', 'Sistem antrean manual', 'Sudah pakai aplikasi khusus'].map((method) => (
                  <label key={method} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                    <input type="checkbox" checked={formData.customer_arrival_method.includes(method)}
                      onChange={() => handleCheckboxChange('customer_arrival_method', method)}
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded" />
                    <span className="text-gray-700">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">7. Masalah yang sering terjadi? (boleh pilih lebih dari 1) <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {['Penumpukan pelanggan di jam tertentu', 'Jadwal barber sering bentrok', 'Pelanggan batal mendadak', 
                  'Promosi kurang efektif', 'Barbershop kurang dikenal orang luas', 'Sulit dapat pelanggan baru', 'Tidak ada masalah'].map((problem) => (
                  <label key={problem} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                    <input type="checkbox" checked={formData.common_problems.includes(problem)}
                      onChange={() => handleCheckboxChange('common_problems', problem)}
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded" />
                    <span className="text-gray-700">{problem}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">8. Sumber pelanggan terbanyak dari: <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {['Pelanggan tetap', 'Walk-in / lewat jalan', 'Sosial media', 'Rekomendasi'].map((source) => (
                  <label key={source} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                    <input type="radio" name="customer_source" value={source} checked={formData.customer_source === source} onChange={handleChange} required
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                    <span className="text-gray-700">{source}</span>
                  </label>
                ))}
                <label className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                  <input type="radio" name="customer_source" value="Lainnya" checked={formData.customer_source === 'Lainnya'} onChange={handleChange} required
                    className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                  <span className="text-gray-700">Lainnya</span>
                </label>
              </div>
              {formData.customer_source === 'Lainnya' && (
                <input type="text" name="customerSourceOther" value={formData.customerSourceOther} onChange={handleChange}
                  placeholder="Sebutkan sumber lainnya..." required
                  className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              )}
            </div>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              Solusi Booking Digital
            </h2>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">9. Kalau ada aplikasi yang bantu mendatangkan pelanggan baru TANPA biaya pendaftaran/bulanan, apakah tertarik? <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {['Sangat tidak tertarik', 'Tidak tertarik', 'Netral', 'Tertarik', 'Sangat tertarik'].map((level) => (
                  <label key={level} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                    <input type="radio" name="interest_no_monthly_fee" value={level} checked={formData.interest_no_monthly_fee === level} onChange={handleChange} required
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                    <span className="text-gray-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">10. Seberapa penting pelanggan bisa atur jadwal sendiri? <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {['Tidak penting', 'Kurang penting', 'Cukup penting', 'Penting', 'Sangat penting'].map((level) => (
                  <label key={level} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                    <input type="radio" name="importance_schedule" value={level} checked={formData.importance_schedule === level} onChange={handleChange} required
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                    <span className="text-gray-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">11. Seberapa penting pelanggan bisa antre dari mana saja? <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {['Tidak penting', 'Kurang penting', 'Cukup penting', 'Penting', 'Sangat penting'].map((level) => (
                  <label key={level} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                    <input type="radio" name="importance_wait_anywhere" value={level} checked={formData.importance_wait_anywhere === level} onChange={handleChange} required
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                    <span className="text-gray-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">12. Seberapa penting ada aplikasi kelola antrean? <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {['Tidak penting', 'Kurang penting', 'Cukup penting', 'Penting', 'Sangat penting'].map((level) => (
                  <label key={level} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                    <input type="radio" name="importance_queue_app" value={level} checked={formData.importance_queue_app === level} onChange={handleChange} required
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                    <span className="text-gray-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">13. Apakah perlu notifikasi otomatis ke pelanggan? <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {['Tidak perlu', 'Opsional', 'Perlu'].map((need) => (
                  <label key={need} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                    <input type="radio" name="want_auto_notification" value={need} checked={formData.want_auto_notification === need} onChange={handleChange} required
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                    <span className="text-gray-700">{need}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</span>
              Promosi & Kemitraan
            </h2>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">14. Apakah Anda bersedia ikut promosi kemitraan dengan aplikasi? <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {['Tidak bersedia', 'Mungkin', 'Ya, bersedia'].map((willing) => (
                  <label key={willing} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                    <input type="radio" name="willing_partnership_promo" value={willing} checked={formData.willing_partnership_promo === willing} onChange={handleChange} required
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                    <span className="text-gray-700">{willing}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                15. Fitur promosi mana yang paling penting? (pilih maksimal 2) <span className="text-red-500">*</span>
              </label>
              {formData.important_promo_features.length >= 2 && (
                <p className="text-sm text-blue-600 mb-2">✓ Sudah {formData.important_promo_features.length}/2 terpilih</p>
              )}
              <div className="space-y-2">
                {['Diskon untuk pelanggan baru', 'Cashback untuk pelanggan setia', 'Paket bundling (hemat)', 'Poin reward'].map((feature) => (
                  <label key={feature} className={`flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition ${
                    formData.important_promo_features.length >= 2 && !formData.important_promo_features.includes(feature) ? 'opacity-50' : ''
                  }`}>
                    <input type="checkbox" checked={formData.important_promo_features.includes(feature)}
                      onChange={() => handleCheckboxChange('important_promo_features', feature)}
                      disabled={formData.important_promo_features.length >= 2 && !formData.important_promo_features.includes(feature)}
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded" />
                    <span className="text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">5</span>
              Pendapat & Saran
            </h2>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">16. Tantangan terbesar di bisnis barbershop menurut Anda? <span className="text-red-500">*</span></label>
              <textarea name="biggest_challenge" value={formData.biggest_challenge} onChange={handleChange} required
                rows={4} placeholder="Tulis tantangan terbesar yang Anda hadapi..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">17. Fitur wajib yang harus ada di aplikasi barbershop? <span className="text-red-500">*</span></label>
              <textarea name="must_have_features" value={formData.must_have_features} onChange={handleChange} required
                rows={4} placeholder="Sebutkan fitur-fitur yang menurut Anda wajib ada..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">18. Apakah Anda bersedia mencoba aplikasi Trimly saat diluncurkan? <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {['Tidak bersedia', 'Mungkin', 'Ya, bersedia'].map((willing) => (
                  <label key={willing} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                    <input type="radio" name="willing_try_trimly" value={willing} checked={formData.willing_try_trimly === willing} onChange={handleChange} required
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                    <span className="text-gray-700">{willing}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg
            hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200
            shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
            {isSubmitting ? '⏳ Mengirim...' : '📤 Kirim Kuesioner'}
          </button>

          {submitStatus === 'success' && (
            <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg animate-fade-in">
              <p className="font-semibold">✅ Terima kasih sudah mengisi!</p>
              <p className="text-sm mt-1">Tanggapan Anda sangat berarti untuk pengembangan Trimly. 🙏</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-fade-in">
              <p className="font-semibold">❌ Terjadi kesalahan</p>
              <p className="text-sm mt-1">Mohon coba lagi atau hubungi tim kami jika masalah berlanjut.</p>
            </div>
          )}
        </form>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>📊 Data akan digunakan untuk riset pengembangan Trimly</p>
          <p className="mt-2">💡 <span className="font-semibold text-blue-600">Trimly</span> - Aplikasi booking barbershop yang bantu bisnis Anda tumbuh tanpa biaya bulanan</p>
        </div>
      </div>
    </div>
  );
}
