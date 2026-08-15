import { NextRequest, NextResponse } from 'next/server';
import { getAllRegistrations, addFolioCharge } from '@/lib/db';
import { MockPMSService } from '@/lib/pms-mock';
import { CartItem } from '@/store/cartStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomNumber, items, totalPrice } = body as { roomNumber: string, items: CartItem[], totalPrice: number };

    if (!roomNumber || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Verify that the room actually has an active guest
    const allRecords = await getAllRegistrations();
    const activeGuest = allRecords.find(r => r.roomNumber === roomNumber && r.syncStatus !== 'archived');

    if (!activeGuest) {
      return NextResponse.json({ 
        error: `No active guest found in Room ${roomNumber}. Please contact the front desk if you just checked in.` 
      }, { status: 404 });
    }

    // 2. Compile order string
    const itemStrings = items.map(item => `${item.quantity}x ${item.name}`);
    const chargeString = `In-Room Dining: ${itemStrings.join(', ')} - ?${totalPrice}`;

    // 3. Send to PMS (Simulated)
    let pmsResponseData;
    try {
      pmsResponseData = await MockPMSService.postRoomCharge(roomNumber, {
        description: chargeString,
        amount: totalPrice,
        category: 'F&B - In Room Dining'
      });
    } catch (err: any) {
      console.error('[GUEST PMS CHARGE ERROR]', err);
      return NextResponse.json(
        { error: 'Hotel system is currently busy. Please order via phone.' },
        { status: 503 }
      );
    }

    // 4. Save locally
    await addFolioCharge(roomNumber, chargeString);

    return NextResponse.json({
      success: true,
      message: `Order confirmed for Room ${roomNumber}!`,
      chargeString,
    });

  } catch (error) {
    console.error('[GUEST ORDER ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error processing your order.' }, { status: 500 });
  }
}
