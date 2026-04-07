import { fetchApi } from '../../lib/api';
import type { AdminDashboard } from './types';

function createAuthorizationHeader(accessToken: string) {
  return { Authorization: `Bearer ${accessToken}` };
}

export async function fetchAdminDashboard(accessToken: string) {
  return fetchApi<AdminDashboard>('/api/admin/dashboard', {
    headers: createAuthorizationHeader(accessToken),
  });
}
