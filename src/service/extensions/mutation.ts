import { useMutation, useQueryClient } from '@tanstack/react-query';
import { extensionApi } from './api';
import { extensionKeys } from './keys';

export const useExtensionActionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) => 
      extensionApi.sendAction(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: extensionKeys.all });
    },
  });
};
