/**
 * Achievement System
 * 
 * Defines special achievements beyond world trophies:
 * - Speed achievements (complete levels fast)
 * - Streak achievements (consecutive plays)
 * - No-hint achievements
 * - Milestone achievements (total words, levels, etc.)
 */

import { t, getLanguage, Language } from './i18n';

export interface Achievement {
    id: string;
    icon: string;
    condition: (stats: PlayerStats) => boolean;
    getName: (lang?: Language) => string;
    getDescription: (lang?: Language) => string;
}

export interface PlayerStats {
    totalWordsFound: number;
    totalLevelsCompleted: number;
    totalStarsEarned: number;
    perfectLevels: number;         // Levels with 3 stars
    noHintLevels: number;          // Levels completed without hints
    fastLevels: number;            // Levels completed in under 30s
    currentStreak: number;         // Days played in a row
    longestStreak: number;
    totalPlayTime: number;         // In seconds
    hintsUsed: number;
    coinsEarned: number;
    lastPlayDate: string | null;
}

// Default stats for new players
export const DEFAULT_STATS: PlayerStats = {
    totalWordsFound: 0,
    totalLevelsCompleted: 0,
    totalStarsEarned: 0,
    perfectLevels: 0,
    noHintLevels: 0,
    fastLevels: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalPlayTime: 0,
    hintsUsed: 0,
    coinsEarned: 0,
    lastPlayDate: null,
};

// Achievement definitions
const achievementNames: Record<string, Record<Language, { name: string; desc: string }>> = {
    first_word: {
        en: { name: 'First Discovery', desc: 'Find your first word' },
        es: { name: 'Primer Descubrimiento', desc: 'Encuentra tu primera palabra' }
    },
    word_hunter: {
        en: { name: 'Word Hunter', desc: 'Find 50 words' },
        es: { name: 'Cazador de Palabras', desc: 'Encuentra 50 palabras' }
    },
    word_master: {
        en: { name: 'Word Master', desc: 'Find 500 words' },
        es: { name: 'Maestro de Palabras', desc: 'Encuentra 500 palabras' }
    },
    word_legend: {
        en: { name: 'Word Legend', desc: 'Find 2000 words' },
        es: { name: 'Leyenda de Palabras', desc: 'Encuentra 2000 palabras' }
    },
    quick_start: {
        en: { name: 'Quick Start', desc: 'Complete 5 levels' },
        es: { name: 'Inicio Rápido', desc: 'Completa 5 niveles' }
    },
    dedicated: {
        en: { name: 'Dedicated Player', desc: 'Complete 50 levels' },
        es: { name: 'Jugador Dedicado', desc: 'Completa 50 niveles' }
    },
    champion: {
        en: { name: 'Champion', desc: 'Complete 200 levels' },
        es: { name: 'Campeón', desc: 'Completa 200 niveles' }
    },
    perfectionist: {
        en: { name: 'Perfectionist', desc: 'Get 3 stars on 10 levels' },
        es: { name: 'Perfeccionista', desc: 'Obtén 3 estrellas en 10 niveles' }
    },
    star_collector: {
        en: { name: 'Star Collector', desc: 'Earn 100 stars total' },
        es: { name: 'Colector de Estrellas', desc: 'Gana 100 estrellas en total' }
    },
    no_help: {
        en: { name: 'Independent', desc: 'Complete 5 levels without hints' },
        es: { name: 'Independiente', desc: 'Completa 5 niveles sin pistas' }
    },
    pure_skill: {
        en: { name: 'Pure Skill', desc: 'Complete 25 levels without hints' },
        es: { name: 'Habilidad Pura', desc: 'Completa 25 niveles sin pistas' }
    },
    speed_demon: {
        en: { name: 'Speed Demon', desc: 'Complete a level in under 30 seconds' },
        es: { name: 'Demonio de la Velocidad', desc: 'Completa un nivel en menos de 30 segundos' }
    },
    lightning_fast: {
        en: { name: 'Lightning Fast', desc: 'Complete 10 levels in under 30 seconds each' },
        es: { name: 'Veloz como el Rayo', desc: 'Completa 10 niveles en menos de 30 segundos cada uno' }
    },
    streak_3: {
        en: { name: 'Getting Started', desc: 'Play 3 days in a row' },
        es: { name: 'Empezando', desc: 'Juega 3 días seguidos' }
    },
    streak_7: {
        en: { name: 'Weekly Warrior', desc: 'Play 7 days in a row' },
        es: { name: 'Guerrero Semanal', desc: 'Juega 7 días seguidos' }
    },
    streak_30: {
        en: { name: 'Monthly Master', desc: 'Play 30 days in a row' },
        es: { name: 'Maestro Mensual', desc: 'Juega 30 días seguidos' }
    },
    rich: {
        en: { name: 'Rich', desc: 'Earn 1000 coins' },
        es: { name: 'Rico', desc: 'Gana 1000 monedas' }
    },
    wealthy: {
        en: { name: 'Wealthy', desc: 'Earn 5000 coins' },
        es: { name: 'Millonario', desc: 'Gana 5000 monedas' }
    },
};

