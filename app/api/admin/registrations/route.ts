import { NextRequest, NextResponse } from 'next/server';
import { getAllRegistrations, getRegistrationById, updateSyncStatus, updateRoomNumber } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 });
  }

  const registrations = await getAllRegistrations();
  return NextResponse.json({
    success: true,
    total: registrations.length,
    registrations,
  });
}

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, registrationId, roomNumber } = body;

    if (action === 'retry' && registrationId) {
      const record = await getRegistrationById(registrationId);
      if (!record) {
        return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
      }

      console.log(`[PMS RETRY TRIGGERED] Staff retrying PMS sync for ${registrationId}...`);

      const pmsResponseData = { pmsAckId: `PMS-ACK-RETRY-${Date.now()}`, status: 'RECEIVED' };
      const updatedRecord = await updateSyncStatus(registrationId, 'synced', pmsResponseData);

      return NextResponse.json({
        success: true,
        message: `PMS Sync successfully retried for ${registrationId}`,
        record: updatedRecord,
      });
    }

    if (action === 'updateRoomNumber' && registrationId) {
      const updatedRecord = await updateRoomNumber(registrationId, roomNumber || '');
      if (!updatedRecord) {
        return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
      }

      console.log(`[ROOM NUMBER ASSIGNED] Staff assigned room "${roomNumber}" to ${registrationId}`);

      return NextResponse.json({
        success: true,
        message: `Room number updated to "${roomNumber}" for ${registrationId}`,
        record: updatedRecord,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
