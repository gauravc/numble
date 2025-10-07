# Numble - Project Architecture

## Project Overview

**Numble** is a daily math equation puzzle game inspired by Wordle. Players have 6 attempts to guess a hidden mathematical equation with feedback provided through color-coded tiles.

### Core Concept
- Daily puzzle game where users guess equations in format: `NUM OP NUM = RESULT`
- 6 attempts per puzzle
- Color-coded feedback (green = correct position, yellow = wrong position, gray = not in equation)
- Single puzzle per day (resets at midnight local time)

---

## Technology Stack

### Frontend Framework
- **Next.js 14+** (App Router)
  - React 18.3.1
  - Server Components and Client Components architecture
  - File-based routing

### Language & Type Safety
- **TypeScript 5.9.3**
  - Strict mode enabled
  - Path aliases configured (`@/*` → project root)

### Styling
- **Tailwind CSS 3.4.18**
  - Custom color scheme for light/dark themes
  - Custom animations (flip, pop, shake, bounce)
  - Responsive breakpoints (xs: 375px, fold: 280px)
  - Color blind mode support

### State Management
- **React Hooks** (useState, useEffect, useCallback)
- localStorage for persistence
- Redis (Vercel KV) for multiplayer sessions

### Storage
- **localStorage**: Game state, statistics, settings, player preferences
- **Redis**: Multiplayer session data with TTL (expires at midnight PT)

### Deployment
- **Vercel**
  - Automatic deployments from git
  - Edge functions for API routes
  - Analytics integration

### Additional Dependencies
- **@vercel/analytics**: User analytics tracking
- **redis**: Multiplayer session storage
- **sharp**: Image optimization (dev dependency)

---

## Project Structure

```
numble/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with metadata & analytics
│   ├── page.tsx                  # Main game page (solo & multiplayer)
│   ├── globals.css               # Global styles & Tailwind imports
│   └── api/                      # API routes
│       └── multiplayer/          # Multiplayer endpoints
│           ├── create/route.ts   # Create new session
│           ├── join/route.ts     # Join existing session
│           ├── guess/route.ts    # Submit multiplayer guess
│           └── session/[id]/route.ts  # Fetch session by ID
│
├── components/                   # React components
│   ├── GameBoard.tsx             # 6×13 grid of tiles
│   ├── Tile.tsx                  # Individual character tile with feedback
│   ├── Keyboard.tsx              # Virtual calculator-style keyboard
│   ├── Header.tsx                # Top navigation bar
│   ├── Modal.tsx                 # Reusable modal wrapper
│   ├── HelpModal.tsx             # How to play instructions
│   ├── StatsModal.tsx            # Statistics & sharing
│   ├── SettingsModal.tsx         # Theme & preferences
│   ├── GameModeModal.tsx         # Solo vs Multiplayer selection
│   ├── InviteModal.tsx           # Share multiplayer invite link
│   └── MultiplayerGame.tsx       # Multiplayer game interface
│
├── lib/                          # Core logic & utilities
│   ├── game.ts                   # Game mechanics (stats, keyboard feedback, sharing)
│   ├── puzzle.ts                 # Daily puzzle generation (seeded RNG)
│   ├── validation.ts             # Equation validation & feedback algorithm
│   ├── storage.ts                # localStorage utilities
│   ├── utils.ts                  # Helper functions
│   ├── multiplayerGame.ts        # Multiplayer client logic
│   └── multiplayerStorage.ts     # Redis session management
│
├── types/
│   └── index.ts                  # TypeScript type definitions
│
├── public/                       # Static assets
│   ├── manifest.json             # PWA manifest
│   ├── favicon.png
│   ├── apple-touch-icon.png
│   ├── icon-192.png
│   └── icon-512.png
│
├── scripts/
│   └── generate-icons.js         # Icon generation script
│
├── .agent/                       # Documentation (this folder)
│   ├── README.md                 # Documentation index
│   ├── system/                   # System architecture docs
│   ├── tasks/                    # PRD & implementation plans
│   └── sop/                      # Standard operating procedures
│
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── next.config.js                # Next.js configuration
└── numble_prd.md                 # Product Requirements Document
```

