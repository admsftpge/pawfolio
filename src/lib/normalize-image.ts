import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

const MAX_DIMENSION = 2048;

/**
 * Transcode any picked image to a right-sized JPEG before upload. TheCatApi
 * rejects HEIC (every iPhone photo) and other formats, so normalise and
 * downscale large photos to keep uploads quick.
 */
export async function normalizeImageToJpeg(
  uri: string,
  width: number,
  height: number,
): Promise<string> {
  try {
    const context = ImageManipulator.manipulate(uri);

    if (Math.max(width, height) > MAX_DIMENSION) {
      context.resize(width >= height ? { width: MAX_DIMENSION } : { height: MAX_DIMENSION });
    }

    const rendered = await context.renderAsync();
    const result = await rendered.saveAsync({ format: SaveFormat.JPEG, compress: 0.8 });
    return result.uri;
  } catch {
    throw new Error('We couldn’t process that photo — please try a different one.');
  }
}
