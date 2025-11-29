import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkCustomerTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 Checking customer_responses table...\n');
    
    const [columns]: any = await connection.query('DESCRIBE customer_responses');
    const fieldNames = columns.map((col: any) => col.Field);
    
    // Check V2 fields
    const v2Fields = [
      'pain_wa_response',
      'pain_time_confusion',
      'pain_still_wait',
      'important_factors',
      'promo_types',
      'will_try_trimly'
    ];
    
    console.log('🔍 V2 Fields Check:');
    let allExist = true;
    v2Fields.forEach(field => {
      const exists = fieldNames.includes(field);
      if (!exists) allExist = false;
      console.log(`  ${exists ? '✅' : '❌'} ${field}`);
    });
    
    // Check OLD fields
    const oldFields = ['price', 'problems', 'booking_fee'];
    console.log('\n🔍 OLD Fields (should NOT exist):');
    let anyOld = false;
    oldFields.forEach(field => {
      const exists = fieldNames.includes(field);
      if (exists) anyOld = true;
      console.log(`  ${exists ? '❌ STILL EXISTS' : '✅ Removed'} ${field}`);
    });
    
    if (allExist && !anyOld) {
      console.log('\n✅ customer_responses is V2!');
    } else {
      console.log('\n❌ customer_responses needs V2 migration!');
      console.log('🛠️  Run: npx tsx scripts/migrate-customer-v2.ts');
    }
    
    const [count]: any = await connection.query('SELECT COUNT(*) as total FROM customer_responses');
    console.log(`\n📊 Total customer responses: ${count[0].total}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

checkCustomerTable();