---

## Core Architecture

### 1. Daily Puzzle System

**Puzzle Generation** (`lib/puzzle.ts`)
- Deterministic seeded random number generator (Linear Congruential Generator)
- Seed based on UTC date (YYYYMMDD format)
- Generates equations with operators: `+`, `-`, `*`, `/`
- Number constraints:
  - Operands: 0-999 (up to 3 digits each)
  - Results: 0-999
  - Division must result in whole numbers
- Puzzle number calculated as days since epoch (2024-01-01)

**Equation Format**
```
NUM OP NUM = RESULT
Examples:
  12 + 34 = 46
  7 * 8 = 56
  72 / 9 = 8
```

### 2. Validation System

**Format Validation** (`lib/validation.ts`)
- Regex pattern: `/^\d{1,3}\s[+\-*/]\s\d{1,3}\s=\s\d{1,3}$/`
- Ensures proper spacing and structure

**Mathematical Validation**
- Verifies equation is mathematically correct
- Special handling for division (no decimals allowed)
- Range checks (0-999 for all numbers)

**Feedback Algorithm**
Two-pass algorithm for color feedback:
1. **First pass**: Mark all exact matches (green)
2. **Second pass**: Mark wrong positions (yellow) from remaining characters
3. Priority: Green > Yellow > Gray

### 3. Game State Management

**State Flow**
```
IN_PROGRESS → [correct guess] → WON
           → [6 wrong guesses] → LOST
```

**localStorage Schema**
```typescript
// Game State (numble_game_state)
{
  currentPuzzleNumber: number,
  guesses: string[],
  gameStatus: 'IN_PROGRESS' | 'WON' | 'LOST',
  lastPlayed: string,  // ISO date
  mode?: 'solo' | 'multiplayer',
  sessionId?: string
}

// Statistics (numble_statistics)
{
  gamesPlayed: number,
  gamesWon: number,
  currentStreak: number,
  maxStreak: number,
  guessDistribution: { 1-6: number }
}

// Settings (numble_settings)
{
  theme: 'light' | 'dark',
  hardMode: boolean,
  colorBlindMode: boolean
}
```

### 4. User Interface

**Component Hierarchy**
```
App (page.tsx)
├── Header
│   └── Icon buttons (Help, Stats, Settings)
├── GameBoard
│   └── 6 rows × 13 Tiles
│       └── Tile (with flip animation)
├── Keyboard
│   ├── Number pad (calculator style: 7-9, 4-6, 1-3, 0)
│   ├── Operators (+, -, *, /)
│   └── Special keys (⌫, =, ✓)
└── Modals
    ├── HelpModal
    ├── StatsModal
    ├── SettingsModal
    ├── GameModeModal
    └── InviteModal
```

**Responsive Design**
- Mobile-first approach (minimum 280px for foldable phones)
- Breakpoints:
  - fold: 280px (Samsung Fold)
  - xs: 375px (iPhone SE)
  - sm: 640px (tablets)
  - md: 768px
  - lg: 1024px (desktop)

**Animations**
- **Flip**: Tile reveal (0.5s, rotateX)
- **Pop**: Character entry (0.1s, scale)
- **Shake**: Invalid guess (0.5s, translateX)
- **Bounce**: Victory celebration (0.5s, scale)

### 5. Multiplayer Architecture

**Session Flow**
1. Player creates session → API generates unique session ID
2. Creator shares invite link with session ID
3. Opponent joins via link
4. Turn-based gameplay (creator goes first)
5. Session stored in Redis with TTL (expires at midnight PT)

**API Routes** (`app/api/multiplayer/`)
- `POST /api/multiplayer/create`: Create new session
- `POST /api/multiplayer/join`: Join session as opponent
- `POST /api/multiplayer/guess`: Submit guess for session
- `GET /api/multiplayer/session/[id]`: Fetch session state

