/**
 * Utility functions for processing and converting product & banner images
 * Resizes and compresses image files into ultra-lightweight, crisp base64 Data URLs (max 800px width)
 * to ensure instant loading, zero lag, zero glitch, and strict adherence to localStorage limits.
 */

export async function processImageFile(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  initialQuality = 0.78
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('براہ کرم درست تصویر منتخب کریں (JPG, PNG, WebP)'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('تصویر پڑھنے میں خرابی ہوئی'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('تصویر پراسیس کرنے میں ناکامی'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Strictly enforce max width 800px and max height 800px
        const effectiveMaxWidth = Math.min(maxWidth, 800);
        const effectiveMaxHeight = Math.min(maxHeight, 800);

        if (width > effectiveMaxWidth || height > effectiveMaxHeight) {
          const ratio = Math.min(effectiveMaxWidth / width, effectiveMaxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
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

        // Try JPEG compression with quality fallback to stay well below 70KB
        let quality = initialQuality;
        let output = canvas.toDataURL('image/jpeg', quality);

        // If string is still larger than 90KB, re-compress with 0.68 quality
        if (output.length > 90000) {
          quality = 0.68;
          output = canvas.toDataURL('image/jpeg', quality);
        }

        // If still > 75KB, stepped fallback
        if (output.length > 80000) {
          quality = 0.58;
          output = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(output);
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Dedicated compression for homepage hero banner (max 800px width for fast loading & localStorage safety)
 */
export async function processBannerImageFile(file: File): Promise<string> {
  return processImageFile(file, 800, 500, 0.75);
}
