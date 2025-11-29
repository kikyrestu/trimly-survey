# Migration Guide: Customer Survey V2

## What Changed
- **Old Survey**: 16 questions, basic structure
- **New Survey**: 18 questions, research-focused with pain awareness scales

## Database Migration Steps

### Option 1: Fresh Start (Recommended for Development)
Run this in your MySQL console or MySQL Workbench connected to Aiven:

```sql
source database/schema-v2.sql
```

### Option 2: Backup Then Migrate (Recommended for Production)
1. Backup existing data:
```sql
CREATE TABLE customer_responses_backup AS SELECT * FROM customer_responses;
```

2. Run migration:
```sql
source database/schema-v2.sql
```

### Option 3: Manual via MySQL CLI
```bash
# Connect to Aiven MySQL
mysql -h mysql-2e2f3022-trimlyindomaret-b74e.l.aivencloud.com -P 26428 -u avnadmin -p defaultdb

# Then paste the contents of schema-v2.sql
```

## New Fields Structure

### Bagian 1: Profil
- `age` - Usia range
- `gender` - Laki-laki/Perempuan/Lainnya
- `domicile` - Domisili utama
- `domicile_other` - Domisili lainnya (jika pilih lainnya)
- `haircut_frequency` - Frekuensi potong rambut

### Bagian 2: Kebiasaan
- `barbershop_choice` - Barbershop pilihan utama
- `important_factors` - Faktor penting (max 3, comma-separated)
- `when_full` - Perilaku saat barbershop penuh

### Bagian 3: Pain Awareness (Skala 1-5)
- `pain_wa_response` - Sering tidak dibalas via WA
- `pain_time_confusion` - Bingung kapan buka/tutup
- `pain_still_wait` - Tetap mengantri meski sudah booking
- `pain_queue_overlap` - Antrian bertabrakan
- `pain_barber_forget` - Tukang cukur lupa bookingnya
- `pain_unknown_barber` - Tidak tahu tukang cukur yang tersedia

### Bagian 4: Minat Booking Online
- `interest_wait_anywhere` - Minat tunggu dari mana saja
- `interest_choose_barber` - Minat pilih tukang cukur
- `interest_queue_time` - Minat lihat estimasi antrian
- `interest_notification` - Minat notifikasi

### Bagian 5: Promo & Keuntungan
- `promo_types` - Jenis promo menarik (max 2, comma-separated)
- `will_download_for_promo` - Mau download karena promo
- `want_comparison_app` - Mau aplikasi perbandingan

### Bagian 6: Pendapat
- `wa_booking_issue` - Masalah booking via WA
- `important_features` - Fitur penting yang diharapkan
- `will_try_trimly` - Mau coba Trimly

## Files Updated
1. ✅ `/app/page.tsx` - New customer survey form
2. ✅ `/lib/db.ts` - Updated insertCustomerResponse() function
3. ✅ `/database/schema-v2.sql` - New database schema
4. ⏳ `/app/admin/dashboard/page.tsx` - Needs update for new analytics

## Next Steps
1. Run database migration (schema-v2.sql)
2. Test submission flow
3. Update admin dashboard to show new analytics
4. Deploy to Vercel

## Testing Checklist
- [ ] Submit new customer survey
- [ ] Check database has correct data
- [ ] Verify all 18 questions are saved
- [ ] Test pain awareness scales (1-5)
- [ ] Test max selection limits (factors: 3, promos: 2)
- [ ] View in admin dashboard
