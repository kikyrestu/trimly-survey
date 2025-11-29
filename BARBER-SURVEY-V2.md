# Barber Survey V2 - Complete Redesign

## 🎯 What Changed

**Old Survey**: 15 questions focusing on commission/fees (made barbers feel "anjir dipalakin?")  
**New Survey**: 18 questions focusing on VALUE - help grow business, no monthly fees, revenue sharing only

## 🔥 New Value Proposition

- ✅ **Tambah pelanggan** - fokus growth
- ✅ **Bantu marketing** - promosi rutin  
- ✅ **Antrian lebih teratur** - booking digital
- ✅ **TANPA biaya pendaftaran / bulanan** - THIS IS KEY!
- ✅ **Bagi hasil** baru setelah pelanggan tambahan datang

## 📊 New Field Structure (18 Questions)

### Bagian 1: Profil Usaha (5Q)
```typescript
business_name: string         // Optional
location: string              // Required: Banyuwangi/Bali/Surabaya/Malang/Lainnya
locationOther?: string        // If "Lainnya" selected
years_operating: string       // < 1 tahun | 1–3 tahun | 3–5 tahun | > 5 tahun
number_of_barbers: string     // 1 orang | 2 orang | 3 orang | > 3 orang
customers_per_day: string     // NEW! < 10 | 10–20 | 21–40 | > 40
```

### Bagian 2: Sistem Operasional & Masalah Umum (3Q)
```typescript
customer_arrival_method: string[]  // Multiple: Walk-in | WhatsApp | Manual | App
common_problems: string[]          // Multiple: Penumpukan | Bentrok | Batal | dll
customer_source: string            // Pelanggan tetap | Walk-in | Sosmed | Rekomendasi | Lainnya
customerSourceOther?: string       // If "Lainnya" selected
```

### Bagian 3: Solusi Booking Digital (5Q)
```typescript
interest_no_monthly_fee: string      // NEW! Sangat tertarik | Tertarik | Ragu | Tidak tertarik
importance_schedule: string          // Sangat penting | Penting | Biasa saja | Tidak penting
importance_wait_anywhere: string     // Sangat penting | Penting | Kurang penting | Tidak penting
importance_queue_app: string         // Sangat membantu | Membantu | Kurang membantu | Tidak perlu
want_auto_notification: string       // Ya | Mungkin | Tidak
```

### Bagian 4: Promosi & Pertumbuhan Usaha (2Q)
```typescript
willing_partnership_promo: string      // Ya | Mungkin | Tidak
important_promo_features: string[]     // Max 2: Search ranking | Review | Profile | Promo | Stats
```

### Bagian 5: Pendapat Usaha (3Q)
```typescript
biggest_challenge: string           // Textarea - tantangan terbesar
must_have_features: string          // Textarea - fitur yang harus ada
willing_try_trimly: string          // Ya, siap mencoba | Mungkin, perlu lihat dulu | Tidak tertarik
```

## 🛠️ Backend Status

### ✅ Completed
1. **Database Schema**: `database/schema-v2-barber.sql`
   - New table structure with 20 fields
   - Indexes on key columns
   - Proper TEXT fields for arrays

2. **Database Function**: `lib/db.ts` → `insertBarberResponse()`
   - Updated to handle all new fields
   - Array handling for checkboxes
   - Optional field support

3. **Backup**: `app/barber/page-old-backup.tsx`
   - Old survey saved as backup

### ⏳ Pending
1. **Frontend**: `app/barber/page.tsx` needs complete rewrite
   - Replace with 18-question structure
   - Add max selection for promo features (2 max)
   - Update form state handling
   - Match new field names

## 📝 Manual Update Instructions

### Option 1: Complete File Replacement

Create new `app/barber/page.tsx` with this structure:

```tsx
'use client';

import { useState } from 'react';
import { Briefcase, Scissors } from 'lucide-react';

export default function BarberSurvey() {
  const [formData, setFormData] = useState({
    // Copy exact field structure from "New Field Structure" section above
  });

  // ... rest of component
}
```

### Option 2: Use Google Form First (Recommended for Testing)

While working on web version, you can use the Google Form version:

**Copy this to Google Forms**:
```
Title: Survey Kebutuhan Barbershop terhadap Layanan Booking – Trimly

Description:
Formulir ini dibuat untuk riset kuliah mengenai kebutuhan barbershop dalam 
mengatur booking pelanggan dan promosi usaha secara digital. Semua jawaban 
bersifat rahasia dan hanya untuk penelitian akademik. Terima kasih atas 
partisipasi Anda! 🙌

[Then add all 18 questions matching the structure above]
```

## 🚀 Migration Steps

1. **Backup Current Data** (if any):
```sql
CREATE TABLE barber_responses_old AS SELECT * FROM barber_responses;
```

2. **Run Migration**:
```sql
source database/schema-v2-barber.sql
```

3. **Test Backend**:
```bash
# From project root
npm run dev

# Test API endpoint
curl -X POST http://localhost:3000/api/submit-barber \
  -H "Content-Type: application/json" \
  -d '{"location":"Bali","years_operating":"1–3 tahun",...}'
```

4. **Update Frontend**: Replace `app/barber/page.tsx` with new 18Q version

5. **End-to-End Test**:
   - Fill complete survey
   - Check browser console
   - Verify database insert
   - Check admin dashboard

## 💡 Key Messaging for Barbers

**OLD (felt like cash grab)**:
- "Komisi berapa?"
- "Ada biaya pendaftaran?"
- "Bayar per transaksi?"

**NEW (value-focused)** 🔥:
- "Bantu dapat pelanggan baru"
- "TANPA biaya pendaftaran/bulanan"
- "Bagi hasil HANYA dari pelanggan tambahan"
- "Jadwal lebih rapi, promosi lebih gampang"

This removes the "anjir dipalakin" feeling! 😎

## 📌 Pitching Points for Presentation

> "Trimly mengurangi risiko mitra → tidak ada biaya bulanan.  
> Mitra hanya berbagi kesuksesan ketika pelanggan tambahan benar-benar datang."

**For Q&A**:
- Q: "Kenapa barber mau pakai?"  
  A: "Zero upfront cost, revenue sharing model, help grow their business"
  
- Q: "Revenue model?"  
  A: "Commission from NEW customers only, not existing base"
  
- Q: "Market validation?"  
  A: "Survey shows barbers main problems: customer acquisition + scheduling chaos"

## 🎁 Next Steps

1. ✅ **Database ready** - schema + backend function done
2. ⏳ **Frontend update** - need to replace `app/barber/page.tsx`
3. ⏳ **Test submission flow**
4. ⏳ **Update admin dashboard** for new analytics
5. ⏳ **Collect real responses** from barbershops
6. ⏳ **Data analysis** - pain points, willingness to try, promo preferences

**Want help with**:
- Creating the complete new `page.tsx` file
- Setting up Google Form version  
- Analyzing survey responses
- Creating graphs for presentation

Just say: "Gas bikin barber page-nya!" or "Buatin Google Form version!"
