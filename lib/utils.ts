// Utility functions

// Format equation with consistent spacing
export function formatEquation(input: string): string {
  // Remove extra spaces
  return input.replace(/\s+/g, ' ').trim();
}

// Get character at position in equation
export function getCharAtPosition(equation: string, position: number): string {
  return equation[position] || '';
}

// Pad equation to fixed length for display
export function padEquation(equation: string, length: number): string {
  return equation.padEnd(length, ' ');
}

// Calculate win percentage
export function calculateWinPercentage(gamesWon: number, gamesPlayed: number): number {
  if (gamesPlayed === 0) return 0;
  return Math.round((gamesWon / gamesPlayed) * 100);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Check if running in browser
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

// Get current date in UTC
export function getTodayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}
