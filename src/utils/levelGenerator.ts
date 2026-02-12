/**
 * Lazy Level Generator (Bilingual Support)
 * 
 * Generates levels on-demand with caching, using the correct language
 * for word selection based on user preferences.
 */

import { Level, LevelBlock, Trophy } from '../types';
import { getWordBank, getCategories, getCategoryName, SupportedLanguage } from '../data/wordBank';
import { seededShuffle } from './gameUtils';
import { getLanguage, t } from './i18n';

// World names for each language
const WORLD_NAMES: Record<SupportedLanguage, string[]> = {
    en: [
        'The Green Forest', 'Animal Kingdom', 'Tasty Treats', 'Humanity', 'Cozy Home',
        'Urban Jungle', 'Fashion Week', 'Cyber Future', 'World Traveler', 'Science Lab',
        'Mystic Woods', 'Wild Safari', 'Gourmet Chef', 'Body & Mind', 'Dream House',
        'Metro City', 'Style Icon', 'High Tech', 'Globetrotter', 'Rocket Science'
    ],
    es: [
        'Bosque Verde', 'Reino Animal', 'Dulces Placeres', 'Humanidad', 'Hogar Dulce Hogar',
        'Jungla Urbana', 'Semana de Moda', 'Futuro Cibernético', 'Viajero Mundial', 'Laboratorio',
        'Bosque Místico', 'Safari Salvaje', 'Chef Gourmet', 'Cuerpo y Mente', 'Casa Soñada',
        'Metrópolis', 'Icono de Estilo', 'Alta Tecnología', 'Trotamundos', 'Ciencia Espacial'
    ]
};

// Configuration
const LEVELS_PER_BLOCK = 50;
const TOTAL_LEVELS = 1000;
const TOTAL_BLOCKS = Math.ceil(TOTAL_LEVELS / LEVELS_PER_BLOCK);

// Cache for generated content - includes language in cache key
const levelCache = new Map<string, Level>(); // key: `${lang}_${levelId}`
const blockCache = new Map<string, LevelBlock>(); // key: `${lang}_${blockIndex}`

/**
 * Get cache key for a level
 */
function getLevelCacheKey(levelId: number, lang: SupportedLanguage): string {
    return `${lang}_${levelId}`;
}

/**
 * Get cache key for a block
 */
function getBlockCacheKey(blockIndex: number, lang: SupportedLanguage): string {
    return `${lang}_${blockIndex}`;
}

/**
 * Generates a single level based on its ID (1-indexed) and language
 */
export function generateLevel(levelId: number, lang?: SupportedLanguage): Level {
    const language = lang || getLanguage();
    const cacheKey = getLevelCacheKey(levelId, language);

    // Check cache first
    if (levelCache.has(cacheKey)) {
        return levelCache.get(cacheKey)!;
    }

    // Safety: ensure levelId is within bounds
    const safeLevelId = Math.max(1, Math.min(levelId, TOTAL_LEVELS));

    const blockIndex = Math.floor((safeLevelId - 1) / LEVELS_PER_BLOCK);
    const levelIndexInBlock = (safeLevelId - 1) % LEVELS_PER_BLOCK;

    const categories = getCategories();
    const categoryKey = categories[blockIndex % categories.length];
    const wordBank = getWordBank(language);
    const categoryWords = wordBank[categoryKey] || [];

    // Determine difficulty based on position in block
    let gridSize = 4;
    let wordCount = 3;
    let difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert' = 'Easy';
    let reward = 10;

    if (levelIndexInBlock >= 10 && levelIndexInBlock < 25) {
        gridSize = 5; wordCount = 4; difficulty = 'Medium'; reward = 15;
    } else if (levelIndexInBlock >= 25 && levelIndexInBlock < 40) {
        gridSize = 6; wordCount = 6; difficulty = 'Hard'; reward = 20;
    } else if (levelIndexInBlock >= 40) {
        gridSize = 8; wordCount = 8; difficulty = 'Expert'; reward = 25;
    }

    // Select words deterministically
    const validWords = categoryWords.filter(w => w.length <= gridSize);
    const shuffled = seededShuffle(validWords, levelId);
    const selectedWords = shuffled.slice(0, wordCount);

    // Get localized category name
    const localizedCategory = getCategoryName(categoryKey, language);

    const level: Level = {
        id: levelId,
        title: localizedCategory,
        words: selectedWords,
        gridSize,
        difficulty,
        rewardCoins: reward
    };

    // Cache the result
    levelCache.set(cacheKey, level);
    return level;
}

/**
 * Gets block metadata (id, name, trophy) without generating all levels
 */
