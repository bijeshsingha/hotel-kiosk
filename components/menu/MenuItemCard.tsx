import { useState, useEffect } from 'react';
import { useCartStore, CartItem } from '@/store/cartStore';

interface MenuItemProps {
  item: Omit<CartItem, 'quantity'> & { time?: string };
}

export function MenuItemCard({ item }: MenuItemProps) {
  const addItem = useCartStore(state => state.addItem);
  const items = useCartStore(state => state.items);
  const [isAvailable, setIsAvailable] = useState(true);
  
  useEffect(() => {
    if (!item.time || item.time.trim() === '') {
      setIsAvailable(true);
      return;
    }

    const checkAvailability = () => {
      try {
        const [startStr, endStr] = item.time.split('-').map(s => s.trim());
        if (!startStr || !endStr) return;

        const parseTime = (timeStr: string) => {
          const [time, modifier] = timeStr.split(' ');
          let [hours, minutes] = time.split(':').map(Number);
          if (modifier === 'PM' && hours < 12) hours += 12;
          if (modifier === 'AM' && hours === 12) hours = 0;
          const d = new Date();
          d.setHours(hours, minutes, 0, 0);
          return d;
        };

        const startTime = parseTime(startStr);
        const endTime = parseTime(endStr);
        const now = new Date();

        setIsAvailable(now >= startTime && now <= endTime);
      } catch (e) {
        setIsAvailable(true); // default to true if parsing fails
      }
    };

    checkAvailability();
    const interval = setInterval(checkAvailability, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [item.time]);

  const isVeg = item.dietary?.toLowerCase().includes('veg') && !item.dietary?.toLowerCase().includes('non');
  const cartItem = items.find(i => i.id === item.id);

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-start transition-all ${isAvailable ? 'hover:shadow-md' : 'opacity-60'}`}>
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-2 mb-1.5">
          {/* Veg/Non-Veg Dot */}
          <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${isVeg ? 'border-green-600' : 'border-red-600'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
          </div>
          <h3 className="font-semibold text-gray-900 leading-tight">{item.name}</h3>
        </div>
        <p className="text-sm font-medium text-gray-600 font-mono">?{item.price}</p>
        
        {!isAvailable && (
          <p className="text-[10px] sm:text-xs text-red-500 font-semibold mt-1.5 bg-red-50 inline-block px-2 py-0.5 rounded-md border border-red-100">
            Available: {item.time}
          </p>
        )}
      </div>
      
      <div className="flex-shrink-0">
        <button 
          onClick={() => addItem(item)}
          disabled={!isAvailable}
          className={`${isAvailable ? 'bg-[#fafafa] hover:bg-gray-100 border-gray-200 text-gray-900 active:scale-95' : 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'} border font-semibold text-sm px-4 py-2 rounded-xl transition-all`}
        >
          {cartItem ? `+ Add (${cartItem.quantity})` : '+ Add'}
        </button>
      </div>
    </div>
  );
}
