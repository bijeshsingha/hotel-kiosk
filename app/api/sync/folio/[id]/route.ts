import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { MockPMSService } from '@/lib/pms-mock';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 });
  }

  const roomId = params.id;
  
  if (!roomId) {
    return NextResponse.json({ error: 'Missing room ID' }, { status: 400 });
  }

  try {
    const folioData = await MockPMSService.getGuestFolio(roomId);
    return NextResponse.json({
      success: true,
      data: folioData,
    });
  } catch (error: any) {
    console.error('[PMS FOLIO FETCH ERROR]', error);
    return NextResponse.json(
      { error: 'PMS API Connection Timeout / Maintenance' },
      { status: 503 }
    );
  }
}
