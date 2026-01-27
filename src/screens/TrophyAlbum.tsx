
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowLeft, Lock, Sparkles, Award, Star, Search, Target, Crown, Play, Shield, Gem, Zap, Timer, Flame, Calendar, CalendarCheck, Coins, Wallet } from 'lucide-react';
import { useGame } from '@/store/GameContext';
import { LEVEL_BLOCKS } from '@/constants';
import { t } from '@/utils/i18n';
import { ACHIEVEMENTS } from '@/utils/achievements';
import * as Icons from 'lucide-react';

const AchievementIcons: Record<string, any> = {
    Search, Target, Crown, Award, Play, Star, Trophy, Sparkles, Shield, Gem, Zap, Timer, Flame, Calendar, CalendarCheck, Coins, Wallet
};

const TrophyAlbum: React.FC = () => {
    const { progress, dispatch } = useGame();
    const [activeTab, setActiveTab] = useState<'trophies' | 'achievements'>('trophies');

    const getIcon = (iconName: string, isUnlocked: boolean, isAchievement: boolean = false) => {
        const IconComponent = isAchievement ? (AchievementIcons[iconName] || Award) : ((Icons as any)[iconName] || Trophy);
        return <IconComponent className={`w-8 h-8 ${isUnlocked ? 'text-slate-900' : 'text-slate-200'}`} />;
    };

    return (
        <div className="h-full bg-[#f8fafc] flex flex-col p-6 pb-24 max-w-lg mx-auto overflow-y-auto">
            <header className="flex flex-col mb-8 mt-2 px-2">
                <div className="flex items-center space-x-6 mb-6">
                    <button
                        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'menu' })}
                        className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft className="w-7 h-7" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{t('trophyAlbum')}</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
                            {activeTab === 'trophies' ? t('unlockedTrophies') : t('achievements')}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-slate-200/50 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('trophies')}
                        className={`flex-1 py-2 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'trophies' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {t('trophies') || 'Trophies'}
                    </button>
                    <button
                        onClick={() => setActiveTab('achievements')}
                        className={`flex-1 py-2 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'achievements' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {t('achievements') || 'Achievements'}
                    </button>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {activeTab === 'trophies' ? (
                    <motion.div
                        key="trophies"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 gap-6 pb-20"
                    >
                        {LEVEL_BLOCKS.map((block, idx) => {
                            const isUnlocked = progress.unlockedTrophyIds.includes(block.trophy.id);

                            return (
                                <motion.div
                                    key={block.id}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`puzzle-card p-6 flex items-center space-x-6 relative overflow-hidden ${!isUnlocked && 'opacity-60 saturate-50'}`}
                                >
                                    <div className={`w-20 h-20 rounded-[2rem] border-2 border-slate-900 flex items-center justify-center relative z-10 ${isUnlocked ? 'bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]' : 'bg-slate-50'}`}>
                                        {isUnlocked ? getIcon(block.trophy.icon, true) : <Lock className="w-6 h-6 text-slate-300" />}
                                        {isUnlocked && (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                                className="absolute -inset-2 border border-dashed border-slate-900/20 rounded-full"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 text-left relative z-10">
                                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
                                            {isUnlocked ? block.trophy.name : 'Unknown Trophy'}
                                        </h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                            {isUnlocked ? block.trophy.description : t('lockedTrophy')}
                                        </p>

                                        {isUnlocked && (
                                            <div className="flex items-center space-x-1">
                                                <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">Elite Achievement</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        key="achievements"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 gap-4 pb-20"
                    >
                        {[...ACHIEVEMENTS].sort((a, b) => {
                            const aUnlocked = progress.unlockedAchievementIds.includes(a.id);
                            const bUnlocked = progress.unlockedAchievementIds.includes(b.id);
                            return (aUnlocked === bUnlocked) ? 0 : aUnlocked ? -1 : 1;
                        }).map((achievement, idx) => {
                            const isUnlocked = progress.unlockedAchievementIds.includes(achievement.id);

                            return (
                                <motion.div
                                    key={achievement.id}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className={`p-4 rounded-2xl flex items-center space-x-4 border-2 ${isUnlocked ? 'bg-white border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]' : 'bg-slate-100/50 border-slate-100 opacity-60'}`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isUnlocked ? 'bg-[#fbbf24]' : 'bg-slate-200'}`}>
                                        {getIcon(achievement.icon, isUnlocked, true)}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
                                            {achievement.getName()}
                                        </h3>
                                        <p className="text-[10px] font-medium text-slate-500">
                                            {achievement.getDescription()}
                                        </p>
                                    </div>
                                    {!isUnlocked && <Lock className="w-4 h-4 text-slate-300" />}
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {(activeTab === 'trophies' ? progress.unlockedTrophyIds : progress.unlockedAchievementIds).length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-30 select-none">
                    <Trophy className="w-20 h-20 mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest">No {activeTab} yet</p>
                </div>
            )}
        </div>
    );
};

export default TrophyAlbum;
