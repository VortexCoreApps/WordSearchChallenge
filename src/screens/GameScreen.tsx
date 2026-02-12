
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Clock, Pause, Lightbulb, Coins, Play, Volume2, VolumeX, Smartphone, SmartphoneNfc } from 'lucide-react';
import { useGame } from '@/store/GameContext';
import WordSearchGrid from '@/components/game/WordSearchGrid';
import WordList from '@/components/game/WordList';
import { formatTime } from '@/utils/gameUtils';
import { UI_CONFIG } from '@/constants';
import { audioSystem } from '@/utils/audioSystem';
import { t, getFeedbackMessages } from '@/utils/i18n';
import { getWorldTheme, getBlockIndexFromLevelId } from '@/constants/worldThemes';

const TimerDisplay: React.FC<{ time: number }> = React.memo(({ time }) => {
    return (
        <div className="text-center">
            <p className="text-[8px] font-black text-[var(--color-text-muted)] uppercase tracking-widest mb-1">{t('time')}</p>
            <div className="flex items-center space-x-2 text-[var(--color-text-primary)] transition-all duration-300">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-lg font-black tabular-nums tracking-tighter">
                    {formatTime(time)}
                </span>
            </div>
        </div>
    );
});

const ProgressDisplay: React.FC<{ found: number, total: number }> = React.memo(({ found, total }) => {
    return (
        <div className="text-center">
            <p className="text-[8px] font-black text-[var(--color-text-muted)] uppercase tracking-widest mb-1">{t('progress')}</p>
            <div className="flex items-center justify-center space-x-2 text-[var(--color-text-primary)]">
                <span className="text-lg font-black tabular-nums tracking-tighter">
                    {found}/{total}
                </span>
            </div>
        </div>
    );
});

