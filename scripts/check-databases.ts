import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkDatabases() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 Connected! Checking available databases...\n');
    
    const [databases] = await connection.query('SHOW DATABASES');
    console.log('📊 Available databases:');
    console.log(databases);
    
    // Try to use defaultdb
    try {
      await connection.query('USE defaultdb');
      console.log('\n✅ Successfully selected defaultdb');
      
      const [tables] = await connection.query('SHOW TABLES');
      console.log('\n📋 Tables in defaultdb:');
      console.log(tables);
    } catch (error: any) {
      console.log('\n❌ Cannot use defaultdb:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

checkDatabases();
