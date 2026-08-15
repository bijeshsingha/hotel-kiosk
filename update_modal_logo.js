const fs = require('fs');
const file = 'components/GuestDetailModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div className="border-b-2 border-gray-900 pb-4 text-center">[\s\S]*?<\/p>/;

const newHeader = `<div className="border-b-2 border-gray-900 pb-4">
              <div className="flex items-center justify-center gap-4 mb-2">
                <img src="/logo.png" alt="HDV Logo" className="w-[60px] h-auto object-contain" />
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-bold tracking-[0.25em] text-gray-500 uppercase leading-none mb-1">Hotel</span>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight font-heading leading-none mb-1">DIVINE VIEW</h1>
                  <p className="text-xs italic text-gray-600 font-serif leading-none mt-0.5">Your Stay in North east</p>
                </div>
              </div>
              <p className="text-xs text-center uppercase font-bold text-gray-600 font-body tracking-widest mt-3">
                Official Guest Registration & Police Intake Form (Form-C)
              </p>`;

content = content.replace(regex, newHeader);
fs.writeFileSync(file, content, 'utf8');
