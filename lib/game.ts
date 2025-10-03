import { GameState, Statistics, FeedbackColor } from '@/types';
import { generateFeedback } from './validation';

// Update statistics after a game ends
export function updateStatistics(
  stats: Statistics,
  gameState: GameState,
  previousGameState: GameState | null
): Statistics {
  const newStats = { ...stats };

  // Only update if this is a newly completed game
  const isNewlyCompleted =
    gameState.gameStatus !== 'IN_PROGRESS' &&
    (!previousGameState || previousGameState.gameStatus === 'IN_PROGRESS');

  if (!isNewlyCompleted) {
    return stats;
  }

  newStats.gamesPlayed++;

  if (gameState.gameStatus === 'WON') {
    newStats.gamesWon++;
    const attemptNumber = gameState.guesses.length as 1 | 2 | 3 | 4 | 5 | 6;
    if (attemptNumber >= 1 && attemptNumber <= 6) {
      newStats.guessDistribution[attemptNumber]++;
    }

    // Update streak
    newStats.currentStreak++;
    if (newStats.currentStreak > newStats.maxStreak) {
      newStats.maxStreak = newStats.currentStreak;
    }
  } else if (gameState.gameStatus === 'LOST') {
    // Reset current streak on loss
    newStats.currentStreak = 0;
  }

  return newStats;
}

// Check if the puzzle has been changed (new day)
export function shouldResetGame(
  currentPuzzleNumber: number,
  savedPuzzleNumber: number
): boolean {
  return currentPuzzleNumber !== savedPuzzleNumber;
}

// Get keyboard feedback from all guesses
export function getKeyboardFeedback(
  guesses: string[],
  target: string
): Map<string, FeedbackColor> {
  const keyFeedback = new Map<string, FeedbackColor>();

  guesses.forEach((guess) => {
    const feedback = generateFeedback(guess, target);
    guess.split('').forEach((char, index) => {
      const currentFeedback = keyFeedback.get(char);
      const newFeedback = feedback[index];

      // Priority: green > yellow > gray
      if (
        !currentFeedback ||
        (newFeedback === 'green') ||
        (newFeedback === 'yellow' && currentFeedback !== 'green')
      ) {
        keyFeedback.set(char, newFeedback);
      }
    });
  });

  return keyFeedback;
}

// Format time until next puzzle (midnight local time)
export function getTimeUntilNextPuzzle(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Generate share text with emoji grid
export function generateShareText(
  puzzleNumber: number,
  guesses: string[],
  target: string,
  gameStatus: 'WON' | 'LOST'
): string {
  const attempts = gameStatus === 'WON' ? guesses.length : 'X';
  let shareText = `Numble ${puzzleNumber} ${attempts}/6\n\n`;

  guesses.forEach((guess) => {
    const feedback = generateFeedback(guess, target);
    const emojiRow = feedback
      .map((color) => {
        switch (color) {
          case 'green':
            return '🟩';
          case 'yellow':
            return '🟨';
          default:
            return '⬜';
        }
      })
      .join('');
    shareText += emojiRow + '\n';
  });

  return shareText.trim();
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
