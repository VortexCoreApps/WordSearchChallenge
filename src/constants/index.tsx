
import { LevelBlock, Level } from '../types';
import {
    getBlockList,
    getBlock,
    getLevelWithBlock,
    generateLevel,
    TOTAL_LEVEL_COUNT,
    BLOCK_COUNT
} from '../utils/levelGenerator';

/**
 * Lazy-loaded LEVEL_BLOCKS proxy
 * 
 * This creates a Proxy that mimics an array but generates blocks on-demand.
 * For backwards compatibility, it still supports array-like access patterns.
 */
const createLazyBlocksProxy = (): LevelBlock[] => {
    const cache = new Map<number, LevelBlock>();

    return new Proxy([] as LevelBlock[], {
        get(target, prop) {
            // Handle array length
            if (prop === 'length') {
                return BLOCK_COUNT;
            }

            // Handle numeric index access
            if (typeof prop === 'string' && /^\d+$/.test(prop)) {
                const index = parseInt(prop, 10);
                if (index >= 0 && index < BLOCK_COUNT) {
                    if (!cache.has(index)) {
                        cache.set(index, getBlock(index));
                    }
                    return cache.get(index);
                }
                return undefined;
            }

            // Handle flatMap for getting all levels (used in START_CURRENT_LEVEL)
            if (prop === 'flatMap') {
                return function <U>(callback: (block: LevelBlock, index: number, array: LevelBlock[]) => U[]): U[] {
                    const results: U[] = [];
                    for (let i = 0; i < BLOCK_COUNT; i++) {
                        if (!cache.has(i)) {
                            cache.set(i, getBlock(i));
                        }
                        const result = callback(cache.get(i)!, i, target);
                        results.push(...result);
                    }
                    return results;
                };
            }

            // Handle find
            if (prop === 'find') {
                return function (predicate: (block: LevelBlock, index: number, array: LevelBlock[]) => boolean): LevelBlock | undefined {
                    for (let i = 0; i < BLOCK_COUNT; i++) {
                        if (!cache.has(i)) {
                            cache.set(i, getBlock(i));
                        }
                        const block = cache.get(i)!;
                        if (predicate(block, i, target)) {
                            return block;
                        }
                    }
                    return undefined;
                };
            }

            // Handle forEach
            if (prop === 'forEach') {
                return function (callback: (block: LevelBlock, index: number, array: LevelBlock[]) => void): void {
                    for (let i = 0; i < BLOCK_COUNT; i++) {
                        if (!cache.has(i)) {
                            cache.set(i, getBlock(i));
                        }
                        callback(cache.get(i)!, i, target);
                    }
                };
            }

            // Handle map
            if (prop === 'map') {
                return function <U>(callback: (block: LevelBlock, index: number, array: LevelBlock[]) => U): U[] {
                    const results: U[] = [];
                    for (let i = 0; i < BLOCK_COUNT; i++) {
                        if (!cache.has(i)) {
                            cache.set(i, getBlock(i));
                        }
                        results.push(callback(cache.get(i)!, i, target));
                    }
                    return results;
                };
            }

            // Handle Symbol.iterator for for...of loops
            if (prop === Symbol.iterator) {
                return function* () {
                    for (let i = 0; i < BLOCK_COUNT; i++) {
                        if (!cache.has(i)) {
                            cache.set(i, getBlock(i));
                        }
                        yield cache.get(i)!;
                    }
                };
            }

            // Default behavior
            return Reflect.get(target, prop);
        },

        has(target, prop) {
            if (typeof prop === 'string' && /^\d+$/.test(prop)) {
                const index = parseInt(prop, 10);
                return index >= 0 && index < BLOCK_COUNT;
            }
            return Reflect.has(target, prop);
        }
    });
};

// Export the lazy-loaded blocks array
export const LEVEL_BLOCKS: LevelBlock[] = createLazyBlocksProxy();

// Re-export utilities for direct access when needed
export { getLevelWithBlock, generateLevel, getBlock, getBlockList };

export const UI_CONFIG = {
    HINT_COST_LETTER: 50,
    HINT_COST_WORD: 150,
};

export const COLORS = [
    '#f87171', // Red
    '#fb923c', // Orange
    '#facc15', // Yellow
    '#a3e635', // Lime
    '#34d399', // Emerald
    '#22d3ee', // Cyan
    '#60a5fa', // Blue
    '#818cf8', // Indigo
    '#c084fc', // Purple
    '#e879f9', // Fuchsia
    '#fb7185', // Rose
    '#2dd4bf', // Teal
];
