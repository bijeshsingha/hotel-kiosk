const fs = require('fs');
const path = 'd:/kachra/Downloads/Digital Form Hotel/lib/db.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'signatureDataUrl: string;',
  'signatureDataUrl: string;\n  idImageUrl?: string;'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done DB Schema');
