export type Operator = '+' | '-' | '*' | '/';

export type FeedbackColor = 'green' | 'yellow' | 'gray' | 'default';

export type CellState = 'empty' | 'tbd' | 'correct' | 'present' | 'absent';

export type GameStatus = 'IN_PROGRESS' | 'WON' | 'LOST';

export type Theme = 'light' | 'dark';

export interface GameState {
  currentPuzzleNumber: number;
  guesses: string[];
  gameStatus: GameStatus;
  lastPlayed: string; // ISO date string
}

export interface Statistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
  };
}

export interface Settings {
  theme: Theme;
  hardMode: boolean;
  colorBlindMode: boolean;
}

export interface TileData {
  char: string;
  feedback: FeedbackColor;
}

export interface KeyboardKey {
  key: string;
  feedback: FeedbackColor;
}
