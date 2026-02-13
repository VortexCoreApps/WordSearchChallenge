
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { t } from '@/utils/i18n';
import { Search, Star, Zap, Coins, ArrowRight, Check, Trophy, MousePointer2, Sparkles, Video } from 'lucide-react';

const OnboardingScreen: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const finishTutorial = useGameStore(state => state.finishTutorial);

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
        } else {
            finishTutorial();
        }
    };

    const steps = [
        {
            title: 'how_to_play',
            description: 'how_to_play_desc',
            visual: (
                <div className="relative w-48 h-48 bg-white border-4 border-[#0f172a] rounded-2xl p-2 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] rotate-[-2deg]">
                    <div className="grid grid-cols-3 gap-1 h-full">
                        {['W', 'O', 'R', 'D', 'S', 'E', 'A', 'R', 'C'].map((l, i) => (
                            <div key={i} className="flex items-center justify-center font-black text-[#0f172a] text-xl border border-slate-100 rounded-md">
                                {l}
                            </div>
                        ))}
                    </div>
                    {/* Animated Selector */}
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: '90%', opacity: 1 }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                        className="absolute top-[6%] left-[5%] h-[25%] bg-[#fde047] opacity-60 rounded-full z-0 border-2 border-[#0f172a]"
                    />
                    <motion.div
                        animate={{ x: [0, 100, 0], y: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                        className="absolute top-[8%] left-[10%] z-20"
                    >
                        <MousePointer2 className="w-8 h-8 text-[#0f172a] fill-white" />
                    </motion.div>
                </div>
            )
        },
        {
            title: 'stars_and_trophies',
            description: 'stars_desc',
            visual: (
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex space-x-2">
                        {[1, 2, 3].map(i => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: i * 0.2, type: 'spring' }}
                            >
                                <Star className={`w-12 h-12 ${i <= 2 ? 'text-[#fbbf24] fill-[#fbbf24]' : 'text-slate-200'} drop-shadow-[2px_2px_0px_rgba(15,23,42,1)]`} />
                            </motion.div>
                        ))}
                    </div>
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="puzzle-card p-4 bg-white border-4 border-[#0f172a] rounded-2xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex items-center space-x-4"
                    >
                        <div className="w-12 h-12 bg-[#fbbf24] rounded-xl flex items-center justify-center border-2 border-[#0f172a]">
                            <Trophy className="w-7 h-7 text-[#0f172a]" />
                        </div>
                        <div className="text-left">
                            <div className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">New Unlocked</div>
                            <div className="text-sm font-black text-[#0f172a] uppercase italic">Nature Master</div>
                        </div>
                    </motion.div>
                </div>
            )
        },
        {
            title: 'smart_hints',
            description: 'hints_desc',
            visual: (
                <div className="grid grid-cols-2 gap-4">
                    <div className="puzzle-card bg-white border-2 border-[#0f172a] rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center">
                        <div className="w-10 h-10 bg-[#fde047] rounded-lg flex items-center justify-center border-2 border-[#0f172a] mb-2">
                            <Zap className="w-6 h-6 text-[#0f172a]" />
                        </div>
                        <div className="text-[10px] font-black uppercase">Letter</div>
                        <div className="flex items-center text-xs font-black text-[#b45309]">
                            <Coins className="w-3 h-3 mr-1" /> 25
                        </div>
                    </div>
                    <div className="puzzle-card bg-white border-2 border-[#0f172a] rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center">
                        <div className="w-10 h-10 bg-[#fda4af] rounded-lg flex items-center justify-center border-2 border-[#0f172a] mb-2">
                            <Search className="w-6 h-6 text-[#0f172a]" />
                        </div>
                        <div className="text-[10px] font-black uppercase">Word</div>
                        <div className="flex items-center text-xs font-black text-[#b45309]">
                            <Coins className="w-3 h-3 mr-1" /> 75
                        </div>
                    </div>
                    <motion.div
                        animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-4 -right-4"
                    >
                        <Sparkles className="w-8 h-8 text-[#fbbf24]" />
                    </motion.div>
                </div>
            )
        },
        {
            title: 'coins_and_rewards',
            description: 'coins_desc',
            visual: (
                <div className="flex flex-col items-center space-y-6">
                    <div className="flex items-center bg-white border-4 border-[#0f172a] rounded-2xl px-6 py-3 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
                        <Coins className="w-8 h-8 text-[#fbbf24] mr-3 fill-[#fbbf24] drop-shadow-[2px_2px_0px_rgba(15,23,42,1)]" />
                        <span className="text-3xl font-black italic text-[#0f172a]">200</span>
                    </div>
                    <button className="flex items-center space-x-3 bg-[#fbbf24] border-4 border-[#0f172a] rounded-2xl px-6 py-3 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
                        <Video className="w-6 h-6 text-[#0f172a]" />
                        <span className="text-xs font-black uppercase italic text-[#0f172a]">Watch & Earn +50</span>
                    </button>
                </div>
            )
        },
        {
            title: 'get_ready',
            description: 'get_ready_desc',
            visual: (
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-32 h-32 bg-[#0f172a] rounded-[2.5rem] flex items-center justify-center shadow-[12px_12px_0px_0px_#fbbf24] rotate-[-8deg] relative"
                >
                    <span className="text-7xl font-black text-white italic" style={{ fontFamily: "'Outfit', sans-serif" }}>W</span>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#fbbf24] rounded-full border-4 border-[#0f172a]" />
                </motion.div>
            )
        }
    ];

    return (
        <div className="h-full bg-[var(--color-background)] flex flex-col p-8 text-center font-sans overflow-hidden pb-16">
            {/* All content grouped and centered together */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-10 sm:space-y-14">
                {/* Header / Title Area */}
                <div className="w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="max-w-xs mx-auto"
                        >
                            <h2 className="text-4xl font-black text-[var(--color-text-primary)] uppercase italic tracking-tighter leading-none mb-4">
                                {t(steps[currentStep].title as any) || steps[currentStep].title}
                            </h2>
                            <div className="h-1.5 w-16 bg-[#fbbf24] mx-auto rounded-full" />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Visual Center Area */}
                <div className="relative py-2">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ scale: 0.8, opacity: 0, rotate: 10 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 1.2, opacity: 0, rotate: -10 }}
                            transition={{ type: 'spring', damping: 15 }}
                            className="relative z-10"
                        >
                            <div className="text-[var(--color-ink)]">
                                {steps[currentStep].visual}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Background decorative elements */}
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
                        <div className="grid grid-cols-4 gap-4 h-full w-full rotate-12 scale-150">
                            {Array.from({ length: 16 }).map((_, i) => (
                                <div key={i} className="text-4xl font-black text-[var(--color-ink)] flex items-center justify-center">?</div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Description Area */}
                <div className="w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                        >
                            <p className="text-[var(--color-text-secondary)] font-bold text-lg leading-tight px-4 max-w-sm mx-auto">
                                {t(steps[currentStep].description as any) || steps[currentStep].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Controls (Indicators and Button) now grouped with content */}
                <div className="w-full pt-4">
                    {/* Progress Indicators */}
                    <div className="flex justify-center gap-2 mb-8">
                        {steps.map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    width: i === currentStep ? 32 : 8,
                                    backgroundColor: i === currentStep ? 'var(--color-ink)' : 'var(--color-border)'
                                }}
                                className="h-2 rounded-full cursor-pointer"
                                onClick={() => setCurrentStep(i)}
                            />
                        ))}
                    </div>

                    <div className="max-w-[280px] mx-auto">
                        <button
                            onClick={handleNext}
                            className="w-full py-5 flex items-center justify-center gap-3 text-xl bg-[var(--color-surface)] border-4 border-[var(--color-ink)] text-[var(--color-text-primary)] shadow-[8px_8px_0px_0px_var(--shadow-color)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all rounded-3xl"
                        >
                            <span className="font-black uppercase italic">
                                {currentStep === steps.length - 1 ? t('get_started') || "Let's Play!" : t('next') || "Next"}
                            </span>
                            {currentStep === steps.length - 1 ? <Check className="w-6 h-6 stroke-[3px]" /> : <ArrowRight className="w-6 h-6 stroke-[3px]" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingScreen;
