const fs = require('fs');
const path = 'd:/kachra/Downloads/Digital Form Hotel/lib/db.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'signatureDataUrl: string;',
  'signatureDataUrl: string;\n  idImageUrl?: string;'
);

content = content.replace(
  'signatureDataUrl: payload.signatureDataUrl,',
  'signatureDataUrl: payload.signatureDataUrl,\n    idImageUrl: payload.idImageUrl,'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done db.ts replace');
