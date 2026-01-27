
import { Preferences } from '@capacitor/preferences';

// The store global is available when the plugin is installed
declare var CdvPurchase: any;

const PREMIUM_KEY = 'is_premium_user';
const PRODUCT_NO_ADS = 'no_ads';

class PurchaseService {
    private store: any = null;
    private isPremium = false;
    private isInitialized = false;

    async initialize() {
        if (this.isInitialized) return;

        // Check local storage first for fast UI response
        const { value } = await Preferences.get({ key: PREMIUM_KEY });
        this.isPremium = value === 'true';

        // Initialize store if on mobile
        if (typeof window !== 'undefined' && (window as any).CdvPurchase) {
            this.store = (window as any).CdvPurchase.store;
            this.setupStore();
            this.isInitialized = true;
        }
    }

    private setupStore() {
        const { store, Store } = (window as any).CdvPurchase;

        // Register the product
        store.register({
            id: PRODUCT_NO_ADS,
            type: Store.ProductType.NON_CONSUMABLE,
            platform: Store.Platform.GOOGLE_PLAY,
        });

        // Track when the product is owned
        store.when()
            .product(PRODUCT_NO_ADS)
            .owned((p: any) => {
                console.log('Product owned: ' + p.id);
                this.setPremiumStatus(true);
            });

        // Simple error handling
        store.error((error: any) => {
            console.error('Store Error: ' + JSON.stringify(error));
        });

        // Initialize the store
        store.initialize([Store.Platform.GOOGLE_PLAY]);
    }

    private async setPremiumStatus(status: boolean) {
        this.isPremium = status;
        await Preferences.set({
            key: PREMIUM_KEY,
            value: status.toString(),
        });

        // Notify app (could use a simple event emitter or skip for now)
        window.dispatchEvent(new CustomEvent('premium_status_changed', { detail: status }));
    }

    async purchaseNoAds(): Promise<boolean> {
        if (!this.store) return false;

        return new Promise((resolve) => {
            const { store } = (window as any).CdvPurchase;
            const product = store.get(PRODUCT_NO_ADS);

            if (product && product.canPurchase) {
                store.order(product)
                    .then(() => {
                        console.log('Purchase flow started');
                        // Note: actual confirmation happens in the .owned() callback
                        resolve(true);
                    })
                    .catch((err: any) => {
                        console.error('Purchase error', err);
                        resolve(false);
                    });
            } else {
                console.warn('Product not found or cannot be purchased');
                resolve(false);
            }
        });
    }

    async restorePurchases() {
        if (this.store) {
            this.store.restore();
        }
    }

    getIsPremium(): boolean {
        return this.isPremium;
    }
}

export const purchaseService = new PurchaseService();
