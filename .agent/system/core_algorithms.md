# Core Algorithms

This document details the key algorithms powering Numble's game mechanics.

---

## 1. Puzzle Generation Algorithm

**Location**: `lib/puzzle.ts`

### Purpose
Generate deterministic daily puzzles that are identical for all users on the same date.

### Seeded Random Number Generator

Uses **Linear Congruential Generator (LCG)** algorithm:

```typescript
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // LCG formula: seed = (seed * a + c) mod m
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;  // Normalize to [0, 1)
  }

  // Generate integer in range [min, max]
  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Pick random element from array
  choice<T>(array: T[]): T {
    return array[this.int(0, array.length - 1)];
  }
}
```

**Constants**:
- Multiplier (a): 9301
- Increment (c): 49297
- Modulus (m): 233280

**Properties**:
- Deterministic (same seed = same sequence)
- Sufficient randomness for game purposes
- Lightweight (no external dependencies)

### Seed Generation

```typescript
function generateSeed(date: Date): number {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return parseInt(`${year}${month}${day}`);
}
```

**Example**:
- Date: 2024-10-15
- Seed: 20241015

**Why UTC?**
- Ensures same puzzle globally
- Avoids timezone discrepancies
- Consistent puzzle numbering

### Puzzle Number Calculation

```typescript
export function getPuzzleNumber(date: Date): number {
  const epoch = new Date('2024-01-01T00:00:00Z');
  const diffTime = date.getTime() - epoch.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}
```

**Example**:
- Epoch: 2024-01-01 → Puzzle #1
- 2024-01-02 → Puzzle #2
- 2024-10-15 → Puzzle #289

### Daily Puzzle Generation

```typescript
export function generateDailyPuzzle(date: Date): string {
  const seed = generateSeed(date);
  const rng = new SeededRandom(seed);

  const operator = rng.choice(['+', '-', '*', '/']);

  let num1, num2, result;
  let attempts = 0;
  const maxAttempts = 100;

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
    }

    // Check if result is within valid range (0-999)
    if (result >= 0 && result <= 999 && attempts < maxAttempts) {
      break;
    }
  } while (attempts < maxAttempts);

  return `${num1} ${operator} ${num2} = ${result}`;
}
```

**Operator-Specific Logic**:

| Operator | Strategy | Range |
|----------|----------|-------|
| `+` | Random operands | 1-99 each |
| `-` | Ensure positive result | 1-99, result ≥ 1 |
| `*` | Limit to avoid large results | 2-15 each |
| `/` | Generate result first, multiply back | divisor 2-12, result 1-20 |

**Constraints**:
- All results must be 0-999 (max 3 digits)
- Division must result in whole numbers
- No negative numbers
- Maximum 100 generation attempts (fallback safety)

---

## 2. Feedback Generation Algorithm

**Location**: `lib/validation.ts`

### Purpose
Provide color-coded feedback comparing guess to target equation.

### Two-Pass Algorithm

**Input**:
- Guess: `"23 + 11 = 34"`
- Target: `"12 + 34 = 46"`

**Output**:
- Array of FeedbackColor: `['yellow', 'yellow', 'gray', 'green', ...]`

### Implementation

```typescript
export function generateFeedback(guess: string, target: string): FeedbackColor[] {
  const guessChars = guess.split('');
  const targetChars = target.split('');
  const feedback: FeedbackColor[] = new Array(guessChars.length).fill('gray');
  const targetUsed: boolean[] = new Array(targetChars.length).fill(false);

  // PASS 1: Mark all exact matches (green)
  for (let i = 0; i < guessChars.length; i++) {
    if (guessChars[i] === targetChars[i]) {
      feedback[i] = 'green';
      targetUsed[i] = true;
    }
  }

  // PASS 2: Mark wrong positions (yellow)
  for (let i = 0; i < guessChars.length; i++) {
    if (feedback[i] === 'gray') {  // Not yet marked
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
```

### Algorithm Breakdown

**Pass 1: Exact Matches (Green)**
- Compare position-by-position
- If `guess[i] === target[i]`, mark green
- Mark target character as "used" to prevent double-counting

