'use client';
import { useState, useEffect } from 'react';
import type { OrderRecord } from '@/lib/ordersDb';
import { ChefHat, Printer, CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        setOrders(await res.json());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, status: OrderRecord['status']) => {
    // Optimistic UI
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchOrders();
  };

  const printKOT = (order: OrderRecord) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = `
      <html>
        <head>
          <title>KOT - ${order.id}</title>
          <style>
            body { font-family: monospace; padding: 20px; font-size: 14px; width: 300px; }
            h2 { text-align: center; margin: 0; }
            .divider { border-bottom: 1px dashed #000; margin: 10px 0; }
            .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
          </style>
        </head>
        <body>
          <h2>KITCHEN ORDER TICKET</h2>
          <div class="divider"></div>
          <p><strong>Room:</strong> ${order.roomNumber}</p>
          <p><strong>Time:</strong> ${new Date(order.createdAt).toLocaleTimeString()}</p>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <div class="divider"></div>
          ${order.items.map(i => `
            <div class="item">
              <span>${i.quantity}x ${i.name}</span>
            </div>
          `).join('')}
          <div class="divider"></div>
          <p style="text-align: center;">*** END OF TICKET ***</p>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const columns = [
    { id: 'pending', title: 'Pending', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'preparing', title: 'Preparing', icon: PlayCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'delivered', title: 'Delivered', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 font-heading flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-amber-500" />
              Kitchen Display System (KDS)
            </h1>
            <p className="text-gray-500 mt-1">Live order management dashboard</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin" className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Admin Dashboard
            </Link>
            <Link href="/menu" target="_blank" className="px-4 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">
              New Order (/menu)
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map(col => (
            <div key={col.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[75vh]">
              <div className={`p-4 border-b border-gray-100 flex items-center gap-2 ${col.bg}`}>
                <col.icon className={`w-5 h-5 ${col.color}`} />
                <h2 className={`font-bold text-lg ${col.color}`}>{col.title}</h2>
                <span className="ml-auto bg-white px-2 py-0.5 rounded-full text-sm font-bold border border-gray-200">
                  {orders.filter(o => o.status === col.id).length}
                </span>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-gray-50/50">
                {orders.filter(o => o.status === col.id).map(order => (
                  <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="inline-block px-2 py-1 bg-gray-900 text-white font-bold text-sm rounded-lg mb-2">
                          Room {order.roomNumber}
                        </span>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
                      </div>
                      <button 
                        onClick={() => printKOT(order)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Print KOT"
                      >
                        <Printer className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-2 mb-4 border-t border-b border-gray-50 py-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm font-semibold text-gray-800">
                          <span>{item.quantity}x {item.name}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <button onClick={() => updateStatus(order.id, 'preparing')} className="flex-1 bg-blue-50 text-blue-700 font-bold py-2 rounded-xl text-sm hover:bg-blue-100 transition-colors">
                          Start Preparing
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button onClick={() => updateStatus(order.id, 'delivered')} className="flex-1 bg-green-50 text-green-700 font-bold py-2 rounded-xl text-sm hover:bg-green-100 transition-colors">
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {orders.filter(o => o.status === col.id).length === 0 && !loading && (
                  <div className="text-center text-gray-400 py-10 text-sm font-medium">
                    No {col.title.toLowerCase()} orders
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
