
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, ArrowRight, Home, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '@/store/GameContext';
import { formatTime } from '@/utils/gameUtils';
import { t } from '@/utils/i18n';
import { hapticService } from '@/services/hapticService';
import * as Icons from 'lucide-react';

const CompleteScreen: React.FC = () => {
    const { state, progress, dispatch } = useGame();
    const stars = progress.stars[state.currentLevel?.id || 0] || 0;

    useEffect(() => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0f172a', '#fde047', '#fda4af', '#67e8f9']
        });
        hapticService.celebration(); // Haptic celebration for level complete
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
            className="h-full bg-[#f8fafc] flex flex-col items-center justify-center p-6 pb-24 text-center max-w-lg mx-auto relative"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            <motion.div
                variants={itemVariants}
                className="w-24 h-24 bg-[#0f172a] rounded-[2rem] flex items-center justify-center mb-8 rotate-3 border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,0.1)]"
            >
                <Trophy className="w-12 h-12 text-white fill-white/10" />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-10">
                <h1 className="text-5xl font-black text-[#0f172a] uppercase italic tracking-tighter mb-2">{t('levelLabel')} {state.currentLevel?.id} {t('levelDone')}</h1>
                <p className="text-[#94a3b8] font-black uppercase tracking-[0.4em] text-[10px]">{t('challengeCompleted')}</p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex space-x-4 mb-12">
                {[1, 2, 3].map(s => (
                    <motion.div
                        key={s}
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5 + s * 0.1, type: "spring", stiffness: 260, damping: 20 }}
                    >
                        <Star className={`w-14 h-14 ${s <= stars ? 'text-[#fbbf24] fill-[#fbbf24]' : 'text-[#e2e8f0] fill-[#e2e8f0]'}`}
                            style={{ filter: s <= stars ? 'drop-shadow(0 4px 0 rgba(251,191,36,0.2))' : 'none' }} />
                    </motion.div>
                ))}
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-6 w-full mb-12">
                <div className="bg-white border-4 border-[#0f172a] p-6 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                    <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest mb-1">{t('time')}</p>
                    <p className="text-2xl font-black text-[#0f172a] tabular-nums">{formatTime(state.timeElapsed)}</p>
                </div>
                <div className="bg-[#0f172a] border-4 border-[#0f172a] p-6 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,0.1)]">
                    <p className="text-[10px] font-black text-[#64748b] uppercase tracking-widest mb-1">{t('totalStars')}</p>
                    <p className="text-2xl font-black text-white">{Object.values(progress.stars).reduce((a, b) => a + b, 0)}</p>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col w-full gap-4">
                <button
                    onClick={() => dispatch({ type: 'START_CURRENT_LEVEL' })}
                    className="w-full bg-[#0f172a] text-white py-5 rounded-[2.5rem] border-4 border-[#0f172a] flex items-center justify-center space-x-4 shadow-[8px_8px_0px_0px_rgba(15,23,42,0.2)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
                >
                    <span className="text-2xl font-black uppercase italic tracking-tight">{t('nextLevel')}</span>
                    <ArrowRight className="w-7 h-7" />
                </button>
                <button
                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'menu' })}
                    className="w-full bg-white text-[#0f172a] py-4 rounded-[2rem] border-4 border-[#0f172a] flex items-center justify-center space-x-2 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                    <Home className="w-5 h-5" />
                    <span className="font-black uppercase text-sm italic tracking-tight underline decoration-[#cbd5e1] underline-offset-4">{t('returnToMenu')}</span>
                </button>
            </motion.div>

            <AnimatePresence>
                {state.showTrophyReveal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-[#0f172a]/90 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white border-4 border-[#0f172a] rounded-[3rem] p-10 w-full max-w-sm text-center shadow-[15px_15px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#fbbf24]/20 rounded-full blur-3xl" />
                            <Sparkles className="w-10 h-10 text-[#fbbf24] fill-[#fbbf24] absolute top-4 right-4" />

                            <h2 className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.5em] mb-4">{t('newTrophyUnlocked')}</h2>

                            <div className="w-32 h-32 bg-[#fbbf24] border-4 border-[#0f172a] rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
                                {getTrophyIcon(state.showTrophyReveal)}
                            </div>

                            <h3 className="text-3xl font-black text-[#0f172a] uppercase italic tracking-tighter mb-2">
                                {state.showTrophyReveal.name}
                            </h3>
                            <p className="text-xs font-bold text-[#64748b] uppercase tracking-widest mb-8">
                                {state.showTrophyReveal.description}
                            </p>

                            <button
                                onClick={() => dispatch({ type: 'CLOSE_TROPHY_REVEAL' })}
                                className="w-full bg-[#0f172a] text-white py-4 rounded-[1.5rem] font-black uppercase tracking-widest shadow-lg active:translate-y-1 transition-all"
                            >
                                {t('collectorsHonor')}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


        </motion.div>
    );
};

export default CompleteScreen;
