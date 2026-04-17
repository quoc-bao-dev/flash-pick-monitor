import { useQuery } from '@tanstack/react-query';
import { extensionApi } from './api';
import { extensionKeys } from './keys';
import type { ExtensionFilters } from './types';

export const useExtensionListQuery = (filters?: ExtensionFilters) => {
  return useQuery({
    queryKey: extensionKeys.list(filters),
    queryFn: () => extensionApi.getExtensions(filters),
    staleTime: 10_000,
  });
};