**Pass 2: Wrong Positions (Yellow)**
- For each remaining gray character in guess
- Search target for first unused matching character
- If found, mark yellow and mark target character as used
- If not found, leave as gray

### Example Walkthrough

**Target**: `"12 + 34 = 46"`
**Guess**: `"23 + 11 = 34"`

| Index | Guess | Target | Pass 1 | Pass 2 | Final |
|-------|-------|--------|--------|--------|-------|
| 0 | `2` | `1` | gray | yellow (found at pos 1) | yellow |
| 1 | `3` | `2` | gray | yellow (found at pos 5) | yellow |
| 2 | ` ` | ` ` | green | - | green |
| 3 | `+` | `+` | green | - | green |
| 4 | ` ` | ` ` | green | - | green |
| 5 | `1` | `3` | gray | yellow (found at pos 0) | yellow |
| 6 | `1` | `4` | gray | gray (no unused `1`) | gray |
| 7 | ` ` | ` ` | green | - | green |
| 8 | `=` | `=` | green | - | green |
| 9 | ` ` | ` ` | green | - | green |
| 10 | `3` | `4` | gray | yellow (found at pos 6) | yellow |
| 11 | `4` | `6` | gray | yellow (found at pos 3) | yellow |

**Result**: `['yellow', 'yellow', 'green', 'green', 'green', 'yellow', 'gray', 'green', 'green', 'green', 'yellow', 'yellow']`

### Edge Cases

**Duplicate Characters**:
- Target: `"11 + 22 = 33"`
- Guess: `"12 + 11 = 23"`
- First `1` in guess matches first `1` in target (green)
- Second `1` in guess matches second `1` in target (yellow)
- Third `1` in guess has no match left (gray)

**Priority**: Green > Yellow > Gray
- Exact matches take precedence
- Only unused target characters can be marked yellow

---

## 3. Validation Algorithm

**Location**: `lib/validation.ts`

### Format Validation

```typescript
export function isValidFormat(guess: string): boolean {
  // Pattern: 1-3 digits, space, operator, space, 1-3 digits, space, =, space, 1-3 digits
  const pattern = /^\d{1,3}\s[+\-*/]\s\d{1,3}\s=\s\d{1,3}$/;
  return pattern.test(guess);
}
```

**Regex Breakdown**:
- `^\d{1,3}`: 1-3 digits at start (first operand)
- `\s`: Single space
- `[+\-*/]`: One of four operators
- `\s`: Space
- `\d{1,3}`: 1-3 digits (second operand)
- `\s=\s`: Space, equals, space
- `\d{1,3}$`: 1-3 digits at end (result)

### Mathematical Validation

```typescript
export function isMathematicallyValid(guess: string): boolean {
  if (!isValidFormat(guess)) return false;

  const parts = guess.split(' ');
  const num1 = parseInt(parts[0]);
  const operator = parts[1];
  const num2 = parseInt(parts[2]);
  const result = parseInt(parts[4]);

  // Range checks
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
      if (num2 === 0) return false;  // Division by zero
      if (num1 % num2 !== 0) return false;  // Must be whole number
      calculatedResult = num1 / num2;
      break;
    default:
      return false;
  }

  return calculatedResult === result;
}
```

**Validation Steps**:
1. Check format with regex
2. Parse operands and result
3. Validate ranges (0-999)
4. Calculate result based on operator
5. Handle division edge cases
6. Compare calculated vs provided result

---

## 4. Statistics Update Algorithm

**Location**: `lib/game.ts`

### Purpose
Update player statistics when a game ends.

```typescript
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
    // Reset streak on loss
    newStats.currentStreak = 0;
  }

  return newStats;
}
```

**Update Rules**:
1. **Games Played**: Increment on any game end (win or loss)
2. **Games Won**: Increment only on win
3. **Guess Distribution**: Increment key matching number of guesses used (1-6)
4. **Current Streak**:
   - Increment on win
   - Reset to 0 on loss
5. **Max Streak**: Update if current streak exceeds it

