const fs = require('fs');
const path = 'd:/kachra/Downloads/Digital Form Hotel/app/api/admin/registrations/route.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'import { getAllRegistrations, getRegistrationById, updateSyncStatus, updateRoomNumber } from \'@/lib/db\';',
  'import { getAllRegistrations, getRegistrationById, updateSyncStatus, updateRoomNumber, updateCheckoutDetails } from \'@/lib/db\';'
);

const newAction = `
    if (action === 'updateCheckout' && registrationId) {
      const { checkoutTime, extraItems } = body;
      const updatedRecord = await updateCheckoutDetails(registrationId, checkoutTime || '', extraItems || '');
      if (!updatedRecord) {
        return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
      }

      console.log(\`[CHECKOUT INFO UPDATED] Staff updated checkout info for \${registrationId}\`);

      return NextResponse.json({
        success: true,
        message: \`Checkout information saved for \${registrationId}\`,
        record: updatedRecord,
      });
    }

    if (action === 'updateRoomNumber'`;

content = content.replace(
  "    if (action === 'updateRoomNumber'",
  newAction
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done API');
