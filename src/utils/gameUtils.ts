
import { GridCell } from '../types';

class SeededRNG {
    private seed: number;
    constructor(seed: number) {
        this.seed = seed;
    }

    next(): number {
        let t = this.seed += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}

export function generateGrid(size: number, words: string[], seed?: number): { grid: GridCell[][], placements: Record<string, { row: number, col: number }[]> } {
    const MAX_RETRIES = 50;

    for (let retry = 0; retry < MAX_RETRIES; retry++) {
        // Deterministic variation of seed for each retry
        // If seed is defined, we use it + offset. If not, random.
        const effectiveSeed = seed !== undefined ? seed + (retry * 7919) : Math.random() * 10000;
        const rng = new SeededRNG(effectiveSeed);

        const grid: GridCell[][] = Array(size).fill(null).map((_, r) =>
            Array(size).fill(null).map((_, c) => ({ letter: '', row: r, col: c }))
        );

        const placements: Record<string, { row: number, col: number }[]> = {};
        const directions = [
            [0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]
        ];

        // Sort words by length descending to place largest first (heuristic)
        const sortedWords = [...words].sort((a, b) => b.length - a.length);
        let allWordsPlaced = true;

        for (const word of sortedWords) {
            let placed = false;
            let attempts = 0;
            // Try to place this specific word
            while (!placed && attempts < 100) {
                const dir = directions[Math.floor(rng.next() * directions.length)];
                const r = Math.floor(rng.next() * size);
                const col = Math.floor(rng.next() * size);

                if (canPlace(grid, word, r, col, dir, size)) {
                    const cells = place(grid, word, r, col, dir);
                    placements[word] = cells;
                    placed = true;
                }
                attempts++;
            }

            if (!placed) {
                allWordsPlaced = false;
                break; // Give up on this grid configuration
            }
        }

        if (allWordsPlaced) {
            // Fill empty cells
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    if (grid[r][c].letter === '') {
                        grid[r][c].letter = letters[Math.floor(rng.next() * letters.length)];
                    }
                }
            }
            return { grid, placements };
        }
    }

    // Fallback (should theoretically not happen with enough retries unless inputs are invalid)
    console.warn("Failed to generate valid grid after max retries");
    // Return empty grid to avoid crash, but game will be playable-ish or broken
    return {
        grid: Array(size).fill(null).map((_, r) => Array(size).fill(null).map((_, c) => ({ letter: '', row: r, col: c }))),
        placements: {}
    };
}

function canPlace(grid: GridCell[][], word: string, r: number, c: number, dir: number[], size: number) {
    for (let i = 0; i < word.length; i++) {
        const nr = r + i * dir[0];
        const nc = c + i * dir[1];
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) return false;
        if (grid[nr][nc].letter !== '' && grid[nr][nc].letter !== word[i]) return false;
    }
    return true;
}

function place(grid: GridCell[][], word: string, r: number, c: number, dir: number[]) {
    const cells = [];
    for (let i = 0; i < word.length; i++) {
        const nr = r + i * dir[0];
        const nc = c + i * dir[1];
        grid[nr][nc].letter = word[i];
        cells.push({ row: nr, col: nc });
    }
    return cells;
}

export function getSelectedCells(start: { row: number, col: number }, end: { row: number, col: number }) {
    const cells = [];
    const dr = end.row - start.row;
    const dc = end.col - start.col;
    const steps = Math.max(Math.abs(dr), Math.abs(dc));

    if (steps === 0) return [start];

    const ir = dr / steps;
    const ic = dc / steps;

    if (Number.isInteger(ir) && Number.isInteger(ic) || (Math.abs(ir) === 1 || ir === 0) && (Math.abs(ic) === 1 || ic === 0)) {
        for (let i = 0; i <= steps; i++) {
            cells.push({
                row: Math.round(start.row + i * ir),
                col: Math.round(start.col + i * ic)
            });
        }
    } else {
        return [start];
    }

    return cells;
}

export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function seededShuffle<T>(array: T[], seed: number): T[] {
    const copy = [...array];
    let m = copy.length;
    let t: T;
    let i: number;

    // Mulberry32 generator
    const random = (s: number) => {
        let t = s + 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    while (m) {
        i = Math.floor(random(seed + m) * m--);
        t = copy[m];
        copy[m] = copy[i];
        copy[i] = t;
    }
    return copy;
}
