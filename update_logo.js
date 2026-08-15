const fs = require('fs');
const file = 'app/check-in/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldHeader = `<header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/15 border 
border-secondary/30 text-secondary text-xs font-bold uppercase tracking-widest mb-3 font-body">
            <Sparkles className="w-3.5 h-3.5" /> Guest Self-Service Kiosk
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main tracking-tight font-heading mb-2">
            HOTEL DIVINE VIEW
          </h1>
          <p className="text-text-muted text-sm sm:text-base font-body">
            Digital Guest Registration & Intake Form
          </p>
        </header>`;

const newHeader = `<header className="flex flex-col items-center justify-center mb-10 mt-2">
          <div className="flex items-center justify-center gap-4 sm:gap-6 bg-white/80 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 backdrop-blur-md">
            {/* Logo Image */}
            <div className="flex-shrink-0">
              <img src="/logo.png" alt="HDV Logo" className="w-[80px] sm:w-[110px] h-auto object-contain rounded-sm" />
            </div>
            
            {/* Vertical Separator */}
            <div className="w-px h-16 sm:h-20 bg-gray-300"></div>
            
            {/* Typography */}
            <div className="flex flex-col text-left">
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-gray-500 uppercase leading-none mb-1">Hotel</span>
              <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight font-heading leading-none mb-1.5">DIVINE VIEW</h1>
              <p className="text-sm sm:text-base italic text-gray-600 font-serif leading-none mt-0.5">Your Stay in North east</p>
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 mt-6 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs sm:text-sm font-bold uppercase tracking-wider font-body shadow-sm">
            <Sparkles className="w-4 h-4" /> Guest Self-Service Kiosk
          </div>
        </header>`;

content = content.replace(oldHeader, newHeader);
fs.writeFileSync(file, content, 'utf8');
