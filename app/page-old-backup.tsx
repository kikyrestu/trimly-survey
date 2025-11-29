'use client';

import { useState } from 'react';
import { Scissors } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    // Bagian 1
    age: '',
    gender: '',
    domicile: '',
    domicileOther: '',
    
    // Bagian 2
    haircut_frequency: '',
    price_range: '',
    
    // Bagian 3
    problems: [] as string[],
    review_importance: '',
    
    // Bagian 4
    app_interest: '',
    needed_features: [] as string[],
    booking_fee: '',
    payment_method: '',
    willing_to_review: '',
    
    // Bagian 5
    barber_selection_importance: '',
    booking_channel: '',
    
    // Pertanyaan Terbuka
    improvement_suggestion: '',
    favorite_barbershop: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const response = await fetch('/api/submit-with-storage', {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Terima Kasih! 🎉</h2>
          <p className="text-gray-600 mb-6">
            Jawaban Anda telah berhasil disimpan. Kontribusi Anda sangat membantu pengembangan Trimly!
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                age: '', gender: '', domicile: '', domicileOther: '',
                haircut_frequency: '', price_range: '',
                problems: [], review_importance: '',
                app_interest: '', needed_features: [], booking_fee: '',
                payment_method: '', willing_to_review: '',
                barber_selection_importance: '', booking_channel: '',
                improvement_suggestion: '', favorite_barbershop: '',
              });
            }}
            className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition"
          >
            Isi Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 text-center border-t-8 border-orange-500">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-500 p-4 rounded-full">
              <Scissors className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Survey Kebutuhan Aplikasi Booking Barbershop – Trimly
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Survei ini bertujuan untuk memahami kebiasaan dan kebutuhan pelanggan barbershop/salon pria 
            di Banyuwangi & sekitarnya. Semua jawaban bersifat anonim dan hanya digunakan untuk keperluan 
            riset startup Trimly. Terima kasih sudah membantu! 💈
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Bagian 1 - Data Responden */}
          <section className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-orange-500">
              Bagian 1 — Data Responden
            </h2>

            {/* Usia */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                1. Usia Anda berapa? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['13–16 tahun', '17–24 tahun', '25–35 tahun', '> 35 tahun'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="age"
                      value={option}
                      checked={formData.age === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Jenis Kelamin */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                2. Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['Laki-laki', 'Perempuan', 'Lainnya'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={formData.gender === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Domisili */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                3. Domisili <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['Banyuwangi', 'Bali', 'Surabaya', 'Malang'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="domicile"
                      value={option}
                      checked={formData.domicile === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition cursor-pointer">
                  <input
                    type="radio"
                    name="domicile"
                    value="Lainnya"
                    checked={formData.domicile === 'Lainnya'}
                    onChange={handleChange}
                    required
                    className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="ml-3 text-gray-700">Kota lain:</span>
                  <input
                    type="text"
                    name="domicileOther"
                    value={formData.domicileOther}
                    onChange={handleChange}
                    placeholder="Sebutkan kota"
                    className="ml-3 flex-1 border-b-2 border-gray-300 focus:border-orange-500 outline-none px-2 py-1"
                    disabled={formData.domicile !== 'Lainnya'}
                  />
                </label>
              </div>
            </div>
          </section>

          {/* Bagian 2 - Kebiasaan Grooming */}
          <section className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-orange-500">
              Bagian 2 — Kebiasaan Grooming
            </h2>

            {/* Frekuensi Potong Rambut */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                4. Seberapa sering Anda potong rambut? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['1x per bulan', '2x per bulan', '> 2x per bulan', 'Jarang / Tidak tentu'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="haircut_frequency"
                      value={option}
                      checked={formData.haircut_frequency === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Harga */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                5. Berapa biasanya Anda membayar jasa potong rambut? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['< Rp 20.000', 'Rp 20.000 – 40.000', 'Rp 40.000 – 60.000', 'Rp 60.000 – 100.000', '> Rp 100.000'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="price_range"
                      value={option}
                      checked={formData.price_range === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Bagian 3 - Permasalahan */}
          <section className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-orange-500">
              Bagian 3 — Permasalahan yang Dialami
            </h2>

            {/* Masalah */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                6. Apa masalah yang sering Anda hadapi saat ke barbershop? <span className="text-red-500">*</span>
                <span className="block text-sm font-normal text-gray-500 mt-1">(pilih semua yang sesuai)</span>
              </label>
              <div className="space-y-3">
                {[
                  'Harus antri lama',
                  'Sudah datang tapi barber penuh',
                  'Susah nyari barber yang cocok',
                  'Harga tidak jelas',
                  'Hasil potong tidak sesuai ekspektasi',
                  'Tidak bisa booking duluan',
                  'Tidak ada info review salon/barber',
                  'Tidak ada masalah berarti'
                ].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.problems.includes(option)}
                      onChange={() => handleCheckboxChange('problems', option)}
                      className="w-5 h-5 text-orange-500 focus:ring-orange-500 rounded"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Review Importance */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                7. Seberapa penting bagi Anda untuk bisa lihat review dan rating barbershop sebelum datang? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['Sangat penting', 'Cukup penting', 'Tidak terlalu penting', 'Tidak penting sama sekali'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="review_importance"
                      value={option}
                      checked={formData.review_importance === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Bagian 4 - Potensi Penggunaan Aplikasi */}
          <section className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-orange-500">
              Bagian 4 — Potensi Penggunaan Aplikasi
            </h2>

            {/* App Interest */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                8. Jika ada aplikasi yang bisa booking barbershop tanpa antre, apakah Anda tertarik menggunakannya? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['Sangat tertarik', 'Tertarik', 'Ragu-ragu', 'Tidak tertarik'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="app_interest"
                      value={option}
                      checked={formData.app_interest === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Needed Features */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                9. Fitur apa yang paling Anda butuhkan? <span className="text-red-500">*</span>
                <span className="block text-sm font-normal text-gray-500 mt-1">(Pilih maksimal 3)</span>
              </label>
              <div className="space-y-3">
                {[
                  'Booking tanpa antre',
                  'Pilih barber sesuai gaya / skill',
                  'Lihat portofolio hasil potong',
                  'Rating & review barber',
                  'Info harga dan layanan lengkap',
                  'Chat konsultasi gaya rambut',
                  'Metode pembayaran non-tunai'
                ].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.needed_features.includes(option)}
                      onChange={() => {
                        if (formData.needed_features.includes(option)) {
                          handleCheckboxChange('needed_features', option);
                        } else if (formData.needed_features.length < 3) {
                          handleCheckboxChange('needed_features', option);
                        }
                      }}
                      className="w-5 h-5 text-orange-500 focus:ring-orange-500 rounded"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Terpilih: {formData.needed_features.length}/3
              </p>
            </div>

            {/* Booking Fee */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                10. Berapa besar Anda bersedia membayar biaya booking? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['Tidak mau ada biaya booking', '< Rp 3.000', 'Rp 3.000 – 5.000', '> Rp 5.000', 'Tergantung layanan'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="booking_fee"
                      value={option}
                      checked={formData.booking_fee === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                11. Apakah Anda lebih suka: <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['Bayar langsung ke barber', 'Bayar lewat aplikasi', 'Bebas, mana aja'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value={option}
                      checked={formData.payment_method === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Willing to Review */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                12. Apakah Anda bersedia memberikan rating & review setelah layanan? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['Ya', 'Mungkin', 'Tidak'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="willing_to_review"
                      value={option}
                      checked={formData.willing_to_review === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Bagian 5 - Profil Digital Barber */}
          <section className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-orange-500">
              Bagian 5 — Profil Digital Barber
            </h2>

            {/* Barber Selection Importance */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                13. Pentingkah bisa memilih barber tertentu berdasarkan gaya yang Anda suka? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['Sangat penting', 'Penting', 'Biasa saja', 'Tidak penting'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="barber_selection_importance"
                      value={option}
                      checked={formData.barber_selection_importance === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Booking Channel */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                14. Anda lebih nyaman booking melalui: <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {['Aplikasi Mobile', 'WhatsApp', 'Instagram', 'Website', 'Lainnya'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition cursor-pointer">
                    <input
                      type="radio"
                      name="booking_channel"
                      value={option}
                      checked={formData.booking_channel === option}
                      onChange={handleChange}
                      required
                      className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Pertanyaan Terbuka */}
          <section className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-orange-500">
              Pertanyaan Terbuka
            </h2>

            {/* Improvement Suggestion */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                15. Menurut Anda, apa yang bisa bikin pengalaman di barbershop lebih baik?
              </label>
              <textarea
                name="improvement_suggestion"
                value={formData.improvement_suggestion}
                onChange={handleChange}
                rows={4}
                placeholder="Tuliskan saran Anda di sini..."
                className="w-full border-2 border-gray-300 rounded-lg p-4 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
              />
            </div>

            {/* Favorite Barbershop */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                16. Sebutkan nama barbershop langganan Anda (opsional)
              </label>
              <input
                type="text"
                name="favorite_barbershop"
                value={formData.favorite_barbershop}
                onChange={handleChange}
                placeholder="Nama barbershop..."
                className="w-full border-2 border-gray-300 rounded-lg p-4 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
              />
            </div>
          </section>

          {/* Submit Button */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xl font-bold py-4 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-[1.02] transition-all shadow-lg"
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
          <p className="text-sm mb-3">
            © 2025 Trimly - Startup Booking Barbershop Banyuwangi
          </p>
          <div className="flex justify-center gap-4 text-xs">
            <a 
              href="/barber" 
              className="text-gray-300 hover:text-white transition inline-flex items-center gap-1"
            >
              💼 Survey untuk Barbershop
            </a>
            <a 
              href="/admin" 
              className="text-gray-400 hover:text-white transition"
            >
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
