const fs = require('fs');
const path = 'd:/kachra/Downloads/Digital Form Hotel/app/api/pms-sync/route.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'signatureDataUrl: data.signatureDataUrl,',
  'signatureDataUrl: data.signatureDataUrl,\n      idImageUrl: data.idImageUrl,'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done route.ts replace');