**Idempotency**: Uses `previousGameState` to prevent double-counting if function called multiple times.

---

## 5. Keyboard Feedback Algorithm

**Location**: `lib/game.ts`

### Purpose
Aggregate feedback from all guesses to show keyboard key colors.

```typescript
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
```

**Priority System**:
1. **Green** (correct position): Highest priority
2. **Yellow** (wrong position): Medium priority
3. **Gray** (not in target): Lowest priority

**Logic**:
- If key never seen → Set to new color
- If key currently gray → Upgrade to yellow or green
- If key currently yellow → Upgrade to green only
- If key currently green → Never downgrade

---

## 6. Hard Mode Validation

**Location**: `lib/game.ts`

### Purpose
Enforce that revealed hints must be reused in subsequent guesses.

```typescript
export function validateHardMode(
  currentGuess: string,
  previousGuesses: string[],
  target: string
): string | null {
  if (previousGuesses.length === 0) {
    return null;  // First guess has no constraints
  }

  // Collect constraints from previous guesses
  const greenConstraints = new Map<number, string>();  // position → character
  const yellowLetters = new Set<string>();  // characters that must be included

  previousGuesses.forEach((guess) => {
    const feedback = generateFeedback(guess, target);
    guess.split('').forEach((char, index) => {
      if (feedback[index] === 'green') {
        greenConstraints.set(index, char);
      } else if (feedback[index] === 'yellow') {
        yellowLetters.add(char);
      }
    });
  });

  // Check green constraints (must use in same position)
  for (const [position, char] of greenConstraints.entries()) {
    if (currentGuess[position] !== char) {
      return `Must use ${char} in position ${position + 1}`;
    }
  }

  // Check yellow constraints (must include somewhere)
  for (const char of yellowLetters) {
    if (!currentGuess.includes(char)) {
      return `Must include ${char} in your guess`;
    }
  }

  return null;  // Valid
}
```

**Rules**:
1. **Green letters**: Must be used in the exact same position
2. **Yellow letters**: Must be included anywhere in the guess
3. **Gray letters**: No constraint

**Example**:
- Previous guess: `"12 + 34 = 46"` → Feedback: `2` is yellow, `+` is green
- Next guess must:
  - Have `+` at position 3
  - Include `2` somewhere

---

## 7. Share Text Generation

**Location**: `lib/game.ts`

### Purpose
Create emoji grid for sharing results without spoiling the puzzle.

```typescript
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
          case 'green': return '🟩';
          case 'yellow': return '🟨';
          default: return '⬜';
        }
      })
      .join('');
    shareText += emojiRow + '\n';
  });

  return shareText.trim();
}
```

**Output Format**:
```
Numble 289 4/6

⬜🟨⬜🟨⬜🟩⬜🟨⬜🟩⬜⬜⬜
🟩⬜🟨⬜🟨🟩⬜⬜⬜🟩⬜🟨⬜
🟩🟩🟩⬜⬜🟩🟩⬜⬜🟩🟩⬜⬜
🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩
```

**Emoji Mapping**:
- 🟩 Green: Correct position
- 🟨 Yellow: Wrong position
- ⬜ White/Gray: Not in target

---

## Algorithm Complexity Analysis

| Algorithm | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Puzzle Generation | O(1) | O(1) |
| Feedback Generation | O(n²) worst case, O(n) average | O(n) |
| Format Validation | O(n) | O(1) |
| Math Validation | O(1) | O(1) |
| Statistics Update | O(1) | O(1) |
| Keyboard Feedback | O(g × n) where g = guesses, n = chars | O(k) where k = unique chars |
| Hard Mode Validation | O(g × n) | O(n) |
| Share Text Generation | O(g × n) | O(g × n) |

Where:
- n = equation length (13 characters)
- g = number of guesses (max 6)
- k = number of unique characters (max ~15)

**Note**: All algorithms are highly efficient given the small, fixed input sizes.

---

## Related Documentation
- [Project Architecture](project_architecture.md)
- [Database Schema](database_schema.md)
- [Testing Guide](../sop/testing_guide.md)
