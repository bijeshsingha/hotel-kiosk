import { useState } from 'react';
import { useCartStore, CartItem } from '@/store/cartStore';

interface MenuItemProps {
  item: Omit<CartItem, 'quantity'>;
}

export function MenuItemCard({ item }: MenuItemProps) {
  const addItem = useCartStore(state => state.addItem);
  const items = useCartStore(state => state.items);
  
  const isVeg = item.dietary?.toLowerCase().includes('veg') && !item.dietary?.toLowerCase().includes('non');
  const cartItem = items.find(i => i.id === item.id);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-start transition-all hover:shadow-md">
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-2 mb-1.5">
          {/* Veg/Non-Veg Dot */}
          <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${isVeg ? 'border-green-600' : 'border-red-600'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
          </div>
          <h3 className="font-semibold text-gray-900 leading-tight">{item.name}</h3>
        </div>
        <p className="text-sm font-medium text-gray-600 font-mono">?{item.price}</p>
      </div>
      
      <div className="flex-shrink-0">
        <button 
          onClick={() => addItem(item)}
          className="bg-[#fafafa] border border-gray-200 text-gray-900 font-semibold text-sm px-4 py-2 rounded-xl active:scale-95 transition-transform"
        >
          + Add
        </button>
      </div>
    </div>
  );
}
