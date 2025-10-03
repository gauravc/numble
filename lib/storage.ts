import { GameState, Statistics, Settings } from '@/types';

const STORAGE_KEYS = {
  GAME_STATE: 'numble_game_state',
  STATISTICS: 'numble_statistics',
  SETTINGS: 'numble_settings',
  FIRST_TIME: 'numble_first_time',
};

// Check if localStorage is available
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// Game State
export function saveGameState(state: GameState): void {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

export function loadGameState(): GameState | null {
  if (!isLocalStorageAvailable()) return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

// Statistics
export function saveStatistics(stats: Statistics): void {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save statistics:', error);
  }
}

export function loadStatistics(): Statistics {
  if (!isLocalStorageAvailable()) {
    return getDefaultStatistics();
  }
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STATISTICS);
    return data ? JSON.parse(data) : getDefaultStatistics();
  } catch (error) {
    console.error('Failed to load statistics:', error);
    return getDefaultStatistics();
  }
}

function getDefaultStatistics(): Statistics {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    },
  };
}

// Settings
export function saveSettings(settings: Settings): void {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

export function loadSettings(): Settings {
  if (!isLocalStorageAvailable()) {
    return getDefaultSettings();
  }
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : getDefaultSettings();
  } catch (error) {
    console.error('Failed to load settings:', error);
    return getDefaultSettings();
  }
}

function getDefaultSettings(): Settings {
  // Detect system theme preference
  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  return {
    theme: prefersDark ? 'dark' : 'light',
    hardMode: false,
    colorBlindMode: false,
  };
}

// First time user
export function isFirstTimeUser(): boolean {
  if (!isLocalStorageAvailable()) return true;
  return !localStorage.getItem(STORAGE_KEYS.FIRST_TIME);
}

export function setFirstTimeUserComplete(): void {
  if (!isLocalStorageAvailable()) return;
  localStorage.setItem(STORAGE_KEYS.FIRST_TIME, 'false');
}

// Clear all data (for debugging/reset)
export function clearAllData(): void {
  if (!isLocalStorageAvailable()) return;
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
