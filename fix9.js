const fs = require('fs');
const path = 'd:/kachra/Downloads/Digital Form Hotel/lib/schemas/guestSchema.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'signatureDataUrl: z.string().min(1, \'Please provide your signature\'),',
  'signatureDataUrl: z.string().min(1, \'Please provide your signature\'),\n  idImageUrl: z.string().optional().default(\'\'),'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done Schema');
