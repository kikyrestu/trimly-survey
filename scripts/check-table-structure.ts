import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkTableStructure() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 Checking barber_responses table structure...\n');
    
    const [columns]: any = await connection.query('DESCRIBE barber_responses');
    
    console.log('📋 Current columns:');
    columns.forEach((col: any) => {
      console.log(`  - ${col.Field.padEnd(30)} ${col.Type.padEnd(20)} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    const fieldNames = columns.map((col: any) => col.Field);
    
    // Check V2 fields
    const v2Fields = [
      'customers_per_day',
      'interest_no_monthly_fee',
      'importance_schedule',
      'importance_wait_anywhere',
      'importance_queue_app',
      'want_auto_notification',
      'willing_partnership_promo',
      'important_promo_features',
      'biggest_challenge',
      'must_have_features',
      'willing_try_trimly'
    ];
    
    console.log('\n🔍 V2 Fields Check:');
    let allV2Exist = true;
    v2Fields.forEach(field => {
      const exists = fieldNames.includes(field);
      if (!exists) allV2Exist = false;
      console.log(`  ${exists ? '✅' : '❌'} ${field}`);
    });
    
    // Check OLD fields that should NOT exist
    const oldFields = ['commission_agreement', 'commission_rate', 'payment_method', 'payment_methods'];
    console.log('\n🔍 OLD Fields (should NOT exist):');
    let anyOldExist = false;
    oldFields.forEach(field => {
      const exists = fieldNames.includes(field);
      if (exists) anyOldExist = true;
      console.log(`  ${exists ? '❌ STILL EXISTS!' : '✅ Removed'} ${field}`);
    });
    
    if (allV2Exist && !anyOldExist) {
      console.log('\n✅✅✅ Table is V2! Schema is correct!');
    } else {
      console.log('\n❌ Table needs migration to V2!');
      console.log('🛠️  Run: mysql ... < database/schema-v2-barber.sql');
    }
    
    // Count existing responses
    const [countResult]: any = await connection.query('SELECT COUNT(*) as total FROM barber_responses');
    console.log(`\n📊 Total responses: ${countResult[0].total}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

checkTableStructure();
