import { deleteRegistration, anonymizeRegistration } from '@/lib/db';

export async function purgeRecord(registrationId: string) {
  console.log(`[COMPLIANCE] Initiating full purge for registration: ${registrationId}`);
  const success = await deleteRegistration(registrationId);
  if (success) {
    console.log(`[COMPLIANCE] Successfully purged registration: ${registrationId}`);
  } else {
    console.error(`[COMPLIANCE] Failed to purge registration: ${registrationId} (Not Found)`);
  }
  return success;
}

export async function anonymizeRecord(registrationId: string) {
  console.log(`[COMPLIANCE] Initiating anonymization for checkout: ${registrationId}`);
  const success = await anonymizeRegistration(registrationId);
  if (success) {
    console.log(`[COMPLIANCE] Successfully anonymized registration: ${registrationId}`);
  } else {
    console.error(`[COMPLIANCE] Failed to anonymize registration: ${registrationId} (Not Found)`);
  }
  return success;
}
