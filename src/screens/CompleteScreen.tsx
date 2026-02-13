
import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, ArrowRight, Home, Sparkles } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { formatTime } from '@/utils/gameUtils';
import { t } from '@/utils/i18n';
import { hapticService } from '@/services/hapticService';
import { adMobService } from '@/services/adMobService';
import { iapService } from '@/services/IAPService';
import { Play, Video } from 'lucide-react';
import * as Icons from 'lucide-react';

const CompleteScreen: React.FC = () => {
    const state = useGameStore();
    const progress = useGameStore(state => state.progress);
    const setView = useGameStore(state => state.setView);
    const startCurrentLevel = useGameStore(state => state.startCurrentLevel);
    const closeTrophyReveal = useGameStore(state => state.closeTrophyReveal);

    // Dispatch shim for ease of migration
    const dispatch = useMemo(() => (action: any) => {
        if (action.type === 'SET_VIEW') setView(action.payload);
        if (action.type === 'START_CURRENT_LEVEL') startCurrentLevel();
        if (action.type === 'CLOSE_TROPHY_REVEAL') closeTrophyReveal();
    }, [setView, startCurrentLevel, closeTrophyReveal]);

    const [showingAdWarning, setShowingAdWarning] = React.useState(false);
    const stars = progress.stars[state.currentLevel?.id || 0] || 0;

    useEffect(() => {
        hapticService.celebration();
    }, []);

    const containerVariants = {
        animate: { transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 }
    };

    const getTrophyIcon = (trophy: any) => {
        const IconComponent = (Icons as any)[trophy.icon] || Trophy;
        return <IconComponent className="w-12 h-12 text-slate-900" />;
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="h-full bg-[var(--color-background)] flex flex-col items-center justify-center p-6 pb-24 text-center max-w-lg mx-auto relative"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            <motion.div
                variants={itemVariants}
                className="w-24 h-24 bg-[var(--color-ink)] rounded-[2rem] flex items-center justify-center mb-8 rotate-3 border-4 border-[var(--color-ink)] shadow-[8px_8px_0px_0px_var(--shadow-light)]"
            >
                <Trophy className="w-12 h-12 text-[var(--color-paper)] fill-[var(--color-paper)]/10" />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-10">
                <h1 className="text-5xl font-black text-[var(--color-text-primary)] uppercase italic tracking-tighter mb-2">{t('levelLabel')} {state.currentLevel?.id} {t('levelDone')}</h1>
                <p className="text-[var(--color-text-muted)] font-black uppercase tracking-[0.4em] text-[10px]">{t('challengeCompleted')}</p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex space-x-4 mb-12">
                {[1, 2, 3].map(s => (
                    <motion.div
                        key={s}
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5 + s * 0.1, type: "spring", stiffness: 260, damping: 20 }}
                    >
                        <Star className={`w-14 h-14 ${s <= stars ? 'text-[#fbbf24] fill-[#fbbf24]' : 'text-[var(--color-text-light)] fill-[var(--color-text-light)]'}`}
                            style={{ filter: s <= stars ? 'drop-shadow(0 4px 0 rgba(251,191,36,0.2))' : 'none' }} />
                    </motion.div>
                ))}
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-6 w-full mb-12">
                <div className="bg-[var(--color-surface)] border-4 border-[var(--color-ink)] p-6 rounded-[2.5rem] shadow-[8px_8px_0px_0px_var(--shadow-color)] flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest mb-1">{t('time')}</p>
                    <p className="text-2xl font-black text-[var(--color-text-primary)] tabular-nums">{formatTime(state.timeElapsed)}</p>
                </div>
                <div className="bg-[var(--color-ink)] border-4 border-[var(--color-ink)] p-6 rounded-[2.5rem] shadow-[8px_8px_0px_0px_var(--shadow-light)]">
                    <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest mb-1">{t('totalStars')}</p>
                    <p className="text-2xl font-black text-[var(--color-paper)]">{Object.values(progress.stars).reduce((a, b) => a + b, 0)}</p>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col w-full gap-4">
                <button
                    onClick={async () => {
                        const levelId = state.currentLevel?.id || 0;
                        const shouldShowAd = levelId >= 10 && levelId % 5 === 0 && !iapService.getIsPremium();

                        if (shouldShowAd) {
                            setShowingAdWarning(true);

                            try {
                                // Show the interstitial (only if pre-loaded, otherwise skip)
                                // The adMobService already handles prepare-and-show fallback
                                await adMobService.showInterstitial();
                            } catch (e) {
                                console.warn('Interstitial ad failed, skipping', e);
                            }

                            setShowingAdWarning(false);

                            // Give the device a moment to recover from the ad overlay
                            await new Promise(resolve => setTimeout(resolve, 300));
                        }

                        // Mandatory stabilization delay to prevent race conditions and UI lockups during level transition
                        await new Promise(resolve => setTimeout(resolve, 300));
                        dispatch({ type: 'START_CURRENT_LEVEL' });
                    }}
                    className="w-full bg-[var(--color-ink)] text-[var(--color-paper)] py-5 rounded-[2.5rem] border-4 border-[var(--color-ink)] flex items-center justify-center space-x-4 shadow-[8px_8px_0px_0px_var(--shadow-light)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
                >
                    <span className="text-2xl font-black uppercase italic tracking-tight">{t('nextLevel')}</span>
                    <ArrowRight className="w-7 h-7" />
                </button>
                <button
                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'menu' })}
                    className="w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] py-4 rounded-[2rem] border-4 border-[var(--color-ink)] flex items-center justify-center space-x-2 shadow-[6px_6px_0px_0px_var(--shadow-color)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                    <Home className="w-5 h-5" />
                    <span className="font-black uppercase text-sm italic tracking-tight underline decoration-[var(--color-text-light)] underline-offset-4">{t('returnToMenu')}</span>
                </button>
            </motion.div>

            <AnimatePresence>
                {state.showTrophyReveal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-[var(--color-ink)]/90 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[var(--color-surface)] border-4 border-[var(--color-ink)] rounded-[3rem] p-10 w-full max-w-sm text-center shadow-[15px_15px_0px_0px_var(--shadow-color)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#fbbf24]/20 rounded-full blur-3xl" />
                            <Sparkles className="w-10 h-10 text-[#fbbf24] fill-[#fbbf24] absolute top-4 right-4" />

                            <h2 className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-[0.5em] mb-4">{t('newTrophyUnlocked')}</h2>

                            <div className="w-32 h-32 bg-[#fbbf24] border-4 border-[var(--color-ink)] rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
                                {getTrophyIcon(state.showTrophyReveal)}
                            </div>

                            <h3 className="text-3xl font-black text-[var(--color-text-primary)] uppercase italic tracking-tighter mb-2">
                                {state.showTrophyReveal.name}
                            </h3>
                            <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-8">
                                {state.showTrophyReveal.description}
                            </p>

                            <button
                                onClick={() => dispatch({ type: 'CLOSE_TROPHY_REVEAL' })}
                                className="w-full bg-[var(--color-ink)] text-[var(--color-paper)] py-4 rounded-[1.5rem] font-black uppercase tracking-widest shadow-lg active:translate-y-1 transition-all"
                            >
                                {t('collectorsHonor')}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showingAdWarning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-[var(--color-ink)]/60 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, rotate: -2 }}
                            animate={{ scale: 1, y: 0, rotate: 0 }}
                            exit={{ scale: 0.9, y: 20, rotate: 2 }}
                            className="bg-[var(--color-surface)] border-4 border-[var(--color-ink)] rounded-[3rem] p-10 w-full max-w-sm text-center shadow-[16px_16px_0px_0px_var(--shadow-color)] relative overflow-hidden"
                        >
                            {/* Decorative background element matching game style */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#fbbf24] -translate-y-16 translate-x-16 rounded-full opacity-20" />

                            <div className="w-20 h-20 bg-[#fbbf24] border-4 border-[var(--color-ink)] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-[6px_6px_0px_0px_var(--color-ink)] rotate-[-6deg] animate-pulse">
                                <Video className="w-10 h-10 text-[var(--color-ink)]" />
                            </div>

                            <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-[var(--color-text-primary)] leading-none">
                                {t('adNotice')}
                            </h3>

                            <p className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-8 leading-relaxed max-w-[240px] mx-auto">
                                {t('adNoticeDesc')}
                            </p>

                            <div className="flex items-center justify-center space-x-3">
                                <motion.div
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ repeat: Infinity, duration: 1, times: [0, 0.5, 1] }}
                                    className="w-3 h-3 bg-[var(--color-ink)] rounded-full"
                                />
                                <motion.div
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ repeat: Infinity, duration: 1, times: [0, 0.5, 1], delay: 0.2 }}
                                    className="w-3 h-3 bg-[var(--color-ink)] rounded-full"
                                />
                                <motion.div
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ repeat: Infinity, duration: 1, times: [0, 0.5, 1], delay: 0.4 }}
                                    className="w-3 h-3 bg-[var(--color-ink)] rounded-full"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CompleteScreen;