export function getBlockMetadata(blockIndex: number, lang?: SupportedLanguage): { id: string; name: string; trophy: Trophy } {
    const language = lang || getLanguage();
    const worldNames = WORLD_NAMES[language] || WORLD_NAMES.en;
    const worldName = worldNames[blockIndex % worldNames.length];
    const blockId = `block_${blockIndex + 1}`;

    const trophyDescriptions: Record<SupportedLanguage, string> = {
        en: `Completed all levels in ${worldName}.`,
        es: `Completados todos los niveles de ${worldName}.`
    };

    return {
        id: blockId,
        name: worldName,
        trophy: {
            id: `trophy_${blockId}`,
            name: `${worldName} ${t('master', language)}`,
            icon: 'Trophy',
            description: trophyDescriptions[language] || trophyDescriptions.en,
            unlockedAtBlockId: blockId
        }
    };
}

/**
 * Gets a complete block with all its levels (generates if needed)
 */
export function getBlock(blockIndex: number, lang?: SupportedLanguage): LevelBlock {
    const language = lang || getLanguage();
    const cacheKey = getBlockCacheKey(blockIndex, language);

    if (blockCache.has(cacheKey)) {
        return blockCache.get(cacheKey)!;
    }

    const metadata = getBlockMetadata(blockIndex, language);
    const startLevelId = blockIndex * LEVELS_PER_BLOCK + 1;
    const levels: Level[] = [];

    for (let i = 0; i < LEVELS_PER_BLOCK; i++) {
        const levelId = startLevelId + i;
        if (levelId <= TOTAL_LEVELS) {
            levels.push(generateLevel(levelId, language));
        }
    }

    const block: LevelBlock = {
        id: metadata.id,
        name: metadata.name,
        levels,
        trophy: metadata.trophy
    };

    blockCache.set(cacheKey, block);
    return block;
}

/**
 * Gets block index for a given level ID
 */
export function getBlockIndexForLevel(levelId: number): number {
    return Math.floor((levelId - 1) / LEVELS_PER_BLOCK);
}

/**
 * Gets block containing a specific level
 */
export function getBlockForLevel(levelId: number, lang?: SupportedLanguage): LevelBlock {
    const blockIndex = getBlockIndexForLevel(levelId);
    return getBlock(blockIndex, lang);
}

/**
 * Gets level and its containing block
 */
export function getLevelWithBlock(levelId: number, lang?: SupportedLanguage): { level: Level; block: LevelBlock } {
    const language = lang || getLanguage();
    const block = getBlockForLevel(levelId, language);
    const level = generateLevel(levelId, language);
    return { level, block };
}

/**
 * Returns lightweight block list for menu display
 */
export function getBlockList(lang?: SupportedLanguage): Array<{ id: string; name: string; trophy: Trophy; levelRange: [number, number] }> {
    const language = lang || getLanguage();
    const blocks: Array<{ id: string; name: string; trophy: Trophy; levelRange: [number, number] }> = [];

    for (let i = 0; i < TOTAL_BLOCKS; i++) {
        const metadata = getBlockMetadata(i, language);
        const startLevel = i * LEVELS_PER_BLOCK + 1;
        const endLevel = Math.min((i + 1) * LEVELS_PER_BLOCK, TOTAL_LEVELS);

        blocks.push({
            ...metadata,
            levelRange: [startLevel, endLevel]
        });
    }

    return blocks;
}

/**
 * Preloads a range of levels into cache (for smoother gameplay)
 */
export function preloadLevels(startId: number, count: number = 5, lang?: SupportedLanguage): void {
    const language = lang || getLanguage();
    for (let i = 0; i < count; i++) {
        const levelId = startId + i;
        if (levelId <= TOTAL_LEVELS) {
            generateLevel(levelId, language);
        }
    }
}

/**
 * Clears cache for a specific language (useful when changing language)
 */
export function clearLanguageCache(lang: SupportedLanguage): void {
    // Clear level cache for this language
    levelCache.forEach((_, key) => {
        if (key.startsWith(`${lang}_`)) {
            levelCache.delete(key);
        }
    });

    // Clear block cache for this language
    blockCache.forEach((_, key) => {
        if (key.startsWith(`${lang}_`)) {
            blockCache.delete(key);
        }
    });
}

/**
 * Clears all caches
 */
export function clearAllCache(): void {
    levelCache.clear();
    blockCache.clear();
}

// Export constants for compatibility
export const TOTAL_LEVEL_COUNT = TOTAL_LEVELS;
export const BLOCK_COUNT = TOTAL_BLOCKS;
export const LEVELS_IN_BLOCK = LEVELS_PER_BLOCK;
