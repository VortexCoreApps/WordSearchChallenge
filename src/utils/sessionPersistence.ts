/**
 * Game Session Persistence
 * 
 * Saves the current game session state so players can resume
 * if they close the app mid-level.
 */

import { GameState, GridCell, WordInfo } from '../types';

const SESSION_STORAGE_KEY = 'ws_challenge_session';

export interface SavedSession {
    levelId: number;
    blockId: string;
    grid: GridCell[][];
    wordsInfo: WordInfo[];
    foundWordsCells: { row: number; col: number; color: string }[];
    hintedCells: { row: number; col: number }[];
    timeElapsed: number;
    view: 'game' | 'complete';
    savedAt: number; // timestamp
}

/**
 * Save current game session
 */
export function saveSession(state: GameState): void {
    if (!state.currentLevel || !state.currentBlock) {
        return;
    }

    const session: SavedSession = {
        levelId: state.currentLevel.id,
        blockId: state.currentBlock.id,
        grid: state.grid,
        wordsInfo: state.wordsInfo,
        foundWordsCells: state.foundWordsCells,
        hintedCells: state.hintedCells,
        timeElapsed: state.timeElapsed,
        view: state.view as 'game' | 'complete',
        savedAt: Date.now(),
    };

    try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
        console.warn('Failed to save session:', e);
    }
}

/**
 * Load saved session if valid
 * Returns null if no session or session is too old (> 24 hours)
 */
export function loadSession(): SavedSession | null {
    try {
        const saved = localStorage.getItem(SESSION_STORAGE_KEY);
        if (!saved) return null;

        const session: SavedSession = JSON.parse(saved);

        // Validate session age (expire after 24 hours)
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours in ms
        if (Date.now() - session.savedAt > maxAge) {
            clearSession();
            return null;
        }

        // Validate session structure
        if (!session.levelId || !session.grid || !session.wordsInfo) {
            clearSession();
            return null;
        }

        return session;
    } catch (e) {
        console.warn('Failed to load session:', e);
        clearSession();
        return null;
    }
}

/**
 * Clear saved session
 */
export function clearSession(): void {
    try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
        console.warn('Failed to clear session:', e);
    }
}

/**
 * Check if there's a valid saved session
 */
export function hasSession(): boolean {
    return loadSession() !== null;
}

/**
 * Get session summary for UI display
 */
export function getSessionSummary(): { levelId: number; progress: string; timeElapsed: number } | null {
    const session = loadSession();
    if (!session) return null;

    const foundCount = session.wordsInfo.filter(w => w.found).length;
    const totalCount = session.wordsInfo.length;

    return {
        levelId: session.levelId,
        progress: `${foundCount}/${totalCount}`,
        timeElapsed: session.timeElapsed,
    };
}
