import { useQuery } from '@tanstack/react-query';
import { fetchAdminDashboard } from './api';

export const adminQueryKeys = {
  dashboard: (accessToken: string | null) => ['admin', 'dashboard', accessToken] as const,
};

export function useAdminDashboard(accessToken: string | null, enabled = true) {
  return useQuery({
    enabled: enabled && Boolean(accessToken),
    queryKey: adminQueryKeys.dashboard(accessToken),
    queryFn: () => fetchAdminDashboard(accessToken as string),
    staleTime: 1000 * 30,
  });
}
