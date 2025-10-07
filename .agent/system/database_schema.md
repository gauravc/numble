# Database & Storage Schema

## Overview

Numble uses two storage mechanisms:
1. **localStorage**: Client-side storage for solo game state, statistics, and settings
2. **Redis (Vercel KV)**: Server-side storage for multiplayer sessions

---

## localStorage Schema

### Storage Keys

| Key | Purpose | Type |
|-----|---------|------|
| `numble_game_state` | Current game progress | GameState |
| `numble_statistics` | Player statistics | Statistics |
| `numble_settings` | User preferences | Settings |
| `numble_first_time` | First-time user flag | string |
| `numble_player_id` | Multiplayer player identifier | string |

---

### 1. Game State (`numble_game_state`)

Stores the current state of the solo game.

```typescript
interface GameState {
  currentPuzzleNumber: number;    // Days since epoch (2024-01-01)
  guesses: string[];              // Array of submitted guesses
  gameStatus: GameStatus;         // 'IN_PROGRESS' | 'WON' | 'LOST'
  lastPlayed: string;             // ISO 8601 timestamp
  mode?: GameMode;                // 'solo' | 'multiplayer'
  sessionId?: string;             // Optional multiplayer session ID
}
```

**Example**
```json
{
  "currentPuzzleNumber": 289,
  "guesses": [
    "12 + 34 = 46",
    "7 * 8 = 56"
  ],
  "gameStatus": "IN_PROGRESS",
  "lastPlayed": "2024-10-15T18:30:00.000Z",
  "mode": "solo"
}
```

**Lifecycle**
- Created: When user starts first game
- Updated: After each guess submission
- Reset: When new puzzle number detected (new day)

---

### 2. Statistics (`numble_statistics`)

Tracks player performance across all games.

```typescript
interface Statistics {
  gamesPlayed: number;       // Total games completed (won + lost)
  gamesWon: number;          // Total games won
  currentStreak: number;     // Consecutive wins
  maxStreak: number;         // Best streak ever
  guessDistribution: {       // Histogram of wins by attempt number
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
  };
}
```

**Example**
```json
{
  "gamesPlayed": 47,
  "gamesWon": 42,
  "currentStreak": 8,
  "maxStreak": 15,
  "guessDistribution": {
    "1": 0,
    "2": 5,
    "3": 12,
    "4": 15,
    "5": 8,
    "6": 2
  }
}
```

**Computed Metrics**
- Win percentage: `(gamesWon / gamesPlayed) * 100`
- Average guesses: `sum(attempts * count) / gamesWon`

**Update Rules**
- `gamesPlayed`: Increment when game ends (won or lost)
- `gamesWon`: Increment only on win
- `currentStreak`: Increment on win, reset to 0 on loss
- `maxStreak`: Update if currentStreak > maxStreak
- `guessDistribution[n]`: Increment the key matching number of guesses used to win

---

### 3. Settings (`numble_settings`)

User preferences and configuration.

```typescript
interface Settings {
  theme: Theme;                // 'light' | 'dark'
  hardMode: boolean;           // Enforce hint reuse
  colorBlindMode: boolean;     // Blue/orange color scheme
}
```

**Example**
```json
{
  "theme": "dark",
  "hardMode": false,
  "colorBlindMode": false
}
```

**Default Values**
- `theme`: Auto-detected from system preference (`prefers-color-scheme`)
- `hardMode`: `false`
- `colorBlindMode`: `false`

**Hard Mode Rules**
When enabled, subsequent guesses must:
- Use all green (correct position) characters in same position
- Include all yellow (wrong position) characters somewhere

---

### 4. First Time Flag (`numble_first_time`)

Simple flag to determine if help modal should be shown.

```typescript
type FirstTimeFlag = 'false' | undefined
```

- **Undefined**: First-time user → Show help modal
- **'false'**: Returning user → Don't show help modal

---

### 5. Player ID (`numble_player_id`)

Unique identifier for multiplayer sessions.

```typescript
type PlayerId = string;  // Random alphanumeric string
```

**Generation**
```typescript
// Format: random(36) + timestamp(36)
// Example: "k3j5h2g9f4l8p1q6x7z9"
Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
```

**Persistence**
- Generated once on first multiplayer game
- Stored permanently in localStorage
- Used to identify player across sessions

---

## Redis Schema (Multiplayer)

### Key Pattern
```
session:{sessionId}
```

### Session Object

```typescript
interface MultiplayerSession {
  id: string;                      // Unique session identifier
  puzzleNumber: number;            // Puzzle number (days since epoch)
  puzzle: string;                  // The target equation
  createdAt: string;               // ISO 8601 timestamp
  creatorId: string;               // Player ID of session creator
  opponentId?: string;             // Player ID of opponent (if joined)
  currentTurn: 'creator' | 'opponent';  // Whose turn it is
  guesses: MultiplayerGuess[];     // Array of all guesses
  gameStatus: GameStatus;          // 'IN_PROGRESS' | 'WON' | 'LOST'
  winnerId?: string;               // Player ID of winner (if game over)
}

interface MultiplayerGuess {
  playerId: string;     // Who made this guess
  guess: string;        // The equation guessed
  timestamp: string;    // ISO 8601 timestamp
}
```

