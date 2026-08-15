import { NextRequest, NextResponse } from 'next/server';
import { purgeRecord, anonymizeRecord } from '@/lib/compliance';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Webhook Secret (Allow 'test-secret' for testing purposes)
    const secret = request.headers.get('x-pms-webhook-secret');
    const expectedSecret = process.env.PMS_WEBHOOK_SECRET || 'test-secret';
    
    if (!secret || secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized webhook payload' }, { status: 401 });
    }

    // 2. Parse Event Payload
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON body. Please send {"event": "reservation.checked_out", "registrationId": "..."}' }, { status: 400 });
    }

    const { event, registrationId } = body;

    if (!event) {
      return NextResponse.json({ error: 'Missing event in payload. Must be reservation.checked_out, reservation.cancelled, or reservation.no_show' }, { status: 400 });
    }

    if (!registrationId) {
      return NextResponse.json({ error: 'Missing registrationId in payload' }, { status: 400 });
    }

    console.log(`[WEBHOOK RECEIVED] Event: ${event} | Registration: ${registrationId}`);

    // 3. Route Event to Compliance Engine
    if (event === 'reservation.cancelled' || event === 'reservation.no_show') {
      await purgeRecord(registrationId);
    } else if (event === 'reservation.checked_out') {
      await anonymizeRecord(registrationId);
    } else {
      return NextResponse.json({ error: 'Unsupported event type. Supported events: reservation.checked_out, reservation.cancelled, reservation.no_show' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Processed ${event} successfully` }, { status: 200 });

  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
