import { NextRequest, NextResponse } from 'next/server';
import { addFolioCharge } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { MockPMSService } from '@/lib/pms-mock';

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { roomNumber, itemName, amount, quantity } = body;

    if (!roomNumber || !itemName || !amount || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const chargeString = `${quantity}x ${itemName} - ?${amount * quantity}`;
    
    // Simulate PMS Folio Posting
    let pmsResponseData;
    try {
      pmsResponseData = await MockPMSService.postRoomCharge(roomNumber, body);
    } catch (err: any) {
      console.error('[PMS CHARGE ERROR]', err);
      return NextResponse.json(
        { error: 'PMS API Connection Timeout / Maintenance. Charge not posted.' },
        { status: 503 }
      );
    }

    // On PMS success, append to local ledger
    const updatedRecord = await addFolioCharge(roomNumber, chargeString);

    if (!updatedRecord) {
      return NextResponse.json({ error: `No active guest found in Room ${roomNumber}` }, { status: 404 });
    }

    console.log(`[POS CHARGE] Added "${chargeString}" to Room ${roomNumber}`);

    return NextResponse.json({
      success: true,
      message: `Charge posted to Room ${roomNumber} successfully`,
      chargeString,
      pmsTransaction: pmsResponseData,
    });
  } catch (error) {
    console.error('[POS CHARGE ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
