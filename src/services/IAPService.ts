
import { Capacitor } from '@capacitor/core';
import 'cordova-plugin-purchase';

// Product IDs - DEBEN coincidir con Google Play Console
export const IAP_PRODUCTS = {
    NO_ADS: 'no_ads',  // Este ID debe existir en Google Play Console
} as const;

export type IAPProductId = typeof IAP_PRODUCTS[keyof typeof IAP_PRODUCTS];

export interface IAPProduct {
    id: IAPProductId;
    title: string;
    description: string;
    price: string;
    priceAmount: number;
    currency: string;
    isConsumable: boolean;
}

export interface PurchaseResult {
    success: boolean;
    pending?: boolean;
    productId?: IAPProductId;
    error?: string;
}

type PurchaseCallback = (productId: IAPProductId) => void;

declare const CdvPurchase: any;

class IAPService {
    private isInitialized: boolean = false;
    private isWeb: boolean = Capacitor.getPlatform() === 'web';
    private purchaseCallbacks: Map<IAPProductId, PurchaseCallback> = new Map();
    private products: Map<IAPProductId, IAPProduct> = new Map();
    private ownedProducts: Set<IAPProductId> = new Set();
    private store: any = null;

    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        // Setup default products first
        this.setupDefaultProducts();

        if (this.isWeb) {
            console.log('IAP: Running on web - using simulated purchases');
            this.isInitialized = true;
            await this.restorePurchases();
            return;
        }

        await this.waitForDeviceReady();

