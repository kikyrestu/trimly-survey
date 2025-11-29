import { NextRequest, NextResponse } from 'next/server';
import { insertBarberResponse, getBarberResponses } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('📥 Received barber survey data:', JSON.stringify(data, null, 2));

    // Save to MySQL database
    const result = await insertBarberResponse(data);
    
    console.log(`✅ Barber survey saved to MySQL database!`);
    console.log('📊 Insert result:', result);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Survey submitted successfully',
        result
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error saving barber survey to database:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to submit survey',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch all barber responses
export async function GET() {
  try {
    console.log('🔍 Fetching barber responses from database...');
    const responses: any = await getBarberResponses();
    
    console.log(`📊 Found ${responses.length} barber responses (V2)`);
    if (responses.length > 0) {
      console.log('📄 Sample barber response from DB:', responses[0]);
    }
    
    // Transform database results to match frontend V2 format
    const transformedResponses = responses.map((row: any) => ({
      id: row.id,
      timestamp: row.timestamp,
      // Bagian 1: Profil Usaha
      business_name: row.business_name,
      location: row.location,
      location_other: row.location_other,
      years_operating: row.years_operating,
      number_of_barbers: row.number_of_barbers,
      customers_per_day: row.customers_per_day,
      // Bagian 2: Sistem Operasional
      customer_arrival_method: row.customer_arrival_method,
      common_problems: row.common_problems,
      customer_source: row.customer_source,
      customer_source_other: row.customer_source_other,
      // Bagian 3: Solusi Booking Digital
      interest_no_monthly_fee: row.interest_no_monthly_fee,
      importance_schedule: row.importance_schedule,
      importance_wait_anywhere: row.importance_wait_anywhere,
      importance_queue_app: row.importance_queue_app,
      want_auto_notification: row.want_auto_notification,
      // Bagian 4: Promosi & Pertumbuhan
      willing_partnership_promo: row.willing_partnership_promo,
      important_promo_features: row.important_promo_features,
      // Bagian 5: Pendapat
      biggest_challenge: row.biggest_challenge,
      must_have_features: row.must_have_features,
      willing_try_trimly: row.willing_try_trimly
    }));
    
    console.log('✅ Transformed barber responses ready (V2 fields)');
    
    return NextResponse.json({
      success: true,
      totalResponses: transformedResponses.length,
      responses: transformedResponses
    });
  } catch (error) {
    console.error('❌ Error fetching barber responses from database:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch responses',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
