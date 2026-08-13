import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'hotel_admin_session';

// Default Staff Credentials
export const STAFF_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123',
};

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return sessionToken === 'authenticated_staff_session';
}
