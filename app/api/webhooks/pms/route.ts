import { NextRequest, NextResponse } from 'next/server';
import { purgeRecord, anonymizeRecord } from '@/lib/compliance';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Webhook Secret
    const secret = request.headers.get('x-pms-webhook-secret');
    if (!secret || secret !== process.env.PMS_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized webhook payload' }, { status: 401 });
    }

    // 2. Parse Event Payload
    const body = await request.json();
    const { event, registrationId } = body;

    if (!registrationId) {
      return NextResponse.json({ error: 'Missing registrationId' }, { status: 400 });
    }

    console.log(`[WEBHOOK RECEIVED] Event: ${event} | Registration: ${registrationId}`);

    // 3. Route Event to Compliance Engine
    if (event === 'reservation.cancelled' || event === 'reservation.no_show') {
      await purgeRecord(registrationId);
    } else if (event === 'reservation.checked_out') {
      await anonymizeRecord(registrationId);
    } else {
      return NextResponse.json({ error: 'Unsupported event type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Processed ${event} successfully` }, { status: 200 });

  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
