import { CSSResult, HTMLTemplateResult, LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { HomeAssistant } from 'custom-card-helpers';
import { galleryStyles } from '../styles/gallery-styles';
import { PlantEntityUtils } from '../utils/plant-entity-utils';
import { ImageCacheManager } from '../utils/image-cache';
import { ThumbnailGenerator, generateMobileThumbnail, generateGalleryImage } from '../utils/thumbnail-generator';
import { TouchHandler, createGalleryTouchHandler } from '../utils/touch-handler';

// Klasse definieren ohne customElement-Decorator
export class FlowerGallery extends LitElement {
    @property() public hass?: HomeAssistant;
    @property() public entityId?: string;
    @property({ type: Array }) public images: string[] = [];
    @property() public onClose?: () => void;
    @property() public getImageDate?: (url: string) => string;
    @property({ type: Number }) public initialImageIndex?: number;
    @state() private _currentImageIndex = 0;
    @state() private _isFading = false;
    @state() private _showActionsFlyout = false;
    @state() private _isPlaying = false;
    @state() private _thumbnailUrls = new Map<string, string>();
    @state() private _galleryImageUrls = new Map<string, string>();
    private _imageRotationInterval?: NodeJS.Timeout;
    private _reparentedToBody: boolean = false;
    private _plantInfo: Record<string, any> | null = null;
    private _isLoading: boolean = false;
    private _imagesList: Array<{url: string, date: Date}> = [];
    private _isImagesLoading: boolean = false;
    private _treatmentHistory: Array<{date: Date, treatment: string}> = [];
    private _imageCache = ImageCacheManager.getInstance();
    private _preloadingPromises = new Map<string, Promise<HTMLImageElement>>();
    private _thumbnailCache = new Map<string, string>();
    private _thumbnailPromises = new Map<string, Promise<string>>();
    private _galleryImageCache = new Map<string, string>();
    private _galleryImagePromises = new Map<string, Promise<string>>();
    private _touchHandler?: TouchHandler;

    private _isChanging = false;

    private async _changeImage(direction: 'next' | 'prev' = 'next', pauseSlideshow: boolean = false) {
        // Prevent multiple simultaneous changes
        if (this._isChanging) return;

        this._isChanging = true;
        this._isFading = true;
        this.requestUpdate();

        await new Promise(resolve => setTimeout(resolve, 500)); // Back to 500ms for smoother transitions

        if (direction === 'next') {
            this._currentImageIndex = (this._currentImageIndex + 1) % this.images.length;
        } else {
            this._currentImageIndex = (this._currentImageIndex - 1 + this.images.length) % this.images.length;
        }

        this._isFading = false;
        this._isChanging = false;
        this.requestUpdate();

        // Pause slideshow if manually navigating
        if (pauseSlideshow && this._isPlaying) {
            this._isPlaying = false;
            this._updateSlideshow();
        }

        // Trigger preloading after image change
        this._preloadAdjacentImages();

        // Preload gallery images for new current image
        this._preloadGalleryImages();

        // Scroll to active thumbnail
        this._scrollToActiveThumbnail();
    }

    /**
     * Preload images adjacent to current image for smooth navigation
     */
    private async _preloadAdjacentImages(): Promise<void> {
        if (this.images.length <= 1) return;

        const preloadRange = 2; // Preload 2 images ahead/behind
        const promises: Promise<HTMLImageElement>[] = [];

        for (let i = -preloadRange; i <= preloadRange; i++) {
            if (i === 0) continue; // Skip current image

            const index = (this._currentImageIndex + i + this.images.length) % this.images.length;
            const url = this.images[index];

            if (url && !this._preloadingPromises.has(url) && !this._imageCache.isCached(url)) {
                const promise = this._imageCache.preloadImage(url);
                this._preloadingPromises.set(url, promise);
                promises.push(promise);
            }
        }

        // Don't await all - let them load in background
        if (promises.length > 0) {
            Promise.allSettled(promises).then(() => {
                // Clean up completed promises
                promises.forEach(promise => {
                    const url = [...this._preloadingPromises.entries()]
                        .find(([_, p]) => p === promise)?.[0];
                    if (url) this._preloadingPromises.delete(url);
                });
            });
        }
    }

    /**
     * Get thumbnail URL for an image, generating if needed
     */
    private async _getThumbnailUrl(originalUrl: string): Promise<string> {
        if (this._thumbnailCache.has(originalUrl)) {
            return this._thumbnailCache.get(originalUrl)!;
        }

        // Return existing promise if already generating
        if (this._thumbnailPromises.has(originalUrl)) {
            return this._thumbnailPromises.get(originalUrl)!;
        }

        // Generate new thumbnail
        const thumbnailPromise = generateMobileThumbnail(originalUrl);
        this._thumbnailPromises.set(originalUrl, thumbnailPromise);

        try {
            const thumbnailUrl = await thumbnailPromise;
            this._thumbnailCache.set(originalUrl, thumbnailUrl);
            this._thumbnailUrls.set(originalUrl, thumbnailUrl);
            this.requestUpdate(); // Trigger re-render with new thumbnail
            return thumbnailUrl;
        } catch (error) {
            console.warn('Failed to generate thumbnail, using original:', error);
            return originalUrl;
        } finally {
            this._thumbnailPromises.delete(originalUrl);
        }
    }

    /**
     * Get gallery-optimized image URL for an image, generating if needed
     */
    private async _getGalleryImageUrl(originalUrl: string): Promise<string> {
        if (this._galleryImageCache.has(originalUrl)) {
            return this._galleryImageCache.get(originalUrl)!;
        }

        // Return existing promise if already generating
        if (this._galleryImagePromises.has(originalUrl)) {
            return this._galleryImagePromises.get(originalUrl)!;
        }

        // Generate new gallery-optimized image
        const galleryImagePromise = generateGalleryImage(originalUrl);
        this._galleryImagePromises.set(originalUrl, galleryImagePromise);

        try {
            const galleryImageUrl = await galleryImagePromise;
            this._galleryImageCache.set(originalUrl, galleryImageUrl);
            this._galleryImageUrls.set(originalUrl, galleryImageUrl);
            this.requestUpdate(); // Trigger re-render with new gallery image
            return galleryImageUrl;
        } catch (error) {
            console.warn('Failed to generate gallery image, using original:', error);
            return originalUrl;
        } finally {
            this._galleryImagePromises.delete(originalUrl);
        }
    }

    /**
     * Preload thumbnails for visible images
     */
    private async _preloadThumbnails(): Promise<void> {
        if (this.images.length === 0) return;

        // Generate thumbnails for current and adjacent images first
        const priorityIndices = [];
        const range = 3; // Current + 3 on each side

        for (let i = -range; i <= range; i++) {
            const index = (this._currentImageIndex + i + this.images.length) % this.images.length;
            priorityIndices.push(index);
        }

        // Generate priority thumbnails
        const priorityPromises = priorityIndices.map(index =>
            this._getThumbnailUrl(this.images[index])
        );

        // Don't wait for all, but start the process
        Promise.allSettled(priorityPromises).then(() => {
            // After priority thumbnails, generate the rest in background
            this._generateRemainingThumbnails();
        });
    }

    /**
     * Generate remaining thumbnails in background
     */
    private async _generateRemainingThumbnails(): Promise<void> {
        const batchSize = 3;
        const remainingUrls = this.images.filter(url => !this._thumbnailCache.has(url));

        for (let i = 0; i < remainingUrls.length; i += batchSize) {
            const batch = remainingUrls.slice(i, i + batchSize);
            const promises = batch.map(url => this._getThumbnailUrl(url));

            await Promise.allSettled(promises);

            // Small delay to keep UI responsive
            if (i + batchSize < remainingUrls.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    }

    /**
     * Preload gallery-optimized images for current and adjacent images
     */
    private async _preloadGalleryImages(): Promise<void> {
        if (this.images.length === 0) return;

        // Generate gallery images for current and adjacent images first
        const priorityIndices = [];
        const range = 2; // Current + 2 on each side

        for (let i = -range; i <= range; i++) {
            const index = (this._currentImageIndex + i + this.images.length) % this.images.length;
            priorityIndices.push(index);
        }

        // Generate priority gallery images
        const priorityPromises = priorityIndices.map(index =>
            this._getGalleryImageUrl(this.images[index])
        );

        // Don't wait for all, but start the process
        Promise.allSettled(priorityPromises).then(() => {
            // After priority images, generate the rest in background
            this._generateRemainingGalleryImages();
        });
    }

    /**
     * Generate remaining gallery images in background
     */
    private async _generateRemainingGalleryImages(): Promise<void> {
        const batchSize = 2; // Smaller batch size for larger images
        const remainingUrls = this.images.filter(url => !this._galleryImageCache.has(url));

        for (let i = 0; i < remainingUrls.length; i += batchSize) {
            const batch = remainingUrls.slice(i, i + batchSize);
            const promises = batch.map(url => this._getGalleryImageUrl(url));

            await Promise.allSettled(promises);

            // Longer delay for gallery images to keep UI responsive
            if (i + batchSize < remainingUrls.length) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
    }

    private async _selectImage(index: number) {
        if (index === this._currentImageIndex) return;

        // Starte Fade-Out
        this._isFading = true;
        this.requestUpdate();

        // Warte auf Fade-Out Animation
        await new Promise(resolve => setTimeout(resolve, 500));

        // Setze neuen Index
        this._currentImageIndex = index;

        // Starte Fade-In
        this._isFading = false;
        this.requestUpdate();

        // Trigger preloading after image selection
        this._preloadAdjacentImages();

        // Preload gallery images for new current image
        this._preloadGalleryImages();

        // Scroll to active thumbnail
        this._scrollToActiveThumbnail();
    }

    /**
     * Scroll to the active thumbnail for better mobile UX
     */
    private _scrollToActiveThumbnail(): void {
        this.updateComplete.then(() => {
            const activeThumb = this.shadowRoot?.querySelector('.thumbnail-container.active');
            if (activeThumb) {
                activeThumb.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        });
    }

    private _toggleActionsFlyout(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        this._showActionsFlyout = !this._showActionsFlyout;
    }

    private _togglePlayPause(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        this._isPlaying = !this._isPlaying;

        this._updateSlideshow();
        this.requestUpdate();
    }

    private _updateSlideshow() {
        // Clear existing interval
        if (this._imageRotationInterval) {
            clearInterval(this._imageRotationInterval);
            this._imageRotationInterval = undefined;
        }

        // Start slideshow if playing and we have multiple images
        if (this._isPlaying && this.images.length > 1) {
            this._imageRotationInterval = setInterval(() => {
                this._changeImage();
            }, 5000);
        }
    }

    private async _handleFileUpload(e: Event) {
        const input = e.target as HTMLInputElement;
        const files = input.files;
        
        if (files && files.length > 0) {
            const file = files[0];
            if (!file.type.startsWith('image/')) {
                alert('Bitte nur Bilder hochladen!');
                return;
            }
            
            if (file.size > 10 * 1024 * 1024) {
                alert('Bild ist zu groß! Maximale Größe ist 10MB.');
                return;
            }
            
            try {
                await this._uploadImage(file);
                this._showActionsFlyout = false;
            } catch (error) {
                alert('Fehler beim Upload: ' + error.message);
            }
        }
    }

    private async _uploadImage(file: File) {
        if (!this.entityId || !this.hass) return;

        const chunkSize = 16384; // 16KB Chunks
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            if (!e.target?.result) return;
            
            const data = e.target.result as ArrayBuffer;
            const totalChunks = Math.ceil(data.byteLength / chunkSize);
            
            for (let i = 0; i < totalChunks; i++) {
                const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
                const hexChunk = Array.from(new Uint8Array(chunk))
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('');
                
                try {
                    await this.hass.connection.sendMessagePromise({
                        type: 'plant/upload_image',
                        entity_id: this.entityId,
                        filename: file.name,
                        chunk: hexChunk,
                        chunk_index: i,
                        total_chunks: totalChunks
                    });
                } catch (error) {
                    console.error('Upload error:', error);
                    throw error;
                }
            }

            // Aktualisiere die Entity nach dem Upload
            await this.hass.callService('homeassistant', 'update_entity', {
                entity_id: this.entityId
            });
        };
        
        reader.readAsArrayBuffer(file);
    }

    private async _deleteImage(filename: string) {
        if (!this.entityId || !this.hass) return;

        try {
            await this.hass.connection.sendMessagePromise({
                type: 'plant/delete_image',
                entity_id: this.entityId,
                filename: filename
            });

            // Aktualisiere die Entity nach dem Löschen
            await this.hass.callService('homeassistant', 'update_entity', {
                entity_id: this.entityId
            });
        } catch (error) {
            throw new Error(`Fehler beim Löschen des Bildes: ${error.message}`);
        }
    }

    private async _setMainImage(filename: string) {
        if (!this.entityId || !this.hass) return;

        try {
            await this.hass.connection.sendMessagePromise({
                type: 'plant/set_main_image',
                entity_id: this.entityId,
                filename: filename
            });

            // Aktualisiere die Entity nach dem Setzen des Hauptbildes
            await this.hass.callService('homeassistant', 'update_entity', {
                entity_id: this.entityId
            });
        } catch (error) {
            throw new Error(`Fehler beim Setzen des Hauptbildes: ${error.message}`);
        }
    }

    private _close(e: Event) {
        e.stopPropagation();
        if (this._imageRotationInterval) {
            clearInterval(this._imageRotationInterval);
        }
        if (this.onClose) {
            this.onClose();
        }
        this.remove();
    }

    private async _loadPlantInfo() {
        if (!this.entityId || !this.hass || this._isLoading) return;

        this._isLoading = true;
        try {
            // Verwende PlantEntityUtils, um die Pflanzen-Info zu holen
            this._plantInfo = await PlantEntityUtils.getPlantInfo(this.hass, this.entityId);
            console.log('[GALLERY] Loaded plant info:', this._plantInfo);
            // Lade die Bilder, nachdem die Pflanzeninfo geladen ist
            await this._initGallery();
        } catch (err) {
            console.warn('Fehler beim Laden der Pflanzen-Info:', err);
            this._plantInfo = null;
        } finally {
            this._isLoading = false;
        }
    }

    private async _initGallery() {
        if (!this.entityId || !this.hass || !this._plantInfo || this._isImagesLoading) return;

        this._isImagesLoading = true;
        try {
            // Lade die Bilder mit der bereits geladenen plantInfo
            this._imagesList = await FlowerGallery.getImagesWithDates(this.hass, this.entityId, this._plantInfo);

            // Lade die Treatment-Historie
            await this._loadTreatmentHistory();

            // Wenn URLs übergeben wurden, verwende diese, ansonsten benutze die geladenen Bilder
            if (this.images.length === 0) {
                this.images = this._imagesList.map(img => img.url);
            }

            // Update slideshow after images are loaded
            this._updateSlideshow();

            // Start preloading adjacent images
            this._preloadAdjacentImages();

            // Start preloading thumbnails
            this._preloadThumbnails();

            // Start preloading gallery images
            this._preloadGalleryImages();

            // Nötige Updates auslösen
            this.requestUpdate();
        } catch (err) {
            console.warn('Fehler beim Laden der Bilder:', err);
        } finally {
            this._isImagesLoading = false;
        }
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.parentElement !== document.body) {
            document.body.appendChild(this);
            this._reparentedToBody = true;
        }
        if (this.initialImageIndex !== undefined) {
            this._currentImageIndex = this.initialImageIndex;
        }
        // Start slideshow if we already have images
        this._updateSlideshow();
        // Lade die Pflanzen-Info (und dann die Bilder)
        this._loadPlantInfo();

        // Start initial preloading if images are already available
        if (this.images.length > 0) {
            this._preloadAdjacentImages();
        }

        // Initialize touch handler after element is connected
        this.updateComplete.then(() => {
            this._initializeTouchHandler();
        });
    }

    /**
     * Initialize touch handler for gesture support
     */
    private _initializeTouchHandler(): void {
        const imageContainer = this.shadowRoot?.querySelector('.gallery-image-container') as HTMLElement;
        if (imageContainer && !this._touchHandler) {
            this._touchHandler = createGalleryTouchHandler(imageContainer, {
                onNext: () => this._changeImage('next', true),
                onPrevious: () => this._changeImage('prev', true),
                onClose: () => this._close(new Event('swipe')),
                onTogglePlayPause: () => this._togglePlayPause(new Event('tap'))
            });
            this._touchHandler.enable();
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._imageRotationInterval) {
            clearInterval(this._imageRotationInterval);
        }

        // Cleanup touch handler
        if (this._touchHandler) {
            this._touchHandler.destroy();
            this._touchHandler = undefined;
        }

        // Cleanup thumbnail cache
        this._thumbnailCache.clear();
        this._thumbnailPromises.clear();

        // Cleanup gallery image cache
        this._galleryImageCache.clear();
        this._galleryImagePromises.clear();
    }

    static get styles(): CSSResult {
        return galleryStyles;
    }

    public static getImageDateFromUrl(url: string): Date | null {
        const match = url.match(/_(\d{8}_\d{6})/);
        if (!match) return null;

        const datePart = match[1];
        const year = datePart.slice(0, 4);
        const month = datePart.slice(4, 6);
        const day = datePart.slice(6, 8);
        const hour = datePart.slice(9, 11);
        const minute = datePart.slice(11, 13);
        return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
    }

    public static async getImagesWithDates(hass: HomeAssistant, entityId: string, plantInfo?: Record<string, any>): Promise<Array<{url: string, date: Date}>> {
        const plantEntity = hass.states[entityId];
        if (!plantEntity?.attributes.images) return [];

        const downloadPath = plantEntity.attributes.download_path || '/local/images/plants/';
        const images: Array<{url: string, date: Date}> = [];

        // Füge das Hauptbild hinzu, wenn vorhanden
        if (plantEntity.attributes.entity_picture) {
            // Benutze plantInfo wenn es übergeben wurde, ansonsten hole es über API
            let firstPhaseDate: Date | null;
            if (plantInfo) {
                firstPhaseDate = await this.getFirstPhaseDate(hass, entityId, plantInfo);
            } else {
                firstPhaseDate = await this.getFirstPhaseDate(hass, entityId);
            }

            if (firstPhaseDate) {
                images.push({
                    url: plantEntity.attributes.entity_picture,
                    date: firstPhaseDate
                });
            }
        }

        // Füge alle anderen Bilder hinzu
        plantEntity.attributes.images.forEach((img: string) => {
            const imageDate = this.getImageDateFromUrl(img);
            if (imageDate) {
                images.push({
                    url: `${downloadPath}${img}`,
                    date: imageDate
                });
            }
        });

        return images.sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    private static async getFirstPhaseDate(hass: HomeAssistant, entityId: string, plantInfo?: Record<string, any>): Promise<Date | null> {
        // Wenn plantInfo übergeben wurde, verwende es direkt
        if (plantInfo) {
            if (!plantInfo?.helpers?.growth_phase?.entity_id) return null;
            
            const phaseEntityId = plantInfo.helpers.growth_phase.entity_id;
            const phaseEntity = hass.states[phaseEntityId];
            if (!phaseEntity) return null;

            const phases = ['samen', 'keimen', 'wurzeln', 'wachstum', 'blüte', 'entfernt', 'geerntet'];
            
            for (const phase of phases) {
                const startDate = phaseEntity.attributes[`${phase === 'entfernt' || phase === 'geerntet' ? phase : phase + '_beginn'}`];
                if (startDate) {
                    return new Date(startDate);
                }
            }
            return null;
        }
        
        // Ansonsten verwende PlantEntityUtils, um die Pflanzen-Info zu holen
        try {
            const newPlantInfo = await PlantEntityUtils.getPlantInfo(hass, entityId);
            if (!newPlantInfo?.helpers?.growth_phase?.entity_id) return null;
            
            const phaseEntityId = newPlantInfo.helpers.growth_phase.entity_id;
            const phaseEntity = hass.states[phaseEntityId];
            if (!phaseEntity) return null;

            const phases = ['samen', 'keimen', 'wurzeln', 'wachstum', 'blüte', 'entfernt', 'geerntet'];
            
            for (const phase of phases) {
                const startDate = phaseEntity.attributes[`${phase === 'entfernt' || phase === 'geerntet' ? phase : phase + '_beginn'}`];
                if (startDate) {
                    return new Date(startDate);
                }
            }
            return null;
        } catch (err) {
            console.warn('Fehler beim Laden der Pflanzen-Info für getFirstPhaseDate:', err);
            return null;
        }
    }

    private async _loadTreatmentHistory(): Promise<void> {
        if (!this.entityId || !this.hass || !this._plantInfo) {
            console.log('[GALLERY] Treatment loading skipped - missing requirements:', {
                entityId: !!this.entityId,
                hass: !!this.hass,
                plantInfo: !!this._plantInfo
            });
            return;
        }

        // Hole die treatment Entity-ID aus der plantInfo
        if (!this._plantInfo?.helpers?.treatment?.entity_id) {
            console.log('[GALLERY] No treatment entity found in plantInfo:', this._plantInfo?.helpers);
            this._treatmentHistory = [];
            return;
        }

        const treatmentEntityId = this._plantInfo.helpers.treatment.entity_id;
        console.log('[GALLERY] Loading treatment history for entity:', treatmentEntityId);

        try {
            // Bestimme den Zeitraum für die Historie (vom ersten Bild bis jetzt)
            const startTime = this._imagesList.length > 0
                ? this._imagesList[0].date.toISOString()
                : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 Jahr zurück als Fallback
            const endTime = new Date().toISOString();

            // Lade Treatment-Historie von Home Assistant
            const response = await this.hass.callApi('GET',
                `history/period/${startTime}?filter_entity_id=${treatmentEntityId}&end_time=${endTime}`
            );

            if (response && Array.isArray(response) && response.length > 0) {
                const history = response[0];
                this._treatmentHistory = [];
                console.log('[GALLERY] Treatment history response:', history);

                for (let i = 0; i < history.length; i++) {
                    const state = history[i];
                    if (state.state &&
                        state.state !== 'unavailable' &&
                        state.state !== 'unknown' &&
                        state.state !== 'none' &&
                        state.state.trim() !== '') {
                        this._treatmentHistory.push({
                            date: new Date(state.last_changed),
                            treatment: state.state
                        });
                    }
                }

                // Sortiere nach Datum (neueste zuerst)
                this._treatmentHistory.sort((a, b) => b.date.getTime() - a.date.getTime());
                console.log('[GALLERY] Loaded treatment history:', this._treatmentHistory);
            } else {
                console.log('[GALLERY] No treatment history found in response:', response);
                this._treatmentHistory = [];
            }
        } catch (error) {
            console.warn('Fehler beim Laden der Treatment-Historie:', error);
            this._treatmentHistory = [];
        }
    }

    private _getTreatmentForImageDate(imageDate: Date): string {
        if (!this._treatmentHistory || this._treatmentHistory.length === 0) {
            console.log('[GALLERY] No treatment history available for date:', imageDate);
            return '';
        }

        // Finde das neueste Treatment vor oder am Bilddatum
        for (const treatment of this._treatmentHistory) {
            if (treatment.date <= imageDate) {
                console.log('[GALLERY] Found treatment for image date:', imageDate, 'treatment:', treatment.treatment);
                return treatment.treatment;
            }
        }

        console.log('[GALLERY] No treatment found for image date:', imageDate);
        return '';
    }

    private _getGroupedImages(): Array<{phase: string, images: Array<{url: string, day: number, totalDays: number, treatment?: string}>, color: string}> {
        if (!this.entityId || !this.hass || !this._plantInfo) return [];

        // Hole die growth_phase Entity-ID aus der plantInfo
        if (!this._plantInfo?.helpers?.growth_phase?.entity_id) {
            return [];
        }

        const phaseEntityId = this._plantInfo.helpers.growth_phase.entity_id;
        const phaseEntity = this.hass.states[phaseEntityId];
        
        if (!phaseEntity) return [];

        const phases = ['samen', 'keimen', 'wurzeln', 'wachstum', 'blüte', 'geerntet', 'entfernt'];
        const phaseLabels: Record<string, string> = {
            'samen': 'Samen',
            'keimen': 'Keimen',
            'wurzeln': 'Wurzeln',
            'wachstum': 'Wuchs',
            'blüte': 'Blüte',
            'geerntet': 'Geerntet',
            'entfernt': 'Entfernt'
        };

        const groupedImages: Array<{phase: string, images: Array<{url: string, day: number, totalDays: number, treatment?: string}>, color: string}> = [];
        let currentPhase = '';
        let currentImages: Array<{url: string, day: number, totalDays: number, treatment?: string}> = [];

        // Sammle aktive Phasen
        const activePhases = phases.filter(phase => {
            const startDate = phaseEntity.attributes[`${phase === 'entfernt' || phase === 'geerntet' ? phase : phase + '_beginn'}`];
            return startDate != null;
        });

        // Finde die erste Phase
        let firstPhaseDate: Date | null = null;
        for (const phase of phases) {
            const startDate = phaseEntity.attributes[`${phase === 'entfernt' || phase === 'geerntet' ? phase : phase + '_beginn'}`];
            if (startDate) {
                firstPhaseDate = new Date(startDate);
                break;
            }
        }

        if (!firstPhaseDate) return [];

        // Gehe durch alle Bilder
        this._imagesList.forEach((imgObject) => {
            const url = imgObject.url;
            const imageDate = imgObject.date;
            let imagePhase = '';
            let daysInPhase = 0;
            let totalDays = 0;

            // Finde die Phase zum Zeitpunkt des Bildes
            for (const phase of phases) {
                const startDate = phaseEntity.attributes[`${phase === 'entfernt' || phase === 'geerntet' ? phase : phase + '_beginn'}`];
                if (startDate) {
                    const phaseStartDate = new Date(startDate);
                    if (imageDate >= phaseStartDate) {
                        imagePhase = phaseLabels[phase];
                        daysInPhase = Math.floor((imageDate.getTime() - phaseStartDate.getTime()) / (1000 * 60 * 60 * 24));
                    }
                }
            }

            // Berechne Gesamtalter
            totalDays = Math.floor((imageDate.getTime() - firstPhaseDate.getTime()) / (1000 * 60 * 60 * 24));

            // Hole Treatment-Information für das Bilddatum
            const treatmentAtImage = this._getTreatmentForImageDate(imageDate);

            if (imagePhase) {
                // Wenn sich die Phase ändert, erstelle eine neue Gruppe
                if (imagePhase !== currentPhase) {
                    if (currentImages.length > 0) {
                        const currentPhaseKey = Object.entries(phaseLabels).find(([_, label]) => label === currentPhase)?.[0] || '';
                        const phaseIndex = activePhases.indexOf(currentPhaseKey);
                        let color = 'var(--primary-color)';

                        if (currentPhaseKey === 'geerntet') {
                            color = 'repeating-linear-gradient(45deg, var(--primary-color), var(--primary-color) 10px, var(--dark-primary-color) 10px, var(--dark-primary-color) 20px)';
                        } else if (currentPhaseKey === 'entfernt') {
                            color = 'repeating-linear-gradient(45deg, var(--error-color), var(--error-color) 10px, var(--dark-error-color) 10px, var(--dark-error-color) 20px)';
                        } else {
                            // Berechne die Helligkeit basierend auf dem Index in den aktiven Phasen
                            const lightness = 55 - ((phaseIndex / Math.max(1, activePhases.length - 1)) * 25);
                            color = `hsl(var(--hue, 120), var(--saturation, 60%), ${lightness}%)`;
                        }

                        groupedImages.push({
                            phase: currentPhase,
                            images: currentImages,
                            color: color
                        });
                    }
                    currentPhase = imagePhase;
                    currentImages = [];
                }

                currentImages.push({
                    url,
                    day: daysInPhase + 1,
                    totalDays: totalDays + 1,
                    treatment: treatmentAtImage
                });
            }
        });

        // Füge die letzte Gruppe hinzu
        if (currentImages.length > 0) {
            const currentPhaseKey = Object.entries(phaseLabels).find(([_, label]) => label === currentPhase)?.[0] || '';
            const phaseIndex = activePhases.indexOf(currentPhaseKey);
            let color = 'var(--primary-color)';

            if (currentPhaseKey === 'geerntet') {
                color = 'repeating-linear-gradient(45deg, var(--primary-color), var(--primary-color) 10px, var(--dark-primary-color) 10px, var(--dark-primary-color) 20px)';
            } else if (currentPhaseKey === 'entfernt') {
                color = 'repeating-linear-gradient(45deg, var(--error-color), var(--error-color) 10px, var(--dark-error-color) 10px, var(--dark-error-color) 20px)';
            } else {
                // Berechne die Helligkeit basierend auf dem Index in den aktiven Phasen
                const lightness = 55 - ((phaseIndex / Math.max(1, activePhases.length - 1)) * 25);
                color = `hsl(var(--hue, 120), var(--saturation, 60%), ${lightness}%)`;
            }

            groupedImages.push({
                phase: currentPhase,
                images: currentImages,
                color: color
            });
        }

        return groupedImages;
    }

    private _getImageDate(url: string): string {
        // Suche das Bild in der geladenen Liste
        const imgObject = this._imagesList.find(img => img.url === url);
        if (!imgObject) return 'Datum unbekannt';

        const imageDate = imgObject.date;
        const dateStr = imageDate.toLocaleDateString('de-DE', {
            weekday: 'short',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Hole die Phase zum Zeitpunkt des Bildes
        // Hole die growth_phase Entity-ID aus der plantInfo
        if (!this._plantInfo?.helpers?.growth_phase?.entity_id) {
            return dateStr;
        }

        const phaseEntityId = this._plantInfo.helpers.growth_phase.entity_id;
        const phaseEntity = this.hass?.states[phaseEntityId];
        
        if (!phaseEntity) return dateStr;

        const phases = ['samen', 'keimen', 'wurzeln', 'wachstum', 'blüte', 'geerntet', 'entfernt'];
        const phaseLabels: Record<string, string> = {
            'samen': 'Samen',
            'keimen': 'Keimen',
            'wurzeln': 'Wurzeln',
            'wachstum': 'Wuchs',
            'blüte': 'Blüte',
            'geerntet': 'Geerntet',
            'entfernt': 'Entfernt'
        };

        let phaseAtImage = '';
        let daysInPhase = 0;
        let totalAge = 0;

        // Finde die erste Phase
        let firstPhaseDate: Date | null = null;
        for (const phase of phases) {
            const startDate = phaseEntity.attributes[`${phase === 'entfernt' || phase === 'geerntet' ? phase : phase + '_beginn'}`];
            if (startDate) {
                firstPhaseDate = new Date(startDate);
                break;
            }
        }

        // Finde die Phase zum Zeitpunkt des Bildes
        for (const phase of phases) {
            const startDate = phaseEntity.attributes[`${phase === 'entfernt' || phase === 'geerntet' ? phase : phase + '_beginn'}`];
            if (startDate) {
                const phaseStartDate = new Date(startDate);
                if (imageDate >= phaseStartDate) {
                    phaseAtImage = phaseLabels[phase];
                    daysInPhase = Math.floor((imageDate.getTime() - phaseStartDate.getTime()) / (1000 * 60 * 60 * 24));
                }
            }
        }

        // Berechne Gesamtalter
        if (firstPhaseDate) {
            totalAge = Math.floor((imageDate.getTime() - firstPhaseDate.getTime()) / (1000 * 60 * 60 * 24));
        }

        // Hole Treatment-Information für das Bilddatum
        const treatmentAtImage = this._getTreatmentForImageDate(imageDate);

        // Prüfe ob es das erste Bild (entity_picture) ist
        if (this.images.indexOf(url) === 0) {
            // Hauptbild benutzt "Tag 1" anstatt berechnete Tage
            let info = `<div class="date-line">${dateStr}</div>`;
            info += `<div class="info-line">Tag 1 <span class="phase">${phaseAtImage}</span>/1 Total</div>`;
            if (treatmentAtImage) {
                info += `<div class="info-line"><span class="treatment">${treatmentAtImage}</span></div>`;
            }
            return info;
        }

        // Formatiere die Ausgabe
        let info = `<div class="date-line">${dateStr}</div>`;
        info += `<div class="info-line">Tag ${daysInPhase + 1} <span class="phase">${phaseAtImage}</span>/${totalAge + 1} Total</div>`;
        if (treatmentAtImage) {
            info += `<div class="info-line"><span class="treatment">${treatmentAtImage}</span></div>`;
        }

        return info;
    }

    render(): HTMLTemplateResult {
        return html`
            <div class="gallery-overlay" @click="${this._close}">
                <div class="gallery-content" @click="${(e: Event) => e.stopPropagation()}">
                    <div class="gallery-header">
                        <span class="gallery-date">
                            ${this.images.length > 0
                                ? unsafeHTML(this._getImageDate(this.images[this._currentImageIndex])) 
                                : 'Keine Bilder vorhanden'}
                        </span>
                        <div class="gallery-header-buttons">
                            <div class="flyout-container ${this._showActionsFlyout ? 'open' : ''}">
                                <ha-icon-button
                                    @click="${this._toggleActionsFlyout}"
                                    .label=${"Aktionen"}
                                    class="actions-button"
                                >
                                    <ha-icon icon="mdi:dots-vertical"></ha-icon>
                                </ha-icon-button>
                                <div class="flyout-menu">
                                    <!-- Camera Actions -->
                                    <label class="flyout-option">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            @change="${(e: Event) => {
                                                this._handleFileUpload(e);
                                                this._showActionsFlyout = false;
                                            }}"
                                            style="display: none;"
                                        >
                                        <ha-icon-button .label=${"Kamera"}>
                                            <ha-icon icon="mdi:camera"></ha-icon>
                                        </ha-icon-button>
                                    </label>
                                    <label class="flyout-option">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            @change="${(e: Event) => {
                                                this._handleFileUpload(e);
                                                this._showActionsFlyout = false;
                                            }}"
                                            style="display: none;"
                                        >
                                        <ha-icon-button .label=${"Galerie"}>
                                            <ha-icon icon="mdi:image"></ha-icon>
                                        </ha-icon-button>
                                    </label>

                                    ${this.images.length > 0 ? html`
                                        <!-- Set Main Image -->
                                        <ha-icon-button
                                            @click="${async () => {
                                                const url = this.images[this._currentImageIndex];
                                                const filename = url.split('/').pop();
                                                if (filename) {
                                                    try {
                                                        await this._setMainImage(filename);
                                                        this._showActionsFlyout = false;
                                                    } catch (error) {
                                                        alert('Fehler beim Setzen des Hauptbildes: ' + error.message);
                                                    }
                                                }
                                            }}"
                                            .label=${"Als Hauptbild setzen"}
                                            class="flyout-option"
                                        >
                                            <ha-icon icon="mdi:image-check"></ha-icon>
                                        </ha-icon-button>

                                        <!-- Delete Image -->
                                        <ha-icon-button
                                            @click="${async () => {
                                                if (confirm('Bild wirklich löschen?')) {
                                                    const url = this.images[this._currentImageIndex];
                                                    const filename = url.split('/').pop();
                                                    if (filename) {
                                                        try {
                                                            await this._deleteImage(filename);
                                                            this._showActionsFlyout = false;
                                                            // Aktualisiere die Bilderliste
                                                            this.images = this.images.filter(img => !img.includes(filename));
                                                            // Wenn das aktuelle Bild gelöscht wurde, zeige das erste Bild an
                                                            if (this._currentImageIndex >= this.images.length) {
                                                                this._currentImageIndex = Math.max(0, this.images.length - 1);
                                                            }
                                                        } catch (error) {
                                                            alert('Fehler beim Löschen: ' + error.message);
                                                        }
                                                    }
                                                }
                                            }}"
                                            .label=${"Bild löschen"}
                                            class="flyout-option delete-option"
                                        >
                                            <ha-icon icon="mdi:delete"></ha-icon>
                                        </ha-icon-button>
                                    ` : ''}

                                    ${this.images.length > 1 ? html`
                                        <!-- Play/Pause Slideshow -->
                                        <ha-icon-button
                                            @click="${(e: Event) => {
                                                this._togglePlayPause(e);
                                                this._showActionsFlyout = false;
                                            }}"
                                            .label="${this._isPlaying ? 'Slideshow pausieren' : 'Slideshow starten'}"
                                            class="flyout-option"
                                        >
                                            <ha-icon icon="${this._isPlaying ? 'mdi:pause' : 'mdi:play'}"></ha-icon>
                                        </ha-icon-button>
                                    ` : ''}
                                </div>
                            </div>
                            <ha-icon-button
                                @click="${this._close}"
                                .label=${"Schließen"}
                            >
                                <ha-icon icon="mdi:close"></ha-icon>
                            </ha-icon-button>
                        </div>
                    </div>
                    
                    ${this.images.length > 0 ? html`
                        <div class="gallery-image-container">
                            <ha-icon-button
                                class="gallery-nav prev"
                                @click="${() => this._changeImage('prev', true)}"
                                .label=${"Vorheriges Bild"}
                            >
                                <ha-icon icon="mdi:chevron-left"></ha-icon>
                            </ha-icon-button>
                            <a href="${this.images[this._currentImageIndex]}" target="_blank">
                                <img class="gallery-image ${this._isFading ? 'fade' : ''}"
                                    src="${this._galleryImageUrls.get(this.images[this._currentImageIndex]) || this.images[this._currentImageIndex]}"
                                >
                            </a>
                            <ha-icon-button
                                class="gallery-nav next"
                                @click="${() => this._changeImage('next', true)}"
                                .label=${"Nächstes Bild"}
                            >
                                <ha-icon icon="mdi:chevron-right"></ha-icon>
                            </ha-icon-button>
                        </div>
                        <div class="gallery-thumbnails">
                            <div class="thumbnails-scroll">
                                ${this._getGroupedImages().map(group => html`
                                    <div class="thumbnail-group">
                                        <div class="thumbnail-group-label" style="--phase-color: ${group.color}">
                                            ${group.phase}
                                        </div>
                                        <div class="thumbnail-group-images">
                                            ${group.images.map(image => html`
                                                <div class="thumbnail-container ${this.images[this._currentImageIndex] === image.url ? 'active' : ''}"
                                                     @click="${() => this._selectImage(this.images.indexOf(image.url))}">
                                                    <div class="thumbnail-day">
                                                        Tag ${image.day}/${image.totalDays}
                                                        ${image.treatment ? html`<br><span class="thumbnail-treatment">${image.treatment}</span>` : ''}
                                                    </div>
                                                    <img class="thumbnail" src="${this._thumbnailUrls.get(image.url) || image.url}">
                                                </div>
                                            `)}
                                        </div>
                                    </div>
                                `)}
                            </div>
                        </div>
                    ` : html`
                        <div class="no-images-message">
                            <ha-icon icon="mdi:image-off"></ha-icon>
                            <span>Keine Bilder vorhanden</span>
                            <span>Klicke auf das Kamera-Symbol oben, um ein Bild hinzuzufügen</span>
                        </div>
                    `}
                </div>
            </div>
        `;
    }
}

// Manuell beim Laden des Moduls registrieren, wenn noch nicht registriert
if (!customElements.get('flower-gallery')) {
    customElements.define('flower-gallery', FlowerGallery);
} 