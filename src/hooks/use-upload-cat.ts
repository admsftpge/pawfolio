import { useMutation, useQueryClient } from '@tanstack/react-query';

import { uploadImage } from '@/api/images';
import { queryKeys } from '@/hooks/use-cats';

export function useUploadCat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadImage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.images }),
  });
}
