import { Operator } from '@/types';

// Seeded random number generator
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Linear Congruential Generator
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  choice<T>(array: T[]): T {
    return array[this.int(0, array.length - 1)];
  }
}

// Generate seed from date (YYYYMMDD format)
function generateSeed(date: Date): number {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return parseInt(`${year}${month}${day}`);
}

// Get puzzle number (days since epoch)
export function getPuzzleNumber(date: Date): number {
  const epoch = new Date('2024-01-01T00:00:00Z');
  const diffTime = date.getTime() - epoch.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

// Generate daily puzzle
export function generateDailyPuzzle(date: Date): string {
  const seed = generateSeed(date);
  const rng = new SeededRandom(seed);

  const operator = rng.choice(['+', '-', '*', '/'] as Operator[]);

  let num1: number;
  let num2: number;
  let result: number;
  let attempts = 0;
  const maxAttempts = 100;

  // Keep generating until we get valid numbers
  do {
    attempts++;

    switch (operator) {
      case '+':
        num1 = rng.int(1, 99);
        num2 = rng.int(1, 99);
        result = num1 + num2;
        break;

      case '-':
        num1 = rng.int(1, 99);
        num2 = rng.int(1, Math.min(num1 - 1, 99));
        result = num1 - num2;
        break;

      case '*':
        num1 = rng.int(2, 15);
        num2 = rng.int(2, 15);
        result = num1 * num2;
        break;

      case '/':
        num2 = rng.int(2, 12);
        result = rng.int(1, 20);
        num1 = num2 * result;
        break;

      default:
        num1 = 1;
        num2 = 1;
        result = 2;
    }

    // Check if result is within valid range (0-999)
    if (result >= 0 && result <= 999 && attempts < maxAttempts) {
      break;
    }
  } while (attempts < maxAttempts);

  // Format equation with proper spacing
  return `${num1} ${operator} ${num2} = ${result}`;
}

// Get today's puzzle
export function getTodaysPuzzle(): string {
  const today = new Date();
  return generateDailyPuzzle(today);
}

// Get puzzle for specific date
export function getPuzzleForDate(date: Date): string {
  return generateDailyPuzzle(date);
}
