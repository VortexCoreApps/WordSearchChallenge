
import {
    AdMob,
    BannerAdOptions,
    BannerAdSize,
    BannerAdPosition,
    AdOptions,
    RewardAdOptions,
    RewardAdPluginEvents,
    InterstitialAdPluginEvents
} from '@capacitor-community/admob';
import { iapService } from './IAPService';

// Test IDs from official AdMob documentation
export const AD_UNITS = {
    BANNER: 'ca-app-pub-1243237395728504/3700203018',
    INTERSTITIAL: 'ca-app-pub-1243237395728504/5064323361',
    REWARDED: 'ca-app-pub-1243237395728504/5623658774'
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

    // Preload flags to avoid duplicate requests
    private isInterstitialLoading = false;
    private isInterstitialPrepared = false;
    private isRewardedLoading = false;
    private isRewardedPrepared = false;

    async initialize() {
        if (this.isInitialized) return;

        try {
            await AdMob.initialize({
                initializeForTesting: false,
                // Registrado vía Consola de AdMob (Test Devices)
            });

            this.isInitialized = true;
            console.log('AdMob Initialized');

            // Set up online/offline listeners
            this.setupConnectionListeners();

            // Set up global listeners for preloading
            this.setupAdListeners();

            // Show banner immediately on start
            await this.showBanner();

            // Preload ads for the first time
            this.preloadInterstitial();
            this.preloadRewarded();

        } catch (e) {
            console.warn('AdMob Initialization failed (probably not on mobile)', e);
        }
    }

    private setupAdListeners() {
        // Interstitial listeners
        AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
            console.log('Interstitial dismissed, preloading next one');
            this.isInterstitialPrepared = false;
            this.preloadInterstitial();
        });

        AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (error) => {
            console.warn('Interstitial failed to load, will retry later', error);
            this.isInterstitialLoading = false;
            this.isInterstitialPrepared = false;
            // Retry after a delay (e.g., 30s) to avoid spamming AdMob
            setTimeout(() => this.preloadInterstitial(), 30000);
        });

        AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
            console.log('Interstitial preloaded and ready');
            this.isInterstitialLoading = false;
            this.isInterstitialPrepared = true;
        });

        // Rewarded listeners
        AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
            console.log('Rewarded Ad dismissed, preloading next one');
            this.isRewardedPrepared = false;
            this.preloadRewarded();
        });

        AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error) => {
            console.warn('Rewarded Ad failed to load, will retry later', error);
            this.isRewardedLoading = false;
            this.isRewardedPrepared = false;
            // Retry after 30s
            setTimeout(() => this.preloadRewarded(), 30000);
        });

        AdMob.addListener(RewardAdPluginEvents.Loaded, () => {
            console.log('Rewarded Ad preloaded and ready');
            this.isRewardedLoading = false;
            this.isRewardedPrepared = true;
        });
    }

    /**
     * Preload an Interstitial ad if not already loading or prepared
     */
    async preloadInterstitial() {
        if (!this.isInitialized || iapService.getIsPremium() || this.isInterstitialLoading || this.isInterstitialPrepared || !this.isOnline) {
            return;
        }

        try {
            this.isInterstitialLoading = true;
            const options: AdOptions = {
                adId: AD_UNITS.INTERSTITIAL,
                isTesting: false
            };
            await AdMob.prepareInterstitial(options);
        } catch (e) {
            this.isInterstitialLoading = false;
            console.error('Preload Interstitial error:', e);
        }
    }

    /**
     * Preload a Rewarded ad if not already loading or prepared
     */
    async preloadRewarded() {
        if (!this.isInitialized || iapService.getIsPremium() || this.isRewardedLoading || this.isRewardedPrepared || !this.isOnline) {
            return;
        }

        try {
            this.isRewardedLoading = true;
            const options: RewardAdOptions = {
                adId: AD_UNITS.REWARDED,
                isTesting: false
            };
            await AdMob.prepareRewardVideoAd(options);
        } catch (e) {
            this.isRewardedLoading = false;
            console.error('Preload Rewarded error:', e);
        }
    }

    private setupConnectionListeners() {
        if (typeof window !== 'undefined') {
            window.addEventListener('online', () => {
                this.isOnline = true;
                console.log('Network: Online');
                // Try preloading once connection returns
                this.preloadInterstitial();
                this.preloadRewarded();
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
        if (iapService.getIsPremium()) {
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
                isTesting: false,
                npa: true
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
            // Only show if already pre-loaded — never block UI with prepare+show
            if (this.isInterstitialPrepared) {
                await AdMob.showInterstitial();
                return { success: true };
            }

            // Not ready — skip this time and ensure it's preloading for next time
            console.log('Interstitial not pre-loaded, skipping and preloading for next time');
            this.preloadInterstitial();
            return { success: false, error: 'load_failed', message: 'Ad not ready yet' };
        } catch (e) {
            console.error('Interstitial error:', e);
            return { success: false, error: 'load_failed', message: 'Failed to show interstitial' };
        }
    }

    async showRewarded(): Promise<AdResult> {
        const check = this.canShowAds();
        if (!check.success) return check;

        return new Promise(async (resolve) => {
            let rewardListener: { remove: () => Promise<void> } | null = null;
            let resolved = false;

            const safeResolve = async (result: AdResult) => {
                if (resolved) return;
                resolved = true;
                if (rewardListener) await rewardListener.remove().catch(() => { });
                resolve(result);
            };

            try {
                // Listen for successful reward
                rewardListener = await AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward) => {
                    console.log('Reward received:', reward);
                    safeResolve({ success: true });
                });

                // If prepared, show. Otherwise, prepare and show.
                if (!this.isRewardedPrepared) {
                    const options: RewardAdOptions = {
                        adId: AD_UNITS.REWARDED,
                        isTesting: false
                    };
                    await AdMob.prepareRewardVideoAd(options);
                }

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
