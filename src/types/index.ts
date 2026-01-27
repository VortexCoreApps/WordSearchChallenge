
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export type GameMode = 'campaign' | 'daily' | 'blitz' | 'relax';

export interface WordInfo {
    word: string;
    found: boolean;
    color: string;
    cells?: { row: number; col: number }[];
}

export interface GridCell {
    letter: string;
    row: number;
    col: number;
}

export interface Level {
    id: number;
    title: string;
    words: string[];
    gridSize: number;
    difficulty: Difficulty;
    rewardCoins: number;
}

export interface Trophy {
    id: string;
    name: string;
    icon: string;
    description: string;
    unlockedAtBlockId: string;
}

export interface LevelBlock {
    id: string;
    name: string;
    levels: Level[];
    trophy: Trophy;
}

export interface UserProgress {
    hasSeenTutorial: boolean;
    completedLevelIds: number[];
    unlockedTrophyIds: string[];
    unlockedAchievementIds: string[];
    totalScore: number;
    stars: Record<number, number>;
    coins: number;
    currentLevelId: number;
    stats: {
        totalWordsFound: number;
        totalLevelsCompleted: number;
        totalStarsEarned: number;
        perfectLevels: number;
        noHintLevels: number;
        fastLevels: number;
        currentStreak: number;
        longestStreak: number;
        totalPlayTime: number;
        hintsUsed: number;
        coinsEarned: number;
        lastPlayDate: string | null;
    };
}

export interface GameState {
    view: 'splash' | 'menu' | 'game' | 'complete' | 'album' | 'settings' | 'onboarding' | 'levels';
    currentLevel: Level | null;
    currentBlock: LevelBlock | null;
    grid: GridCell[][];
    wordsInfo: WordInfo[];
    foundWordsCells: { row: number; col: number; color: string }[];
    hintedCells: { row: number; col: number }[];
    timeElapsed: number;
    isPaused: boolean;
    showTrophyReveal: Trophy | null;
    newAchievement: any | null;
    hasProcessedCompletion: boolean;
}

export type GameAction =
    | { type: 'SET_VIEW'; payload: GameState['view'] }
    | { type: 'START_LEVEL'; payload: { level: Level; block: LevelBlock } }
    | { type: 'START_CURRENT_LEVEL' }
    | { type: 'RESTORE_SESSION'; payload: { level: Level; block: LevelBlock; session: any } }
    | { type: 'WORD_FOUND'; payload: { word: string; cells: { row: number; col: number }[] } }
    | { type: 'USE_HINT'; payload: { type: 'single_letter' | 'full_word' } }
    | { type: 'TICK_TIMER' }
    | { type: 'TOGGLE_PAUSE' }
    | { type: 'COMPLETE_LEVEL' }
    | { type: 'CLOSE_TROPHY_REVEAL' }
    | { type: 'ADD_COINS'; payload: number }
    | { type: 'SHOW_ACHIEVEMENT'; payload: any }
    | { type: 'CLOSE_ACHIEVEMENT' }
    | { type: 'FINISH_TUTORIAL' }
    | { type: 'PAUSE_GAME' }
    | { type: 'RESUME_GAME' }
    | { type: 'RESET_PROGRESS' };
