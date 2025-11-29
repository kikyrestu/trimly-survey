'use client';

import { useState } from 'react';
import { Scissors } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    // Bagian 1 - Profil
    age: '',
    gender: '',
    domicile: '',
    domicileOther: '',
    haircut_frequency: '',
    
    // Bagian 2 - Kebiasaan Potong Rambut
    barbershop_choice: '',
    important_factors: [] as string[],
    when_full: '',
    
    // Bagian 3 - Pain Awareness
    pain_wa_response: '',
    pain_time_confusion: '',
    pain_still_wait: '',
    pain_queue_overlap: '',
    pain_barber_forget: '',
    pain_unknown_barber: '',
    
    // Bagian 4 - Minat Booking Online
    interest_wait_anywhere: '',
    interest_choose_barber: '',
    interest_queue_time: '',
    interest_notification: '',
    
    // Bagian 5 - Promo & Keuntungan
    promo_types: [] as string[],
    will_download_for_promo: '',
    want_comparison_app: '',
    
    // Bagian 6 - Pendapat
    wa_booking_issue: '',
    important_features: '',
    will_try_trimly: '',
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
        // Remove if already selected
        return { ...prev, [name]: currentValues.filter(v => v !== value) };
      } else {
        // Add if not at max
        if (maxSelect && currentValues.length >= maxSelect) {
          return prev; // Don't add if max reached
        }
        return { ...prev, [name]: [...currentValues, value] };
      }
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
            Dukungan Anda membantu kami mengembangkan solusi yang lebih baik untuk pelanggan barbershop di Indonesia 💈🚀
          </p>
          <div className="flex gap-4">
            <a
              href="/barber"
              className="flex-1 bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition"
            >
              Survey Barbershop
            </a>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition"
            >
              Survey Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8 px-4 shadow-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <Scissors className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Survey Kebutuhan Pelanggan Barbershop</h1>
          <p className="text-orange-100 text-lg">
            Survei ini digunakan untuk riset kuliah mengenai kebiasaan pelanggan saat potong rambut dan minat terhadap aplikasi booking barbershop. Semua jawaban akan dijaga kerahasiaannya. Terima kasih telah membantu riset kami! 🙌
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* BAGIAN 1: PROFIL */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-4 border-orange-500 pb-3">
              Bagian 1 – Profil
            </h2>

            {/* 1. Usia */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                1. Usia Anda <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {['< 17 tahun', '17–21 tahun', '22–30 tahun', '> 30 tahun'].map((option) => (
                  <label key={option} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 cursor-pointer transition">
                    <input
                      type="radio"
                      name="age"
                      value={option}
                      checked={formData.age === option}
                      onChange={handleChange}
                      className="w-5 h-5 text-orange-500"
                      required
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Jenis Kelamin */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                2. Jenis kelamin <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {['Laki-laki', 'Perempuan', 'Lainnya'].map((option) => (
                  <label key={option} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 cursor-pointer transition">
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={formData.gender === option}
                      onChange={handleChange}
                      className="w-5 h-5 text-orange-500"
                      required
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Domisili */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                3. Berdomisili di: <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {['Banyuwangi', 'Bali', 'Surabaya', 'Malang', 'Kota lain'].map((option) => (
                  <label key={option} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 cursor-pointer transition">
                    <input
                      type="radio"
                      name="domicile"
                      value={option}
                      checked={formData.domicile === option}
                      onChange={handleChange}
                      className="w-5 h-5 text-orange-500"
                      required
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              {formData.domicile === 'Kota lain' && (
                <input
                  type="text"
                  name="domicileOther"
                  value={formData.domicileOther}
                  onChange={handleChange}
                  placeholder="Sebutkan kota Anda"
                  className="mt-3 w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                  required
                />
              )}
            </div>

            {/* 4. Frekuensi */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                4. Seberapa sering Anda potong rambut dalam sebulan? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {['1 kali', '2 kali', '> 2 kali', 'Tidak tentu'].map((option) => (
                  <label key={option} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 cursor-pointer transition">
                    <input
                      type="radio"
                      name="haircut_frequency"
                      value={option}
                      checked={formData.haircut_frequency === option}
                      onChange={handleChange}
                      className="w-5 h-5 text-orange-500"
                      required
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* BAGIAN 2: KEBIASAAN POTONG RAMBUT */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-4 border-orange-500 pb-3">
              Bagian 2 – Kebiasaan Potong Rambut
            </h2>

            {/* 5. Biasanya potong rambut di */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                5. Biasanya Anda potong rambut di: <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {[
                  'Barbershop tertentu (langganan)',
                  'Terserah / random yang terdekat',
                  'Ikut rekomendasi teman',
                  'Lainnya'
                ].map((option) => (
                  <label key={option} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 cursor-pointer transition">
                    <input
                      type="radio"
                      name="barbershop_choice"
                      value={option}
                      checked={formData.barbershop_choice === option}
                      onChange={handleChange}
                      className="w-5 h-5 text-orange-500"
                      required
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 6. Yang paling penting */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                6. Apa yang paling penting saat memilih barbershop? (maks 3) <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-3">Pilih maksimal 3 opsi</p>
              <div className="space-y-2">
                {[
                  'Kualitas hasil potong',
                  'Harga',
                  'Dekat rumah',
                  'Barber favorit',
                  'Review bagus',
                  'Waktu menunggu tidak lama',
                  'Promo / diskon'
                ].map((option) => (
                  <label key={option} className={`flex items-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 cursor-pointer transition ${
                    formData.important_factors.length >= 3 && !formData.important_factors.includes(option) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.important_factors.includes(option)}
                      onChange={() => handleCheckboxChange('important_factors', option, 3)}
                      className="w-5 h-5 text-orange-500"
                      disabled={formData.important_factors.length >= 3 && !formData.important_factors.includes(option)}
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 7. Kalau kondisi penuh */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                7. Kalau kondisi barbershop penuh, Anda biasanya: <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {[
                  'Tetap menunggu di tempat',
                  'Cari barbershop lain',
                  'Tidak jadi potong hari itu',
                  'Lainnya'
                ].map((option) => (
                  <label key={option} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 cursor-pointer transition">
                    <input
                      type="radio"
                      name="when_full"
                      value={option}
                      checked={formData.when_full === option}
                      onChange={handleChange}
                      className="w-5 h-5 text-orange-500"
                      required
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* BAGIAN 3: PAIN AWARENESS */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-4 border-orange-500 pb-3">
              Bagian 3 – Pain Awareness (Masalah yang sering terjadi)
            </h2>
            <p className="text-gray-600 mb-6">
              8. Seberapa sering Anda mengalami hal berikut saat booking / walk-in?<br/>
              <span className="text-sm">(1 = Tidak pernah, 5 = Sering banget)</span>
            </p>

            {[
              { name: 'pain_wa_response', label: 'Chat WA lama dibalas' },
              { name: 'pain_time_confusion', label: 'Salah paham jam kedatangan' },
              { name: 'pain_still_wait', label: 'Tetap menunggu lama di tempat' },
              { name: 'pain_queue_overlap', label: 'Antrean tabrakan sama pelanggan lain' },
              { name: 'pain_barber_forget', label: 'Barber lupa kalau Anda sudah booking' },
              { name: 'pain_unknown_barber', label: 'Tidak tau barber mana yang akan melayani' }
            ].map((pain) => (
              <div key={pain.name} className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">
                  {pain.label} <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 justify-between">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <label key={rating} className="flex-1 text-center">
                      <input
                        type="radio"
                        name={pain.name}
                        value={rating}
                        checked={formData[pain.name as keyof typeof formData] === String(rating)}
                        onChange={handleChange}
                        className="hidden peer"
                        required
                      />
                      <div className="p-3 border-2 border-gray-300 rounded-lg cursor-pointer peer-checked:border-orange-500 peer-checked:bg-orange-500 peer-checked:text-white hover:border-orange-300 transition">
                        {rating}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* BAGIAN 4: MINAT BOOKING ONLINE */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-4 border-orange-500 pb-3">
              Bagian 4 – Minat Terhadap Booking Online
            </h2>

            {/* 9. Nunggu dari mana saja */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                9. Kalau bisa nunggu dari mana saja sampai giliran tiba, apakah Anda mau booking online? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {['Ya banget', 'Ya', 'Mungkin', 'Tidak'].map((option) => (
                  <label key={option} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 cursor-pointer transition">
                    <input
                      type="radio"
                      name="interest_wait_anywhere"
                      value={option}
                      checked={formData.interest_wait_anywhere === option}
                      onChange={handleChange}
                      className="w-5 h-5 text-orange-500"
                      required
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 10. Pilih barber favorit */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                10. Seberapa tertarik Anda memilih barber favorit sebelum datang? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {['Sangat tertarik', 'Tertarik', 'Biasa saja', 'Tidak tertarik'].map((option) => (
                  <label key={option} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 cursor-pointer transition">
                    <input
                      type="radio"
                      name="interest_choose_barber"
                      value={option}
                      checked={formData.interest_choose_barber === option}
                      onChange={handleChange}
                      className="w-5 h-5 text-orange-500"
                      required
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 11. Lihat perkiraan waktu */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                11. Kalau aplikasi bisa lihat perkiraan waktu antrean, apakah Anda mau mencoba? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {['Iya', 'Mungkin', 'Tidak yakin', 'Tidak'].map((option) => (
                  <label key={option} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 cursor-pointer transition">
                    <input
                      type="radio"
                      name="interest_queue_time"
                      value={option}
                      checked={formData.interest_queue_time === option}
                      onChange={handleChange}
                      className="w-5 h-5 text-orange-500"
                      required
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 12. Notifikasi */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                12. Apakah Anda mau dapat notifikasi saat hampir giliran? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {['Sangat mau', 'Mau', 'Biasa saja', 'Tidak perlu'].map((option) => (
                  <label key={option} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 cursor-pointer transition">
                    <input
                      type="radio"
                      name="interest_notification"
                      value={option}
                      checked={formData.interest_notification === option}
                      onChange={handleChange}
                      className="w-5 h-5 text-orange-500"
                      required
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* BAGIAN 5: PROMO & KEUNTUNGAN */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-4 border-orange-500 pb-3">
              Bagian 5 – Promo & Keuntungan
            </h2>

            {/* 13. Promo yang menarik */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                13. Promo apa yang bikin Anda mau coba barbershop baru? (maks 2) <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-3">Pilih maksimal 2 opsi</p>
              <div className="space-y-2">
                {[
                  'Diskon pelanggan pertama',
                  'Cashback',
                  'Point untuk potong berikutnya',
                  'Bonus hair tonic / styling',
                  'Promo barber kekinian'
                ].map((option) => (
                  <label key={option} className={`flex items-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 cursor-pointer transition ${
                    formData.promo_types.length >= 2 && !formData.promo_types.includes(option) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.promo_types.includes(option)}
                      onChange={() => handleCheckboxChange('promo_types', option, 2)}
                      className="w-5 h-5 text-orange-500"
                      disabled={formData.promo_types.length >= 2 && !formData.promo_types.includes(option)}
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 14. Download app untuk promo */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                14. Kalau ada promo eksklusif hanya di aplikasi, apakah Anda akan download aplikasinya? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {['Iya', 'Mungkin', 'Tidak'].map((option) => (
                  <label key={option} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 cursor-pointer transition">
                    <input
                      type="radio"
                      name="will_download_for_promo"
                      value={option}
                      checked={formData.will_download_for_promo === option}
                      onChange={handleChange}
                      className="w-5 h-5 text-orange-500"
                      required
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 15. App bandingkan rating */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                15. Apakah Anda mau aplikasi yang bisa bandingkan rating & harga barbershop? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {['Ya', 'Mungkin', 'Tidak'].map((option) => (
                  <label key={option} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 cursor-pointer transition">
                    <input
                      type="radio"
                      name="want_comparison_app"
                      value={option}
                      checked={formData.want_comparison_app === option}
                      onChange={handleChange}
                      className="w-5 h-5 text-orange-500"
                      required
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* BAGIAN 6: PENDAPAT */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-4 border-orange-500 pb-3">
              Bagian 6 – Pendapat
            </h2>

            {/* 16. WA kurang nyaman */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                16. Menurut Anda, apa yang bikin booking via WA kurang nyaman? <span className="text-red-500">*</span>
              </label>
              <textarea
                name="wa_booking_issue"
                value={formData.wa_booking_issue}
                onChange={handleChange}
                rows={4}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                placeholder="Tulis pengalaman atau keluhan Anda..."
                required
              />
            </div>

            {/* 17. Fitur penting */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                17. Apa fitur penting yang harus ada di aplikasi booking barbershop? <span className="text-red-500">*</span>
              </label>
              <textarea
                name="important_features"
                value={formData.important_features}
                onChange={handleChange}
                rows={4}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                placeholder="Sebutkan fitur-fitur yang Anda butuhkan..."
                required
              />
            </div>

            {/* 18. Bersedia coba Trimly */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                18. Apakah Anda bersedia mencoba aplikasi Trimly jika nanti tersedia? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {['Ya, ingin coba', 'Mungkin, lihat dulu', 'Tidak tertarik'].map((option) => (
                  <label key={option} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 cursor-pointer transition">
                    <input
                      type="radio"
                      name="will_try_trimly"
                      value={option}
                      checked={formData.will_try_trimly === option}
                      onChange={handleChange}
                      className="w-5 h-5 text-orange-500"
                      required
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-12 rounded-full text-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all shadow-2xl"
            >
              Kirim Jawaban 🚀
            </button>
          </div>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 text-center">
          <a
            href="/barber"
            className="inline-block bg-blue-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-600 transition"
          >
            💼 Survey untuk Pemilik Barbershop
          </a>
        </div>
      </div>
    </div>
  );
}
