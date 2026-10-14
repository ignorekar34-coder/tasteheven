/**
 * Utility functions for processing and converting product & banner images
 * Resizes and compresses image files into ultra-lightweight, crisp base64 Data URLs
 * to ensure 60fps performance, instant rendering, and zero quota or glitch issues.
 */

export async function processImageFile(
  file: File,
  maxWidth = 640,
  maxHeight = 640,
  quality = 0.78
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Selected file must be a valid image (JPG, PNG, WebP)'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for processing'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Proportional constraint
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Attempt WebP first for optimal byte-size / sharpness ratio
        try {
          const webpData = canvas.toDataURL('image/webp', quality);
          if (webpData.startsWith('data:image/webp') && webpData.length < 150000) {
            resolve(webpData);
            return;
          }
        } catch {
          // Fallback to JPEG
        }

        // High compatibility JPEG
        const jpegData = canvas.toDataURL('image/jpeg', quality);
        resolve(jpegData);
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Dedicated compression for wide homepage hero banners (1200x750, ~60KB-90KB)
 */
export async function processBannerImageFile(file: File): Promise<string> {
  return processImageFile(file, 1200, 750, 0.80);
}
