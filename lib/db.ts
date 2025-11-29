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

// Insert customer response
export async function insertCustomerResponse(data: any) {
  const sql = `
    INSERT INTO customer_responses 
    (name, age, gender, domicile, frequency, price, problems, interest, 
     features, booking_fee, payment_method, channel, review_importance, suggestions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  // Map frontend field names to database columns
  const params = [
    'Anonymous', // Default name since form doesn't collect it
    data.age || null,
    data.gender || null,
    data.domicile || data.domicileOther || null,
    data.haircut_frequency || null,
    data.price_range || null,
    Array.isArray(data.problems) ? data.problems.join(', ') : (data.problems || null),
    data.app_interest || null,
    Array.isArray(data.needed_features) ? data.needed_features.join(', ') : (data.needed_features || null),
    data.booking_fee || null,
    data.payment_method || null,
    data.booking_channel || null,
    data.review_importance || null,
    data.improvement_suggestion || data.favorite_barbershop || null
  ];
  
  console.log('💾 Saving to DB with params:', params);
  
  return await query(sql, params);
}

// Get all barber responses
export async function getBarberResponses() {
  const sql = 'SELECT * FROM barber_responses ORDER BY timestamp DESC';
  return await query(sql);
}

// Insert barber response
export async function insertBarberResponse(data: any) {
  const sql = `
    INSERT INTO barber_responses 
    (business_name, location, years_operating, number_of_barbers, customer_methods, 
     challenges, customer_source, app_interest, commission_agreement, commission_rate, 
     partnership, features, notification, payment_methods, suggestions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const params = [
    data.businessName || null,
    data.location || null,
    data.yearsOperating || null,
    data.numberOfBarbers || null,
    Array.isArray(data.customerMethods) ? data.customerMethods.join(', ') : (data.customerMethods || null),
    Array.isArray(data.challenges) ? data.challenges.join(', ') : (data.challenges || null),
    data.customerSource || null,
    data.appInterest || null,
    data.commissionAgreement || null,
    data.commissionRate || null,
    data.partnership || null,
    Array.isArray(data.features) ? data.features.join(', ') : (data.features || null),
    data.notification || null,
    Array.isArray(data.paymentMethods) ? data.paymentMethods.join(', ') : (data.paymentMethods || null),
    data.suggestions || null
  ];
  
  return await query(sql, params);
}

// Verify admin credentials
export async function verifyAdmin(username: string, password: string) {
  const sql = 'SELECT * FROM admin_users WHERE username = ? AND password = ?';
  const results: any = await query(sql, [username, password]);
  return results.length > 0;
}

export default pool;
