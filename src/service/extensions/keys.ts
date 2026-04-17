export const extensionKeys = {
  all: ['extensions'] as const,
  lists: () => [...extensionKeys.all, 'list'] as const,
  list: (filters?: any) => [...extensionKeys.lists(), filters] as const,
  details: () => [...extensionKeys.all, 'detail'] as const,
  detail: (id: string) => [...extensionKeys.details(), id] as const,
};
