
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Star, Search, Target, Crown, Play, Trophy, Sparkles, Shield, Gem, Zap, Timer, Flame, Calendar, CalendarCheck, Coins, Wallet } from 'lucide-react';
import { Achievement } from '@/utils/achievements';
import { useGame } from '@/store/GameContext';
import { t } from '@/utils/i18n';

const AchievementIcons: Record<string, any> = {
    Search, Target, Crown, Award, Play, Star, Trophy, Sparkles, Shield, Gem, Zap, Timer, Flame, Calendar, CalendarCheck, Coins, Wallet
};

const AchievementToast: React.FC = () => {
    const { state, dispatch } = useGame();
    const achievement = state.newAchievement as Achievement | null;

    useEffect(() => {
        if (achievement) {
            const timer = setTimeout(() => {
                dispatch({ type: 'CLOSE_ACHIEVEMENT' });
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [achievement, dispatch]);

    return (
        <AnimatePresence>
            {achievement && (
                <motion.div
                    initial={{ y: -100, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -100, opacity: 0, scale: 0.9 }}
                    className="fixed top-10 left-0 right-0 z-[100] flex justify-center px-6 pointer-events-none"
                >
                    <div className="bg-[var(--color-ink)] text-[var(--color-paper)] p-4 rounded-2xl flex items-center gap-4 shadow-[0_20px_50px_var(--color-shadow)] border-2 border-[#fbbf24] max-w-sm pointer-events-auto">
                        <div className="w-12 h-12 bg-[#fbbf24] rounded-xl flex items-center justify-center flex-shrink-0">
                            {React.createElement(AchievementIcons[achievement.icon] || Award, {
                                className: "w-7 h-7 text-[#0f172a]"
                            })}
                        </div>
                        <div className="flex-grow">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#fbbf24] mb-1">
                                {t('achievement_unlocked') || 'Achievement Unlocked!'}
                            </h4>
                            <h3 className="text-sm font-black italic uppercase leading-tight">
                                {achievement.getName()}
                            </h3>
                            <p className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                                {achievement.getDescription()}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AchievementToast;
