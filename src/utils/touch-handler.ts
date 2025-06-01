/**
 * Touch Handler for gesture recognition and touch interactions
 * Supports swipe, tap, and pinch gestures
 */

export interface TouchGestureCallbacks {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    onPinchZoom?: (scale: number) => void;
    onTap?: () => void;
    onDoubleTap?: () => void;
}

export interface TouchPoint {
    x: number;
    y: number;
    time: number;
}

export class TouchHandler {
    private startPoints: TouchPoint[] = [];
    private lastTapTime = 0;
    private initialDistance = 0;
    private callbacks: TouchGestureCallbacks;
    private element: HTMLElement;
    private isActive = false;

    // Configuration
    private readonly SWIPE_THRESHOLD = 50; // Minimum distance for swipe
    private readonly SWIPE_MAX_TIME = 300; // Maximum time for swipe (ms)
    private readonly TAP_MAX_DISTANCE = 10; // Maximum movement for tap
    private readonly TAP_MAX_TIME = 300; // Maximum time for tap
    private readonly DOUBLE_TAP_DELAY = 300; // Maximum delay between taps

    constructor(element: HTMLElement, callbacks: TouchGestureCallbacks) {
        this.element = element;
        this.callbacks = callbacks;
        this.attachListeners();
    }

    /**
     * Enable touch handling
     */
    enable(): void {
        this.isActive = true;
    }

    /**
     * Disable touch handling
     */
    disable(): void {
        this.isActive = false;
    }

    /**
     * Destroy touch handler and remove listeners
     */
    destroy(): void {
        this.detachListeners();
        this.isActive = false;
    }

    private attachListeners(): void {
        this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { 
            passive: false 
        });
        this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { 
            passive: false 
        });
        this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { 
            passive: false 
        });
        this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this), { 
            passive: false 
        });
    }

    private detachListeners(): void {
        this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
        this.element.removeEventListener('touchmove', this.handleTouchMove.bind(this));
        this.element.removeEventListener('touchend', this.handleTouchEnd.bind(this));
        this.element.removeEventListener('touchcancel', this.handleTouchCancel.bind(this));
    }

    private handleTouchStart(e: TouchEvent): void {
        if (!this.isActive) return;

        this.startPoints = Array.from(e.touches).map(touch => ({
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now()
        }));

        if (e.touches.length === 2) {
            // Two finger gesture - prepare for pinch
            this.initialDistance = this.getDistance(e.touches[0], e.touches[1]);
        }
    }

    private handleTouchMove(e: TouchEvent): void {
        if (!this.isActive || this.startPoints.length === 0) return;

        if (e.touches.length === 2 && this.callbacks.onPinchZoom) {
            // Handle pinch zoom
            e.preventDefault();
            const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
            const scale = currentDistance / this.initialDistance;
            this.callbacks.onPinchZoom(scale);
        } else if (e.touches.length === 1 && this.startPoints.length === 1) {
            // Single finger movement - check if it's a significant swipe
            const deltaX = Math.abs(e.touches[0].clientX - this.startPoints[0].x);
            const deltaY = Math.abs(e.touches[0].clientY - this.startPoints[0].y);
            
            // Prevent default if movement is significant (likely a swipe)
            if (deltaX > 20 || deltaY > 20) {
                e.preventDefault();
            }
        }
    }

    private handleTouchEnd(e: TouchEvent): void {
        if (!this.isActive || this.startPoints.length === 0) return;

        if (e.changedTouches.length === 1 && this.startPoints.length === 1) {
            const endTouch = e.changedTouches[0];
            const startPoint = this.startPoints[0];
            const endTime = Date.now();

            const deltaX = endTouch.clientX - startPoint.x;
            const deltaY = endTouch.clientY - startPoint.y;
            const deltaTime = endTime - startPoint.time;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Determine gesture type
            if (distance <= this.TAP_MAX_DISTANCE && deltaTime <= this.TAP_MAX_TIME) {
                this.handleTap();
            } else if (deltaTime <= this.SWIPE_MAX_TIME) {
                this.handleSwipe(deltaX, deltaY, distance);
            }
        }

        this.startPoints = [];
    }

    private handleTouchCancel(e: TouchEvent): void {
        this.startPoints = [];
    }

    private handleTap(): void {
        const currentTime = Date.now();
        const timeSinceLastTap = currentTime - this.lastTapTime;

        if (timeSinceLastTap <= this.DOUBLE_TAP_DELAY && this.callbacks.onDoubleTap) {
            // Double tap
            this.callbacks.onDoubleTap();
            this.lastTapTime = 0; // Reset to prevent triple tap
        } else {
            // Single tap (with delay to check for double tap)
            setTimeout(() => {
                if (Date.now() - this.lastTapTime >= this.DOUBLE_TAP_DELAY) {
                    this.callbacks.onTap?.();
                }
            }, this.DOUBLE_TAP_DELAY);
            this.lastTapTime = currentTime;
        }
    }

    private handleSwipe(deltaX: number, deltaY: number, distance: number): void {
        if (distance < this.SWIPE_THRESHOLD) return;

        // Determine primary direction
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0 && this.callbacks.onSwipeRight) {
                this.callbacks.onSwipeRight();
            } else if (deltaX < 0 && this.callbacks.onSwipeLeft) {
                this.callbacks.onSwipeLeft();
            }
        } else {
            // Vertical swipe
            if (deltaY > 0 && this.callbacks.onSwipeDown) {
                this.callbacks.onSwipeDown();
            } else if (deltaY < 0 && this.callbacks.onSwipeUp) {
                this.callbacks.onSwipeUp();
            }
        }
    }

    private getDistance(touch1: Touch, touch2: Touch): number {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

/**
 * Utility function to create a touch handler with common gallery gestures
 */
export function createGalleryTouchHandler(
    element: HTMLElement,
    callbacks: {
        onNext?: () => void;
        onPrevious?: () => void;
        onClose?: () => void;
        onTogglePlayPause?: () => void;
    }
): TouchHandler {
    return new TouchHandler(element, {
        onSwipeLeft: callbacks.onNext,
        onSwipeRight: callbacks.onPrevious,
        onSwipeUp: callbacks.onClose,
        onTap: callbacks.onTogglePlayPause,
        onDoubleTap: callbacks.onTogglePlayPause
    });
}
