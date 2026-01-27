/**
 * Haptic Feedback Service
 * 
 * Provides vibration feedback for user interactions on mobile devices.
 * Uses the Capacitor Haptics plugin when available, falls back to
 * the Web Vibrator API.
 */

import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

class HapticService {
    private isNative: boolean;
    private isEnabled: boolean = true;

    constructor() {
        this.isNative = Capacitor.isNativePlatform();
    }

    /**
     * Enable or disable haptic feedback
     */
    setEnabled(enabled: boolean): void {
        this.isEnabled = enabled;
        localStorage.setItem('ws_haptics_enabled', String(enabled));
    }

    /**
     * Check if haptics are enabled
     */
    getEnabled(): boolean {
        const saved = localStorage.getItem('ws_haptics_enabled');
        if (saved !== null) {
            this.isEnabled = saved === 'true';
        }
        return this.isEnabled;
    }

    /**
     * Light tap - for button presses, selections
     */
    async light(): Promise<void> {
        if (!this.isEnabled) return;

        try {
            if (this.isNative) {
                await Haptics.impact({ style: ImpactStyle.Light });
            } else {
                this.webVibrate(10);
            }
        } catch (e) {
            // Silently fail if haptics not available
        }
    }

    /**
     * Medium tap - for important actions
     */
    async medium(): Promise<void> {
        if (!this.isEnabled) return;

        try {
            if (this.isNative) {
                await Haptics.impact({ style: ImpactStyle.Medium });
            } else {
                this.webVibrate(20);
            }
        } catch (e) {
            // Silently fail
        }
    }

    /**
     * Heavy tap - for significant events
     */
    async heavy(): Promise<void> {
        if (!this.isEnabled) return;

        try {
            if (this.isNative) {
                await Haptics.impact({ style: ImpactStyle.Heavy });
            } else {
                this.webVibrate(30);
            }
        } catch (e) {
            // Silently fail
        }
    }

    /**
     * Success notification - for word found, level complete
     */
    async success(): Promise<void> {
        if (!this.isEnabled) return;

        try {
            if (this.isNative) {
                await Haptics.notification({ type: NotificationType.Success });
            } else {
                // Double pulse pattern for success
                this.webVibrate([15, 50, 15]);
            }
        } catch (e) {
            // Silently fail
        }
    }

    /**
     * Warning notification - for hints, low time
     */
    async warning(): Promise<void> {
        if (!this.isEnabled) return;

        try {
            if (this.isNative) {
                await Haptics.notification({ type: NotificationType.Warning });
            } else {
                this.webVibrate([30, 30, 30]);
            }
        } catch (e) {
            // Silently fail
        }
    }

    /**
     * Error notification - for invalid selections
     */
    async error(): Promise<void> {
        if (!this.isEnabled) return;

        try {
            if (this.isNative) {
                await Haptics.notification({ type: NotificationType.Error });
            } else {
                this.webVibrate([50, 30, 50, 30, 50]);
            }
        } catch (e) {
            // Silently fail
        }
    }

    /**
     * Selection changed - for letter selection in grid
     */
    async selection(): Promise<void> {
        if (!this.isEnabled) return;

        try {
            if (this.isNative) {
                await Haptics.selectionChanged();
            } else {
                this.webVibrate(5);
            }
        } catch (e) {
            // Silently fail
        }
    }

    /**
     * Celebration pattern - for trophy unlock
     */
    async celebration(): Promise<void> {
        if (!this.isEnabled) return;

        try {
            if (this.isNative) {
                // Triple success pulse
                await Haptics.notification({ type: NotificationType.Success });
                setTimeout(async () => {
                    await Haptics.notification({ type: NotificationType.Success });
                }, 200);
                setTimeout(async () => {
                    await Haptics.notification({ type: NotificationType.Success });
                }, 400);
            } else {
                this.webVibrate([20, 50, 20, 50, 20, 50, 40]);
            }
        } catch (e) {
            // Silently fail
        }
    }

    /**
     * Web Vibrator API fallback
     */
    private webVibrate(pattern: number | number[]): void {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }
}

export const hapticService = new HapticService();
