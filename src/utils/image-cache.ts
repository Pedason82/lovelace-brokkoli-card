/**
 * Image Cache Manager for optimized image loading and caching
 * Provides preloading, caching, and memory management for gallery images
 */

export interface CacheStats {
    size: number;
    maxSize: number;
    hitRate: number;
    totalRequests: number;
    cacheHits: number;
}

export class ImageCacheManager {
    private static instance: ImageCacheManager;
    private cache = new Map<string, HTMLImageElement>();
    private loadingPromises = new Map<string, Promise<HTMLImageElement>>();
    private readonly MAX_CACHE_SIZE = 20;
    private stats = {
        totalRequests: 0,
        cacheHits: 0
    };

    static getInstance(): ImageCacheManager {
        if (!ImageCacheManager.instance) {
            ImageCacheManager.instance = new ImageCacheManager();
        }
        return ImageCacheManager.instance;
    }

    /**
     * Preload an image and add it to cache
     */
    async preloadImage(url: string): Promise<HTMLImageElement> {
        this.stats.totalRequests++;

        // Return cached image if available
        if (this.cache.has(url)) {
            this.stats.cacheHits++;
            return this.cache.get(url)!;
        }

        // Return existing loading promise if already loading
        if (this.loadingPromises.has(url)) {
            return this.loadingPromises.get(url)!;
        }

        // Create new loading promise
        const loadingPromise = this._loadImage(url);
        this.loadingPromises.set(url, loadingPromise);

        try {
            const img = await loadingPromise;
            this._addToCache(url, img);
            return img;
        } catch (error) {
            console.warn(`Failed to preload image: ${url}`, error);
            throw error;
        } finally {
            this.loadingPromises.delete(url);
        }
    }

    /**
     * Check if image is cached
     */
    isCached(url: string): boolean {
        return this.cache.has(url);
    }

    /**
     * Get cached image without loading
     */
    getCachedImage(url: string): HTMLImageElement | null {
        return this.cache.get(url) || null;
    }

    /**
     * Clear cache
     */
    clearCache(): void {
        this.cache.clear();
        this.loadingPromises.clear();
        this.stats = { totalRequests: 0, cacheHits: 0 };
    }

    /**
     * Get cache statistics
     */
    getStats(): CacheStats {
        return {
            size: this.cache.size,
            maxSize: this.MAX_CACHE_SIZE,
            hitRate: this.stats.totalRequests > 0 ? this.stats.cacheHits / this.stats.totalRequests : 0,
            totalRequests: this.stats.totalRequests,
            cacheHits: this.stats.cacheHits
        };
    }

    /**
     * Preload multiple images in batch
     */
    async preloadBatch(urls: string[]): Promise<PromiseSettledResult<HTMLImageElement>[]> {
        const promises = urls.map(url => this.preloadImage(url));
        return Promise.allSettled(promises);
    }

    private async _loadImage(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
            
            // Set crossOrigin for CORS support
            img.crossOrigin = 'anonymous';
            img.src = url;
        });
    }

    private _addToCache(url: string, img: HTMLImageElement): void {
        // Implement LRU eviction if cache is full
        if (this.cache.size >= this.MAX_CACHE_SIZE) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }
        
        this.cache.set(url, img);
    }
}

/**
 * Utility function to preload images with error handling
 */
export async function preloadImages(urls: string[]): Promise<void> {
    const cacheManager = ImageCacheManager.getInstance();
    const results = await cacheManager.preloadBatch(urls);
    
    const failures = results.filter(result => result.status === 'rejected');
    if (failures.length > 0) {
        console.warn(`Failed to preload ${failures.length} out of ${urls.length} images`);
    }
}
