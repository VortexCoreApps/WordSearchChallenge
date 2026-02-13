
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { capacitorStorage } from '../utils/capacitorStorage';
import {
    GameState,
    UserProgress,
    WordInfo,
    GridCell,
    Level,
    LevelBlock,
    Difficulty
} from '../types';
import { COLORS, UI_CONFIG, getLevelWithBlock } from '../constants';
import { generateGrid, seededShuffle } from '../utils/gameUtils';
import { audioSystem } from '../utils/audioSystem';
import { hapticService } from '../services/hapticService';
import { saveSession, loadSession, clearSession } from '../utils/sessionPersistence';
import {
    updateStatsOnLevelComplete,
    updateStreak,
    checkAchievements,
    DEFAULT_STATS
} from '../utils/achievements';
import { setLanguage } from '../utils/i18n';

interface GameStore extends GameState {
    progress: UserProgress;

    // Actions
    setView: (view: GameState['view']) => void;
    startLevel: (level: Level, block: LevelBlock, grid: GridCell[][], placements: Record<string, { row: number, col: number }[]>) => void;
    startCurrentLevel: () => void;
    restoreSession: (level: Level, block: LevelBlock, session: any) => void;
    wordFound: (word: string, cells: { row: number, col: number }[]) => void;
    useHint: (type: 'single_letter' | 'full_word') => void;
    tickTimer: () => void;
    togglePause: () => void;
    pauseGame: () => void;
    resumeGame: () => void;
    completeLevel: () => void;
    closeTrophyReveal: () => void;
    addCoins: (amount: number) => void;
    showAchievement: (achievement: any) => void;
    closeAchievement: () => void;
    finishTutorial: () => void;
    toggleSound: () => void;
    toggleVibration: () => void;
    setLanguage: (lang: 'en' | 'es') => void;
    resetProgress: () => void;
}

const calculateStars = (timeElapsed: number, difficulty: Difficulty): number => {
    const thresholds: Record<Difficulty, { three: number; two: number }> = {
        'Easy': { three: 30, two: 60 },
        'Medium': { three: 45, two: 90 },
        'Hard': { three: 75, two: 150 },
        'Expert': { three: 120, two: 240 },
    };
    const { three, two } = thresholds[difficulty];
    if (timeElapsed <= three) return 3;
    if (timeElapsed <= two) return 2;
    return 1;
};

