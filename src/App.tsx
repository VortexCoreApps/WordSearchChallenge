
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProvider, useGame } from './store/GameContext';
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
import { App as CapApp } from '@capacitor/app';

const screenVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

const transition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30
};

import AchievementToast from '@/components/ui/AchievementToast';

const AppContent: React.FC = () => {
    const { state, progress, dispatch } = useGame();

    // 0. Initialize AdMob and IAPService ONLY ONCE on mount
    React.useEffect(() => {
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

    // Use refs to avoid re-creating listeners on every state change
    const stateRef = React.useRef(state);
    React.useEffect(() => { stateRef.current = state; }, [state]);

    React.useEffect(() => {
        // 1. Web Visibility / Focus Logic (uses refs for stable closures)
        const handleVisibilityChange = () => {
            if (document.hidden && stateRef.current.view === 'game') {
                dispatch({ type: 'PAUSE_GAME' });
            }
        };

        const handleBlur = () => {
            if (stateRef.current.view === 'game') {
                dispatch({ type: 'PAUSE_GAME' });
            }
        };

        // 2. Capacitor (Native) App State & Back Button Logic
        const setupNativeListeners = async () => {
            try {
                // Pause when backgrounded
                const stateListener = await CapApp.addListener('appStateChange', ({ isActive }) => {
                    if (!isActive && stateRef.current.view === 'game') {
                        dispatch({ type: 'PAUSE_GAME' });
                    }
                });

                // Handle Hardware Back Button
                const backListener = await CapApp.addListener('backButton', () => {
                    const currentView = stateRef.current.view;
                    const isPaused = stateRef.current.isPaused;

                    if (currentView === 'menu' || currentView === 'onboarding' || currentView === 'splash') {
                        CapApp.exitApp();
                    } else if (currentView === 'game') {
                        if (isPaused) {
                            dispatch({ type: 'SET_VIEW', payload: 'menu' });
                        } else {
                            dispatch({ type: 'PAUSE_GAME' });
                        }
                    } else {
                        // All other sub-screens go back to menu
                        dispatch({ type: 'SET_VIEW', payload: 'menu' });
                    }
                });

                return { stateListener, backListener };
            } catch (error) {
                console.warn('Capacitor App plugin not available, falling back to Web API');
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
    }, [dispatch]); // Only depends on dispatch (stable)

    React.useEffect(() => {
        if (state.view === 'splash') {
            const timer = setTimeout(() => {
                if (!progress.hasSeenTutorial) {
                    dispatch({ type: 'SET_VIEW', payload: 'onboarding' });
                } else {
                    dispatch({ type: 'SET_VIEW', payload: 'menu' });
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [state.view, progress.hasSeenTutorial, dispatch]);

    return (
        <div className="relative h-full w-full bg-[var(--color-background)] text-[var(--color-text-primary)] font-sans selection:bg-[#fde047] overflow-hidden no-select">
            <AnimatePresence mode="wait">
                <motion.div
                    key={state.view}
                    variants={screenVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={transition}
                    className="absolute inset-0 w-full h-full overflow-y-auto hide-scrollbar pt-[calc(var(--safe-top)+12px)] pb-[var(--safe-bottom)] pl-[var(--safe-left)] pr-[var(--safe-right)]"
                >
                    {state.view === 'splash' && <SplashScreen />}
                    {state.view === 'menu' && <MenuScreen />}
                    {state.view === 'game' && <GameScreen />}
                    {state.view === 'complete' && <CompleteScreen />}
                    {state.view === 'album' && <TrophyAlbum />}
                    {state.view === 'onboarding' && <OnboardingScreen />}
                    {state.view === 'settings' && <SettingsScreen />}
                    {state.view === 'levels' && <LevelSelection />}
                </motion.div>
            </AnimatePresence>

            {/* Achievement Notifications */}
            <AchievementToast />
        </div>
    );
};

const App: React.FC = () => (
    <GameProvider>
        <AppContent />
    </GameProvider>
);

export default App;
