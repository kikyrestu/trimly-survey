import mysql from 'mysql2/promise';

// Aiven MySQL Database Configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'defaultdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  ssl: {
    rejectUnauthorized: false
  }
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database Connected Successfully!');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL Connection Error:', error);
    return false;
  }
}

// Execute query
export async function query(sql: string, params?: any[]) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('❌ MySQL Query Error:', error);
    throw error;
  }
}

// Get all customer responses
export async function getCustomerResponses() {
  const sql = 'SELECT * FROM customer_responses ORDER BY timestamp DESC';
  return await query(sql);
}

// Insert customer response (V2 - Redesigned Survey)
export async function insertCustomerResponse(data: any) {
  const sql = `
    INSERT INTO customer_responses 
    (age, gender, domicile, domicile_other, haircut_frequency, 
     barbershop_choice, important_factors, when_full,
     pain_wa_response, pain_time_confusion, pain_still_wait, 
     pain_queue_overlap, pain_barber_forget, pain_unknown_barber,
     interest_wait_anywhere, interest_choose_barber, interest_queue_time, interest_notification,
     promo_types, will_download_for_promo, want_comparison_app,
     wa_booking_issue, important_features, will_try_trimly)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  // Map frontend field names to database columns
  const params = [
    // Bagian 1: Profil
    data.age || null,
    data.gender || null,
    data.domicile || null,
    data.domicileOther || null,
    data.haircut_frequency || null,
    
    // Bagian 2: Kebiasaan
    data.barbershop_choice || null,
    Array.isArray(data.important_factors) ? data.important_factors.join(', ') : (data.important_factors || null),
    data.when_full || null,
    
    // Bagian 3: Pain Awareness (skala 1-5)
    data.pain_wa_response || null,
    data.pain_time_confusion || null,
    data.pain_still_wait || null,
    data.pain_queue_overlap || null,
    data.pain_barber_forget || null,
    data.pain_unknown_barber || null,
    
    // Bagian 4: Minat Booking Online
    data.interest_wait_anywhere || null,
    data.interest_choose_barber || null,
    data.interest_queue_time || null,
    data.interest_notification || null,
    
    // Bagian 5: Promo & Keuntungan
    Array.isArray(data.promo_types) ? data.promo_types.join(', ') : (data.promo_types || null),
    data.will_download_for_promo || null,
    data.want_comparison_app || null,
    
    // Bagian 6: Pendapat
    data.wa_booking_issue || null,
    data.important_features || null,
    data.will_try_trimly || null
  ];
  
  console.log('💾 Saving customer survey V2 to DB with params:', params);
  
  return await query(sql, params);
}

// Get all barber responses
export async function getBarberResponses() {
  const sql = 'SELECT * FROM barber_responses ORDER BY timestamp DESC';
  return await query(sql);
}

// Insert barber response (V2 - Redesigned Survey)
export async function insertBarberResponse(data: any) {
  const sql = `
    INSERT INTO barber_responses 
    (business_name, location, location_other, years_operating, number_of_barbers, customers_per_day,
     customer_arrival_method, common_problems, customer_source, customer_source_other,
     interest_no_monthly_fee, importance_schedule, importance_wait_anywhere, importance_queue_app, want_auto_notification,
     willing_partnership_promo, important_promo_features,
     biggest_challenge, must_have_features, willing_try_trimly)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  // Map frontend field names to database columns
  const params = [
    // Bagian 1: Profil Usaha
    data.business_name || null,
    data.location || null,
    data.locationOther || null,
    data.years_operating || null,
    data.number_of_barbers || null,
    data.customers_per_day || null,
    
    // Bagian 2: Sistem Operasional & Masalah Umum
    Array.isArray(data.customer_arrival_method) ? data.customer_arrival_method.join(', ') : (data.customer_arrival_method || null),
    Array.isArray(data.common_problems) ? data.common_problems.join(', ') : (data.common_problems || null),
    data.customer_source || null,
    data.customerSourceOther || null,
    
    // Bagian 3: Solusi Booking Digital
    data.interest_no_monthly_fee || null,
    data.importance_schedule || null,
    data.importance_wait_anywhere || null,
    data.importance_queue_app || null,
    data.want_auto_notification || null,
    
    // Bagian 4: Promosi & Pertumbuhan Usaha
    data.willing_partnership_promo || null,
    Array.isArray(data.important_promo_features) ? data.important_promo_features.join(', ') : (data.important_promo_features || null),
    
    // Bagian 5: Pendapat Usaha
    data.biggest_challenge || null,
    data.must_have_features || null,
    data.willing_try_trimly || null
  ];
  
  console.log('💾 Saving barber survey V2 to DB with params:', params);
  
  return await query(sql, params);
}

// Verify admin credentials
export async function verifyAdmin(username: string, password: string) {
  const sql = 'SELECT * FROM admin_users WHERE username = ? AND password = ?';
  const results: any = await query(sql, [username, password]);
  return results.length > 0;
}

export default pool;
