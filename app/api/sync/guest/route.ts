import { NextRequest, NextResponse } from 'next/server';
import { guestRegistrationSchema } from '@/lib/schemas/guestSchema';
import { saveLocalRegistration, updateSyncStatus } from '@/lib/db';
import { MockPMSService } from '@/lib/pms-mock';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Server-side Zod validation
    const validationResult = guestRegistrationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid guest registration payload',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const registrationId = `PMS-REG-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    // 2. STEP 1: Save to persistent database FIRST (status: "pending")
    const localRecord = await saveLocalRegistration({
      registrationId,
      primaryGuest: data.primaryGuest,
      coGuests: data.coGuests,
      foreignerDetails: data.foreignerDetails,
      termsAccepted: data.termsAccepted,
      signatureDataUrl: data.signatureDataUrl,
      idImageUrl: data.idImageUrl,
    });

    console.log('\n=======================================================');
    console.log(` [LOCAL DB SAVED] Guest intake stored: ${registrationId}`);
    console.log(` Primary Guest: ${data.primaryGuest.fullName} (${data.primaryGuest.nationality})`);
    console.log(` Mobile Number: ${data.primaryGuest.contact.mobileNumber}`);
    console.log('=======================================================\n');

    // 3. STEP 2: Attempt to push payload to PMS API Gateway
    let pmsSyncSuccess = false;
    let pmsResponseData = null;
    let syncErrorMessage = '';

    try {
      // Use Mock PMS Service
      pmsResponseData = await MockPMSService.pushGuestProfile(data);
      pmsSyncSuccess = true;
    } catch (err: any) {
      console.error('[PMS GATEWAY ERROR]', err);
      pmsSyncSuccess = false;
      syncErrorMessage = err?.message || 'PMS API Connection Timeout / Maintenance';
    }

    // 4. STEP 3: Update database sync status
    if (pmsSyncSuccess) {
      await updateSyncStatus(registrationId, 'synced', pmsResponseData);
    } else {
      await updateSyncStatus(registrationId, 'failed', null, syncErrorMessage);
    }

    // 5. STEP 4: Return confirmation to Kiosk (Guest data is safely saved!)
    return NextResponse.json(
      {
        success: true,
        message: pmsSyncSuccess
          ? 'Guest registration synced to PMS and saved locally.'
          : 'Guest registration saved locally. PMS retry scheduled.',
        registrationId,
        guestName: data.primaryGuest.fullName,
        syncStatus: pmsSyncSuccess ? 'synced' : 'failed',
        timestamp: localRecord.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('PMS Sync Route Handler Exception:', error);
    return NextResponse.json(
      { error: 'Internal Server Error during PMS Gateway sync' },
      { status: 500 }
    );
  }
}
