import { CatImage, deleteImage } from '@/api/images';
import { queryKeys } from '@/hooks/use-cats';
import { useOptimisticListMutation } from '@/hooks/use-optimistic-list-mutation';

export function useDeleteCat() {
  return useOptimisticListMutation<string, CatImage>({
    queryKey: queryKeys.images,
    mutationFn: deleteImage,
    update: (images, imageId) => images.filter((image) => image.id !== imageId),
  });
}
