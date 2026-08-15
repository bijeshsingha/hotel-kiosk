'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Coffee, MenuSquare, UserPlus, X, Command } from 'lucide-react';

export function GlobalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: 'Kiosk', href: '/check-in', icon: UserPlus },
    { name: 'Admin', href: '/admin', icon: LayoutDashboard },
    { name: 'POS', href: '/pos', icon: Coffee },
    { name: 'Menu', href: '/menu', icon: MenuSquare },
  ];

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {isOpen && (
        <div className="absolute bottom-14 left-0 bg-gray-900/90 backdrop-blur-md rounded-2xl p-2 shadow-2xl flex flex-col gap-1 w-40 border border-gray-700/50">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-amber-500/20 text-amber-300' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-gray-800 transition-all border border-gray-700 active:scale-95"
        aria-label="App Switcher"
      >
        {isOpen ? <X className="w-5 h-5 text-gray-400" /> : <Command className="w-5 h-5 text-gray-300" />}
      </button>
    </div>
  );
}
