
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/useGameStore';
import MenuScreen from '@/screens/MenuScreen';
import GameScreen from '@/screens/GameScreen';
import CompleteScreen from '@/screens/CompleteScreen';
import SplashScreen from '@/screens/SplashScreen';
import OnboardingScreen from '@/screens/OnboardingScreen';
import TrophyAlbum from '@/screens/TrophyAlbum';
import LevelSelection from '@/screens/LevelSelection';
import SettingsScreen from '@/screens/SettingsScreen';
import { adMobService } from '@/services/adMobService';
import { iapService, IAP_PRODUCTS } from '@/services/IAPService';
import { migrateLocalStorageToPreferences } from '@/utils/capacitorStorage';
import { App as CapApp } from '@capacitor/app';

const screenVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

const transition = {
    duration: 0.3,
    ease: "easeInOut" as const
};

import AchievementToast from '@/components/ui/AchievementToast';

const App: React.FC = () => {
    const view = useGameStore(state => state.view);
    const progress = useGameStore(state => state.progress);
    const isPaused = useGameStore(state => state.isPaused);
    const setView = useGameStore(state => state.setView);
    const pauseGame = useGameStore(state => state.pauseGame);

    // 0. Initialize services and migrate data ONLY ONCE on mount
    React.useEffect(() => {
        // Migrate existing localStorage data to Capacitor Preferences (one-time)
        migrateLocalStorageToPreferences('ws_challenge_pro_storage');

        adMobService.initialize();

        iapService.initialize().then(() => {
            // Si ya tiene no_ads comprado, ocultar banner
            if (iapService.isOwned(IAP_PRODUCTS.NO_ADS)) {
                adMobService.hideBanner();
            }

            // Registrar callback para cuando se complete la compra
            iapService.onPurchaseComplete(IAP_PRODUCTS.NO_ADS, () => {
                adMobService.hideBanner();
            });
        });
    }, []);

    // Local refs for native listeners to avoid stale closures
    const currentViewRef = React.useRef(view);
    const isPausedRef = React.useRef(isPaused);

    useEffect(() => {
        currentViewRef.current = view;
        isPausedRef.current = isPaused;
    }, [view, isPaused]);

    React.useEffect(() => {
        // 1. Web Visibility / Focus Logic
        const handleVisibilityChange = () => {
            if (document.hidden && currentViewRef.current === 'game') {
                pauseGame();
            }
        };

        const handleBlur = () => {
            if (currentViewRef.current === 'game') {
                pauseGame();
            }
        };

        // 2. Capacitor (Native) App State & Back Button Logic
        const setupNativeListeners = async () => {
            try {
                // Pause when backgrounded
                const stateListener = await CapApp.addListener('appStateChange', ({ isActive }) => {
                    if (!isActive && currentViewRef.current === 'game') {
                        pauseGame();
                    }
                });

                // Handle Hardware Back Button
                const backListener = await CapApp.addListener('backButton', () => {
                    const currentView = currentViewRef.current;
                    const isPaused = isPausedRef.current;

                    if (currentView === 'menu' || currentView === 'onboarding' || currentView === 'splash') {
                        CapApp.exitApp();
                    } else if (currentView === 'game') {
                        if (isPaused) {
                            setView('menu');
                        } else {
                            pauseGame();
                        }
                    } else {
                        setView('menu');
                    }
                });

                return { stateListener, backListener };
            } catch (error) {
                console.warn('Capacitor App plugin not available');
                return null;
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        let listeners: any = null;
        setupNativeListeners().then(l => listeners = l);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            if (listeners) {
                listeners.stateListener.remove();
                listeners.backListener.remove();
            }
        };
    }, []); // Only setup once

    React.useEffect(() => {
        if (view === 'splash') {
            const timer = setTimeout(() => {
                if (!progress.hasSeenTutorial) {
                    setView('onboarding');
                } else {
                    setView('menu');
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [view, progress.hasSeenTutorial]);

    return (
        <div className="relative h-full w-full bg-[var(--color-background)] text-[var(--color-text-primary)] font-sans selection:bg-[#fde047] overflow-hidden no-select">
            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    variants={screenVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={transition}
                    className="absolute inset-0 w-full h-full overflow-y-auto hide-scrollbar pt-[calc(var(--safe-top)+12px)] pb-[var(--safe-bottom)] pl-[var(--safe-left)] pr-[var(--safe-right)]"
                >
                    {view === 'splash' && <SplashScreen />}
                    {view === 'menu' && <MenuScreen />}
                    {view === 'game' && <GameScreen />}
                    {view === 'complete' && <CompleteScreen />}
                    {view === 'album' && <TrophyAlbum />}
                    {view === 'onboarding' && <OnboardingScreen />}
                    {view === 'settings' && <SettingsScreen />}
                    {view === 'levels' && <LevelSelection />}
                </motion.div>
            </AnimatePresence>

            {/* Achievement Notifications */}
            <AchievementToast />
        </div>
    );
};

export default App;
