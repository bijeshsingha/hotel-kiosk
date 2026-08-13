'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  X,
  Printer,
  User,
  Calendar,
  Phone,
  MapPin,
  Compass,
  Users,
  Globe,
  Key,
  Check,
} from 'lucide-react';

interface GuestDetailModalProps {
  record: any;
  onClose: () => void;
  onRetrySync?: (id: string) => void;
  onUpdateRoomNumber?: (id: string, roomNumber: string) => void;
  isRetrying?: boolean;
}

export default function GuestDetailModal({
  record,
  onClose,
  onRetrySync,
  onUpdateRoomNumber,
  isRetrying = false,
}: GuestDetailModalProps) {
  if (!record) return null;

  const { primaryGuest, coGuests, foreignerDetails, syncStatus, registrationId, createdAt } = record;
  const [roomNumber, setRoomNumber] = useState(primaryGuest?.roomNumber || record.roomNumber || '');
  const [savingRoom, setSavingRoom] = useState(false);

  const isForeigner = primaryGuest?.nationality?.trim().toLowerCase() !== 'indian';
  const isFailed = syncStatus === 'failed';

  const handlePrint = () => {
    window.print();
  };

  const handleSaveRoomNumber = async () => {
    if (!onUpdateRoomNumber) return;
    setSavingRoom(true);
    try {
      await onUpdateRoomNumber(registrationId, roomNumber);
    } finally {
      setSavingRoom(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Top Sticky Modal Header (no-print) */}
        <div className="no-print bg-primary text-white p-4 sm:p-5 flex items-center justify-between gap-4 border-b border-gray-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs bg-white/20 text-white px-2.5 py-0.5 rounded font-bold">
                {registrationId}
              </span>
              <span
                className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  isFailed ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                }`}
              >
                {isFailed ? 'Sync Failed' : 'Synced to PMS'}
              </span>

              {roomNumber && (
                <span className="font-mono text-xs bg-secondary text-white px-2.5 py-0.5 rounded font-bold">
                  ROOM #{roomNumber}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-heading mt-1 text-white">
              {primaryGuest?.fullName}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              className="bg-secondary hover:bg-secondary/90 text-white border-none shadow"
            >
              <Printer className="w-4 h-4 mr-1.5" /> Print Police Form (Form-C)
            </Button>

            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Close Modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content Body / Printable Area */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 bg-white printable-area">
          {/* Front Desk Room Assignment Tool (no-print) */}
          <div className="no-print bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5 text-amber-900">
              <Key className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <span className="font-bold text-xs uppercase tracking-wider block">Front Desk Room Assignment</span>
                <span className="text-xs text-amber-800 font-body">Assign or change the room number for this guest registration.</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. Room 304"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value.toUpperCase())}
                className="px-3 py-1.5 text-xs font-bold font-mono border border-amber-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 w-32"
              />
              <Button type="button" variant="primary" size="sm" onClick={handleSaveRoomNumber} disabled={savingRoom}>
                <Check className="w-3.5 h-3.5 mr-1" /> {savingRoom ? 'Saving...' : 'Save Room'}
              </Button>
            </div>
          </div>

          {/* Official Printable Header */}
          <div className="border-b-2 border-gray-900 pb-4 text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-wider">
              HOTEL DIVINE VIEW
            </h1>
            <p className="text-xs uppercase font-bold text-gray-600 font-body tracking-widest mt-1">
              Official Guest Registration & Police Intake Form (Form-C)
            </p>
            <div className="flex items-center justify-between text-xs font-mono text-gray-600 mt-3 pt-2 border-t border-gray-200">
              <span>Registration ID: <strong>{registrationId}</strong></span>
              <span>Room Assigned: <strong className="text-gray-900">{roomNumber || 'UNASSIGNED'}</strong></span>
              <span>Intake Date: <strong>{new Date(createdAt).toLocaleString()}</strong></span>
              <span>Nationality: <strong>{(primaryGuest?.nationality || 'Indian').toUpperCase()}</strong></span>
            </div>
          </div>

          {/* Section 1: Primary Guest Details */}
          <div className="space-y-3 print-page-break">
            <div className="flex items-center gap-2 font-heading font-bold text-gray-900 text-base border-b border-gray-200 pb-1">
              <User className="w-4 h-4 text-primary no-print" />
              <span>1. PRIMARY GUEST INFORMATION</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-body">
              <div className="col-span-2 sm:col-span-2">
                <span className="text-gray-500 font-semibold block uppercase">Full Name (Block Letters)</span>
                <span className="text-gray-900 font-bold text-sm">{primaryGuest?.fullName}</span>
              </div>
              <div>
                <span className="text-gray-500 font-semibold block uppercase">Age / Gender</span>
                <span className="text-gray-900 font-medium">{primaryGuest?.age} yrs / {primaryGuest?.gender}</span>
              </div>
              <div>
                <span className="text-gray-500 font-semibold block uppercase">Assigned Room No.</span>
                <span className="text-primary font-bold">{roomNumber || 'UNASSIGNED'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 font-semibold block uppercase">Father / Spouse Name</span>
                <span className="text-gray-900 font-medium">{primaryGuest?.fatherSpouseName || 'N/A'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 font-semibold block uppercase">Arrival Date & Time</span>
                <span className="text-gray-900 font-medium">{primaryGuest?.arrivalDateTime}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Address & Travel Details */}
          <div className="space-y-3 print-page-break">
            <div className="flex items-center gap-2 font-heading font-bold text-gray-900 text-base border-b border-gray-200 pb-1">
              <MapPin className="w-4 h-4 text-primary no-print" />
              <span>2. ADDRESS & TRAVEL DETAILS</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-body">
              <div className="col-span-2 sm:col-span-4">
                <span className="text-gray-500 font-semibold block uppercase">Full Residential Address</span>
                <span className="text-gray-900 font-medium">
                  {primaryGuest?.address?.streetAddress || ''}, {primaryGuest?.address?.city || ''},{' '}
                  {primaryGuest?.address?.state || ''} - {primaryGuest?.address?.pinCode || ''},{' '}
                  {primaryGuest?.address?.country || 'India'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-semibold block uppercase">Arrived From</span>
                <span className="text-gray-900 font-medium">{primaryGuest?.travel?.arrivedFrom || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500 font-semibold block uppercase">Going To</span>
                <span className="text-gray-900 font-medium">{primaryGuest?.travel?.goingTo || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500 font-semibold block uppercase">Purpose of Visit</span>
                <span className="text-gray-900 font-medium">{primaryGuest?.travel?.purposeOfVisit || 'Tourism'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 font-semibold block uppercase">How Guest Found Us</span>
                <span className="text-primary font-bold">
                  {primaryGuest?.travel?.referralChannel || 'Google Search / Maps'}
                </span>
                {primaryGuest?.travel?.referralDetails && (
                  <span className="text-gray-600 block text-[11px] font-mono">
                    Details: {primaryGuest.travel.referralDetails}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Contact & Vehicle Details */}
          <div className="space-y-3 print-page-break">
            <div className="flex items-center gap-2 font-heading font-bold text-gray-900 text-base border-b border-gray-200 pb-1">
              <Phone className="w-4 h-4 text-primary no-print" />
              <span>3. CONTACT & VEHICLE INFORMATION</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-body">
              <div>
                <span className="text-gray-500 font-semibold block uppercase">Primary Mobile</span>
                <span className="text-gray-900 font-bold">{primaryGuest?.contact?.mobileNumber}</span>
              </div>
              <div>
                <span className="text-gray-500 font-semibold block uppercase">Alternate Phone</span>
                <span className="text-gray-900 font-medium">{primaryGuest?.contact?.phoneNumber || 'N/A'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 font-semibold block uppercase">Email Address</span>
                <span className="text-gray-900 font-medium">{primaryGuest?.contact?.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500 font-semibold block uppercase">Driver Name</span>
                <span className="text-gray-900 font-medium">{primaryGuest?.vehicle?.driverName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500 font-semibold block uppercase">Car / Vehicle No.</span>
                <span className="text-gray-900 font-medium">{primaryGuest?.vehicle?.carNumber || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Accompanying Co-Guests */}
          <div className="space-y-3 print-page-break">
            <div className="flex items-center gap-2 font-heading font-bold text-gray-900 text-base border-b border-gray-200 pb-1">
              <Users className="w-4 h-4 text-primary no-print" />
              <span>4. ACCOMPANYING CO-GUESTS ({coGuests?.length || 0})</span>
            </div>

            {!coGuests || coGuests.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No accompanying co-guests registered.</p>
            ) : (
              <table className="w-full text-left text-xs border border-gray-300 rounded overflow-hidden">
                <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-300">
                  <tr>
                    <th className="p-2 border-r border-gray-300">#</th>
                    <th className="p-2 border-r border-gray-300">Full Name</th>
                    <th className="p-2 border-r border-gray-300">Age</th>
                    <th className="p-2 border-r border-gray-300">Gender</th>
                    <th className="p-2">Relation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {coGuests.map((cg: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-2 border-r border-gray-200 font-mono">{idx + 1}</td>
                      <td className="p-2 border-r border-gray-200 font-bold text-gray-900">{cg.fullName}</td>
                      <td className="p-2 border-r border-gray-200">{cg.age || 'N/A'}</td>
                      <td className="p-2 border-r border-gray-200">{cg.gender}</td>
                      <td className="p-2">{cg.relation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Section 5: Foreigner Form-C Details (Conditional) */}
          {isForeigner && foreignerDetails && (
            <div className="space-y-3 bg-orange-50/50 p-4 border border-orange-200 rounded-lg print-page-break">
              <div className="flex items-center gap-2 font-heading font-bold text-orange-950 text-base border-b border-orange-200 pb-1">
                <Globe className="w-4 h-4 text-secondary no-print" />
                <span>5. FOREIGNER FORM-C REGISTRATION DETAILS</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-body">
                <div>
                  <span className="text-orange-800 font-semibold block uppercase">Passport No.</span>
                  <span className="text-gray-900 font-bold text-sm">{foreignerDetails.passportNo}</span>
                </div>
                <div>
                  <span className="text-orange-800 font-semibold block uppercase">Date of Issue</span>
                  <span className="text-gray-900 font-medium">{foreignerDetails.dateOfIssue || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-orange-800 font-semibold block uppercase">Place of Issue</span>
                  <span className="text-gray-900 font-medium">{foreignerDetails.placeOfIssue || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-orange-800 font-semibold block uppercase">RAP No.</span>
                  <span className="text-gray-900 font-medium">{foreignerDetails.restrictedAreaPermitNo || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-orange-800 font-semibold block uppercase">Arrival Date in India</span>
                  <span className="text-gray-900 font-medium">{foreignerDetails.dateOfArrivalInIndia || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-orange-800 font-semibold block uppercase">Employed in India?</span>
                  <span className="text-gray-900 font-medium">{foreignerDetails.employedInIndia || 'No'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-orange-800 font-semibold block uppercase">Proposed Stay Duration</span>
                  <span className="text-gray-900 font-medium">{foreignerDetails.proposedDurationStay || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Section 6: Digital Signature & Legal Declaration */}
          <div className="pt-4 border-t-2 border-gray-900 space-y-4 print-page-break">
            <p className="text-[11px] text-gray-600 font-body italic">
              "I hereby declare that all particulars filled in this guest registration intake form are true, accurate, and correct to the best of my knowledge and belief."
            </p>

            <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pt-2">
              <div className="w-full sm:w-1/2 bg-gray-50 border border-gray-300 p-3 rounded text-center">
                <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Digital Signature of Primary Guest</span>
                {record.signatureDataUrl ? (
                  <img src={record.signatureDataUrl} alt="Guest Digital Signature" className="max-h-16 mx-auto object-contain" />
                ) : (
                  <div className="h-16 flex items-center justify-center text-xs text-gray-400">No Signature</div>
                )}
                <span className="text-[10px] text-gray-500 font-mono block mt-1">Signed on: {new Date(createdAt).toLocaleString()}</span>
              </div>

              <div className="w-full sm:w-1/2 text-right space-y-8">
                <div className="border-b border-gray-400 pb-1">
                  <span className="text-xs font-bold text-gray-700 uppercase">Front Desk Staff Signature</span>
                </div>
                <div className="border-b border-gray-400 pb-1">
                  <span className="text-xs font-bold text-gray-700 uppercase">Local Police Station Verification Stamp</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Actions (no-print) */}
        <div className="no-print bg-gray-100 p-4 border-t border-gray-200 flex items-center justify-between gap-4">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Close Detail View
          </Button>

          <div className="flex items-center gap-3">
            {isFailed && onRetrySync && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onRetrySync(registrationId)}
                disabled={isRetrying}
              >
                {isRetrying ? 'Retrying PMS Sync...' : 'Retry PMS Sync'}
              </Button>
            )}

            <Button type="button" variant="primary" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1.5" /> Print Form-C For Police
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
