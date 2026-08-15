const fs = require('fs');
const path = 'd:/kachra/Downloads/Digital Form Hotel/lib/db.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '  signatureDataUrl: string;',
  '  signatureDataUrl: string;\n  checkoutTime?: string;\n  extraItems?: string;'
);

const newFunc = `
export async function updateCheckoutDetails(
  registrationId: string,
  checkoutTime: string,
  extraItems: string
): Promise<any | null> {
  const records = await getAllRegistrations();
  const index = records.findIndex((r) => r.registrationId === registrationId);
  if (index === -1) return null;

  records[index].checkoutTime = checkoutTime;
  records[index].extraItems = extraItems;
  records[index].updatedAt = new Date().toISOString();

  await saveKvRecords(records);
  writeLocalDb(records);

  return records[index];
}
`;
content += newFunc;

fs.writeFileSync(path, content, 'utf8');
console.log('Done DB');
