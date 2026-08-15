const fs = require('fs');
const path = 'd:/kachra/Downloads/Digital Form Hotel/app/admin/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'const headers = ["Registration ID", "Date", "Time", "Full Name", "Mobile", "Nationality", "Room Number", "Status", "Total Co-Guests"];',
  'const headers = ["Registration ID", "Date", "Time", "Full Name", "Mobile", "Nationality", "Room Number", "Status", "Total Co-Guests", "Checkout Time", "Extra Items"];'
);

content = content.replace(
  'reg.coGuests ? reg.coGuests.length : 0\n      ].join(",");',
  'reg.coGuests ? reg.coGuests.length : 0,\n        reg.checkoutTime ? new Date(reg.checkoutTime).toLocaleString() : \'\',\n        `"${reg.extraItems ? reg.extraItems.replace(/"/g, \'""\') : \'\'}"`\n      ].join(",");'
);

// We can also add a small badge for "Checked Out" in the list view
content = content.replace(
  '{reg.syncStatus === \'synced\' && <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}',
  '{reg.checkoutTime && <span className="mr-2 text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase font-bold border border-blue-200">Checked Out</span>}\n                        {reg.syncStatus === \'synced\' && <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done Page');