export const useGameStore = create<GameStore>()(
    persist(
        (set, get) => ({
            // State
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
            hasProcessedCompletion: false,

            progress: {
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
            },

            // Actions
            setView: (view) => {
                if (view === 'menu' || view === 'levels') {
                    audioSystem.playClick();
                    hapticService.light();
                }
                set({ view });
            },

            startLevel: (level, block, grid, placements) => {
                const shuffledColors = seededShuffle([...COLORS], level.id);
                const wordsInfo: WordInfo[] = level.words.map((w, i) => ({
                    word: w,
                    found: false,
                    color: shuffledColors[i % shuffledColors.length],
                    cells: placements?.[w] ?? []
                }));

                set({
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
                });

                // Track start date
                const today = new Date().toISOString().split('T')[0];
                set(state => ({
                    progress: {
                        ...state.progress,
                        stats: { ...state.progress.stats, lastPlayDate: today }
                    }
                }));
            },

            startCurrentLevel: () => {
                const { progress } = get();
                audioSystem.playClick();
                hapticService.light();

                try {
                    const target = getLevelWithBlock(progress.currentLevelId);
                    if (!target.level || !target.level.words || target.level.words.length === 0) {
                        set({ view: 'menu' });
                        return;
                    }

                    const { grid, placements } = generateGrid(target.level.gridSize, target.level.words, target.level.id);
                    const allWordsPlaced = target.level.words.every(w => placements[w] && placements[w].length > 0);

                    if (!allWordsPlaced) {
                        const retry = generateGrid(target.level.gridSize, target.level.words, target.level.id + 9999);
                        const retryAllPlaced = target.level.words.every(w => retry.placements[w] && retry.placements[w].length > 0);
                        if (!retryAllPlaced) {
                            set({ view: 'menu' });
                            return;
                        }
                        get().startLevel(target.level, target.block, retry.grid, retry.placements);
                    } else {
                        get().startLevel(target.level, target.block, grid, placements);
                    }
                } catch (error) {
                    console.error('START_CURRENT_LEVEL: Critical error', error);
                    set({ view: 'menu' });
                }
            },

            restoreSession: (level, block, session) => {
                set({
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
                });
            },

            wordFound: (word, cells) => {
                const { wordsInfo, foundWordsCells, hintedCells, currentLevel, currentBlock, view } = get();
                const wordIdx = wordsInfo.findIndex(w => w.word === word && !w.found);
                if (wordIdx === -1) return;

                const newWords = [...wordsInfo];
                newWords[wordIdx] = { ...newWords[wordIdx], found: true };

                const newCells = [
                    ...foundWordsCells,
                    ...cells.map(c => ({ ...c, color: newWords[wordIdx].color }))
                ];

                const allDone = newWords.every(w => w.found);
                let showTrophy = get().showTrophyReveal;

                if (allDone && currentBlock && currentLevel) {
                    const levels = currentBlock.levels;
                    if (levels[levels.length - 1].id === currentLevel.id) {
                        showTrophy = currentBlock.trophy;
                    }
                }

                const newHintedCells = hintedCells.filter(hc =>
                    !cells.some(tc => tc.row === hc.row && tc.col === hc.col)
                );

                audioSystem.playWordFound();
                hapticService.success();

                set({
                    wordsInfo: newWords,
                    foundWordsCells: newCells,
                    hintedCells: newHintedCells,
                    view: allDone ? 'complete' : view,
                    showTrophyReveal: showTrophy
                });

                if (allDone) {
                    get().completeLevel();
                }
            },

            useHint: (type) => {
                const { wordsInfo, hintedCells, foundWordsCells, progress } = get();
                const cost = type === 'single_letter' ? UI_CONFIG.HINT_COST_LETTER : UI_CONFIG.HINT_COST_WORD;

                if (progress.coins < cost) return;

                audioSystem.playHint();
                hapticService.warning();

                const unfoundWords = wordsInfo.filter(w => !w.found);
                if (unfoundWords.length === 0) return;

                const sortedByDifficulty = [...unfoundWords].sort((a, b) => {
                    const lengthDiff = b.word.length - a.word.length;
                    if (lengthDiff !== 0) return lengthDiff;
                    const aHintedCount = a.cells!.filter(c => hintedCells.some(hc => hc.row === c.row && hc.col === c.col)).length;
                    const bHintedCount = b.cells!.filter(c => hintedCells.some(hc => hc.row === c.row && hc.col === c.col)).length;
                    return aHintedCount - bHintedCount;
                });

                set(state => ({
                    progress: { ...state.progress, coins: state.progress.coins - cost }
                }));

                if (type === 'full_word') {
                    const targetWord = sortedByDifficulty[0];
                    get().wordFound(targetWord.word, targetWord.cells!);
                    return;
                }

                if (type === 'single_letter') {
                    for (const word of sortedByDifficulty) {
                        const wordCells = word.cells!;
                        const firstCell = wordCells[0];
                        const isFirstHinted = hintedCells.some(hc => hc.row === firstCell.row && hc.col === firstCell.col);
                        const isFirstFound = foundWordsCells.some(fc => fc.row === firstCell.row && fc.col === firstCell.col);

                        if (!isFirstHinted && !isFirstFound) {
                            set({ hintedCells: [...hintedCells, { row: firstCell.row, col: firstCell.col }] });
                            return;
                        }

                        const lastCell = wordCells[wordCells.length - 1];
                        const isLastHinted = hintedCells.some(hc => hc.row === lastCell.row && hc.col === lastCell.col);
                        const isLastFound = foundWordsCells.some(fc => fc.row === lastCell.row && fc.col === lastCell.col);

                        if (!isLastHinted && !isLastFound) {
                            set({ hintedCells: [...hintedCells, { row: lastCell.row, col: lastCell.col }] });
                            return;
                        }

                        const unhintedCells = wordCells.filter(tc =>
                            !hintedCells.some(hc => hc.row === tc.row && hc.col === tc.col) &&
                            !foundWordsCells.some(fc => fc.row === tc.row && fc.col === tc.col)
                        );

                        if (unhintedCells.length > 0) {
                            const targetCell = unhintedCells[0];
                            set({ hintedCells: [...hintedCells, { row: targetCell.row, col: targetCell.col }] });
                            return;
                        }
                    }
                }
            },

            tickTimer: () => {
                const { isPaused, view, timeElapsed } = get();
                if (!isPaused && view === 'game') {
                    set({ timeElapsed: timeElapsed + 1 });
                }
            },

            togglePause: () => {
                audioSystem.playClick();
                set(state => ({ isPaused: !state.isPaused }));
            },

            pauseGame: () => set({ isPaused: true }),
            resumeGame: () => set({ isPaused: false }),

            completeLevel: () => {
                const { currentLevel, currentBlock, timeElapsed, progress, wordsInfo, hintedCells, hasProcessedCompletion } = get();
                if (!currentLevel || !currentBlock || hasProcessedCompletion) return;

                const stars = calculateStars(timeElapsed, currentLevel.difficulty);
                const isFirstCompletion = !progress.completedLevelIds.includes(currentLevel.id);
                const reward = isFirstCompletion ? currentLevel.rewardCoins : 5;

                const newCompletedLevels = isFirstCompletion
                    ? [...progress.completedLevelIds, currentLevel.id]
                    : progress.completedLevelIds;

                const newStars = { ...progress.stars };
                if (!newStars[currentLevel.id] || stars > newStars[currentLevel.id]) {
                    newStars[currentLevel.id] = stars;
                }

                const updatedStats = updateStatsOnLevelComplete(
                    progress.stats,
                    wordsInfo.filter(w => w.found).length,
                    stars,
                    timeElapsed,
                    hintedCells.length,
                    reward
                );
                updatedStats.lastPlayDate = progress.stats.lastPlayDate;

                const newlyUnlocked = checkAchievements(updatedStats, progress.unlockedAchievementIds);
                const newUnlockedAchievementIds = [
                    ...progress.unlockedAchievementIds,
                    ...newlyUnlocked.map(a => a.id)
                ];

                set(state => ({
                    hasProcessedCompletion: true,
                    progress: {
                        ...state.progress,
                        completedLevelIds: newCompletedLevels,
                        unlockedAchievementIds: newUnlockedAchievementIds,
                        stars: newStars,
                        coins: state.progress.coins + reward,
                        currentLevelId: isFirstCompletion ? (currentLevel.id + 1) : state.progress.currentLevelId,
                        stats: updatedStats
                    }
                }));

                audioSystem.playLevelComplete();
                if (newlyUnlocked.length > 0) {
                    set({ newAchievement: newlyUnlocked[0] });
                    hapticService.celebration();
                }

                clearSession();
            },

            closeTrophyReveal: () => set({ showTrophyReveal: null }),
            addCoins: (amount) => set(state => ({ progress: { ...state.progress, coins: state.progress.coins + amount } })),
            showAchievement: (achievement) => set({ newAchievement: achievement }),
            closeAchievement: () => set({ newAchievement: null }),
            finishTutorial: () => set(state => ({ view: 'menu', progress: { ...state.progress, hasSeenTutorial: true } })),

            toggleSound: () => set(state => {
                const newValue = !state.progress.settings.soundEnabled;
                audioSystem.setEnabled(newValue);
                return { progress: { ...state.progress, settings: { ...state.progress.settings, soundEnabled: newValue } } };
            }),

            toggleVibration: () => set(state => {
                const newValue = !state.progress.settings.hapticsEnabled;
                hapticService.setEnabled(newValue);
                return { progress: { ...state.progress, settings: { ...state.progress.settings, hapticsEnabled: newValue } } };
            }),

            setLanguage: (lang) => {
                setLanguage(lang);
                window.location.reload();
            },

            resetProgress: () => {
                localStorage.removeItem('ws_challenge_pro_storage');
                import('../utils/capacitorStorage').then(({ capacitorStorage }) => {
                    capacitorStorage.removeItem('ws_challenge_pro_storage');
                });
                window.location.reload();
            }
        }),
        {
            name: 'ws_challenge_pro_storage',
            storage: createJSONStorage(() => capacitorStorage),
            partialize: (state) => ({ progress: state.progress }),
            version: 1,
        }
    )
);
