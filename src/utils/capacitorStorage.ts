/**
 * Capacitor Preferences storage adapter for Zustand persist middleware.
 * 
 * Uses @capacitor/preferences (SharedPreferences on Android) which is more
 * durable than WebView localStorage. Data persists across app updates and
 * can survive reinstallation if Android backup is enabled.
 * 
 * Falls back to localStorage on web (dev environment).
 */

import { StateStorage } from 'zustand/middleware';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

export const capacitorStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        if (isNative) {
            try {
                const { value } = await Preferences.get({ key: name });
                return value;
            } catch (e) {
                console.warn('capacitorStorage.getItem failed, falling back to localStorage', e);
                return localStorage.getItem(name);
            }
        }
        return localStorage.getItem(name);
    },

    setItem: async (name: string, value: string): Promise<void> => {
        if (isNative) {
            try {
                await Preferences.set({ key: name, value });
            } catch (e) {
                console.warn('capacitorStorage.setItem failed, falling back to localStorage', e);
                localStorage.setItem(name, value);
            }
        }
        // Always write to localStorage too as a redundant backup
        localStorage.setItem(name, value);
    },

    removeItem: async (name: string): Promise<void> => {
        if (isNative) {
            try {
                await Preferences.remove({ key: name });
            } catch (e) {
                console.warn('capacitorStorage.removeItem failed', e);
            }
        }
        localStorage.removeItem(name);
    },
};

/**
 * One-time migration: if data exists in localStorage but NOT in Preferences,
 * copy it over. This handles the case where users already have progress
 * saved in localStorage from previous versions.
 */
export async function migrateLocalStorageToPreferences(key: string): Promise<void> {
    if (!isNative) return;

    try {
        const { value: existing } = await Preferences.get({ key });
        if (existing) return; // Already migrated

        const localData = localStorage.getItem(key);
        if (localData) {
            await Preferences.set({ key, value: localData });
            console.log(`Migrated "${key}" from localStorage to Capacitor Preferences`);
        }
    } catch (e) {
        console.warn('Migration from localStorage to Preferences failed', e);
    }
}
