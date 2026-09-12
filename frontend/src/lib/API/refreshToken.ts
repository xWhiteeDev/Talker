import { isUrlValid } from '../../services/guardService';

export async function refreshToken() {
  const fullEndpoint = import.meta.env['VITE_SERVER_ENDPOINT'] + '/api/auth/refresh';
  const isUrlCorrect: boolean = isUrlValid(fullEndpoint);
  if (!isUrlCorrect) {
    return false;
  }
  const res = await fetch(fullEndpoint, { method: 'POST', credentials: 'include' });
  if (!res.ok) {
    if (res.status === 401) {
      return { success: false, requiresLogin: true };
    }
    return { success: false, requiresLogin: false };
  }
  return { success: true, requiresLogin: false };
}
