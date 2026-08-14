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
  checkoutTime?: string;
  extraItems?: string;
}

const DB_FILE_PATH = process.env.VERCEL
  ? path.join('/tmp', 'registrations_db.json')
  : path.join(process.cwd(), 'registrations_db.json');

// Memory store fallback
let inMemoryStore: StoredGuestRecord[] = [];

// Support Vercel KV / Upstash Redis REST API for Serverless Global Persistence
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KV_KEY = 'hotel_divine_view_registrations';

async function fetchKvRecords(): Promise<StoredGuestRecord[] | null> {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const res = await fetch(`${KV_URL}/get/${KV_KEY}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.result) return [];
    let parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
    // Handle legacy double-stringified data gracefully
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[KV READ ERROR]', err);
    return null;
  }
}

async function saveKvRecords(records: StoredGuestRecord[]): Promise<boolean> {
  if (!KV_URL || !KV_TOKEN) return false;
  try {
    const res = await fetch(`${KV_URL}/set/${KV_KEY}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(records),
    });
    return res.ok;
  } catch (err) {
    console.error('[KV WRITE ERROR]', err);
    return false;
  }
}

function readLocalDb(): StoredGuestRecord[] {
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
    console.error('[LOCAL DB READ ERROR]', error);
    return inMemoryStore;
  }
}

function writeLocalDb(records: StoredGuestRecord[]): void {
  try {
    inMemoryStore = records;
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(records, null, 2), 'utf-8');
  } catch (error) {
    console.error('[LOCAL DB WRITE ERROR]', error);
  }
}

export async function getAllRegistrations(): Promise<StoredGuestRecord[]> {
  const kvRecords = await fetchKvRecords();
  if (kvRecords !== null) return kvRecords;
  return readLocalDb();
}

export async function getRegistrationById(registrationId: string): Promise<StoredGuestRecord | null> {
  const records = await getAllRegistrations();
  return records.find((r) => r.registrationId === registrationId) || null;
}

export async function saveLocalRegistration(payload: {
  registrationId: string;
  primaryGuest: any;
  coGuests: any[];
  foreignerDetails: any;
  termsAccepted: boolean;
  signatureDataUrl: string;
}): Promise<StoredGuestRecord> {
  const records = await getAllRegistrations();
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
  await saveKvRecords(records);
  writeLocalDb(records);

  return newRecord;
}

export async function updateSyncStatus(
  registrationId: string,
  status: 'synced' | 'failed',
  pmsResponse?: any,
  syncError?: string
): Promise<StoredGuestRecord | null> {
  const records = await getAllRegistrations();
  const index = records.findIndex((r) => r.registrationId === registrationId);
  if (index === -1) return null;

  records[index].syncStatus = status;
  records[index].updatedAt = new Date().toISOString();
  if (pmsResponse) records[index].pmsResponse = pmsResponse;
  if (syncError) records[index].syncError = syncError;
  if (status === 'failed') records[index].retryCount += 1;

  await saveKvRecords(records);
  writeLocalDb(records);

  return records[index];
}

export async function updateRoomNumber(registrationId: string, roomNumber: string): Promise<StoredGuestRecord | null> {
  const records = await getAllRegistrations();
  const index = records.findIndex((r) => r.registrationId === registrationId);
  if (index === -1) return null;

  records[index].roomNumber = roomNumber;
  if (records[index].primaryGuest) {
    records[index].primaryGuest.roomNumber = roomNumber;
  }
  records[index].updatedAt = new Date().toISOString();

  await saveKvRecords(records);
  writeLocalDb(records);

  return records[index];
}

export async function updateCheckoutDetails(
  registrationId: string,
  checkoutTime: string,
  extraItems: string
): Promise<any | null> {
  const records = await getAllRegistrations();
  const index = records.findIndex((r) => r.registrationId === registrationId);
  if (index === -1) return null;

  records[index].checkoutTime = checkoutTime;
  records[index].extraItems = extraItems;
  records[index].updatedAt = new Date().toISOString();

  await saveKvRecords(records);
  writeLocalDb(records);

  return records[index];
}
