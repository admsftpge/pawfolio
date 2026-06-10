import { useMutation, useQueryClient } from '@tanstack/react-query';

import { uploadImage } from '@/api/images';
import { queryKeys } from '@/hooks/use-cats';
import { normalizeImageToJpeg } from '@/lib/normalize-image';

type UploadInput = {
  uri: string;
  width: number;
  height: number;
};

export function useUploadCat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uri, width, height }: UploadInput) => {
      const jpegUri = await normalizeImageToJpeg(uri, width, height);
      await uploadImage(jpegUri);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.images }),
  });
}
