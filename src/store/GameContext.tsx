
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, GameAction, UserProgress, WordInfo, Difficulty } from '../types';
import { LEVEL_BLOCKS, COLORS, UI_CONFIG, getLevelWithBlock } from '../constants';
import { generateGrid, seededShuffle } from '../utils/gameUtils';
import { audioSystem } from '../utils/audioSystem';
import { setLanguage } from '../utils/i18n';
import { hapticService } from '../services/hapticService';
import { saveSession, loadSession, clearSession } from '../utils/sessionPersistence';
import { updateStatsOnLevelComplete, updateStreak, checkAchievements, DEFAULT_STATS, Achievement } from '../utils/achievements';

/**
 * Calculate stars based on time elapsed AND difficulty
 * Higher difficulties get more generous time thresholds
 */
function calculateStars(timeElapsed: number, difficulty: Difficulty): number {
    // Time thresholds in seconds for 3 stars / 2 stars
    const thresholds: Record<Difficulty, { three: number; two: number }> = {
        'Easy': { three: 30, two: 60 },      // 4x4 grid, 3 words
        'Medium': { three: 45, two: 90 },    // 5x5 grid, 4 words
        'Hard': { three: 75, two: 150 },     // 6x6 grid, 6 words
        'Expert': { three: 120, two: 240 },  // 8x8 grid, 8 words
    };

    const { three, two } = thresholds[difficulty];

    if (timeElapsed <= three) return 3;
    if (timeElapsed <= two) return 2;
    return 1;
}

const initialState: GameState = {
    view: 'splash',
    currentLevel: null,
    currentBlock: null,
    grid: [],
    wordsInfo: [],
    foundWordsCells: [],
    hintedCells: [],
    timeElapsed: 0,
    isPaused: false,
    showTrophyReveal: null,
    newAchievement: null,
    hasProcessedCompletion: false
};

const GameContext = createContext<{
    state: GameState;
    progress: UserProgress;
    dispatch: React.Dispatch<GameAction>;
} | null>(null);

