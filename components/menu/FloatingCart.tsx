'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, ChevronUp, X, Minus, Plus, Loader2 } from 'lucide-react';

export function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [roomNumber, setRoomNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = useCartStore(state => state.items);
  const totalItems = useCartStore(state => state.getTotalItems());
  const totalPrice = useCartStore(state => state.getTotalPrice());
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const clearCart = useCartStore(state => state.clearCart);

  if (totalItems === 0) return null;

  const handleCheckout = async () => {
    setErrorMsg('');
    if (!roomNumber) {
      setErrorMsg('Please enter your room number.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/guest/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomNumber, items, totalPrice }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit order');
      }

      alert('Order placed successfully! It has been charged to your room.');
      clearCart();
      setIsOpen(false);
      setIsCheckingOut(false);
      setRoomNumber('');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => {
            setIsOpen(false);
            setIsCheckingOut(false);
            setErrorMsg('');
          }}
        ></div>
      )}

      {/* Cart Drawer */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: '85vh', height: isCheckingOut ? 'auto' : '85vh' }}
      >
        <div className="p-6 flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900 font-heading">
              {isCheckingOut ? 'Confirm Room' : 'Your Order'}
            </h2>
            <button 
              onClick={() => {
                if (isCheckingOut) {
                  setIsCheckingOut(false);
                  setErrorMsg('');
                } else {
                  setIsOpen(false);
                }
              }} 
              className="p-2 bg-gray-100 rounded-full text-gray-600 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isCheckingOut ? (
            <>
              {/* Order List view */}
              <div className="flex-1 overflow-y-auto mb-6 min-h-0">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-gray-500 font-mono text-sm">?{item.price}</p>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-gray-600 active:scale-90"><Minus className="w-4 h-4"/></button>
                      <span className="font-semibold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-gray-600 active:scale-90"><Plus className="w-4 h-4"/></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6 flex-shrink-0">
                <div className="flex justify-between items-center font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span className="font-mono">?{totalPrice}</span>
                </div>
              </div>

              <button 
                className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl active:scale-[0.98] transition-transform flex-shrink-0"
                onClick={() => setIsCheckingOut(true)}
              >
                Checkout (?{totalPrice})
              </button>
            </>
          ) : (
            <>
              {/* Checkout view */}
              <div className="flex-1 mb-6">
                <p className="text-gray-600 mb-4 text-sm">
                  Please enter your room number to place the order and charge it to your folio.
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Room Number</label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g. 101"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all font-mono text-lg"
                    autoFocus
                  />
                </div>
                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {errorMsg}
                  </div>
                )}
              </div>

              <button 
                className="w-full bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold py-4 rounded-2xl active:scale-[0.98] transition-all flex justify-center items-center gap-2 flex-shrink-0"
                onClick={handleCheckout}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  <>Confirm & Place Order</>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Floating Action Button (Bottom Bar) */}
      {!isOpen && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm z-30">
          <button 
            onClick={() => setIsOpen(true)}
            className="w-full bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center justify-between active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <span className="font-semibold">View Cart</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold">?{totalPrice}</span>
              <ChevronUp className="w-5 h-5 opacity-70" />
            </div>
          </button>
        </div>
      )}
    </>
  );
}
