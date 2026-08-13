import fs from 'fs';
import path from 'path';

export interface StoredGuestRecord {
  registrationId: string;
  createdAt: string;
  updatedAt: string;
  roomNumber?: string;
  syncStatus: 'synced' | 'pending' | 'failed';
  pmsResponse?: any;
  syncError?: string;
  retryCount: number;
  primaryGuest: any;
  coGuests: any[];
  foreignerDetails: any;
  termsAccepted: boolean;
  signatureDataUrl: string;
}

// In Vercel serverless functions, process.cwd() is read-only. Use /tmp in Vercel environment.
const DB_FILE_PATH = process.env.VERCEL
  ? path.join('/tmp', 'registrations_db.json')
  : path.join(process.cwd(), 'registrations_db.json');

// Memory cache fallback for serverless invocation lifecycle
let inMemoryStore: StoredGuestRecord[] = [];

function readDb(): StoredGuestRecord[] {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(inMemoryStore), 'utf-8');
      return inMemoryStore;
    }
    const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(data || '[]');
    inMemoryStore = parsed;
    return parsed;
  } catch (error) {
    console.error('[DB READ ERROR]', error);
    return inMemoryStore;
  }
}

function writeDb(records: StoredGuestRecord[]): void {
  try {
    inMemoryStore = records;
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(records, null, 2), 'utf-8');
  } catch (error) {
    console.error('[DB WRITE ERROR]', error);
  }
}

// 1. Save new guest intake to local database first
export function saveLocalRegistration(payload: {
  registrationId: string;
  primaryGuest: any;
  coGuests: any[];
  foreignerDetails: any;
  termsAccepted: boolean;
  signatureDataUrl: string;
}): StoredGuestRecord {
  const records = readDb();
  const timestamp = new Date().toISOString();

  const newRecord: StoredGuestRecord = {
    registrationId: payload.registrationId,
    createdAt: timestamp,
    updatedAt: timestamp,
    roomNumber: payload.primaryGuest?.roomNumber || '',
    syncStatus: 'pending',
    retryCount: 0,
    primaryGuest: payload.primaryGuest,
    coGuests: payload.coGuests || [],
    foreignerDetails: payload.foreignerDetails || null,
    termsAccepted: payload.termsAccepted,
    signatureDataUrl: payload.signatureDataUrl,
  };

  records.unshift(newRecord);
  writeDb(records);
  return newRecord;
}

// 2. Update PMS sync status after API attempt
export function updateSyncStatus(
  registrationId: string,
  status: 'synced' | 'failed',
  pmsResponse?: any,
  syncError?: string
): StoredGuestRecord | null {
  const records = readDb();
  const index = records.findIndex((r) => r.registrationId === registrationId);
  if (index === -1) return null;

  records[index].syncStatus = status;
  records[index].updatedAt = new Date().toISOString();
  if (pmsResponse) records[index].pmsResponse = pmsResponse;
  if (syncError) records[index].syncError = syncError;
  if (status === 'failed') records[index].retryCount += 1;

  writeDb(records);
  return records[index];
}

// 3. Assign or update Room Number by Front Desk Staff
export function updateRoomNumber(registrationId: string, roomNumber: string): StoredGuestRecord | null {
  const records = readDb();
  const index = records.findIndex((r) => r.registrationId === registrationId);
  if (index === -1) return null;

  records[index].roomNumber = roomNumber;
  if (records[index].primaryGuest) {
    records[index].primaryGuest.roomNumber = roomNumber;
  }
  records[index].updatedAt = new Date().toISOString();

  writeDb(records);
  return records[index];
}

// 4. Get all stored registrations for Front Desk
export function getAllRegistrations(): StoredGuestRecord[] {
  return readDb();
}

// 5. Get registration by ID
export function getRegistrationById(registrationId: string): StoredGuestRecord | null {
  const records = readDb();
  return records.find((r) => r.registrationId === registrationId) || null;
}
