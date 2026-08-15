import { NextRequest, NextResponse } from 'next/server';
import { getAllRegistrations } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 });
  }

  const registrations = await getAllRegistrations();
  
  // Return only active guests (not archived/checked out)
  const activeGuests = registrations
    .filter(r => r.syncStatus !== 'archived')
    .map(r => ({
      registrationId: r.registrationId,
      roomNumber: r.roomNumber || r.primaryGuest?.roomNumber,
      fullName: r.primaryGuest?.fullName,
      arrivalDate: r.primaryGuest?.arrivalDateTime,
    }));

  return NextResponse.json({
    success: true,
    guests: activeGuests,
  });
}
