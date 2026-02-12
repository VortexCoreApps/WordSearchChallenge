
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft, Lock, Star, ChevronRight, RotateCcw } from 'lucide-react';
import { useGame } from '@/store/GameContext';
import { getBlockList } from '@/constants';
import { getLevelWithBlock } from '@/utils/levelGenerator';
import { getWorldTheme } from '@/constants/worldThemes';
import { t } from '@/utils/i18n';

const LEVELS_PER_BLOCK = 50;

const LevelSelection: React.FC = () => {
    const { progress, dispatch } = useGame();
    const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);

    const getBlockProgress = (levelRange: [number, number]) => {
        const [start, end] = levelRange;
        const completedInBlock = progress.completedLevelIds.filter(id => id >= start && id <= end).length;
        const totalInBlock = (end - start) + 1;

        let totalStars = 0;
        for (let id = start; id <= end; id++) {
            totalStars += (progress.stars[id] || 0);
        }

        return {
            completedCount: completedInBlock,
            totalCount: totalInBlock,
            stars: totalStars,
            maxStars: totalInBlock * 3
        };
    };

    const isBlockUnlocked = (index: number) => {
        if (index === 0) return true;
        const prevBlockEnd = index * LEVELS_PER_BLOCK;
        return progress.completedLevelIds.includes(prevBlockEnd);
    };

    // When a block is selected, determine the level range to render
    const selectedBlockData = useMemo(() => {
        if (selectedBlockIndex === null) return null;
        const blocks = getBlockList();
        const block = blocks[selectedBlockIndex];
        if (!block) return null;

        const [start, end] = block.levelRange;
        const levels: { id: number; isCompleted: boolean; stars: number; isLocked: boolean }[] = [];

        for (let id = start; id <= end; id++) {
            const isCompleted = progress.completedLevelIds.includes(id);
            const starCount = progress.stars[id] || 0;
            const isLocked = id > start && !progress.completedLevelIds.includes(id - 1);
            levels.push({ id, isCompleted, stars: starCount, isLocked });
        }

        return { block, levels };
    }, [selectedBlockIndex, progress.completedLevelIds, progress.stars]);

    const handleStartLevel = (levelId: number) => {
        const target = getLevelWithBlock(levelId);
        dispatch({ type: 'START_LEVEL', payload: target });
    };

    const handleBack = () => {
        if (selectedBlockIndex !== null) {
            setSelectedBlockIndex(null);
        } else {
            dispatch({ type: 'SET_VIEW', payload: 'menu' });
        }
    };

    // ─── Level Detail View ─────────────────────────────────────
    if (selectedBlockData && selectedBlockIndex !== null) {
        const { block, levels } = selectedBlockData;
        const stats = getBlockProgress(block.levelRange);
        const theme = getWorldTheme(selectedBlockIndex);

        return (
            <div className="h-full bg-[var(--color-background)] flex flex-col p-6 pb-24 max-w-lg mx-auto overflow-y-auto">
                {/* Themed header banner */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="rounded-3xl border-3 border-[var(--color-ink)] p-5 mb-6 mt-4 relative shadow-[6px_6px_0px_0px_var(--shadow-color)]"
                    style={{ background: theme.bg, overflow: 'clip' }}
                >
                    {/* Decorative glow — inside bounds */}
                    <div
                        className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20 blur-2xl pointer-events-none"
                        style={{ background: theme.glow, transform: 'translate(30%, -30%)' }}
                    />
                    <div
                        className="absolute bottom-0 left-0 w-28 h-28 rounded-full opacity-15 blur-xl pointer-events-none"
                        style={{ background: theme.accent, transform: 'translate(-30%, 30%)' }}
                    />

                    <div className="relative z-10 flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className="p-1.5 rounded-xl transition-colors flex-shrink-0"
                            style={{ color: theme.text }}
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <span className="text-3xl flex-shrink-0">{theme.emoji}</span>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-black uppercase italic tracking-tighter leading-none truncate" style={{ color: theme.text }}>
                                {block.name}
                            </h2>
                            <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: `${theme.text}99` }}>
                                    {stats.completedCount}/{stats.totalCount} {t('completed')}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3" style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                                    <span className="text-[9px] font-black tabular-nums" style={{ color: '#fbbf24' }}>
                                        {stats.stars}/{stats.maxStars}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress bar inside banner */}
                    <div className="relative z-10 mt-4 h-2 rounded-full overflow-hidden" style={{ background: `${theme.text}15` }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(stats.completedCount / stats.totalCount) * 100}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{ background: theme.progressBar }}
                        />
                    </div>
                </motion.div>

                {/* Level Grid */}
                <div className="grid grid-cols-5 gap-3 px-1">
                    {levels.map((level, idx) => {
                        const isPerfect = level.stars === 3;
                        const canImprove = level.isCompleted && level.stars < 3;

                        return (
                            <motion.button
                                key={level.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: idx * 0.012, type: 'spring', stiffness: 400, damping: 25 }}
                                disabled={level.isLocked}
                                onClick={() => handleStartLevel(level.id)}
                                className={`
                                    relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all
                                    ${level.isLocked
                                        ? 'bg-[var(--color-border)] border-[var(--color-border)] opacity-40'
                                        : level.isCompleted
                                            ? isPerfect
                                                ? 'border-[var(--color-ink)] shadow-[3px_3px_0px_0px_var(--shadow-color)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
                                                : 'border-[var(--color-ink)] shadow-[3px_3px_0px_0px_var(--shadow-color)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
                                            : 'bg-[var(--color-surface)] border-[var(--color-ink)] shadow-[3px_3px_0px_0px_var(--shadow-color)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
                                    }
                                `}
                                style={level.isCompleted && !level.isLocked ? {
                                    background: isPerfect ? theme.accent : `${theme.accent}60`
                                } : undefined}
                            >
                                {level.isLocked ? (
                                    <Lock className="w-4 h-4 text-[var(--color-text-muted)]" />
                                ) : (
                                    <>
                                        <span className={`text-sm font-black tabular-nums leading-none ${level.isCompleted ? 'text-white' : 'text-[var(--color-text-primary)]'}`}
                                            style={level.isCompleted ? { textShadow: '0 1px 2px rgba(0,0,0,0.3)' } : undefined}
                                        >
                                            {level.id}
                                        </span>

                                        {/* Stars row */}
                                        <div className="flex items-center gap-[2px] mt-1">
                                            {[1, 2, 3].map(s => (
                                                <Star
                                                    key={s}
                                                    className={`w-[10px] h-[10px] ${s <= level.stars
                                                        ? 'text-white fill-white'
                                                        : level.isCompleted
                                                            ? 'text-white/30'
                                                            : 'text-[var(--color-text-light)]'
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        {/* Replay indicator */}
                                        {canImprove && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                                                style={{ background: theme.bg }}
                                            >
                                                <RotateCcw className="w-2.5 h-2.5 text-white" />
                                            </div>
                                        )}
                                    </>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ─── World List View ─────────────────────────────────────
    return (
        <div className="h-full bg-[var(--color-background)] flex flex-col p-6 pb-24 max-w-lg mx-auto overflow-y-auto">
            <header className="flex items-center space-x-6 mb-8 mt-4 px-2">
                <button
                    onClick={handleBack}
                    className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                    <ArrowLeft className="w-7 h-7" />
                </button>
                <div>
                    <h2 className="text-2xl font-black text-[var(--color-text-primary)] uppercase italic tracking-tighter leading-none">
                        {t('worlds')}
                    </h2>
                    <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-[0.3em] mt-2">
                        {progress.completedLevelIds.length} {t('levelsFound')}
                    </p>
                </div>
            </header>

            <div className="flex flex-col gap-4">
                {getBlockList().map((block, idx) => {
                    const unlocked = isBlockUnlocked(idx);
                    const stats = getBlockProgress(block.levelRange);
                    const isCompleted = stats.completedCount === stats.totalCount;
                    const hasTrophy = progress.unlockedTrophyIds.includes(block.trophy.id);
                    const theme = getWorldTheme(idx);
                    const progressPercent = stats.totalCount > 0 ? (stats.completedCount / stats.totalCount) * 100 : 0;

                    return (
                        <motion.button
                            key={block.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.04 }}
                            disabled={!unlocked}
                            onClick={() => setSelectedBlockIndex(idx)}
                            className={`
                                relative rounded-3xl border-3 border-[var(--color-ink)] p-4 text-left transition-all overflow-hidden
                                ${!unlocked
                                    ? 'opacity-50 grayscale shadow-none'
                                    : 'shadow-[5px_5px_0px_0px_var(--shadow-color)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none'
                                }
                            `}
                            style={{ background: unlocked ? theme.bg : undefined }}
                        >
                            {/* Decorative glow elements */}
                            {unlocked && (
                                <>
                                    <div
                                        className="absolute -top-10 -right-10 w-36 h-36 rounded-full opacity-15 blur-2xl pointer-events-none"
                                        style={{ background: theme.glow }}
                                    />
                                    <div
                                        className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-10 blur-xl pointer-events-none"
                                        style={{ background: theme.accent }}
                                    />
                                </>
                            )}

                            <div className="relative z-10 flex items-center gap-4">
                                {/* Icon area */}
                                <div
                                    className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl flex-shrink-0 ${unlocked ? 'border-white/20' : 'border-[var(--color-border)] bg-[var(--color-border)]'
                                        }`}
                                    style={unlocked ? { background: `${theme.accent}30` } : undefined}
                                >
                                    {unlocked ? (
                                        hasTrophy ? <Trophy className="w-7 h-7 text-[#fbbf24] fill-[#fbbf24]/30" /> : <span>{theme.emoji}</span>
                                    ) : (
                                        <Lock className="w-5 h-5 text-[var(--color-text-muted)]" />
                                    )}
                                </div>

                                {/* Text content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3
                                            className="text-base font-black uppercase tracking-tight leading-none truncate"
                                            style={{ color: unlocked ? theme.text : 'var(--color-text-muted)' }}
                                        >
                                            {block.name}
                                        </h3>
                                        {!unlocked && (
                                            <span className="text-[8px] font-black uppercase text-[var(--color-text-muted)] border border-[var(--color-border)] px-1.5 py-0.5 rounded ml-2 flex-shrink-0">
                                                {t('locked')}
                                            </span>
                                        )}
                                        {isCompleted && unlocked && (
                                            <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
                                                style={{ background: `${theme.accent}40`, color: theme.text }}
                                            >
                                                ✓ 100%
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span
                                            className="text-[9px] font-bold uppercase tracking-widest"
                                            style={{ color: unlocked ? `${theme.text}80` : 'var(--color-text-muted)' }}
                                        >
                                            {t('levels')} {idx * 50 + 1}–{Math.min((idx + 1) * 50, 1000)}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3" style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                                            <span className="text-[9px] font-black tabular-nums"
                                                style={{ color: unlocked ? '#fbbf24' : 'var(--color-text-muted)' }}
                                            >
                                                {stats.stars}/{stats.maxStars}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    {unlocked && (
                                        <div className="mt-2.5 h-1.5 rounded-full overflow-hidden relative" style={{ background: `${theme.text}15` }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progressPercent}%` }}
                                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                                className="absolute inset-y-0 left-0 rounded-full"
                                                style={{ background: theme.progressBar }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Arrow */}
                                {unlocked && (
                                    <ChevronRight className="w-5 h-5 flex-shrink-0 opacity-40" style={{ color: theme.text }} />
                                )}
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default LevelSelection;
