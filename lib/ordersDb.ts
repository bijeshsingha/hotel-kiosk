import fs from 'fs';
import path from 'path';

export interface OrderRecord {
  id: string;
  roomNumber: string;
  items: any[];
  totalPrice: number;
  status: 'pending' | 'preparing' | 'delivered';
  createdAt: string;
  updatedAt: string;
}

const DB_FILE_PATH = process.env.VERCEL
  ? path.join('/tmp', 'orders_db.json')
  : path.join(process.cwd(), 'orders_db.json');

let inMemoryOrders: OrderRecord[] = [];

// Support Vercel KV for Serverless Global Persistence
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KV_KEY = 'hotel_divine_view_orders';

async function fetchKvOrders(): Promise<OrderRecord[] | null> {
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
    if (typeof parsed === 'string') parsed = JSON.parse(parsed);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return null;
  }
}

async function saveKvOrders(records: OrderRecord[]): Promise<boolean> {
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
    return false;
  }
}

function readLocalDb(): OrderRecord[] {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(inMemoryOrders), 'utf-8');
      return inMemoryOrders;
    }
    const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(data || '[]');
    inMemoryOrders = parsed;
    return parsed;
  } catch (error) {
    return inMemoryOrders;
  }
}

function writeLocalDb(records: OrderRecord[]): void {
  try {
    inMemoryOrders = records;
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(records, null, 2), 'utf-8');
  } catch (error) {}
}

export async function getAllOrders(): Promise<OrderRecord[]> {
  const kvRecords = await fetchKvOrders();
  if (kvRecords !== null) return kvRecords;
  return readLocalDb();
}

export async function saveOrder(payload: Omit<OrderRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<OrderRecord> {
  const records = await getAllOrders();
  const timestamp = new Date().toISOString();

  const newOrder: OrderRecord = {
    id: `ord_${Date.now()}`,
    status: 'pending',
    createdAt: timestamp,
    updatedAt: timestamp,
    ...payload,
  };

  records.unshift(newOrder);
  await saveKvOrders(records);
  writeLocalDb(records);

  return newOrder;
}

export async function updateOrderStatus(id: string, status: OrderRecord['status']): Promise<OrderRecord | null> {
  const records = await getAllOrders();
  const index = records.findIndex(r => r.id === id);
  if (index === -1) return null;

  records[index].status = status;
  records[index].updatedAt = new Date().toISOString();

  await saveKvOrders(records);
  writeLocalDb(records);

  return records[index];
}
