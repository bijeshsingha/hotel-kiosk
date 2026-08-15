'use client';
import { useState } from 'react';
import { MenuItemCard } from './MenuItemCard';
import { FloatingCart } from './FloatingCart';
import { Sparkles } from 'lucide-react';

interface MenuLayoutProps {
  menuData: Record<string, any[]>;
}

export function MenuLayout({ menuData }: MenuLayoutProps) {
  const categories = Object.keys(menuData);
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const handleScrollTo = (category: string) => {
    setActiveCategory(category);
    const element = document.getElementById(`category-${category}`);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pb-32">
      {/* Header */}
      <header className="bg-white px-6 pt-10 pb-4 sticky top-0 z-20 border-b border-gray-100 shadow-sm">
        <h1 className="text-3xl font-black text-gray-900 font-heading mb-4">In-Room Dining</h1>
        
        {/* Category Pills (Horizontal Scroll) */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-6 px-6">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleScrollTo(category)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeCategory === category 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {/* Menu Grid */}
      <main className="px-4 sm:px-6 mt-6 max-w-3xl mx-auto">
        {categories.map(category => (
          <section key={category} id={`category-${category}`} className="mb-10 pt-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuData[category].map(item => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </main>

      <FloatingCart />
      
      {/* CSS for hide-scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
