import { FeedbackColor } from '@/types';

// Validate equation format: "NUM OP NUM = RESULT"
export function isValidFormat(guess: string): boolean {
  // Pattern: 1-3 digits, space, operator, space, 1-3 digits, space, =, space, 1-3 digits
  const pattern = /^\d{1,3}\s[+\-*/]\s\d{1,3}\s=\s\d{1,3}$/;
  return pattern.test(guess);
}

// Validate mathematical correctness
export function isMathematicallyValid(guess: string): boolean {
  if (!isValidFormat(guess)) return false;

  const parts = guess.split(' ');
  const num1 = parseInt(parts[0]);
  const operator = parts[1];
  const num2 = parseInt(parts[2]);
  const result = parseInt(parts[4]);

  // Check number ranges
  if (num1 < 0 || num1 > 999) return false;
  if (num2 < 0 || num2 > 999) return false;
  if (result < 0 || result > 999) return false;

  let calculatedResult: number;

  switch (operator) {
    case '+':
      calculatedResult = num1 + num2;
      break;

    case '-':
      calculatedResult = num1 - num2;
      break;

    case '*':
      calculatedResult = num1 * num2;
      break;

    case '/':
      if (num2 === 0) return false;
      if (num1 % num2 !== 0) return false; // Must result in whole number
      calculatedResult = num1 / num2;
      break;

    default:
      return false;
  }

  return calculatedResult === result;
}

// Generate feedback for each character
export function generateFeedback(guess: string, target: string): FeedbackColor[] {
  // Convert strings to character arrays
  const guessChars = guess.split('');
  const targetChars = target.split('');
  const feedback: FeedbackColor[] = new Array(guessChars.length).fill('gray');
  const targetUsed: boolean[] = new Array(targetChars.length).fill(false);

  // First pass: Mark all greens (exact matches)
  for (let i = 0; i < guessChars.length; i++) {
    if (guessChars[i] === targetChars[i]) {
      feedback[i] = 'green';
      targetUsed[i] = true;
    }
  }

  // Second pass: Mark yellows (wrong position)
  for (let i = 0; i < guessChars.length; i++) {
    if (feedback[i] === 'gray') {
      for (let j = 0; j < targetChars.length; j++) {
        if (!targetUsed[j] && guessChars[i] === targetChars[j]) {
          feedback[i] = 'yellow';
          targetUsed[j] = true;
          break;
        }
      }
    }
  }

  return feedback;
}

// Get validation error message
export function getValidationError(guess: string): string | null {
  if (!guess || guess.trim() === '') {
    return 'Please enter an equation';
  }

  if (!isValidFormat(guess)) {
    return 'Invalid equation format';
  }

  const parts = guess.split(' ');
  const num1 = parseInt(parts[0]);
  const num2 = parseInt(parts[2]);
  const result = parseInt(parts[4]);

  if (num1 < 0 || num1 > 999 || num2 < 0 || num2 > 999) {
    return 'Numbers must be 0-999';
  }

  if (result < 0 || result > 999) {
    return 'Result must be 0-999';
  }

  if (!isMathematicallyValid(guess)) {
    const operator = parts[1];
    if (operator === '/' && num2 !== 0 && num1 % num2 !== 0) {
      return 'Division must result in whole number';
    }
    return 'Equation is not correct';
  }

  return null;
}

// Check if guess is complete (has all required characters)
export function isGuessComplete(guess: string): boolean {
  // Should have format: NN O NN = RRR (min 9 chars, max 13 chars)
  // Examples: "1 + 2 = 3" (9), "99 + 99 = 198" (13)
  return guess.length >= 9 && isValidFormat(guess);
}
