import { useQuery } from '@tanstack/react-query';
import { fetchPopularVideosByCategory } from './api';

export function usePopularVideosByCategory(regionCode: string) {
  return useQuery({
    queryKey: ['popularVideosByCategory', regionCode],
    queryFn: () => fetchPopularVideosByCategory(regionCode),
    staleTime: 1000 * 30,
  });
}
