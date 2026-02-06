
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
import { adMobService } from '@/services/adMobService';
import { purchaseService } from '@/services/purchaseService';
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

    // 0. Initialize AdMob and PurchaseService ONLY ONCE on mount
    React.useEffect(() => {
        adMobService.initialize();
        purchaseService.initialize();
    }, []);

    React.useEffect(() => {
        // 1. Web Visibility / Focus Logic
        const handleVisibilityChange = () => {
            if (document.hidden && state.view === 'game') {
                dispatch({ type: 'PAUSE_GAME' });
            }
        };

        const handleBlur = () => {
            if (state.view === 'game') {
                dispatch({ type: 'PAUSE_GAME' });
            }
        };

        // 2. Capacitor (Native) App State & Back Button Logic
        const setupNativeListeners = async () => {
            try {
                // Pause when backgrounded
                const stateListener = await CapApp.addListener('appStateChange', ({ isActive }) => {
                    if (!isActive && state.view === 'game') {
                        dispatch({ type: 'PAUSE_GAME' });
                    }
                });

                // Handle Hardware Back Button
                const backListener = await CapApp.addListener('backButton', () => {
                    if (state.view === 'menu' || state.view === 'onboarding' || state.view === 'splash') {
                        CapApp.exitApp();
                    } else if (state.view === 'game') {
                        if (state.isPaused) {
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
    }, [state.view, state.isPaused, dispatch]);

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
