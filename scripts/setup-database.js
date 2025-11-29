#!/usr/bin/env node

/**
 * Database Setup Script
 * This script initializes the MySQL database with the required tables
 */

require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
};

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected successfully!\n');

    // Create customer_responses table
    console.log('📋 Creating customer_responses table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customer_responses (
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
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_timestamp (timestamp),
        INDEX idx_domicile (domicile),
        INDEX idx_age (age),
        INDEX idx_gender (gender)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ customer_responses table created\n');

    // Create barber_responses table
    console.log('📋 Creating barber_responses table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS barber_responses (
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
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_timestamp (timestamp),
        INDEX idx_location (location),
        INDEX idx_years (years_operating),
        INDEX idx_commission_rate (commission_rate)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ barber_responses table created\n');

    // Create admin_users table
    console.log('📋 Creating admin_users table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_username (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ admin_users table created\n');

    // Insert default admin user
    console.log('👤 Creating default admin user...');
    try {
      await connection.execute(
        'INSERT INTO admin_users (username, password) VALUES (?, ?)',
        ['admin', 'trimly2025']
      );
      console.log('✅ Default admin user created (username: admin, password: trimly2025)\n');
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log('ℹ️  Admin user already exists\n');
      } else {
        throw error;
      }
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📊 Tables created:');
    console.log('  - customer_responses');
    console.log('  - barber_responses');
    console.log('  - admin_users');
    console.log('\n🔐 Admin credentials:');
    console.log('  Username: admin');
    console.log('  Password: trimly2025');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n👋 Database connection closed');
    }
  }
}

// Run setup
setupDatabase();
