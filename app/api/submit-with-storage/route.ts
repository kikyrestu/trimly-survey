import { NextRequest, NextResponse } from 'next/server';
import { insertCustomerResponse, getCustomerResponses } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('📥 Received customer survey data:', JSON.stringify(data, null, 2));

    // Save to MySQL database
    const result = await insertCustomerResponse(data);
    
    console.log(`✅ Customer survey saved to MySQL database!`);
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
    console.error('❌ Error saving survey to database:', error);
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

// GET endpoint to fetch all customer responses
export async function GET() {
  try {
    console.log('🔍 Fetching customer responses from database...');
    const responses: any = await getCustomerResponses();
    
    console.log(`📊 Found ${responses.length} customer responses (V2)`);
    if (responses.length > 0) {
      console.log('📄 Sample response from DB:', responses[0]);
    }
    
    // Transform database results to match frontend V2 format
    const transformedResponses = responses.map((row: any) => ({
      id: row.id,
      timestamp: row.timestamp,
      // Bagian 1: Profil
      age: row.age,
      gender: row.gender,
      domicile: row.domicile,
      domicile_other: row.domicile_other,
      haircut_frequency: row.haircut_frequency,
      // Bagian 2: Kebiasaan
      barbershop_choice: row.barbershop_choice,
      important_factors: row.important_factors,
      when_full: row.when_full,
      // Bagian 3: Pain Awareness (1-5)
      pain_wa_response: row.pain_wa_response,
      pain_time_confusion: row.pain_time_confusion,
      pain_still_wait: row.pain_still_wait,
      pain_queue_overlap: row.pain_queue_overlap,
      pain_barber_forget: row.pain_barber_forget,
      pain_unknown_barber: row.pain_unknown_barber,
      // Bagian 4: Minat Booking Online
      interest_wait_anywhere: row.interest_wait_anywhere,
      interest_choose_barber: row.interest_choose_barber,
      interest_queue_time: row.interest_queue_time,
      interest_notification: row.interest_notification,
      // Bagian 5: Promo & Keuntungan
      promo_types: row.promo_types,
      will_download_for_promo: row.will_download_for_promo,
      want_comparison_app: row.want_comparison_app,
      // Bagian 6: Pendapat
      wa_booking_issue: row.wa_booking_issue,
      important_features: row.important_features,
      will_try_trimly: row.will_try_trimly
    }));
    
    console.log('✅ Transformed responses ready to send (V2 fields)');
    
    return NextResponse.json({
      success: true,
      totalResponses: transformedResponses.length,
      responses: transformedResponses
    });
  } catch (error) {
    console.error('❌ Error fetching responses from database:', error);
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
