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
    
    console.log(`📊 Found ${responses.length} customer responses`);
    if (responses.length > 0) {
      console.log('📄 Sample response from DB:', responses[0]);
    }
    
    // Transform database results to match frontend format
    const transformedResponses = responses.map((row: any) => ({
      id: row.id,
      name: row.name,
      age: row.age,
      gender: row.gender,
      domicile: row.domicile,
      frequency: row.frequency,
      price: row.price,
      problems: row.problems && row.problems.includes(',') ? row.problems.split(', ') : (row.problems ? [row.problems] : []),
      interest: row.interest,
      features: row.features && row.features.includes(',') ? row.features.split(', ') : (row.features ? [row.features] : []),
      bookingFee: row.booking_fee,
      paymentMethod: row.payment_method,
      channel: row.channel,
      reviewImportance: row.review_importance,
      suggestions: row.suggestions,
      timestamp: row.timestamp
    }));
    
    console.log('✅ Transformed responses ready to send');
    
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
