import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

async function migrateToV2() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
    multipleStatements: true
  });

  try {
    console.log('🔄 Starting barber_responses V2 migration...\n');
    
    // Read SQL file
    const sql = fs.readFileSync('database/schema-v2-barber.sql', 'utf8');
    
    // Execute migration
    await connection.query(sql);
    
    console.log('✅ Migration completed successfully!');
    
    // Verify new structure
    const [columns]: any = await connection.query('DESCRIBE barber_responses');
    console.log('\n📋 New table structure:');
    columns.forEach((col: any) => {
      console.log(`  - ${col.Field.padEnd(30)} ${col.Type}`);
    });
    
    const fieldNames = columns.map((col: any) => col.Field);
    
    // Verify V2 fields exist
    const v2Fields = ['customers_per_day', 'interest_no_monthly_fee', 'willing_try_trimly'];
    console.log('\n✅ V2 Key Fields:');
    v2Fields.forEach(field => {
      console.log(`  ${fieldNames.includes(field) ? '✅' : '❌'} ${field}`);
    });
    
    // Check old fields removed
    const oldFields = ['commission_agreement', 'commission_rate'];
    console.log('\n✅ OLD Fields Removed:');
    oldFields.forEach(field => {
      console.log(`  ${fieldNames.includes(field) ? '❌ STILL EXISTS' : '✅ Removed'} ${field}`);
    });
    
    console.log('\n🎉 Database is now V2 ready! You can submit barber surveys.');
    
  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await connection.end();
  }
}

migrateToV2();