const GameScreen: React.FC = () => {
    const { state, progress, dispatch } = useGame();
    const [showHintMenu, setShowHintMenu] = useState(false);
    const [boardRotation, setBoardRotation] = useState(0);
    const [feedback, setFeedback] = useState<{ message: string, color: string } | null>(null);
    const { currentLevel, currentBlock, grid, wordsInfo, foundWordsCells, timeElapsed, isPaused } = state;

    // Get localized feedback messages
    const feedbackMessages = getFeedbackMessages();

    const handleWordFound = React.useCallback((word: string, cells: { row: number, col: number }[]) => {
        const wordInfo = wordsInfo.find(w => (w.word === word || w.word === [...word].reverse().join('')) && !w.found);
        if (wordInfo) {
            dispatch({ type: 'WORD_FOUND', payload: { word: wordInfo.word, cells } });
            setFeedback({
                message: feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)],
                color: wordInfo.color
            });
            setTimeout(() => setFeedback(null), 1500);
        }
    }, [wordsInfo, feedbackMessages, dispatch]);

    if (!currentLevel) return null;

    const foundCount = wordsInfo.filter(w => w.found).length;

    // Get world theme for current level
    const worldTheme = useMemo(() => {
        const blockIndex = getBlockIndexFromLevelId(currentLevel.id);
        return getWorldTheme(blockIndex);
    }, [currentLevel.id]);

    return (
        <div className="h-full bg-[var(--color-background)] flex flex-col p-4 pb-20 touch-none max-w-lg mx-auto overflow-hidden relative">
            {/* World-themed ambient background — fixed to fill entire viewport */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
                {/* Top-right glow */}
                <div
                    className="absolute w-80 h-80 rounded-full blur-2xl"
                    style={{ background: worldTheme.accent, top: '-8%', right: '-10%', opacity: 0.15 }}
                />
                {/* Bottom-left glow */}
                <div
                    className="absolute w-72 h-72 rounded-full blur-2xl"
                    style={{ background: worldTheme.glow, bottom: '0%', left: '-15%', opacity: 0.12 }}
                />
                {/* Center subtle wash */}
                <div
                    className="absolute rounded-full blur-2xl"
                    style={{
                        background: `radial-gradient(circle, ${worldTheme.accent}15 0%, transparent 70%)`,
                        width: '120%', height: '60%',
                        top: '25%', left: '-10%',
                        opacity: 0.4
                    }}
                />
            </div>
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] pointer-events-none"
                    >
                        <div
                            className="text-white px-10 py-4 rounded-[2rem] border-4 border-[var(--color-ink)] shadow-[8px_8px_0px_0px_var(--shadow-color)] rotate-[-4deg]"
                            style={{
                                fontFamily: "'Outfit', sans-serif",
                                backgroundColor: feedback.color
                            }}
                        >
                            <span className="text-4xl font-black italic tracking-tighter whitespace-nowrap uppercase">
                                {feedback.message}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="grid grid-cols-[1fr_2fr_1fr] items-center mb-6 mt-6 px-2">
                <div className="flex justify-start">
                    <button
                        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'menu' })}
                        className="p-3 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1" style={{ color: worldTheme.accent }}>
                        {worldTheme.emoji} {currentBlock?.name || 'Journey'}
                    </p>
                    <h3 className="text-xl font-black text-[var(--color-text-primary)] uppercase italic leading-tight">
                        {t('levelLabel')} {currentLevel.id}
                    </h3>
                </div>
                <div className="flex justify-end">
                    <div className="bg-[var(--color-surface)] border-2 border-[var(--color-ink)] px-3 py-1.5 rounded-xl shadow-[4px_4px_0px_0px_var(--shadow-color)] flex items-center space-x-1.5 scale-90 origin-right">
                        <Coins className="w-4 h-4 text-[#fbbf24] fill-[#fbbf24]" />
                        <span className="font-black text-[var(--color-text-primary)] text-sm">{progress.coins}</span>
                    </div>
                </div>
            </header>

            <div className="flex items-center justify-center space-x-12 mb-4">
                <TimerDisplay time={timeElapsed} />
                <div className="w-px h-6 bg-[var(--color-border)]" />
                <ProgressDisplay found={foundCount} total={wordsInfo.length} />
            </div>

            <main className="flex-1 min-h-0 flex flex-col items-center justify-center gap-y-2 sm:gap-y-4">
                <motion.div
                    animate={{ rotate: boardRotation }}
                    transition={{ type: "spring", stiffness: 260, damping: 26 }}
                    className="w-full max-w-[360px] flex justify-center"
                >
                    <WordSearchGrid
                        grid={grid}
                        onWordFound={handleWordFound}
                        foundWordsCells={foundWordsCells}
                        rotation={boardRotation}
                    />
                </motion.div>
                <div className="w-full flex flex-col items-center mb-4 sm:mb-8">
                    <WordList words={wordsInfo} category={currentLevel.title} />
                </div>
            </main>

            <footer className="mt-auto py-4 flex items-center justify-center space-x-6 relative">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
                    className="w-16 h-16 bg-[var(--color-surface)] border-2 border-[var(--color-ink)] rounded-2xl flex items-center justify-center shadow-[6px_6px_0px_0px_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                    <Pause className="w-6 h-6 text-[var(--color-ink)] fill-[var(--color-ink)]" />
                </motion.button>

                <div className="relative">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className={`group relative overflow-hidden px-10 h-16 rounded-[2rem] border-2 border-[var(--color-ink)] flex items-center justify-center space-x-3 shadow-[8px_8px_0px_0px_var(--shadow-color)] transition-all ${showHintMenu ? 'bg-[var(--color-ink)] text-[var(--color-paper)] translate-x-[4px] translate-y-[4px] shadow-none' : 'bg-[#fbbf24] text-[#0f172a]'
                            }`}
                        onClick={() => setShowHintMenu(!showHintMenu)}
                    >
                        <Lightbulb className={`w-7 h-7 ${showHintMenu ? 'text-[var(--color-paper)]' : 'text-[#0f172a] fill-[#fde047]'}`} />
                        <span className="text-xl font-black uppercase italic tracking-tighter">{t('hints')}</span>
                        {!showHintMenu && (
                            <div className="absolute top-0 right-0 w-2 h-2 bg-[#f43f5e] rounded-full mt-2 mr-6 animate-pulse" />
                        )}
                    </motion.button>

                    <AnimatePresence>
                        {showHintMenu && (
                            <motion.div
                                initial={{ y: 20, opacity: 0, scale: 0.9 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: 20, opacity: 0, scale: 0.9 }}
                                className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-[var(--color-surface)] border-4 border-[var(--color-ink)] p-5 rounded-[2.5rem] shadow-[12px_12px_0px_0px_var(--shadow-color)] w-72 z-40"
                            >
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[var(--color-surface)] border-b-4 border-r-4 border-[var(--color-ink)] rotate-45" />
                                <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-[0.3em] mb-4 text-center">{t('magicalHelpers')}</p>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => {
                                            dispatch({ type: 'USE_HINT', payload: { type: 'single_letter' } });
                                            setShowHintMenu(false);
                                        }}
                                        className="w-full group flex items-center justify-between p-4 bg-[var(--color-background)] border-2 border-transparent hover:border-[var(--color-ink)] rounded-2xl transition-all"
                                    >
                                        <div className="text-left">
                                            <p className="text-sm font-black text-[var(--color-text-primary)] uppercase leading-none">{t('letterHint')}</p>
                                            <p className="text-[8px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mt-1">{t('letterHintDesc')}</p>
                                        </div>
                                        <div className="flex items-center space-x-1.5 bg-[#fef3c7] group-hover:bg-[#fbbf24] px-3 py-1.5 rounded-xl transition-colors">
                                            <Coins className="w-3.5 h-3.5 text-[#b45309] fill-[#b45309]" />
                                            <span className="text-xs font-black text-[#92400e]">{UI_CONFIG.HINT_COST_LETTER}</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => {
                                            dispatch({ type: 'USE_HINT', payload: { type: 'full_word' } });
                                            setShowHintMenu(false);
                                        }}
                                        className="w-full group flex items-center justify-between p-4 bg-[var(--color-background)] border-2 border-transparent hover:border-[var(--color-ink)] rounded-2xl transition-all"
                                    >
                                        <div className="text-left">
                                            <p className="text-sm font-black text-[var(--color-text-primary)] uppercase leading-none">{t('wordHint')}</p>
                                            <p className="text-[8px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mt-1">{t('wordHintDesc')}</p>
                                        </div>
                                        <div className="flex items-center space-x-1.5 bg-[#fef3c7] group-hover:bg-[#fbbf24] px-3 py-1.5 rounded-xl transition-colors">
                                            <Coins className="w-3.5 h-3.5 text-[#b45309] fill-[#b45309]" />
                                            <span className="text-xs font-black text-[#92400e]">{UI_CONFIG.HINT_COST_WORD}</span>
                                        </div>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <motion.button
                    whileTap={{ scale: 0.9, rotate: 180 }}
                    onClick={() => {
                        setBoardRotation(prev => prev + 180);
                        audioSystem.playClick();
                    }}
                    className="w-16 h-16 bg-[var(--color-surface)] border-2 border-[var(--color-ink)] rounded-2xl flex items-center justify-center shadow-[6px_6px_0px_0px_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                    <RefreshCw className="w-6 h-6 text-[var(--color-ink)]" />
                </motion.button>
            </footer>

            <AnimatePresence>
                {isPaused && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-[#0f172a]/90 flex items-center justify-center p-6"
                    >
                        <motion.div
                            className="bg-white border-4 border-[#0f172a] rounded-[3rem] p-12 w-full max-w-sm text-center shadow-[16px_16px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f8fafc] -translate-y-16 translate-x-16 rounded-full opacity-50" />

                            <div className="w-20 h-20 bg-[#0f172a] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
                                <Pause className="w-10 h-10 text-white fill-white" />
                            </div>

                            <h2 className="text-2xl font-black text-[#0f172a] uppercase italic mb-6 tracking-tighter leading-none whitespace-nowrap">{t('gamePaused')}</h2>

                            <div className="flex justify-center space-x-4 mb-8">
                                <button
                                    onClick={() => dispatch({ type: 'TOGGLE_SOUND' })}
                                    className={`p-4 border-2 border-[#0f172a] rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all ${progress.settings.soundEnabled ? 'bg-[#fbbf24]' : 'bg-gray-100 opacity-60'}`}
                                >
                                    {progress.settings.soundEnabled ? <Volume2 className="w-6 h-6 text-[#0f172a]" /> : <VolumeX className="w-6 h-6 text-[#0f172a]" />}
                                </button>
                                <button
                                    onClick={() => dispatch({ type: 'TOGGLE_VIBRATION' })}
                                    className={`p-4 border-2 border-[#0f172a] rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all ${progress.settings.hapticsEnabled ? 'bg-[#14b8a6]' : 'bg-gray-100 opacity-60'}`}
                                >
                                    {progress.settings.hapticsEnabled ? <SmartphoneNfc className="w-6 h-6 text-[#0f172a]" /> : <Smartphone className="w-6 h-6 text-[#0f172a]" />}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
                                    className="w-full bg-[#0f172a] text-white py-5 rounded-[2rem] flex items-center justify-center space-x-3 shadow-lg group hover:translate-y-[-2px] transition-all"
                                >
                                    <Play className="w-6 h-6 fill-current" />
                                    <span className="text-xl font-black uppercase italic tracking-tight">{t('resumeGame')}</span>
                                </button>
                                <button
                                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'menu' })}
                                    className="w-full bg-white text-[#0f172a] py-4 rounded-[1.5rem] border-2 border-[#0f172a] flex items-center justify-center space-x-2 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                                >
                                    <span className="font-black uppercase text-sm italic tracking-tight underline decoration-[#cbd5e1] underline-offset-4">{t('quitToMenu')}</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GameScreen;
