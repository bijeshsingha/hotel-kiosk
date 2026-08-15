import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const event = searchParams.get('event');
  const registrationId = searchParams.get('registrationId');

  if (!event || !registrationId) {
    return NextResponse.json({ error: 'Missing event or registrationId query parameters' }, { status: 400 });
  }

  try {
    const origin = request.nextUrl.origin;
    const webhookUrl = `${origin}/api/webhooks/pms`;

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-pms-webhook-secret': process.env.PMS_WEBHOOK_SECRET || 'test-secret',
      },
      body: JSON.stringify({
        event,
        registrationId,
      }),
    });

    const data = await res.json();
    
    return NextResponse.json({
      success: res.ok,
      status: res.status,
      response: data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to emit webhook: ' + error.message }, { status: 500 });
  }
}
