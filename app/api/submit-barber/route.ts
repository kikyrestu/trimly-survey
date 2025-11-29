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
    const responses: any = await getBarberResponses();
    
    // Transform database results to match frontend format
    const transformedResponses = responses.map((row: any) => ({
      id: row.id,
      businessName: row.business_name,
      location: row.location,
      yearsOperating: row.years_operating,
      numberOfBarbers: row.number_of_barbers,
      customerMethods: row.customer_methods && row.customer_methods.includes(',') ? row.customer_methods.split(', ') : (row.customer_methods ? [row.customer_methods] : []),
      challenges: row.challenges && row.challenges.includes(',') ? row.challenges.split(', ') : (row.challenges ? [row.challenges] : []),
      customerSource: row.customer_source,
      appInterest: row.app_interest,
      commissionAgreement: row.commission_agreement,
      commissionRate: row.commission_rate,
      partnership: row.partnership,
      features: row.features && row.features.includes(',') ? row.features.split(', ') : (row.features ? [row.features] : []),
      notification: row.notification,
      paymentMethods: row.payment_methods && row.payment_methods.includes(',') ? row.payment_methods.split(', ') : (row.payment_methods ? [row.payment_methods] : []),
      suggestions: row.suggestions,
      timestamp: row.timestamp
    }));
    
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
