'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, ChevronUp, X, Minus, Plus } from 'lucide-react';

export function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const items = useCartStore(state => state.items);
  const totalItems = useCartStore(state => state.getTotalItems());
  const totalPrice = useCartStore(state => state.getTotalPrice());
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const clearCart = useCartStore(state => state.clearCart);

  if (totalItems === 0) return null;

  return (
    <>
      {/* Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Cart Drawer */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: '85vh' }}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 font-heading">Your Order</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-600 active:scale-95">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mb-6">
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

          <div className="border-t border-gray-100 pt-4 mb-6">
            <div className="flex justify-between items-center font-bold text-lg text-gray-900">
              <span>Total</span>
              <span className="font-mono">?{totalPrice}</span>
            </div>
          </div>

          <button 
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl active:scale-[0.98] transition-transform"
            onClick={() => {
              alert('Order confirmed! (In Phase 6, we will ask for your room number)');
              clearCart();
              setIsOpen(false);
            }}
          >
            Confirm Order
          </button>
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
