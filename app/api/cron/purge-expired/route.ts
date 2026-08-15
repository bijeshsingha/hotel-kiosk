import { NextRequest, NextResponse } from 'next/server';
import { getAllRegistrations, deleteRegistration } from '@/lib/db';

export async function GET(request: NextRequest) {
  // Security check: Vercel Cron jobs automatically send this header
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn('Unauthorized cron invocation attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const records = await getAllRegistrations();
    const now = new Date();
    
    // 365 days ago
    const oneYearAgo = new Date();
    oneYearAgo.setDate(now.getDate() - 365);

    let purgedCount = 0;

    for (const record of records) {
      const createdAt = new Date(record.createdAt);
      if (createdAt < oneYearAgo) {
        console.log(`[CRON PURGE] Deleting expired record: ${record.registrationId}`);
        await deleteRegistration(record.registrationId);
        purgedCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Cron executed successfully. Purged ${purgedCount} expired records.`
    }, { status: 200 });

  } catch (error) {
    console.error('[CRON PURGE ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
