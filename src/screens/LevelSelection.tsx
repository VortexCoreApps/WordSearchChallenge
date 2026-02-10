
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft, Lock, Star, ChevronRight } from 'lucide-react';
import { useGame } from '@/store/GameContext';
import { LEVEL_BLOCKS } from '@/constants';
import { t } from '@/utils/i18n';

const LevelSelection: React.FC = () => {
    const { progress, dispatch } = useGame();

    const getBlockProgress = (blockId: string) => {
        const blockIndex = parseInt(blockId.split('_')[1]) - 1;
        const block = LEVEL_BLOCKS[blockIndex];
        const completedInBlock = block.levels.filter(l => progress.completedLevelIds.includes(l.id)).length;
        const totalInBlock = block.levels.length;

        let totalStars = 0;
        block.levels.forEach(l => {
            totalStars += (progress.stars[l.id] || 0);
        });

        return {
            completedCount: completedInBlock,
            totalCount: totalInBlock,
            stars: totalStars,
            maxStars: totalInBlock * 3
        };
    };

    const isBlockUnlocked = (index: number) => {
        if (index === 0) return true;

        // Block is unlocked if the previous block is completed
        const prevBlock = LEVEL_BLOCKS[index - 1];
        const lastLevelOfPrevBlock = prevBlock.levels[prevBlock.levels.length - 1].id;
        return progress.completedLevelIds.includes(lastLevelOfPrevBlock);
    };

    return (
        <div className="h-full bg-[var(--color-background)] flex flex-col p-6 pb-24 max-w-lg mx-auto overflow-y-auto">
            <header className="flex items-center space-x-6 mb-8 mt-4 px-2">
                <button
                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'menu' })}
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

            <div className="flex flex-col gap-6">
                {LEVEL_BLOCKS.map((block, idx) => {
                    const unlocked = isBlockUnlocked(idx);
                    const stats = getBlockProgress(block.id);
                    const isCompleted = stats.completedCount === stats.totalCount;
                    const hasTrophy = progress.unlockedTrophyIds.includes(block.trophy.id);

                    return (
                        <motion.button
                            key={block.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            disabled={!unlocked}
                            onClick={() => {
                                // For now, we can only start the "current" level or first uncompleted level in block
                                const nextInBlock = block.levels.find(l => !progress.completedLevelIds.includes(l.id)) || block.levels[0];
                                dispatch({ type: 'START_LEVEL', payload: { level: nextInBlock, block: block } });
                            }}
                            className={`puzzle-card p-5 text-left transition-all ${!unlocked ? 'opacity-60 grayscale shadow-none' : 'hover:translate-x-1 hover:translate-y-1 hover:shadow-none'}`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`w-16 h-16 rounded-2xl border-2 border-[var(--color-ink)] flex items-center justify-center relative ${unlocked ? (isCompleted ? 'bg-[#34d399]' : 'bg-[#fbbf24]') : 'bg-[var(--color-border)]'}`}>
                                    {unlocked ? (
                                        hasTrophy ? <Trophy className="w-8 h-8 text-[#0f172a] fill-white/20" /> : <ChevronRight className="w-8 h-8 text-[#0f172a]" />
                                    ) : (
                                        <Lock className="w-6 h-6 text-[var(--color-text-muted)]" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-lg font-black text-[var(--color-text-primary)] uppercase tracking-tight leading-none truncate">
                                            {block.name}
                                        </h3>
                                        {!unlocked && (
                                            <span className="text-[8px] font-black uppercase text-[var(--color-text-muted)] border border-[var(--color-border)] px-1.5 py-0.5 rounded">
                                                {t('locked')}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">
                                            {t('levels')} {idx * 50 + 1}-{Math.min((idx + 1) * 50, 1000)}
                                        </span>
                                        <div className="flex items-center text-amber-500">
                                            <Star className="w-3 h-3 fill-amber-500 mr-1" />
                                            <span className="text-[10px] font-black tabular-nums">{stats.stars}/{stats.maxStars}</span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    {unlocked && (
                                        <div className="mt-3 h-2 bg-[var(--color-background)] rounded-full border border-[var(--color-border)] overflow-hidden relative">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(stats.completedCount / stats.totalCount) * 100}%` }}
                                                className={`absolute inset-y-0 left-0 ${isCompleted ? 'bg-[#34d399]' : 'bg-[#fbbf24]'}`}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default LevelSelection;
