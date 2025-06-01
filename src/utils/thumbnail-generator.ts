/**
 * Thumbnail Generator for optimized image thumbnails
 * Generates smaller versions of images for better performance
 */

export interface ThumbnailOptions {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'webp' | 'png';
}

export class ThumbnailGenerator {
    private static canvas: HTMLCanvasElement;
    private static ctx: CanvasRenderingContext2D;
    private static thumbnailCache = new Map<string, string>();
    private static readonly MAX_CACHE_SIZE = 50;

    static {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;
    }

    /**
     * Generate a thumbnail from an image URL
     */
    static async generateThumbnail(
        imageUrl: string,
        options: ThumbnailOptions = {}
    ): Promise<string> {
        const {
            width = 80,
            height = 80,
            quality = 0.8,
            format = 'jpeg'
        } = options;

        // Create cache key
        const cacheKey = `${imageUrl}_${width}x${height}_${quality}_${format}`;
        
        // Return cached thumbnail if available
        if (this.thumbnailCache.has(cacheKey)) {
            return this.thumbnailCache.get(cacheKey)!;
        }

        try {
            const thumbnailUrl = await this._createThumbnail(imageUrl, width, height, quality, format);
            this._addToCache(cacheKey, thumbnailUrl);
            return thumbnailUrl;
        } catch (error) {
            console.warn(`Failed to generate thumbnail for ${imageUrl}:`, error);
            // Return original URL as fallback
            return imageUrl;
        }
    }

    /**
     * Generate thumbnails for multiple images
     */
    static async generateBatch(
        imageUrls: string[],
        options: ThumbnailOptions = {}
    ): Promise<Array<{ original: string; thumbnail: string }>> {
        const promises = imageUrls.map(async (url) => ({
            original: url,
            thumbnail: await this.generateThumbnail(url, options)
        }));

        const results = await Promise.allSettled(promises);
        return results
            .filter((result): result is PromiseFulfilledResult<{ original: string; thumbnail: string }> => 
                result.status === 'fulfilled')
            .map(result => result.value);
    }

    /**
     * Clear thumbnail cache
     */
    static clearCache(): void {
        // Revoke blob URLs to free memory
        this.thumbnailCache.forEach(url => {
            if (url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        });
        this.thumbnailCache.clear();
    }

    /**
     * Get cache statistics
     */
    static getCacheStats() {
        return {
            size: this.thumbnailCache.size,
            maxSize: this.MAX_CACHE_SIZE
        };
    }

    private static async _createThumbnail(
        imageUrl: string,
        width: number,
        height: number,
        quality: number,
        format: string
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                try {
                    this.canvas.width = width;
                    this.canvas.height = height;

                    // For square thumbnails, use smart cropping
                    if (width === height) {
                        this._drawSquareThumbnail(img, width);
                    } else {
                        // Original logic for non-square thumbnails
                        this._drawStandardThumbnail(img, width, height);
                    }

                    // Convert to blob URL
                    const mimeType = format === 'jpeg' ? 'image/jpeg' :
                                   format === 'webp' ? 'image/webp' : 'image/png';

                    this.canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(URL.createObjectURL(blob));
                        } else {
                            reject(new Error('Failed to generate thumbnail blob'));
                        }
                    }, mimeType, quality);
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => reject(new Error(`Failed to load image: ${imageUrl}`));
            img.src = imageUrl;
        });
    }

    /**
     * Draw perfect square thumbnail with smart cropping
     */
    private static _drawSquareThumbnail(img: HTMLImageElement, size: number): void {
        // Clear canvas
        this.ctx.clearRect(0, 0, size, size);

        // Calculate the largest square that fits in the image
        const minDimension = Math.min(img.width, img.height);

        // Calculate crop coordinates (center the crop area)
        const cropX = (img.width - minDimension) / 2;
        const cropY = (img.height - minDimension) / 2;

        // Draw the center square portion of the image
        this.ctx.drawImage(
            img,
            cropX, cropY, minDimension, minDimension,  // Source: crop square from center
            0, 0, size, size                           // Destination: fill entire canvas
        );
    }

    /**
     * Draw standard thumbnail with aspect ratio preservation
     */
    private static _drawStandardThumbnail(img: HTMLImageElement, width: number, height: number): void {
        // Original logic for non-square thumbnails
        const aspectRatio = img.width / img.height;
        let drawWidth = width;
        let drawHeight = height;
        let offsetX = 0;
        let offsetY = 0;

        if (aspectRatio > 1) {
            // Landscape image
            drawHeight = width / aspectRatio;
            offsetY = (height - drawHeight) / 2;
        } else {
            // Portrait image
            drawWidth = height * aspectRatio;
            offsetX = (width - drawWidth) / 2;
        }

        // Clear canvas and draw image
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    private static _addToCache(key: string, thumbnailUrl: string): void {
        // Implement LRU eviction if cache is full
        if (this.thumbnailCache.size >= this.MAX_CACHE_SIZE) {
            const firstKey = this.thumbnailCache.keys().next().value;
            if (firstKey) {
                const oldUrl = this.thumbnailCache.get(firstKey);
                if (oldUrl && oldUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(oldUrl);
                }
                this.thumbnailCache.delete(firstKey);
            }
        }

        this.thumbnailCache.set(key, thumbnailUrl);
    }
}

/**
 * Utility function for mobile-optimized square thumbnails
 */
export function generateMobileThumbnail(imageUrl: string): Promise<string> {
    // Responsive square thumbnails for different screen sizes
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;

    let size: number;
    if (isSmallMobile) {
        size = 64;  // Small mobile
    } else if (isMobile) {
        size = 72;  // Tablet
    } else {
        size = 80;  // Desktop
    }

    // Always generate perfect squares
    return ThumbnailGenerator.generateThumbnail(imageUrl, {
        width: size,
        height: size,  // Same as width for perfect squares
        quality: isMobile ? 0.7 : 0.8,
        format: 'jpeg'
    });
}

/**
 * Preload and generate thumbnails for an array of images
 */
export async function preloadThumbnails(imageUrls: string[]): Promise<void> {
    const batchSize = 5; // Process in batches to avoid overwhelming the browser
    
    for (let i = 0; i < imageUrls.length; i += batchSize) {
        const batch = imageUrls.slice(i, i + batchSize);
        await ThumbnailGenerator.generateBatch(batch);
        
        // Small delay between batches to keep UI responsive
        if (i + batchSize < imageUrls.length) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
}
