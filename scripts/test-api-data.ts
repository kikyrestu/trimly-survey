import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testAPIData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 Testing Customer Data...\n');
    
    const [customerRows]: any = await connection.query('SELECT * FROM customer_responses LIMIT 1');
    if (customerRows.length > 0) {
      console.log('📊 Sample Customer Row from DB:');
      console.log(JSON.stringify(customerRows[0], null, 2));
      
      console.log('\n✅ Key V2 Fields Check:');
      const keyFields = ['barbershop_choice', 'important_factors', 'pain_wa_response', 'promo_types', 'will_try_trimly'];
      keyFields.forEach(field => {
        console.log(`  - ${field}: ${customerRows[0][field] ? '✅ HAS DATA' : '❌ NULL/EMPTY'}`);
      });
    }
    
    console.log('\n\n🔍 Testing Barber Data...\n');
    
    const [barberRows]: any = await connection.query('SELECT * FROM barber_responses LIMIT 1');
    if (barberRows.length > 0) {
      console.log('📊 Sample Barber Row from DB:');
      console.log(JSON.stringify(barberRows[0], null, 2));
      
      console.log('\n✅ Key V2 Fields Check:');
      const keyFields = ['customers_per_day', 'interest_no_monthly_fee', 'important_promo_features', 'willing_try_trimly'];
      keyFields.forEach(field => {
        console.log(`  - ${field}: ${barberRows[0][field] ? '✅ HAS DATA' : '❌ NULL/EMPTY'}`);
      });
    }
    
    // Count total
    const [customerCount]: any = await connection.query('SELECT COUNT(*) as total FROM customer_responses');
    const [barberCount]: any = await connection.query('SELECT COUNT(*) as total FROM barber_responses');
    
    console.log('\n\n📈 Total Responses:');
    console.log(`  - Customer: ${customerCount[0].total}`);
    console.log(`  - Barber: ${barberCount[0].total}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

testAPIData();
