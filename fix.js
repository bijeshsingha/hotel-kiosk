const fs = require('fs');
const path = 'd:/kachra/Downloads/Digital Form Hotel/app/admin/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /(<main className="max-w-6xl mx-auto px-4 py-8">\s*\{\/\* Top Admin Header \*\/})/g,
  '<main className="max-w-6xl mx-auto px-4 py-8">\n      <div className="no-print">\n      {/* Top Admin Header */}'
);

content = content.replace(
  /(\s*\{\/\* Guest Full Detail & Print Modal \*\/})/g,
  '\n      </div>\n'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done');
