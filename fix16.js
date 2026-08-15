const fs = require('fs');
const path = 'd:/kachra/Downloads/Digital Form Hotel/lib/db.ts';
let content = fs.readFileSync(path, 'utf8');

const newFunctions = `
export async function deleteRegistration(registrationId: string): Promise<boolean> {
  const records = await getAllRegistrations();
  const initialLength = records.length;
  const filtered = records.filter(r => r.registrationId !== registrationId);
  
  if (filtered.length === initialLength) return false;
  
  await saveKvRecords(filtered);
  writeLocalDb(filtered);
  return true;
}

export async function anonymizeRegistration(registrationId: string): Promise<boolean> {
  const records = await getAllRegistrations();
  const index = records.findIndex(r => r.registrationId === registrationId);
  if (index === -1) return false;

  // Anonymize sensitive fields
  records[index].signatureDataUrl = '';
  records[index].idImageUrl = '';
  
  // Optionally anonymize primary contact (leaving just name/nationality for ledger)
  if (records[index].primaryGuest?.contact) {
    records[index].primaryGuest.contact.mobileNumber = '[REDACTED]';
    records[index].primaryGuest.contact.email = '[REDACTED]';
  }
  
  records[index].syncStatus = 'archived_anonymized';
  records[index].updatedAt = new Date().toISOString();

  await saveKvRecords(records);
  writeLocalDb(records);
  return true;
}
`;

content += newFunctions;
fs.writeFileSync(path, content, 'utf8');
console.log('Done updating db.ts');