export const ACHIEVEMENTS: Achievement[] = [
    // Word milestones
    {
        id: 'first_word',
        icon: 'Search',
        condition: (s) => s.totalWordsFound >= 1,
        getName: (lang) => achievementNames.first_word[lang || getLanguage()].name,
        getDescription: (lang) => achievementNames.first_word[lang || getLanguage()].desc,
    },
    {
        id: 'word_hunter',
        icon: 'Target',
        condition: (s) => s.totalWordsFound >= 50,
        getName: (lang) => achievementNames.word_hunter[lang || getLanguage()].name,
        getDescription: (lang) => achievementNames.word_hunter[lang || getLanguage()].desc,
    },
    {
        id: 'word_master',
        icon: 'Crown',
        condition: (s) => s.totalWordsFound >= 500,
        getName: (lang) => achievementNames.word_master[lang || getLanguage()].name,
        getDescription: (lang) => achievementNames.word_master[lang || getLanguage()].desc,
    },
    {
        id: 'word_legend',
        icon: 'Award',
        condition: (s) => s.totalWordsFound >= 2000,
        getName: (lang) => achievementNames.word_legend[lang || getLanguage()].name,
        getDescription: (lang) => achievementNames.word_legend[lang || getLanguage()].desc,
    },

    // Level milestones
    {
        id: 'quick_start',
        icon: 'Play',
        condition: (s) => s.totalLevelsCompleted >= 5,
        getName: (lang) => achievementNames.quick_start[lang || getLanguage()].name,
        getDescription: (lang) => achievementNames.quick_start[lang || getLanguage()].desc,
    },
    {
        id: 'dedicated',
        icon: 'Star',
        condition: (s) => s.totalLevelsCompleted >= 50,
        getName: (lang) => achievementNames.dedicated[lang || getLanguage()].name,
        getDescription: (lang) => achievementNames.dedicated[lang || getLanguage()].desc,
    },
    {
        id: 'champion',
        icon: 'Trophy',
        condition: (s) => s.totalLevelsCompleted >= 200,
        getName: (lang) => achievementNames.champion[lang || getLanguage()].name,
        getDescription: (lang) => achievementNames.champion[lang || getLanguage()].desc,
    },

    // Star/Perfect milestones
    {
        id: 'perfectionist',
        icon: 'Sparkles',
        condition: (s) => s.perfectLevels >= 10,
        getName: (lang) => achievementNames.perfectionist[lang || getLanguage()].name,
        getDescription: (lang) => achievementNames.perfectionist[lang || getLanguage()].desc,
    },
    {
        id: 'star_collector',
        icon: 'Stars',
        condition: (s) => s.totalStarsEarned >= 100,
        getName: (lang) => achievementNames.star_collector[lang || getLanguage()].name,
        getDescription: (lang) => achievementNames.star_collector[lang || getLanguage()].desc,
    },

    // No-hint achievements
    {
        id: 'no_help',
        icon: 'Shield',
        condition: (s) => s.noHintLevels >= 5,
        getName: (lang) => achievementNames.no_help[lang || getLanguage()].name,
        getDescription: (lang) => achievementNames.no_help[lang || getLanguage()].desc,
    },
    {
        id: 'pure_skill',
        icon: 'Gem',
        condition: (s) => s.noHintLevels >= 25,
        getName: (lang) => achievementNames.pure_skill[lang || getLanguage()].name,
        getDescription: (lang) => achievementNames.pure_skill[lang || getLanguage()].desc,
    },

    // Speed achievements
    {
        id: 'speed_demon',
        icon: 'Zap',
        condition: (s) => s.fastLevels >= 1,
        getName: (lang) => achievementNames.speed_demon[lang || getLanguage()].name,
        getDescription: (lang) => achievementNames.speed_demon[lang || getLanguage()].desc,
    },
    {
        id: 'lightning_fast',
        icon: 'Timer',
        condition: (s) => s.fastLevels >= 10,
        getName: (lang) => achievementNames.lightning_fast[lang || getLanguage()].name,
        getDescription: (lang) => achievementNames.lightning_fast[lang || getLanguage()].desc,
    },

    // Streak achievements
    {
        id: 'streak_3',
        icon: 'Flame',
        condition: (s) => s.longestStreak >= 3,
        getName: (lang) => achievementNames.streak_3[lang || getLanguage()].name,
        getDescription: (lang) => achievementNames.streak_3[lang || getLanguage()].desc,
    },
    {
        id: 'streak_7',
        icon: 'Calendar',
        condition: (s) => s.longestStreak >= 7,
        getName: (lang) => achievementNames.streak_7[lang || getLanguage()].name,
        getDescription: (lang) => achievementNames.streak_7[lang || getLanguage()].desc,
    },
    {
        id: 'streak_30',
        icon: 'CalendarCheck',
        condition: (s) => s.longestStreak >= 30,
        getName: (lang) => achievementNames.streak_30[lang || getLanguage()].name,
        getDescription: (lang) => achievementNames.streak_30[lang || getLanguage()].desc,
    },

    // Coin achievements
    {
        id: 'rich',
        icon: 'Coins',
        condition: (s) => s.coinsEarned >= 1000,
        getName: (lang) => achievementNames.rich[lang || getLanguage()].name,
        getDescription: (lang) => achievementNames.rich[lang || getLanguage()].desc,
    },
    {
        id: 'wealthy',
        icon: 'Wallet',
        condition: (s) => s.coinsEarned >= 5000,
        getName: (lang) => achievementNames.wealthy[lang || getLanguage()].name,
        getDescription: (lang) => achievementNames.wealthy[lang || getLanguage()].desc,
    },
];