        try {
            if (typeof CdvPurchase !== 'undefined') {
                this.store = CdvPurchase.store;

                // Registrar productos
                this.store.register([
                    {
                        id: IAP_PRODUCTS.NO_ADS,
                        type: CdvPurchase.ProductType.NON_CONSUMABLE,
                        platform: CdvPurchase.Platform.GOOGLE_PLAY
                    }
                ]);

                // Event handlers
                this.store.when()
                    .productUpdated((product: any) => {
                        this.updateProductFromStore(product);
                    })
                    .approved((transaction: any) => {
                        console.log('IAP: Purchase approved');
                        transaction.verify();
                    })
                    .verified((receipt: any) => {
                        console.log('IAP: Purchase verified');
                        receipt.finish();
                    })
                    .finished((transaction: any) => {
                        const productId = transaction.products[0]?.id as IAPProductId;
                        if (productId) {
                            this.handleSuccessfulPurchase(productId);
                        }
                    })
                    .receiptUpdated(() => {
                        this.checkOwnedProducts();
                    });

                await this.store.initialize([CdvPurchase.Platform.GOOGLE_PLAY]);
                this.checkOwnedProducts();
            }

            this.isInitialized = true;
        } catch (error) {
            console.error('IAP initialization failed:', error);
            this.isInitialized = true;
        }
    }

    private waitForDeviceReady(): Promise<void> {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                setTimeout(resolve, 100);
            } else {
                document.addEventListener('deviceready', () => resolve(), false);
            }
        });
    }

    private updateProductFromStore(storeProduct: any): void {
        const id = storeProduct.id as IAPProductId;
        const existing = this.products.get(id);
        if (existing) {
            existing.title = storeProduct.title || existing.title;
            existing.description = storeProduct.description || existing.description;
            existing.price = storeProduct.pricing?.price || existing.price;
            existing.priceAmount = storeProduct.pricing?.priceMicros
                ? storeProduct.pricing.priceMicros / 1000000
                : existing.priceAmount;
            existing.currency = storeProduct.pricing?.currency || existing.currency;
        }
    }

    private checkOwnedProducts(): void {
        if (!this.store) return;

        const product = this.store.get(IAP_PRODUCTS.NO_ADS);
        if (product && product.owned) {
            if (!this.ownedProducts.has(IAP_PRODUCTS.NO_ADS)) {
                this.ownedProducts.add(IAP_PRODUCTS.NO_ADS);
                this.savePurchaseState();

                // Dispatch event for UI updates
                window.dispatchEvent(new CustomEvent('premium_status_changed', { detail: true }));

                const callback = this.purchaseCallbacks.get(IAP_PRODUCTS.NO_ADS);
                if (callback) callback(IAP_PRODUCTS.NO_ADS);
            }
        }
    }

    private setupDefaultProducts(): void {
        this.products.set(IAP_PRODUCTS.NO_ADS, {
            id: IAP_PRODUCTS.NO_ADS,
            title: 'Sin Anuncios',
            description: 'Elimina todos los anuncios permanentemente',
            price: '1,99 €',
            priceAmount: 1.99,
            currency: 'EUR',
            isConsumable: false
        });
    }

    // Registrar callback para cuando se complete la compra
    onPurchaseComplete(productId: IAPProductId, callback: PurchaseCallback): void {
        this.purchaseCallbacks.set(productId, callback);
    }

    getProduct(productId: IAPProductId): IAPProduct | undefined {
        return this.products.get(productId);
    }

    isOwned(productId: IAPProductId): boolean {
        return this.ownedProducts.has(productId);
    }

    /**
     * Backwards-compatible alias used by adMobService and other consumers
     */
    getIsPremium(): boolean {
        return this.isOwned(IAP_PRODUCTS.NO_ADS);
    }

    async purchase(productId: IAPProductId): Promise<PurchaseResult> {
        if (!this.isInitialized) await this.initialize();

        const product = this.products.get(productId);
        if (!product) return { success: false, error: 'Product not found' };

        if (!product.isConsumable && this.ownedProducts.has(productId)) {
            return { success: false, error: 'Product already owned' };
        }

        if (this.isWeb) {
            return this.simulateWebPurchase(productId, product);
        }

        if (!this.store) return { success: false, error: 'Store not initialized' };

        try {
            const storeProduct = this.store.get(productId);
            if (!storeProduct) return { success: false, error: 'Product not found in store' };

            const offer = storeProduct.getOffer();
            if (!offer) return { success: false, error: 'No offer available' };

            await offer.order();
            return { success: false, pending: true, productId };

        } catch (error: any) {
            return { success: false, error: error.message || String(error) };
        }
    }

    private simulateWebPurchase(productId: IAPProductId, product: IAPProduct): PurchaseResult {
        const confirmed = window.confirm(
            `¿Comprar "${product.title}" por ${product.price}?\n\n(Simulación web)`
        );

        if (!confirmed) return { success: false, error: 'Purchase cancelled' };

        this.handleSuccessfulPurchase(productId);
        return { success: true, productId };
    }

    private handleSuccessfulPurchase(productId: IAPProductId): void {
        const product = this.products.get(productId);

        if (product && !product.isConsumable) {
            this.ownedProducts.add(productId);
            this.savePurchaseState();
        }

        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('premium_status_changed', { detail: true }));

        const callback = this.purchaseCallbacks.get(productId);
        if (callback) callback(productId);
    }

    async restorePurchases(): Promise<void> {
        const saved = localStorage.getItem('ws_challenge_iap_owned');
        if (saved) {
            try {
                const owned = JSON.parse(saved) as string[];
                owned.forEach(id => this.ownedProducts.add(id as IAPProductId));

                if (this.ownedProducts.size > 0) {
                    window.dispatchEvent(new CustomEvent('premium_status_changed', { detail: true }));
                }

                this.ownedProducts.forEach(productId => {
                    const callback = this.purchaseCallbacks.get(productId);
                    if (callback) callback(productId);
                });
            } catch (e) {
                console.error('IAP: Error restoring from localStorage', e);
            }
        }

        if (!this.isWeb && this.store) {
            try {
                await this.store.restorePurchases();
            } catch (e) {
                console.error('IAP: Error restoring from store', e);
            }
        }
    }

    private savePurchaseState(): void {
        const owned = Array.from(this.ownedProducts);
        localStorage.setItem('ws_challenge_iap_owned', JSON.stringify(owned));
    }
}

export const iapService = new IAPService();
