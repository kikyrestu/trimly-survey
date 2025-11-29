import { query } from '../lib/db';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testBarberDB() {
  try {
    console.log('🔍 Checking barber_responses table structure...\n');
    
    // Check table structure
    const columns: any = await query('DESCRIBE barber_responses', []);
    
    console.log('📋 Table columns:');
    columns.forEach((col: any) => {
      console.log(`  - ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    console.log('\n✅ Table structure looks good!');
    
    // Check if critical V2 fields exist
    const fieldNames = columns.map((col: any) => col.Field);
    const requiredV2Fields = [
      'customers_per_day',
      'interest_no_monthly_fee', 
      'willing_partnership_promo',
      'important_promo_features',
      'biggest_challenge',
      'must_have_features',
      'willing_try_trimly'
    ];
    
    console.log('\n🔍 Checking V2 fields...');
    requiredV2Fields.forEach(field => {
      const exists = fieldNames.includes(field);
      console.log(`  ${exists ? '✅' : '❌'} ${field}`);
    });
    
    // Check for OLD fields that should NOT exist
    const oldFields = ['commission_agreement', 'commission_rate', 'payment_method'];
    console.log('\n🔍 Checking OLD fields (should NOT exist)...');
    oldFields.forEach(field => {
      const exists = fieldNames.includes(field);
      console.log(`  ${exists ? '❌ FOUND (BAD!)' : '✅ NOT FOUND (GOOD!)'} ${field}`);
    });
    
    // Get row count
    const countResult: any = await query('SELECT COUNT(*) as total FROM barber_responses', []);
    console.log(`\n📊 Total responses in database: ${countResult[0].total}`);
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes("Table") && error.message.includes("doesn't exist")) {
      console.log('\n🛠️  FIX: Run the schema V2 SQL file!');
      console.log('   mysql -h YOUR_HOST -u USER -p DATABASE < database/schema-v2-barber.sql');
    }
    
    process.exit(1);
  }
}

testBarberDB();
