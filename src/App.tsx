
import React from 'react';
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
import { App as CapApp } from '@capacitor/app';

const screenVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
};

const transition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30
};

import AchievementToast from '@/components/ui/AchievementToast';

const AppContent: React.FC = () => {
    const { state, progress, dispatch } = useGame();

    // 0. Initialize AdMob ONLY ONCE on mount
    React.useEffect(() => {
        adMobService.initialize();
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

        // 2. Capacitor (Native) App State Logic
        const setupNativePause = async () => {
            try {
                const listener = await CapApp.addListener('appStateChange', ({ isActive }) => {
                    if (!isActive && state.view === 'game') {
                        dispatch({ type: 'PAUSE_GAME' });
                    }
                });
                return listener;
            } catch (error) {
                console.warn('Capacitor App plugin not available, falling back to Web API');
                return null;
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        let nativeListener: any = null;
        setupNativePause().then(l => nativeListener = l);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            if (nativeListener) nativeListener.remove();
        };
    }, [state.view, dispatch]);

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
        <div className="relative h-full w-full bg-[#f8fafc] text-[#0f172a] font-sans selection:bg-[#fde047] overflow-hidden no-select">
            <AnimatePresence mode="wait">
                <motion.div
                    key={state.view}
                    variants={screenVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={transition}
                    className="absolute inset-0 w-full h-full overflow-y-auto hide-scrollbar"
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
