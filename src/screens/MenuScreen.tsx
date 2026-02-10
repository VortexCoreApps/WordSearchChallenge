
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Trophy, Coins, Star, X, Video, Settings } from 'lucide-react';
import { useGame } from '@/store/GameContext';
import { adMobService } from '@/services/adMobService';
import { t, getLanguage } from '@/utils/i18n';
import { purchaseService } from '@/services/purchaseService';
import { ShieldCheck, RefreshCw } from 'lucide-react';

// Seeded random for stable background letters
function seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

const MenuScreen: React.FC = () => {
    const { progress, dispatch } = useGame();
    const [showAdConfirmation, setShowAdConfirmation] = useState(false);
    const [rewardNotification, setRewardNotification] = useState<string | null>(null);
    const [isPremium, setIsPremium] = useState(purchaseService.getIsPremium());

    React.useEffect(() => {
        const handlePremiumChange = (e: any) => {
            setIsPremium(e.detail);
        };
        window.addEventListener('premium_status_changed', handlePremiumChange);
        return () => window.removeEventListener('premium_status_changed', handlePremiumChange);
    }, []);

    // Generate stable background letters using seeded random
    const backgroundLetters = useMemo(() => {
        return Array.from({ length: 200 }).map((_, i) =>
            String.fromCharCode(65 + Math.floor(seededRandom(i * 123.456) * 26))
        );
    }, []);

    return (
        <div className="h-full flex flex-col items-center justify-between max-w-lg mx-auto bg-[var(--color-background)] overflow-hidden relative font-sans p-8 pb-24">
            {/* Thematic Background: Letter Grid Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04] select-none flex flex-wrap content-start p-4">
                {backgroundLetters.map((letter, i) => (
                    <span key={i} className="w-8 h-8 flex items-center justify-center font-black text-xs text-[var(--color-ink)]">
                        {letter}
                    </span>
                ))}
            </div>

            <header className="flex flex-col items-center mt-8 mb-8 w-full z-10">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-4 relative"
                >
                    <div className="w-20 h-20 bg-[var(--color-surface)] border-4 border-[var(--color-ink)] rounded-3xl flex items-center justify-center shadow-[8px_8px_0px_0px_var(--shadow-color)] rotate-[-6deg] relative overflow-hidden">
                        <span className="text-4xl font-black text-[var(--color-ink)] italic">W</span>
                    </div>
                </motion.div>

                {/* Floating Settings Button in Header Area */}
                <div className="absolute top-8 right-8 z-20">
                    <motion.button
                        whileTap={{ scale: 0.9, rotate: 90 }}
                        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'settings' })}
                        className="p-3 bg-[var(--color-surface)] border-2 border-[var(--color-ink)] rounded-2xl shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_var(--shadow-color)] transition-all"
                    >
                        <Settings className="w-6 h-6 text-[var(--color-ink)]" />
                    </motion.button>
                </div>
                <div className="relative inline-block px-4">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="absolute bottom-1 left-0 h-4 bg-[#fde047] opacity-60 z-0"
                    />
                    <h1 className="text-4xl font-black text-[var(--color-text-primary)] uppercase italic tracking-tighter text-center leading-none relative z-10">
                        {t('appTitle')}<br />
                        <span className="text-xl tracking-[0.2em] font-black text-[var(--color-text-secondary)] not-italic block mt-1">{t('appSubtitle')}</span>
                    </h1>
                </div>
            </header>

            <div className="w-full flex flex-col gap-8 flex-1 justify-center max-w-[340px] z-10">
                {/* Word Discovery Stats */}
                <div className="flex justify-center space-x-4">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-[#fbbf24] translate-x-1 translate-y-1 rounded-2xl transition-all" />
                        <div className="relative bg-[var(--color-surface)] border-2 border-[var(--color-ink)] px-6 py-3 rounded-2xl flex items-center space-x-3">
                            <Coins className="w-5 h-5 text-[var(--color-ink)] fill-[#fbbf24]" />
                            <span className="font-black text-[var(--color-text-primary)] text-xl tabular-nums">{progress.coins}</span>
                        </div>
                        <AnimatePresence>
                            {rewardNotification && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.5 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.5 }}
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-max z-[60] pointer-events-none"
                                >
                                    <div className="bg-[#facc15] text-[#0f172a] px-4 py-2 rounded-xl border-4 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rotate-[-2deg] flex items-center gap-2">
                                        <Coins className="w-5 h-5 fill-[#0f172a]" />
                                        <span className="text-lg font-black italic tracking-tighter uppercase">
                                            {rewardNotification}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-[#f43f5e] translate-x-1 translate-y-1 rounded-2xl transition-all" />
                        <div className="relative bg-[var(--color-surface)] border-2 border-[var(--color-ink)] px-6 py-3 rounded-2xl flex items-center space-x-3">
                            <Star className="w-5 h-5 text-[var(--color-ink)] fill-[#f43f5e]" />
                            <span className="font-black text-[var(--color-text-primary)] text-xl tabular-nums">
                                {Object.values(progress.stars).reduce((a, b) => a + b, 0)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Action: Highlighted Level Card */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => dispatch({ type: 'START_CURRENT_LEVEL' })}
                    className="w-full bg-[var(--color-surface)] border-4 border-[var(--color-ink)] p-8 rounded-[2.5rem] flex flex-col items-center justify-center relative shadow-[12px_12px_0px_0px_var(--shadow-color)] group"
                >
                    {/* Highlighter Marks decoration */}
                    <div className="absolute top-6 left-8 w-24 h-6 bg-[#34d399] opacity-20 rounded-full -rotate-12 blur-sm" />
                    <div className="absolute bottom-10 right-10 w-32 h-8 bg-[#38bdf8] opacity-20 rounded-full rotate-6 blur-sm" />

                    <div className="w-16 h-16 bg-[var(--color-ink)] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-[var(--color-paper)] fill-[var(--color-paper)] ml-1" />
                    </div>

                    <div className="relative px-4">
                        <div className="absolute -inset-1 bg-[#fde047] opacity-60 rounded-lg -rotate-1" />
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter relative z-10 text-[var(--color-text-primary)]">{t('levelLabel')} {progress.currentLevelId}</h3>
                    </div>
                    <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.4em] mt-3">{t('readyToFind')}</p>
                </motion.button>

                {/* Secondary Actions */}
                <div className="grid grid-cols-3 gap-3">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'levels' })}
                        className="flex flex-col items-center group"
                    >
                        <div className="w-14 h-14 bg-[var(--color-surface)] border-3 border-[var(--color-ink)] rounded-2xl flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_var(--shadow-color)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                            <Star className="w-6 h-6 text-[var(--color-ink)] fill-[#34d399]" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">{t('levels')}</span>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'album' })}
                        className="flex flex-col items-center group"
                    >
                        <div className="w-14 h-14 bg-[var(--color-surface)] border-3 border-[var(--color-ink)] rounded-2xl flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_var(--shadow-color)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                            <div className="relative w-7 h-7 flex items-center justify-center">
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-full h-full fill-[#fbbf24] stroke-[var(--color-ink)]"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                                    <path d="M4 22h16" />
                                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                                </svg>
                            </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">{t('trophies')}</span>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAdConfirmation(true)}
                        className={`flex flex-col items-center group ${isPremium ? 'opacity-50 grayscale pointer-events-none' : ''}`}
                    >
                        <div className="w-14 h-14 bg-[var(--color-surface)] border-3 border-[var(--color-ink)] rounded-2xl flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_var(--shadow-color)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                            <Video className="w-6 h-6 text-[var(--color-ink)] fill-[#fbbf24]" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">{isPremium ? t('purchased') : t('freeCoins')}</span>
                    </motion.button>
                </div>

                {/* Remove Ads Banner */}
                {!isPremium && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={async () => {
                            const success = await purchaseService.purchaseNoAds();
                            if (!success) {
                                setRewardNotification(t('error'));
                                setTimeout(() => setRewardNotification(null), 3000);
                            }
                        }}
                        className="w-full bg-[#fde047] border-3 border-[#0f172a] p-4 rounded-2xl flex items-center justify-between shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] group mt-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white border-2 border-[#0f172a] rounded-xl flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-[#0f172a]" />
                            </div>
                            <div className="text-left">
                                <h4 className="text-sm font-black uppercase tracking-tighter leading-none">{t('removeAds')}</h4>
                                <p className="text-[10px] font-bold text-[#0f172a]/60 uppercase leading-none mt-1">{t('removeAdsDesc')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-[#0f172a]/40 uppercase">{t('restorePurchases')}</span>
                            <RefreshCw
                                className="w-4 h-4 text-[#0f172a] opacity-40 group-hover:rotate-180 transition-transform duration-500 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    purchaseService.restorePurchases();
                                }}
                            />
                        </div>
                    </motion.button>
                )}
            </div>

            <AnimatePresence>
                {showAdConfirmation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowAdConfirmation(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[var(--color-surface)] border-4 border-[var(--color-ink)] rounded-3xl p-6 w-full max-w-sm shadow-[8px_8px_0px_0px_var(--shadow-color)] relative"
                        >
                            <button
                                onClick={() => setShowAdConfirmation(false)}
                                className="absolute -top-3 -right-3 bg-[#f43f5e] border-2 border-[var(--color-ink)] rounded-full p-2 text-white shadow-[2px_2px_0px_0px_var(--shadow-color)] hover:scale-110 active:scale-90 transition-transform"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-[#fbbf24] border-3 border-[#0f172a] rounded-2xl flex items-center justify-center mb-4 rotate-[-6deg]">
                                    <Video className="w-8 h-8 text-[#0f172a]" />
                                </div>

                                <h3 className="text-2xl font-black uppercase italic text-[var(--color-text-primary)] mb-2 leading-none">
                                    {t('watchAd')}
                                </h3>
                                <p className="text-[var(--color-text-secondary)] font-bold text-sm mb-6 max-w-[200px]">
                                    {t('watchAdDescription')} <span className="text-[#059669]">100 {t('freeCoins')}</span>!
                                </p>

                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => setShowAdConfirmation(false)}
                                        className="flex-1 font-black text-[var(--color-text-secondary)] uppercase tracking-wide py-3 hover:bg-black/5 rounded-xl transition-colors"
                                    >
                                        {t('later')}
                                    </button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={async () => {
                                            setShowAdConfirmation(false);

                                            // Check if ads are available first
                                            const canShow = adMobService.canShowAds();
                                            if (!canShow.success) {
                                                setRewardNotification(adMobService.getErrorMessage(canShow.error!, 'en'));
                                                setTimeout(() => setRewardNotification(null), 3000);
                                                return;
                                            }

                                            const result = await adMobService.showRewarded();
                                            if (result.success) {
                                                // Small delay to allow ad UI to close comfortably
                                                setTimeout(() => {
                                                    dispatch({ type: 'ADD_COINS', payload: 100 });
                                                    setRewardNotification(t('rewardReceived'));
                                                    // Show for longer so user definitely sees it
                                                    setTimeout(() => setRewardNotification(null), 4000);
                                                }, 500);
                                            } else if (result.error) {
                                                // Show error message to user - use language-aware error message
                                                const lang = getLanguage();
                                                setRewardNotification(adMobService.getErrorMessage(result.error, lang === 'es' ? 'es' : 'en'));
                                                setTimeout(() => setRewardNotification(null), 3000);
                                            }
                                        }}
                                        className="flex-[2] bg-[#34d399] border-2 border-[var(--color-ink)] rounded-xl py-3 font-black text-[var(--color-ink)] uppercase tracking-wide shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--shadow-color)] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Play className="w-4 h-4 fill-[var(--color-ink)]" />
                                        {t('watch')}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

            </AnimatePresence>

        </div>
    );
};

export default MenuScreen;