**Example**
```json
{
  "id": "k3j5h2g9f4l8p1q6x7z9a2b3c4d5e6f7",
  "puzzleNumber": 289,
  "puzzle": "12 + 34 = 46",
  "createdAt": "2024-10-15T18:00:00.000Z",
  "creatorId": "player_abc123",
  "opponentId": "player_xyz789",
  "currentTurn": "opponent",
  "guesses": [
    {
      "playerId": "player_abc123",
      "guess": "7 * 8 = 56",
      "timestamp": "2024-10-15T18:01:00.000Z"
    },
    {
      "playerId": "player_xyz789",
      "guess": "9 + 10 = 19",
      "timestamp": "2024-10-15T18:02:00.000Z"
    }
  ],
  "gameStatus": "IN_PROGRESS"
}
```

---

### TTL (Time To Live)

Sessions automatically expire to save storage space.

**Expiration Time**: Midnight Pacific Time (next occurrence)

**Calculation Logic**
```typescript
function getSecondsUntilMidnightPT(): number {
  const now = new Date();
  const midnightPT = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
  );
  midnightPT.setHours(24, 0, 0, 0);

  const diff = midnightPT.getTime() - now.getTime();
  return Math.max(Math.floor(diff / 1000), 60); // Minimum 60 seconds
}
```

**Why Midnight PT?**
- Aligns with daily puzzle reset
- All multiplayer games based on same daily puzzle
- Prevents stale sessions from accumulating

---

### Redis Operations

#### Create Session
```typescript
await redis.set(
  `session:${sessionId}`,
  JSON.stringify(session),
  { EX: getSecondsUntilMidnightPT() }
);
```

#### Get Session
```typescript
const data = await redis.get(`session:${sessionId}`);
const session = data ? JSON.parse(data) : null;
```

#### Update Session
```typescript
const session = await getSession(sessionId);
const updated = { ...session, ...updates };
await redis.set(
  `session:${sessionId}`,
  JSON.stringify(updated),
  { EX: getSecondsUntilMidnightPT() }
);
```

#### Add Guess
```typescript
const session = await getSession(sessionId);
session.guesses.push(newGuess);
await updateSession(sessionId, session);
```

---

## Data Migration & Compatibility

### localStorage Migration
No migration system currently implemented. Changes to schema may require:
1. Version field in stored objects
2. Migration function on app load
3. Fallback to defaults for missing fields

**Current Approach**: Graceful degradation
- Missing fields → Use defaults
- Invalid data → Clear and reinitialize
- Type mismatches → Logged but handled

### Redis Session Compatibility
Sessions automatically expire, so breaking changes are less problematic:
- Old sessions expire at midnight
- New sessions use updated schema
- No long-term data persistence concerns

---

## Storage Limits

### localStorage
- **Quota**: ~5-10 MB per origin (browser-dependent)
- **Current Usage**: < 10 KB per user
- **Risk**: Very low (game state is minimal)

### Redis (Vercel KV)
- **Quota**: Depends on Vercel plan
- **Per Session**: ~2-5 KB
- **Max Sessions**: Thousands (with TTL cleanup)
- **Cost**: Negligible at current scale

---

## Data Backup & Recovery

### localStorage
- **No automatic backup**: Data stored only on device
- **Loss scenarios**: Browser cache clear, incognito mode
- **Mitigation**: Consider future cloud sync feature

### Redis
- **Backup**: Handled by Vercel KV (Redis provider)
- **Recovery**: Not needed (sessions are temporary)
- **Failure mode**: Graceful degradation (user sees error, can start solo game)

---

## Privacy & Compliance

### Personal Data
- **NO personal identifiable information** stored
- Player IDs are random, anonymous strings
- No emails, names, or contact info collected

### GDPR Compliance
- localStorage can be cleared by user (browser settings)
- No cookies used (except Vercel Analytics, if enabled)
- No data shared with third parties

### Analytics
- Optional Vercel Analytics
- Anonymous usage metrics only
- No user tracking across devices

---

## Storage Utilities

Located in `lib/storage.ts`:

```typescript
// localStorage operations
saveGameState(state: GameState): void
loadGameState(): GameState | null
saveStatistics(stats: Statistics): void
loadStatistics(): Statistics
saveSettings(settings: Settings): void
loadSettings(): Settings
isFirstTimeUser(): boolean
setFirstTimeUserComplete(): void
clearAllData(): void  // Debug/reset utility
```

Located in `lib/multiplayerStorage.ts`:

```typescript
// Redis operations
createSession(session: MultiplayerSession): Promise<void>
getSession(sessionId: string): Promise<MultiplayerSession | null>
updateSession(sessionId: string, updates: Partial<MultiplayerSession>): Promise<MultiplayerSession | null>
addGuessToSession(sessionId: string, guess: MultiplayerGuess): Promise<MultiplayerSession | null>
joinSession(sessionId: string, opponentId: string): Promise<MultiplayerSession | null>
generateSessionId(): string
```

---

## Related Documentation
- [Project Architecture](project_architecture.md)
- [API Routes Documentation](../sop/api_routes.md)
- [localStorage Best Practices](../sop/storage_best_practices.md)
