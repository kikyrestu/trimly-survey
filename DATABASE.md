# 🗄️ MySQL Database Integration Guide

## Database Connection Details

**Provider:** Aiven Cloud MySQL  
**Configuration:** Set in `.env.local` file (see `.env.example` for template)

Required environment variables:
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name  

## Database Schema

### 1. `customer_responses` Table
Stores responses from the customer survey (main survey at `/`).

```sql
CREATE TABLE customer_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age VARCHAR(50) NOT NULL,
    gender VARCHAR(50) NOT NULL,
    domicile VARCHAR(255) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    price VARCHAR(100) NOT NULL,
    problems TEXT NOT NULL,
    interest VARCHAR(100) NOT NULL,
    features TEXT NOT NULL,
    booking_fee VARCHAR(100) NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    channel VARCHAR(100) NOT NULL,
    review_importance VARCHAR(100) NOT NULL,
    suggestions TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:** timestamp, domicile, age, gender

### 2. `barber_responses` Table
Stores responses from the barbershop/salon business owner survey at `/barber`.

```sql
CREATE TABLE barber_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    years_operating VARCHAR(100) NOT NULL,
    number_of_barbers VARCHAR(100) NOT NULL,
    customer_methods TEXT NOT NULL,
    challenges TEXT NOT NULL,
    customer_source VARCHAR(255) NOT NULL,
    app_interest VARCHAR(100) NOT NULL,
    commission_agreement VARCHAR(100) NOT NULL,
    commission_rate VARCHAR(50) NOT NULL,
    partnership VARCHAR(100) NOT NULL,
    features TEXT NOT NULL,
    notification VARCHAR(255) NOT NULL,
    payment_methods TEXT NOT NULL,
    suggestions TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:** timestamp, location, years_operating, commission_rate

### 3. `admin_users` Table
Stores admin user credentials for dashboard access.

```sql
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Default Admin:**
- Username: `admin`
- Password: `trimly2025`

## Setup Instructions

### 1. Install Dependencies
```bash
npm install mysql2
```

### 2. Initialize Database
Run the setup script to create all tables:
```bash
node scripts/setup-database.js
```

Expected output:
```
✅ Connected successfully!
✅ customer_responses table created
✅ barber_responses table created
✅ admin_users table created
✅ Default admin user created
🎉 Database setup completed successfully!
```

### 3. Test Connection
The database connection is automatically established when the Next.js app starts. Check the console for connection status.

## API Endpoints

### Customer Survey

**POST /api/submit-with-storage**
- Saves customer survey responses to MySQL
- Validates and stores all 16 survey questions
- Returns success status

**GET /api/submit-with-storage**
- Fetches all customer survey responses
- Returns transformed data matching frontend format
- Used by admin dashboard

### Barber Survey

**POST /api/submit-barber**
- Saves barbershop/salon survey responses to MySQL
- Stores commission preferences and business info
- Returns success status

**GET /api/submit-barber**
- Fetches all barber survey responses
- Returns transformed data
- Used by admin dashboard

## Database Utility Functions

Located in `/lib/db.ts`:

### Connection Management
```typescript
import { testConnection, query } from '@/lib/db';

// Test database connection
await testConnection();

// Execute raw SQL
await query('SELECT * FROM customer_responses');
```

### Customer Response Functions
```typescript
import { getCustomerResponses, insertCustomerResponse } from '@/lib/db';

// Get all customer responses
const responses = await getCustomerResponses();

// Insert new customer response
await insertCustomerResponse({
  name: "John Doe",
  age: "25-35 tahun",
  gender: "Laki-laki",
  // ... other fields
});
```

### Barber Response Functions
```typescript
import { getBarberResponses, insertBarberResponse } from '@/lib/db';

// Get all barber responses
const responses = await getBarberResponses();

// Insert new barber response
await insertBarberResponse({
  businessName: "Modern Barbershop",
  location: "Banyuwangi",
  // ... other fields
});
```

### Admin Authentication
```typescript
import { verifyAdmin } from '@/lib/db';

// Verify admin credentials
const isValid = await verifyAdmin('admin', 'trimly2025');
```

## Data Migration

If you have existing data in JSON files (`data/responses.json` or `data/barber-responses.json`), you can migrate it to MySQL:

### Create Migration Script
```javascript
// scripts/migrate-to-mysql.js
const fs = require('fs');
const { insertCustomerResponse, insertBarberResponse } = require('../lib/db');

async function migrate() {
  // Migrate customer responses
  const customerData = JSON.parse(fs.readFileSync('data/responses.json'));
  for (const response of customerData) {
    await insertCustomerResponse(response);
  }
  
  // Migrate barber responses
  const barberData = JSON.parse(fs.readFileSync('data/barber-responses.json'));
  for (const response of barberData) {
    await insertBarberResponse(response);
  }
}

migrate();
```

## Troubleshooting

### SSL Certificate Error
If you see `self-signed certificate in certificate chain` error:
- The config already has `rejectUnauthorized: false` in SSL settings
- This allows connection despite self-signed certificates

### Connection Timeout
- Check if your IP is whitelisted in Aiven console
- Verify network connectivity
- Ensure correct host and port

### Query Errors
- Check column names match the schema
- Verify data types are correct
- Look for SQL syntax errors in console

## Dashboard Integration

The admin dashboard at `/admin/dashboard` now:
- ✅ Fetches data from MySQL instead of JSON files
- ✅ Supports both customer and barber survey tabs
- ✅ Real-time data display
- ✅ Automatic data transformation for charts

## Environment Variables (Optional)

## Environment Variables

Create a `.env.local` file in the project root with your database credentials:

```env
# .env.local
DB_HOST=your-database-host
DB_PORT=your-database-port
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
```

The `/lib/db.ts` file is already configured to use these environment variables:
```typescript
const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // ... other configs
};
```

## Backup & Export

### Export Data to JSON
```bash
# Export customer responses
curl http://localhost:3000/api/submit-with-storage > customer-backup.json

# Export barber responses
curl http://localhost:3000/api/submit-barber > barber-backup.json
```

### Direct MySQL Dump
```bash
mysqldump -h mysql-2e2f3022-hashdesignind-d152.g.aivencloud.com \
  -P 26428 -u avnadmin -p defaultdb > trimly-backup.sql
```

## Performance Considerations

1. **Connection Pooling:** Already configured with 10 connections
2. **Indexes:** Applied on frequently queried fields
3. **Batch Operations:** Use transactions for multiple inserts
4. **Caching:** Consider Redis for frequently accessed data

## Security Notes

⚠️ **Important:**
- Current password storage is plain text (for development)
- For production, implement bcrypt password hashing
- Use environment variables for credentials
- Enable SSL certificate validation
- Implement rate limiting on APIs
- Add CORS policies

## Next Steps

- [ ] Implement bcrypt password hashing for admin users
- [ ] Add data export functionality in dashboard
- [ ] Implement backup automation
- [ ] Add data visualization filters by date range
- [ ] Create API rate limiting
- [ ] Add response data validation
- [ ] Implement soft delete for responses

---

**Status:** ✅ MySQL integration complete and tested
**Last Updated:** November 29, 2025