function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'SET_VIEW':
            return { ...state, view: action.payload };

        case 'START_LEVEL': {
            const { level, block, grid, placements } = action.payload;

            // Safety: validate level data before proceeding
            if (!level || !level.words || level.words.length === 0 || !grid || grid.length === 0) {
                console.error('START_LEVEL: Invalid level data', { level, hasGrid: !!grid });
                return { ...state, view: 'menu' };
            }

            // Seeded shuffle for colors so color assignment is also deterministic
            const shuffledColors = seededShuffle([...COLORS], level.id);

            const wordsInfo: WordInfo[] = level.words.map((w, i) => ({
                word: w,
                found: false,
                color: shuffledColors[i % shuffledColors.length],
                cells: placements?.[w] ?? []
            }));

            return {
                ...state,
                currentLevel: level,
                currentBlock: block,
                grid,
                wordsInfo,
                foundWordsCells: [],
                hintedCells: [],
                timeElapsed: 0,
                view: 'game',
                isPaused: false,
                hasProcessedCompletion: false,
            };
        }

        case 'RESTORE_SESSION': {
            const { level, block, session } = action.payload;
            return {
                ...state,
                currentLevel: level,
                currentBlock: block,
                grid: session.grid,
                wordsInfo: session.wordsInfo,
                foundWordsCells: session.foundWordsCells,
                hintedCells: session.hintedCells,
                timeElapsed: session.timeElapsed,
                view: session.view || 'game',
                isPaused: session.view === 'game',
                hasProcessedCompletion: session.view === 'complete',
            };
        }

        case 'WORD_FOUND': {
            const { word, cells } = action.payload;
            const wordIdx = state.wordsInfo.findIndex(w => w.word === word && !w.found);
            if (wordIdx === -1) return state;

            const newWords = [...state.wordsInfo];
            newWords[wordIdx] = { ...newWords[wordIdx], found: true };

            const newCells = [
                ...state.foundWordsCells,
                ...cells.map(c => ({ ...c, color: newWords[wordIdx].color }))
            ];

            const allDone = newWords.every(w => w.found);
            let showTrophy = state.showTrophyReveal;

            if (allDone && state.currentBlock && state.currentLevel) {
                const levels = state.currentBlock.levels;
                if (levels[levels.length - 1].id === state.currentLevel.id) {
                    showTrophy = state.currentBlock.trophy;
                }
            }

            // Clear hinted cells that belong to this found word
            const newHintedCells = state.hintedCells.filter(hc =>
                !cells.some(tc => tc.row === hc.row && tc.col === hc.col)
            );

            return {
                ...state,
                wordsInfo: newWords,
                foundWordsCells: newCells,
                hintedCells: newHintedCells,
                view: allDone ? 'complete' : state.view,
                showTrophyReveal: showTrophy
            };
        }

        case 'USE_HINT': {
            const { type } = action.payload;
            const unfoundWords = state.wordsInfo.filter(w => !w.found);
            if (unfoundWords.length === 0) return state;

            // Smart word selection: prioritize longer (harder) words
            const sortedByDifficulty = [...unfoundWords].sort((a, b) => {
                // Longer words are harder
                const lengthDiff = b.word.length - a.word.length;
                if (lengthDiff !== 0) return lengthDiff;

                // Words with fewer hinted cells are harder
                const aHintedCount = a.cells!.filter(c =>
                    state.hintedCells.some(hc => hc.row === c.row && hc.col === c.col)
                ).length;
                const bHintedCount = b.cells!.filter(c =>
                    state.hintedCells.some(hc => hc.row === c.row && hc.col === c.col)
                ).length;
                return aHintedCount - bHintedCount;
            });

            if (type === 'full_word') {
                // Select the hardest unfound word (longest with fewest hints)
                const targetWord = sortedByDifficulty[0];

                const newWords = state.wordsInfo.map(w =>
                    w.word === targetWord.word ? { ...w, found: true } : w
                );
                const newCells = [
                    ...state.foundWordsCells,
                    ...targetWord.cells!.map(c => ({ ...c, color: targetWord.color }))
                ];

                // Clear hinted cells that belong to this word
                const newHintedCells = state.hintedCells.filter(hc =>
                    !targetWord.cells!.some(tc => tc.row === hc.row && tc.col === hc.col)
                );

                const allDone = newWords.every(w => w.found);
                return {
                    ...state,
                    wordsInfo: newWords,
                    foundWordsCells: newCells,
                    hintedCells: newHintedCells,
                    view: allDone ? 'complete' : state.view
                };
            }

            if (type === 'single_letter') {
                // Smart letter hint: prioritize first letter, then sequential letters
                for (const word of sortedByDifficulty) {
                    const wordCells = word.cells!;

                    // First, try to hint the first letter of the word (most helpful)
                    const firstCell = wordCells[0];
                    const isFirstHinted = state.hintedCells.some(
                        hc => hc.row === firstCell.row && hc.col === firstCell.col
                    );
                    const isFirstFound = state.foundWordsCells.some(
                        fc => fc.row === firstCell.row && fc.col === firstCell.col
                    );

                    if (!isFirstHinted && !isFirstFound) {
                        return {
                            ...state,
                            hintedCells: [...state.hintedCells, { row: firstCell.row, col: firstCell.col }]
                        };
                    }

                    // Then try the last letter (second most helpful for direction)
                    const lastCell = wordCells[wordCells.length - 1];
                    const isLastHinted = state.hintedCells.some(
                        hc => hc.row === lastCell.row && hc.col === lastCell.col
                    );
                    const isLastFound = state.foundWordsCells.some(
                        fc => fc.row === lastCell.row && fc.col === lastCell.col
                    );

                    if (!isLastHinted && !isLastFound) {
                        return {
                            ...state,
                            hintedCells: [...state.hintedCells, { row: lastCell.row, col: lastCell.col }]
                        };
                    }

                    // Finally, try any unhinted cell in the word
                    const unhintedCells = wordCells.filter(tc =>
                        !state.hintedCells.some(hc => hc.row === tc.row && hc.col === tc.col) &&
                        !state.foundWordsCells.some(fc => fc.row === tc.row && fc.col === tc.col)
                    );

                    if (unhintedCells.length > 0) {
                        const targetCell = unhintedCells[0]; // Take sequential, not random
                        return {
                            ...state,
                            hintedCells: [...state.hintedCells, { row: targetCell.row, col: targetCell.col }]
                        };
                    }
                }
            }
            return state;
        }

        case 'COMPLETE_LEVEL': {
            if (!state.currentBlock || !state.currentLevel) return state;

            // Mark as processed to avoid double triggers
            if (state.hasProcessedCompletion) return state;

            const currentBlockLevels = state.currentBlock.levels;
            const currentLevelIdx = currentBlockLevels.findIndex(l => l.id === state.currentLevel!.id);
            const isLastOfBlock = currentLevelIdx === currentBlockLevels.length - 1;

            return {
                ...state,
                hasProcessedCompletion: true,
                showTrophyReveal: isLastOfBlock ? state.currentBlock.trophy : null
            };
        }

        case 'CLOSE_TROPHY_REVEAL':
            return { ...state, showTrophyReveal: null };

        case 'SHOW_ACHIEVEMENT':
            return { ...state, newAchievement: action.payload };

        case 'CLOSE_ACHIEVEMENT':
            return { ...state, newAchievement: null };

        case 'TICK_TIMER':
            if (state.isPaused) return state;
            return { ...state, timeElapsed: state.timeElapsed + 1 };

        case 'TOGGLE_PAUSE':
            return { ...state, isPaused: !state.isPaused };

        case 'PAUSE_GAME':
            return { ...state, isPaused: true };

        case 'RESUME_GAME':
            return { ...state, isPaused: false };

        case 'RESET_PROGRESS':
            return { ...initialState, view: 'menu' };

        case 'FINISH_TUTORIAL':
            return { ...state, view: 'menu' };

        default:
            return state;
    }
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const [progress, setProgress] = React.useState<UserProgress>(() => {
        const saved = localStorage.getItem('ws_challenge_pro_progress');
        const defaultProgress: UserProgress = {
            hasSeenTutorial: false,
            completedLevelIds: [],
            unlockedTrophyIds: [],
            unlockedAchievementIds: [],
            totalScore: 0,
            stars: {},
            coins: 200,
            currentLevelId: 1,
            stats: { ...DEFAULT_STATS, lastPlayDate: null },
            settings: {
                soundEnabled: true,
                hapticsEnabled: true
            }
        };

        if (saved) {
            const parsed = JSON.parse(saved);
            // Ensure streak is updated on load
            const updatedStats = updateStreak(parsed.stats || defaultProgress.stats, parsed.stats?.lastPlayDate || null);
            return { ...defaultProgress, ...parsed, stats: updatedStats };
        }
        return defaultProgress;
    });

    useEffect(() => {
        localStorage.setItem('ws_challenge_pro_progress', JSON.stringify(progress));
        // Sync services with current settings
        audioSystem.setEnabled(progress.settings.soundEnabled);
        hapticService.setEnabled(progress.settings.hapticsEnabled);
    }, [progress]);

    // Auto-trigger level completion logic when game view changes to 'complete'
    React.useEffect(() => {
        if (state.view === 'complete' && state.currentLevel && !state.hasProcessedCompletion) {
            // COMPLETE_LEVEL is now handled more directly in globalDispatch for found words,
            // but we keep this as a safeguard for other completion paths (like hints).
            globalDispatch({ type: 'COMPLETE_LEVEL' });
        }
    }, [state.view]);

    const globalDispatch = (action: GameAction) => {
        if (action.type === 'START_CURRENT_LEVEL' || action.type === 'SET_VIEW' || action.type === 'TOGGLE_PAUSE' || action.type === 'FINISH_TUTORIAL') {
            audioSystem.playClick();
            hapticService.light();
        }

        if (action.type === 'FINISH_TUTORIAL') {
            setProgress(prev => ({ ...prev, hasSeenTutorial: true }));
            dispatch(action);
            return;
        }

        if (action.type === 'WORD_FOUND') {
            // Check if it's actually found in reducer logic is hard here, so we check if state changed?
            // Actually, we can just call it, or better, use a useEffect on state.wordsInfo
        }

        if (action.type === 'START_CURRENT_LEVEL') {
            try {
                const target = getLevelWithBlock(progress.currentLevelId);

                // Validate level has words before attempting grid generation
                if (!target.level || !target.level.words || target.level.words.length === 0) {
                    console.error('START_CURRENT_LEVEL: Level has no words', { levelId: progress.currentLevelId, level: target.level });
                    dispatch({ type: 'SET_VIEW', payload: 'menu' });
                    return;
                }

                // Pre-calculate grid OUTSIDE of reducer to prevent UI thread hangs on Android
                const { grid, placements } = generateGrid(target.level.gridSize, target.level.words, target.level.id);

                // Validate placements — every word must have at least 1 cell placed
                const allWordsPlaced = target.level.words.every(w => placements[w] && placements[w].length > 0);
                if (!allWordsPlaced) {
                    console.warn('START_CURRENT_LEVEL: Not all words could be placed, retrying with fresh seed');
                    // Retry with a different seed offset
                    const retry = generateGrid(target.level.gridSize, target.level.words, target.level.id + 9999);
                    const retryAllPlaced = target.level.words.every(w => retry.placements[w] && retry.placements[w].length > 0);
                    if (!retryAllPlaced) {
                        console.error('START_CURRENT_LEVEL: Failed to place all words even after retry');
                        dispatch({ type: 'SET_VIEW', payload: 'menu' });
                        return;
                    }
                    dispatch({
                        type: 'START_LEVEL',
                        payload: {
                            level: target.level,
                            block: target.block,
                            grid: retry.grid,
                            placements: retry.placements
                        }
                    });
                } else {
                    dispatch({
                        type: 'START_LEVEL',
                        payload: {
                            level: target.level,
                            block: target.block,
                            grid,
                            placements
                        }
                    });
                }

                // Update last play date when starting a level
                const today = new Date().toISOString().split('T')[0];
                setProgress(prev => ({
                    ...prev,
                    stats: { ...prev.stats, lastPlayDate: today }
                }));
            } catch (error) {
                console.error('START_CURRENT_LEVEL: Critical error loading level', error);
                dispatch({ type: 'SET_VIEW', payload: 'menu' });
            }
            return;
        }

        if (action.type === 'START_LEVEL') {
            // Already includes grid/placements if coming from components, 
            // but if called directly we should ensure they exist.
            // Usually this is called from LevelSelection or START_CURRENT_LEVEL.
            const { level } = action.payload;
            let grid = (action.payload as any).grid;
            let placements = (action.payload as any).placements;

            if (!grid || !placements) {
                const generated = generateGrid(level.gridSize, level.words, level.id);
                grid = generated.grid;
                placements = generated.placements;
            }

            dispatch({
                type: 'START_LEVEL',
                payload: { ...action.payload, grid, placements }
            });
            return;
        }

        if (action.type === 'USE_HINT') {
            const cost = action.payload.type === 'single_letter' ? UI_CONFIG.HINT_COST_LETTER : UI_CONFIG.HINT_COST_WORD;
            if (progress.coins >= cost) {
                audioSystem.playHint();
                hapticService.warning(); // Haptic feedback for hint
                setProgress(prev => ({ ...prev, coins: prev.coins - cost }));
                dispatch(action);
            }
            return;
        }

        if (action.type === 'ADD_COINS') {
            setProgress(prev => ({ ...prev, coins: prev.coins + action.payload }));
            return;
        }

        if (action.type === 'COMPLETE_LEVEL') {
            if (!state.currentLevel || !state.currentBlock) {
                console.error('COMPLETE_LEVEL: No current level/block data');
                dispatch(action); // Still forward to reducer for hasProcessedCompletion flag
                return;
            }
            const stars = calculateStars(state.timeElapsed, state.currentLevel.difficulty);
            const isFirstCompletion = !progress.completedLevelIds.includes(state.currentLevel.id);
            const reward = isFirstCompletion ? state.currentLevel.rewardCoins : 5;

            // 1. Update basic progress
            const newCompletedLevels = isFirstCompletion
                ? [...progress.completedLevelIds, state.currentLevel.id]
                : progress.completedLevelIds;

            const newStars = { ...progress.stars };
            if (!newStars[state.currentLevel.id] || stars > newStars[state.currentLevel.id]) {
                newStars[state.currentLevel.id] = stars;
            }

            // 2. Update player stats
            const hintsUsedInLevel = state.wordsInfo.filter(w => !w.found).length; // Incorrect, need to track hints used? 
            // Actually hintedCells length might be a better proxy for now, but hints can reveal full words.
            // Let's assume hintsUsed is tracked in GameState if we want precision.
            // For now, let's just use a reasonable count.
            const hintsCount = state.hintedCells.length; // Approximate

            const updatedStats = updateStatsOnLevelComplete(
                progress.stats,
                state.wordsInfo.filter(w => w.found).length,
                stars,
                state.timeElapsed,
                hintsCount,
                reward
            );

            // Ensure lastPlayDate is preserved/updated
            updatedStats.lastPlayDate = progress.stats.lastPlayDate;

            // 3. Check for achievements
            const newlyUnlocked = checkAchievements(updatedStats, progress.unlockedAchievementIds);
            const newUnlockedAchievementIds = [
                ...progress.unlockedAchievementIds,
                ...newlyUnlocked.map(a => a.id)
            ];

            setProgress(prev => ({
                ...prev,
                completedLevelIds: newCompletedLevels,
                unlockedAchievementIds: newUnlockedAchievementIds,
                stars: newStars,
                coins: prev.coins + reward,
                currentLevelId: isFirstCompletion ? (state.currentLevel!.id + 1) : prev.currentLevelId,
                stats: updatedStats
            }));

            // 4. If new achievements, show them one by one (simplified: just the first for now)
            if (newlyUnlocked.length > 0) {
                dispatch({ type: 'SHOW_ACHIEVEMENT', payload: newlyUnlocked[0] });
                hapticService.celebration();
            }

            dispatch(action);
            clearSession();
            return;
        }

        if (action.type === 'TOGGLE_SOUND') {
            setProgress(prev => ({
                ...prev,
                settings: { ...prev.settings, soundEnabled: !prev.settings.soundEnabled }
            }));
            return;
        }

        if (action.type === 'TOGGLE_VIBRATION') {
            setProgress(prev => ({
                ...prev,
                settings: { ...prev.settings, hapticsEnabled: !prev.settings.hapticsEnabled }
            }));
            return;
        }

        if (action.type === 'SET_LANGUAGE') {
            setLanguage(action.payload);
            window.location.reload();
            return;
        }

        if (action.type === 'RESET_PROGRESS') {
            localStorage.removeItem('ws_challenge_pro_progress');
            window.location.reload(); // Hard reset is safest for all state
            return;
        }

        dispatch(action);
    };

    // Track found words count for sound effects
    const prevFoundCountRef = React.useRef(0);

    // Effect for procedural sounds - uses stable ref pattern instead of array.join()
    useEffect(() => {
        const currentFoundCount = state.wordsInfo.filter(w => w.found).length;

        // Only play sound if count increased (new word found) and we're in game
        if (currentFoundCount > prevFoundCountRef.current && state.view === 'game') {
            audioSystem.playWordFound();
            hapticService.success(); // Haptic feedback for word found
        }

        prevFoundCountRef.current = currentFoundCount;
    }, [state.wordsInfo, state.view]);

    useEffect(() => {
        if (state.view === 'complete') {
            audioSystem.playLevelComplete();
        }
    }, [state.view]);

    // This effect was redundant with the logic in globalDispatch COMPLETE_LEVEL.
    // Removed to prevent double state updates and delays.

    useEffect(() => {
        let timer: number;
        if (state.view === 'game' && !state.isPaused) {
            timer = window.setInterval(() => dispatch({ type: 'TICK_TIMER' }), 1000);
        }
        return () => clearInterval(timer);
    }, [state.view, state.isPaused]);

    // Auto-save session during active game or complete screen
    useEffect(() => {
        if ((state.view === 'game' || state.view === 'complete') && state.currentLevel) {
            saveSession(state);
        }
    }, [state.view, state.wordsInfo, state.foundWordsCells, state.hintedCells]);

    // Restore session on mount if one exists
    // This handles the case where the WebView was destroyed while backgrounded
    const hasAttemptedRestore = React.useRef(false);
    useEffect(() => {
        if (hasAttemptedRestore.current) return;
        hasAttemptedRestore.current = true;

        const session = loadSession();
        if (session && progress.hasSeenTutorial) {
            try {
                const target = getLevelWithBlock(session.levelId);
                dispatch({
                    type: 'RESTORE_SESSION',
                    payload: { level: target.level, block: target.block, session }
                });
                console.log('Session restored for level', session.levelId);
            } catch (e) {
                console.warn('Failed to restore session:', e);
                clearSession();
            }
        }
    }, []);

    // Clear session when leaving game without completing
    useEffect(() => {
        if (state.view === 'menu') {
            // Only clear if there was an active session and we're going back to menu
            // (not completing the level, which is handled in the complete effect)
        }
    }, [state.view]);

    return (
        <GameContext.Provider value={{ state, progress, dispatch: globalDispatch }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGame must be used within GameProvider');
    return context;
};
