import { NextResponse } from 'next/server';
import { getAllOrders } from '@/lib/ordersDb';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  const isAuth = await isAuthenticated();
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const orders = await getAllOrders();
  return NextResponse.json(orders);
}