**Redis Schema**
```typescript
// Key: session:{sessionId}
// TTL: Seconds until midnight Pacific Time
{
  id: string,
  puzzleNumber: number,
  puzzle: string,
  createdAt: string,
  creatorId: string,
  opponentId?: string,
  currentTurn: 'creator' | 'opponent',
  guesses: Array<{
    playerId: string,
    guess: string,
    timestamp: string
  }>,
  gameStatus: GameStatus,
  winnerId?: string
}
```

---

## Key Features

### Core Gameplay
- ✅ Daily equation puzzle (resets at midnight local time)
- ✅ 6 attempts per puzzle
- ✅ Color-coded feedback (green/yellow/gray)
- ✅ Virtual calculator keyboard
- ✅ Input validation (format + mathematical correctness)
- ✅ Win/loss detection
- ✅ Hard mode (must reuse revealed hints)

### User Experience
- ✅ First-time user help modal
- ✅ Statistics tracking (games played, win rate, streaks, distribution)
- ✅ Share results as emoji grid (no spoilers)
- ✅ Dark/light theme toggle
- ✅ Color blind mode (blue/orange instead of green/yellow)
- ✅ Responsive design (mobile → desktop)
- ✅ Smooth animations and transitions

### Multiplayer
- ✅ Turn-based multiplayer via shareable link
- ✅ Same puzzle for both players
- ✅ Session-based gameplay (expires at midnight)
- ✅ Real-time game state synchronization

### Progressive Web App (PWA)
- ✅ Installable on mobile devices
- ✅ Offline-capable (local game state)
- ✅ App manifest with icons
- ✅ Optimized for performance

---

## Data Flow

### Solo Game Flow
```
1. User lands on page
   ↓
2. Load saved state from localStorage
   ↓
3. Check if puzzle number matches today's puzzle
   ↓
4. If new day → Reset game state
   If returning → Restore progress
   ↓
5. User enters guess via keyboard
   ↓
6. Validate format & math
   ↓
7. If valid → Generate feedback & update state
   ↓
8. Check win/loss condition
   ↓
9. If game over → Update statistics → Show stats modal
```

### Multiplayer Game Flow
```
1. Player A creates session
   ↓
2. API generates session ID, stores in Redis
   ↓
3. Player A shares invite link
   ↓
4. Player B clicks link, joins session
   ↓
5. Game begins (Player A's turn)
   ↓
6. Player A submits guess → API validates & updates session
   ↓
7. Turn switches to Player B
   ↓
8. Repeat until win condition or 6 guesses each
   ↓
9. Winner determined by who guesses correctly first
```

---

## Performance Considerations

### Optimization Strategies
- **Code splitting**: Lazy load modals
- **Image optimization**: Using Next.js Image component & sharp
- **Bundle size**: Minimal dependencies
- **Caching**: Static assets cached by Vercel CDN
- **Server Components**: Reduce client-side JavaScript

### Target Metrics
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3s
- Lighthouse Performance Score: > 90

---

## Security & Privacy

### Data Privacy
- No personal data collection
- Anonymous local storage only
- Optional analytics (Vercel Analytics)
- No user accounts or authentication

### API Security
- Input validation on all endpoints
- Rate limiting via Vercel Edge Functions
- Redis connection secured via environment variables

---

## Environment Variables

```bash
# Required for multiplayer
kv_store_REDIS_URL=redis://...

# Optional
NEXT_PUBLIC_ANALYTICS_ID=...
NEXT_PUBLIC_APP_URL=https://numble.vercel.app
```

---

## Integration Points

### External Services
1. **Vercel**: Hosting, deployments, edge functions, analytics
2. **Redis (Vercel KV)**: Multiplayer session storage
3. **Browser APIs**: localStorage, Clipboard API

### Third-Party Dependencies
- React & Next.js ecosystem
- Tailwind CSS for styling
- TypeScript for type safety
- Redis client for session management

---

## Related Documentation
- [Product Requirements Document](../../numble_prd.md)
- [TypeScript Types](types_reference.md)
- [Component Documentation](components_reference.md)
