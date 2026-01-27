
import {
    AdMob,
    BannerAdOptions,
    BannerAdSize,
    BannerAdPosition,
    AdOptions,
    RewardAdOptions,
    RewardAdPluginEvents
} from '@capacitor-community/admob';
import { purchaseService } from './purchaseService';

// Test IDs from official AdMob documentation
export const AD_UNITS = {
    BANNER: 'ca-app-pub-3940256099942544/6300978111',
    INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
    REWARDED: 'ca-app-pub-3940256099942544/5224354917'
};

export type AdErrorType = 'no_connection' | 'load_failed' | 'not_initialized' | 'unknown';

export interface AdResult {
    success: boolean;
    error?: AdErrorType;
    message?: string;
}

class AdMobService {
    private isInitialized = false;
    private lastConnectionCheck = 0;
    private isOnline = true;

    async initialize() {
        if (this.isInitialized) return;

        try {
            await AdMob.initialize({
                initializeForTesting: true,
            });
            this.isInitialized = true;
            console.log('AdMob Initialized');

            // Set up online/offline listeners
            this.setupConnectionListeners();

            // Show banner immediately on start
            await this.showBanner();
        } catch (e) {
            console.warn('AdMob Initialization failed (probably not on mobile)', e);
        }
    }

    private setupConnectionListeners() {
        if (typeof window !== 'undefined') {
            window.addEventListener('online', () => {
                this.isOnline = true;
                console.log('Network: Online');
            });
            window.addEventListener('offline', () => {
                this.isOnline = false;
                console.log('Network: Offline');
            });
            this.isOnline = navigator.onLine;
        }
    }

    /**
     * Check if we have network connectivity
     */
    isNetworkAvailable(): boolean {
        return this.isOnline;
    }

    /**
     * Check if ads can be shown
     */
    canShowAds(): AdResult {
        if (!this.isInitialized) {
            return { success: false, error: 'not_initialized', message: 'AdMob not initialized' };
        }
        if (!this.isOnline) {
            return { success: false, error: 'no_connection', message: 'No internet connection' };
        }
        if (purchaseService.getIsPremium()) {
            return { success: false, error: 'unknown', message: 'User is premium, ads disabled' };
        }
        return { success: true };
    }

    async showBanner(): Promise<AdResult> {
        const check = this.canShowAds();
        if (!check.success) return check;

        try {
            const options: BannerAdOptions = {
                adId: AD_UNITS.BANNER,
                adSize: BannerAdSize.ADAPTIVE_BANNER,
                position: BannerAdPosition.BOTTOM_CENTER,
                margin: 0,
                isTesting: true,
                npa: true // Non-personalized ads can sometimes help with layout consistency in test mode
            };
            await AdMob.showBanner(options);
            return { success: true };
        } catch (e) {
            console.error('Banner error:', e);
            return { success: false, error: 'load_failed', message: 'Failed to load banner' };
        }
    }

    async hideBanner(): Promise<void> {
        if (!this.isInitialized) return;
        try {
            await AdMob.removeBanner();
        } catch (e) {
            console.error('Hide Banner error:', e);
        }
    }

    async showInterstitial(): Promise<AdResult> {
        const check = this.canShowAds();
        if (!check.success) return check;

        try {
            const options: AdOptions = {
                adId: AD_UNITS.INTERSTITIAL,
                isTesting: true
            };
            await AdMob.prepareInterstitial(options);
            await AdMob.showInterstitial();
            return { success: true };
        } catch (e) {
            console.error('Interstitial error:', e);
            return { success: false, error: 'load_failed', message: 'Failed to load interstitial' };
        }
    }

    async showRewarded(): Promise<AdResult> {
        const check = this.canShowAds();
        if (!check.success) return check;

        return new Promise(async (resolve) => {
            // Track listeners for proper cleanup
            let rewardListener: { remove: () => Promise<void> } | null = null;
            let failedListener: { remove: () => Promise<void> } | null = null;
            let dismissedListener: { remove: () => Promise<void> } | null = null;
            let resolved = false;

            const cleanup = async () => {
                if (rewardListener) await rewardListener.remove().catch(() => { });
                if (failedListener) await failedListener.remove().catch(() => { });
                if (dismissedListener) await dismissedListener.remove().catch(() => { });
            };

            const safeResolve = async (result: AdResult) => {
                if (resolved) return;
                resolved = true;
                await cleanup();
                resolve(result);
            };

            try {
                const options: RewardAdOptions = {
                    adId: AD_UNITS.REWARDED,
                    isTesting: true
                };
                await AdMob.prepareRewardVideoAd(options);

                // Listen for successful reward
                rewardListener = await AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward) => {
                    console.log('Reward received:', reward);
                    safeResolve({ success: true });
                });

                // Listen for ad load/show failures
                failedListener = await AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error) => {
                    console.warn('Rewarded Ad failed to load:', error);
                    safeResolve({ success: false, error: 'load_failed', message: 'Failed to load ad' });
                });

                // Listen for ad dismissed without reward (user closed early)
                dismissedListener = await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
                    console.log('Rewarded Ad dismissed');
                    // Only resolve false if not already rewarded
                    setTimeout(() => safeResolve({ success: false, error: 'unknown', message: 'Ad dismissed' }), 100);
                });

                await AdMob.showRewardVideoAd();
            } catch (e) {
                console.error('Rewarded Ad error:', e);
                await safeResolve({ success: false, error: 'load_failed', message: 'Error showing ad' });
            }
        });
    }

    /**
     * Get user-friendly error message for ad errors
     */
    getErrorMessage(error: AdErrorType, lang: 'en' | 'es' = 'en'): string {
        const messages = {
            en: {
                no_connection: 'No internet connection. Ads are not available.',
                load_failed: 'Could not load ad. Please try again later.',
                not_initialized: 'Ads are not available on this device.',
                unknown: 'Something went wrong. Please try again.'
            },
            es: {
                no_connection: 'Sin conexión a internet. Los anuncios no están disponibles.',
                load_failed: 'No se pudo cargar el anuncio. Intenta más tarde.',
                not_initialized: 'Los anuncios no están disponibles en este dispositivo.',
                unknown: 'Algo salió mal. Por favor intenta de nuevo.'
            }
        };
        return messages[lang][error];
    }
}

export const adMobService = new AdMobService();
