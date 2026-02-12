
import { Preferences } from '@capacitor/preferences';

// The store global is available when the plugin is installed
declare var CdvPurchase: any;

const PREMIUM_KEY = 'is_premium_user';
const PRODUCT_NO_ADS = 'no_ads';
const PRODUCT_NO_ADS_ALT = 'noads'; // Basado en tu captura de Play Console

class PurchaseService {
    private store: any = null;
    private isPremium = false;
    private isInitialized = false;
    private storeReady = false;

    async initialize() {
        if (this.isInitialized) return;

        // Check local storage first for fast UI response
        const { value } = await Preferences.get({ key: PREMIUM_KEY });
        this.isPremium = value === 'true';

        // Initialize store if on mobile
        if (typeof window !== 'undefined' && (window as any).CdvPurchase) {
            this.isInitialized = true;
            this.store = (window as any).CdvPurchase.store;
            this.setupStore();
        }
    }

    private setupStore() {
        const { store, Store } = (window as any).CdvPurchase;

        console.log('PurchaseService: Setting up store...');

        // Registramos ambos posibles IDs vistos en tu consola
        store.register([
            {
                id: PRODUCT_NO_ADS,
                type: Store.ProductType.NON_CONSUMABLE,
            },
            {
                id: PRODUCT_NO_ADS_ALT,
                type: Store.ProductType.NON_CONSUMABLE,
            }
        ]);

        // Track when the product is owned or updated
        store.when()
            .product(PRODUCT_NO_ADS)
            .owned((p: any) => {
                console.log('PurchaseService: Product owned: ' + p.id);
                this.setPremiumStatus(true);
            })
            .updated((p: any) => {
                console.log('PurchaseService: Product updated: ' + p.id + ' State: ' + p.state);
                if (p.owned) {
                    this.setPremiumStatus(true);
                }
            });

        // Store ready event
        store.ready(() => {
            console.log('PurchaseService: Store is READY');
            this.storeReady = true;

            // Check if user already owns it after sync
            const product = store.get(PRODUCT_NO_ADS);
            if (product && product.owned) {
                console.log('PurchaseService: Validated ownership on store ready');
                this.setPremiumStatus(true);
            }
        });

        // Simple error handling
        store.error((error: any) => {
            console.error('PurchaseService Error: ' + JSON.stringify(error));
        });

        // Initialize the store
        store.initialize([Store.Platform.GOOGLE_PLAY]);
    }

    private async setPremiumStatus(status: boolean) {
        if (this.isPremium === status) return;

        console.log('PurchaseService: Setting premium status to:', status);
        this.isPremium = status;
        await Preferences.set({
            key: PREMIUM_KEY,
            value: status.toString(),
        });

        // Notify app
        window.dispatchEvent(new CustomEvent('premium_status_changed', { detail: status }));
    }

    async purchaseNoAds(): Promise<boolean> {
        // Alerta visual para confirmar que el código nuevo está en el dispositivo
        if (typeof window !== 'undefined') {
            window.alert('Diagnóstico: Intentando comprar "no_ads"...');
        }

        if (!this.store) {
            console.error('PurchaseService: Store not available');
            if (typeof window !== 'undefined') window.alert('Error: Store no disponible');
            return false;
        }

        const { store } = (window as any).CdvPurchase;
        console.log('PurchaseService: Attempting purchase...');

        // Intentamos buscar ambos IDs
        let product = store.get(PRODUCT_NO_ADS);
        if (!product) product = store.get(PRODUCT_NO_ADS_ALT);

        if (!product) {
            const allProducts = (window as any).CdvPurchase.store.products;
            const registeredIds = allProducts ? allProducts.map((p: any) => p.id).join(', ') : 'ninguno';
            const msg = `Producto "no_ads" no encontrado. IDs registrados: [${registeredIds}]`;
            console.warn('PurchaseService:', msg);
            if (typeof window !== 'undefined') window.alert(msg);
            return false;
        }

        console.log('PurchaseService: Product info:', JSON.stringify({
            id: product.id,
            canPurchase: product.canPurchase,
            owned: product.owned,
            state: product.state
        }));

        if (product.canPurchase) {
            try {
                console.log('PurchaseService: Lanzando flujo de Google Play...');
                await store.order(product);
                return true;
            } catch (err: any) {
                console.error('PurchaseService: Error en la orden:', err);
                if (typeof window !== 'undefined') window.alert('Error Google Play: ' + err.message);
                return false;
            }
        } else {
            const msg = 'El producto existe pero no se puede comprar (¿ya es tuyo o falta sincronizar?)';
            console.warn('PurchaseService:', msg);
            if (typeof window !== 'undefined') window.alert(msg);
            return false;
        }
    }

    async restorePurchases() {
        if (this.store) {
            console.log('PurchaseService: Restoring purchases...');
            this.store.restore();
        }
    }

    getIsPremium(): boolean {
        return this.isPremium;
    }
}

export const purchaseService = new PurchaseService();
