const fs = require('fs');
const path = 'd:/kachra/Downloads/Digital Form Hotel/lib/db.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '  idImageUrl?: string;\n  idImageUrl?: string;',
  '  idImageUrl?: string;'
);

content = content.replace(
  '  syncStatus: \'synced\' | \'pending\' | \'failed\';',
  '  syncStatus: \'synced\' | \'pending\' | \'failed\' | \'archived_anonymized\';'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed db.ts duplicate and types');