// Storage key for player stats
const STATS_STORAGE_KEY = 'ws_player_stats';
const ACHIEVEMENTS_STORAGE_KEY = 'ws_unlocked_achievements';

/**
 * Load player stats from storage
 */
export function loadPlayerStats(): PlayerStats {
    try {
        const saved = localStorage.getItem(STATS_STORAGE_KEY);
        if (saved) {
            return { ...DEFAULT_STATS, ...JSON.parse(saved) };
        }
    } catch (e) {
        console.warn('Failed to load player stats:', e);
    }
    return { ...DEFAULT_STATS };
}

/**
 * Save player stats to storage
 */
export function savePlayerStats(stats: PlayerStats): void {
    try {
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
        console.warn('Failed to save player stats:', e);
    }
}

/**
 * Load unlocked achievement IDs
 */
export function loadUnlockedAchievements(): string[] {
    try {
        const saved = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Failed to load achievements:', e);
    }
    return [];
}

/**
 * Save unlocked achievement IDs
 */
export function saveUnlockedAchievements(ids: string[]): void {
    try {
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
        console.warn('Failed to save achievements:', e);
    }
}

/**
 * Check for newly unlocked achievements
 * @returns Array of newly unlocked achievements
 */
export function checkAchievements(stats: PlayerStats, currentlyUnlocked: string[]): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    for (const achievement of ACHIEVEMENTS) {
        if (!currentlyUnlocked.includes(achievement.id) && achievement.condition(stats)) {
            newlyUnlocked.push(achievement);
        }
    }

    return newlyUnlocked;
}

/**
 * Update stats after completing a level
 */
export function updateStatsOnLevelComplete(
    currentStats: PlayerStats,
    wordsFound: number,
    starsEarned: number,
    timeElapsed: number,
    hintsUsedInLevel: number,
    coinsEarned: number
): PlayerStats {
    const newStats = { ...currentStats };

    newStats.totalWordsFound += wordsFound;
    newStats.totalLevelsCompleted += 1;
    newStats.totalStarsEarned += starsEarned;
    newStats.coinsEarned += coinsEarned;

    if (starsEarned === 3) {
        newStats.perfectLevels += 1;
    }

    if (hintsUsedInLevel === 0) {
        newStats.noHintLevels += 1;
    }

    if (timeElapsed <= 30) {
        newStats.fastLevels += 1;
    }

    newStats.totalPlayTime += timeElapsed;
    newStats.hintsUsed += hintsUsedInLevel;

    return newStats;
}

/**
 * Update streak based on last play date
 */
export function updateStreak(currentStats: PlayerStats, lastPlayDate: string | null): PlayerStats {
    const today = new Date().toISOString().split('T')[0];

    if (!lastPlayDate) {
        return { ...currentStats, currentStreak: 1, longestStreak: Math.max(currentStats.longestStreak, 1) };
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (lastPlayDate === today) {
        // Already played today
        return currentStats;
    } else if (lastPlayDate === yesterday) {
        // Continuing streak
        const newStreak = currentStats.currentStreak + 1;
        return {
            ...currentStats,
            currentStreak: newStreak,
            longestStreak: Math.max(currentStats.longestStreak, newStreak)
        };
    } else {
        // Streak broken
        return { ...currentStats, currentStreak: 1, longestStreak: Math.max(currentStats.longestStreak, 1) };
    }
}
