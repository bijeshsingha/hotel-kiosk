const fs = require('fs');
const path = 'd:/kachra/Downloads/Digital Form Hotel/lib/schemas/guestSchema.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'signatureDataUrl: z.string().min(10, \'Digital signature is required\'),',
  'signatureDataUrl: z.string().min(10, \'Digital signature is required\'),\n  idImageUrl: z.string().optional().default(\'\'),'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed Schema');
