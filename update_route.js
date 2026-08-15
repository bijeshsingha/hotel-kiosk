const fs = require('fs');
const p = 'app/api/sync/guest/route.ts';
let content = fs.readFileSync(p, 'utf8');

content = content.replace(
`import { saveLocalRegistration, updateSyncStatus } from '@/lib/db';`,
`import { saveLocalRegistration, updateSyncStatus } from '@/lib/db';
import { MockPMSService } from '@/lib/pms-mock';`
);

content = content.replace(
`    try {
      // In production: await fetch(process.env.PMS_API_URL!, { method: 'POST', body: JSON.stringify(data) });
      // Simulate PMS gateway push
      pmsSyncSuccess = true;
      pmsResponseData = { pmsAckId: \`PMS-ACK-\${Date.now()}\`, status: 'RECEIVED' };
    } catch (err: any) {`,
`    try {
      // Use Mock PMS Service
      pmsResponseData = await MockPMSService.pushGuestProfile(data);
      pmsSyncSuccess = true;
    } catch (err: any) {`
);

fs.writeFileSync(p, content, 'utf8');
