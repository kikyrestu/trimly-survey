import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

async function migrateCustomerToV2() {
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
    console.log('🔄 Starting customer_responses V2 migration...\n');
    
    // Read SQL file
    const sql = fs.readFileSync('database/schema-v2.sql', 'utf8');
    
    // Execute migration
    await connection.query(sql);
    
    console.log('✅ Migration completed successfully!');
    
    // Verify new structure
    const [columns]: any = await connection.query('DESCRIBE customer_responses');
    console.log('\n📋 New table structure (showing key fields):');
    const keyFields = ['age', 'important_factors', 'pain_wa_response', 'promo_types', 'will_try_trimly'];
    columns.forEach((col: any) => {
      if (keyFields.includes(col.Field)) {
        console.log(`  ✅ ${col.Field.padEnd(30)} ${col.Type}`);
      }
    });
    
    console.log('\n🎉 customer_responses is now V2 ready!');
    
  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await connection.end();
  }
}

migrateCustomerToV2();
