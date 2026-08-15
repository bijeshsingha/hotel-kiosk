import { GlobalNav } from './GlobalNav';
import { isAuthenticated } from '@/lib/auth';

export async function GlobalNavWrapper() {
  const isAuth = await isAuthenticated();
  
  if (!isAuth) {
    return null;
  }
  
  return <GlobalNav />;
}
