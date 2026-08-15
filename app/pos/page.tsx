'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, UtensilsCrossed, Coffee, Check, LogOut, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function POSDashboardPage() {
  const router = useRouter();
  const [activeGuests, setActiveGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemQty, setItemQty] = useState('1');
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveGuests();
  }, []);

  const fetchActiveGuests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pos/active-guests');
      if (res.ok) {
        const data = await res.json();
        // Filter out guests who don't have a room assigned
        setActiveGuests(data.guests?.filter((g: any) => g.roomNumber) || []);
      } else if (res.status === 401) {
        router.push('/login?callbackUrl=/pos');
      }
    } catch (err) {
      console.error('Failed to fetch active guests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handlePostCharge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !itemName || !itemPrice || !itemQty) return;

    setIsPosting(true);
    setPostSuccess(null);

    try {
      const res = await fetch('/api/sync/folio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomNumber: selectedRoom,
          itemName,
          amount: Number(itemPrice),
          quantity: Number(itemQty)
        })
      });

      const data = await res.json();
      if (res.ok) {
        setPostSuccess(`Successfully posted: ${data.chargeString}`);
        setItemName('');
        setItemPrice('');
        setItemQty('1');
        setTimeout(() => setPostSuccess(null), 3000);
      } else {
        alert('Failed to post charge: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Network error while posting charge');
    } finally {
      setIsPosting(false);
    }
  };

  const filteredGuests = activeGuests.filter(g => 
    g.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-body pb-12">
      {/* Top Navigation */}
      <header className="bg-emerald-900 text-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg leading-tight tracking-wide">DIVINE VIEW POS</h1>
              <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-mono">Restaurant & F&B Billing</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20 text-white hidden sm:flex">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Admin
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout} className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
              <LogOut className="w-4 h-4 sm:mr-1.5" /> <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Room Search */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
              <h2 className="font-heading font-bold text-gray-800 text-sm uppercase flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-600" /> Select Guest Room
              </h2>
            </div>
            <div className="p-4 bg-white">
              <input
                type="text"
                placeholder="Search by Room No. or Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none mb-4 text-sm"
              />

              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                  <div className="text-center py-8 text-gray-500 text-sm flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                    Loading active rooms...
                  </div>
                ) : filteredGuests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    No active rooms found matching your search.
                  </div>
                ) : (
                  filteredGuests.map((guest) => (
                    <div 
                      key={guest.registrationId}
                      onClick={() => setSelectedRoom(guest.roomNumber)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                        selectedRoom === guest.roomNumber 
                          ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 shadow-sm' 
                          : 'bg-white border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                      }`}
                    >
                      <div>
                        <span className="block font-bold text-gray-900 font-heading">{guest.fullName}</span>
                        <span className="text-xs text-gray-500">Check-in: {guest.arrivalDate || 'N/A'}</span>
                      </div>
                      <div className="flex-shrink-0 bg-emerald-100 text-emerald-800 font-mono font-bold px-3 py-1 rounded-md text-sm">
                        RM {guest.roomNumber}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Charge Entry */}
        <div className="lg:col-span-7">
          <Card className={`border-0 shadow-sm overflow-hidden transition-all duration-300 ${!selectedRoom ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
            <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
              <h2 className="font-heading font-bold text-white text-lg flex items-center gap-2">
                <Coffee className="w-5 h-5 text-emerald-200" /> Post New Charge
              </h2>
              {selectedRoom && (
                <div className="bg-white/20 px-3 py-1 rounded font-mono font-bold text-white shadow-sm border border-white/30">
                  ROOM {selectedRoom}
                </div>
              )}
            </div>
            
            <div className="p-6 sm:p-8 bg-white">
              {!selectedRoom && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
                  <span className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold shadow-xl text-sm">
                    Select a Room First
                  </span>
                </div>
              )}

              <form onSubmit={handlePostCharge} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-1.5">Item Name / Description</label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Dinner Buffet, Room Service, Laundry"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-1.5">Unit Price (?)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">?</span>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={itemPrice}
                        onChange={(e) => setItemPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-1.5">Quantity</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={itemQty}
                      onChange={(e) => setItemQty(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-gray-500 text-sm font-medium">
                    Total Amount:
                  </div>
                  <div className="text-3xl font-black text-emerald-600 font-mono">
                    ?{(Number(itemPrice || 0) * Number(itemQty || 1)).toFixed(2)}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                  disabled={isPosting || !selectedRoom}
                >
                  {isPosting ? 'Posting Charge...' : `Post Charge to Room ${selectedRoom || ''}`}
                </Button>

                {postSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800 font-medium text-sm animate-fadeIn">
                    <Check className="w-5 h-5 text-green-600 shrink-0" />
                    {postSuccess}
                  </div>
                )}
              </form>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
