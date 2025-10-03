# Numble - Product Requirements Document

## 1. Executive Summary

Numble is a daily puzzle game inspired by Wordle, where players guess a hidden mathematical equation in 6 attempts. Each guess must be a valid equation, and feedback is provided using color-coded tiles to indicate correct numbers, operators, and positions.

## 2. Product Goals

### Primary Objectives
- Create an engaging daily puzzle game that combines logic and mathematics
- Provide a mobile-first experience that works seamlessly on all devices
- Enable social sharing of results without spoiling the puzzle
- Deploy as a Progressive Web App (PWA) on Vercel

### Success Metrics
- Daily active users (DAU)
- Average completion rate
- Share rate (percentage of players sharing results)
- Average attempts per puzzle

## 3. Technical Specifications

### Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks (useState, useEffect, useContext)
- **Storage**: localStorage for game state persistence
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics (optional)

### Browser Support
- Chrome/Edge (last 2 versions)
- Safari (last 2 versions)
- Firefox (last 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 8+)

### Performance Requirements
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3s
- Lighthouse Performance Score: > 90

## 4. Game Mechanics

### 4.1 Equation Format
- Target equation format: `NUM OP NUM = RESULT`
- Valid operators: `+`, `-`, `*`, `/`
- Number range: 0-99 (two digits maximum)
- Result range: 0-999 (three digits maximum)
- All equations must be mathematically valid
- Division results must be whole numbers (no decimals)

**Example equations:**
- `12 + 34 = 46`
- `56 - 23 = 33`
- `7 * 8 = 56`
- `72 / 9 = 8`

### 4.2 Game Rules
- Players have 6 attempts to guess the equation
- Each guess must be a valid equation (proper format and mathematically correct)
- After each guess, tiles change color to show how close the guess was
- One new puzzle is released daily at midnight local time
- Players can only play once per day

### 4.3 Feedback System

**Color Coding:**
- **Green**: Character is correct and in the correct position
- **Yellow**: Character is in the equation but in the wrong position
- **Gray**: Character is not in the equation at all

**Feedback Rules:**
- Each character (digit, operator, equals sign) is evaluated independently
- If a character appears multiple times in the guess but only once in the target, only one instance gets colored (green takes priority over yellow)
- The equals sign (=) position is always fixed, so it should always show as green in its position

**Example:**
- Target: `12 + 34 = 46`
- Guess: `23 + 11 = 34`
- Feedback:
  - `2`: Yellow (2 is in target but wrong position)
  - `3`: Yellow (3 is in target but wrong position)
  - `+`: Green (correct operator, correct position)
  - `1`: Yellow (1 is in target but wrong position)
  - `1`: Gray (already counted the 1)
  - `=`: Green (always correct)
  - `3`: Yellow (3 is in target but wrong position)
  - `4`: Yellow (4 is in target but wrong position)

### 4.4 Input Validation
- Prevent submission of invalid equations (format or mathematical errors)
- Show error message for invalid inputs
- Prevent playing after winning or losing
- Prevent playing completed puzzles

### 4.5 Daily Puzzle Generation
- Use a deterministic seed based on the current date
- Same puzzle for all players on the same day globally (use UTC date)
- Algorithm should generate diverse, solvable equations
- Ensure no duplicate puzzles across consecutive days

## 5. User Interface Requirements

### 5.1 Layout Structure

**Main Game Screen:**
```
+----------------------------------+
|           NUMBLE                  |
+----------------------------------+
|                                   |
|   [Equation Grid - 6 rows]        |
|   Each row: [__][__][__][__]...   |
|                                   |
|   [On-screen Calculator Keyboard] |
|   [0-9] [+ - * /] [= ⌫ ✓]        |
|                                   |
+----------------------------------+
|  [?] [📊] [⚙️]                    |
+----------------------------------+
```

**Components:**
1. Header with game title and icons
2. Equation grid (6 rows × 10 characters: NUM OP NUM = RES)
3. Virtual keyboard for input
4. Bottom navigation (Help, Stats, Settings)
5. Modal overlays (Help, Stats, Settings, Win/Loss)

### 5.2 Equation Grid
- 6 rows representing 6 attempts
- Each row contains 10 character spaces: `[N][N][_][O][_][N][N][_][=][_][R][R][R]`
- Character spaces represented as tiles with borders
- Active row highlighted with darker border
- Submitted rows show color-coded feedback
- Smooth animation when tiles flip to reveal colors

### 5.3 Virtual Keyboard
- **Number pad**: 0-9 (arranged like calculator: 7 8 9, 4 5 6, 1 2 3, 0)
- **Operators**: + - * / (in a row)
- **Special keys**: 
  - Backspace (⌫)
  - Enter/Submit (✓)
  - Equals (=) - auto-inserted or dedicated button
- Keys show color feedback after each guess (gray/yellow/green)
- Disabled keys when row is complete or game is over

### 5.4 Responsive Design
- Mobile-first approach (320px minimum width)
- Tablet layout (768px+): Larger tiles and keyboard
- Desktop layout (1024px+): Centered content, max-width container
- Touch-friendly tap targets (minimum 44×44px)
- Landscape mode support with adjusted layout

### 5.5 Color Scheme
```
Primary Colors:
- Background: #121213 (dark theme) or #FFFFFF (light theme)
- Text: #FFFFFF (dark) or #000000 (light)
- Tile Default: #3A3A3C (dark) or #D3D6DA (light)
- Tile Green: #538D4E
- Tile Yellow: #B59F3B
- Tile Gray: #3A3A3C (dark) or #787C7E (light)
- Keyboard: #818384

Accent Colors:
- Primary CTA: #538D4E
- Error: #DC2626
- Border: #3A3A3C (dark) or #D3D6DA (light)
```

### 5.6 Animations
- Tile flip animation when revealing feedback (180° flip, 0.5s duration)
- Tile pop animation when entering character (scale 1.1, 0.1s)
- Row shake animation for invalid equation (horizontal shake, 0.5s)
- Victory bounce animation (scale up, 0.5s)
- Modal fade-in/fade-out (0.3s)
- Smooth keyboard key press feedback

## 6. Feature Requirements

### 6.1 Core Features (MVP)

**Game Play:**
- Daily equation puzzle
- 6 attempts per puzzle
- Color-coded feedback system
- Virtual keyboard input
- Input validation
- Win/loss detection

**Modals:**
- Help/How to Play
- Statistics
- Settings

**Statistics:**
- Games played
- Win percentage
- Current streak
- Max streak
- Guess distribution (histogram showing 1-6 attempts)

**Settings:**
- Dark/Light theme toggle
- (Optional) Hard mode toggle

**Sharing:**
- Share results as emoji grid (no spoilers)
- Copy to clipboard
- Format example:
```
Numble 123 4/6

⬜🟨⬜🟨⬜🟩⬜🟨
🟩⬜🟨⬜🟨🟩⬜⬜
🟩🟩🟩⬜⬜🟩🟩⬜
🟩🟩🟩🟩🟩🟩🟩🟩
```

### 6.2 Nice-to-Have Features (Post-MVP)
- Hard mode: Revealed hints must be used in subsequent guesses
- Keyboard shortcuts for desktop users
- Archive mode to play previous puzzles
- Multiple difficulty levels (easy: single-digit numbers, hard: larger numbers)
- Sound effects toggle
- Practice mode (unlimited random puzzles)
- Color blind mode with alternative color schemes

## 7. Data Storage

### 7.1 localStorage Schema

```typescript
interface GameState {
  currentPuzzleNumber: number;
  guesses: string[];
  gameStatus: 'IN_PROGRESS' | 'WON' | 'LOST';
  lastPlayed: string; // ISO date string
}

interface Statistics {
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

interface Settings {
  theme: 'light' | 'dark';
  hardMode: boolean;
  colorBlindMode: boolean;
}
```

### 7.2 Storage Keys
- `numble_game_state`: Current game state
- `numble_statistics`: Player statistics
- `numble_settings`: User preferences

## 8. Puzzle Generation Algorithm

### 8.1 Requirements
- Deterministic: Same date = same puzzle for all users
- Diverse: Variety of operations and numbers
- Solvable: Ensure puzzle has reasonable difficulty
- No decimals: Division must result in whole numbers

### 8.2 Algorithm Approach

```typescript
function generateDailyPuzzle(date: Date): string {
  // 1. Create seed from date (YYYYMMDD)
  const seed = generateSeed(date);
  
  // 2. Use seeded random number generator
  const rng = new SeededRandom(seed);
  
  // 3. Generate equation components
  const operator = rng.choice(['+', '-', '*', '/']);
  
  // 4. Generate numbers based on operator constraints
  let num1, num2, result;
  
  switch(operator) {
    case '+':
      num1 = rng.int(1, 99);
      num2 = rng.int(1, 99);
      result = num1 + num2;
      break;
    case '-':
      result = rng.int(1, 98);
      num1 = rng.int(result + 1, 99);
      num2 = num1 - result;
      break;
    case '*':
      num1 = rng.int(2, 12);
      num2 = rng.int(2, 12);
      result = num1 * num2;
      break;
    case '/':
      num2 = rng.int(2, 12);
      result = rng.int(1, 20);
      num1 = num2 * result;
      break;
  }
  
  // 5. Validate result is within bounds
  if (result > 999) {
    // Regenerate with smaller numbers
  }
  
  return `${num1} ${operator} ${num2} = ${result}`;
}
```

## 9. Validation Logic

### 9.1 Equation Format Validation
```typescript
function isValidFormat(guess: string): boolean {
  // Pattern: NUM OP NUM = RESULT
  // Example: "12 + 34 = 46"
  const pattern = /^\d{1,2}\s[+\-*/]\s\d{1,2}\s=\s\d{1,3}$/;
  return pattern.test(guess);
}
```

### 9.2 Mathematical Validation
```typescript
function isMathematicallyValid(guess: string): boolean {
  const parts = guess.split(' ');
  const num1 = parseInt(parts[0]);
  const operator = parts[1];
  const num2 = parseInt(parts[2]);
  const result = parseInt(parts[4]);
  
  let calculatedResult: number;
  
  switch(operator) {
    case '+': calculatedResult = num1 + num2; break;
    case '-': calculatedResult = num1 - num2; break;
    case '*': calculatedResult = num1 * num2; break;
    case '/': 
      if (num2 === 0 || num1 % num2 !== 0) return false;
      calculatedResult = num1 / num2;
      break;
    default: return false;
  }
  
  return calculatedResult === result;
}
```

### 9.3 Feedback Generation
```typescript
function generateFeedback(guess: string, target: string): FeedbackColor[] {
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
```

## 10. User Experience Flow

### 10.1 First-Time User Flow
1. User lands on app
2. Automatically show "How to Play" modal
3. Close modal to see game board
4. Begin playing

### 10.2 Returning User Flow
1. User lands on app
2. Check localStorage for today's puzzle
3. If not played: Show empty board
4. If in progress: Restore game state
5. If completed: Show results and next puzzle countdown

### 10.3 Gameplay Flow
1. User enters characters using virtual keyboard
2. Characters appear in active row
3. User can backspace to delete
4. When row is complete, user presses Enter
5. Validate equation format and math
6. If invalid: Show error, shake row
7. If valid: Animate tile flip, reveal colors
8. Update keyboard colors
9. Check win/loss condition
10. If game over: Show modal with stats and share button
11. If not: Move to next row

## 11. Error Handling

### 11.1 Input Errors
- **Invalid format**: "Invalid equation format"
- **Invalid math**: "Equation is not correct"
- **Out of range**: "Numbers must be 0-99"
- **Division error**: "Division must result in whole number"

### 11.2 Storage Errors
- Handle localStorage quota exceeded
- Graceful degradation if localStorage unavailable
- Validate data integrity on load

### 11.3 Date/Time Errors
- Handle timezone issues consistently
- Fallback if date generation fails

## 12. Accessibility Requirements

### 12.1 WCAG 2.1 AA Compliance
- Color contrast ratio ≥ 4.5:1 for text
- Color contrast ratio ≥ 3:1 for UI components
- Keyboard navigation support
- Screen reader compatibility

### 12.2 Keyboard Support
- Tab: Navigate between interactive elements
- Enter: Submit guess
- Backspace: Delete character
- Escape: Close modals
- Arrow keys: Navigate keyboard (optional)

### 12.3 ARIA Labels
- Descriptive labels for all interactive elements
- Announce game state changes to screen readers
- Label tile colors for assistive technology

### 12.4 Focus Management
- Visible focus indicators
- Logical focus order
- Return focus after modal close

## 13. Testing Requirements

### 13.1 Unit Tests
- Equation validation logic
- Feedback generation algorithm
- Puzzle generation consistency
- localStorage utilities

### 13.2 Integration Tests
- Game flow (start to finish)
- Modal interactions
- Statistics tracking
- Sharing functionality

### 13.3 E2E Tests
- Complete game scenarios (win/loss)
- Cross-browser compatibility
- Mobile device testing
- PWA functionality

### 13.4 Manual Testing Checklist
- [ ] Play complete game on mobile
- [ ] Play complete game on desktop
- [ ] Test all modals
- [ ] Test theme switching
- [ ] Test statistics accuracy
- [ ] Test sharing functionality
- [ ] Test invalid equation handling
- [ ] Test puzzle consistency across devices
- [ ] Test offline functionality (PWA)
- [ ] Test countdown timer to next puzzle

## 14. Deployment Requirements

### 14.1 Vercel Configuration
- **Framework**: Next.js
- **Build command**: `npm run build`
- **Output directory**: `.next`
- **Install command**: `npm install`
- **Environment**: Node.js 18.x or later

### 14.2 Environment Variables
```bash
# Optional
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
NEXT_PUBLIC_APP_URL=https://numble.vercel.app
```

### 14.3 PWA Configuration
```json
// manifest.json
{
  "name": "Numble - Daily Math Puzzle",
  "short_name": "Numble",
  "description": "A daily equation puzzle game",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#121213",
  "theme_color": "#538D4E",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 14.4 SEO Requirements
- Meta title: "Numble - Daily Math Equation Puzzle"
- Meta description: "Guess the daily equation in 6 tries. A new math puzzle every day!"
- Open Graph tags for social sharing
- Favicon and app icons

### 14.5 Performance Optimization
- Image optimization (Next.js Image component)
- Code splitting
- Lazy loading for modals
- Minimize bundle size
- Enable caching headers

## 15. Project Structure

```
numble/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main game page
│   ├── globals.css         # Global styles
│   └── favicon.ico
├── components/
│   ├── GameBoard.tsx       # Equation grid
│   ├── Keyboard.tsx        # Virtual keyboard
│   ├── Tile.tsx            # Individual tile
│   ├── Modal.tsx           # Reusable modal
│   ├── HelpModal.tsx       # How to play
│   ├── StatsModal.tsx      # Statistics
│   ├── SettingsModal.tsx   # Settings
│   └── Header.tsx          # App header
├── lib/
│   ├── game.ts             # Game logic
│   ├── puzzle.ts           # Puzzle generation
│   ├── validation.ts       # Equation validation
│   ├── storage.ts          # localStorage utils
│   └── utils.ts            # Helper functions
├── types/
│   └── index.ts            # TypeScript types
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── icon-192.png
│   └── icon-512.png
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 16. Implementation Phases

### Phase 1: Core Functionality (Week 1)
- Set up Next.js project
- Implement game board and tiles
- Create virtual keyboard
- Implement equation validation
- Create puzzle generation algorithm
- Implement feedback system
- Basic styling (mobile-first)

### Phase 2: Game Logic & Storage (Week 1)
- Win/loss detection
- localStorage integration
- Daily puzzle rotation
- Statistics tracking
- Game state persistence

### Phase 3: UI/UX Polish (Week 2)
- Animations and transitions
- Modals (Help, Stats, Settings)
- Theme switching
- Responsive design refinement
- Error handling and messages

### Phase 4: Features & Sharing (Week 2)
- Share results functionality
- Keyboard color feedback
- Countdown to next puzzle
- Statistics visualization

### Phase 5: Testing & Deployment (Week 3)
- Unit and integration tests
- Cross-browser testing
- PWA setup
- Performance optimization
- Deploy to Vercel
- Final QA

## 17. Success Criteria

### Launch Readiness
- [ ] All core features functional
- [ ] No critical bugs
- [ ] Mobile responsive
- [ ] PWA installable
- [ ] Performance metrics met
- [ ] Accessibility standards met
- [ ] Successfully deployed on Vercel

### Post-Launch Monitoring
- Monitor error rates
- Track performance metrics
- Gather user feedback
- Monitor daily active users
- Track completion and share rates

## 18. Future Enhancements

### V2 Features
- User accounts and cloud sync
- Leaderboards
- Friend challenges
- Custom puzzle creation
- Achievement system
- Multiple language support
- Practice mode with hints
- Advanced statistics and analytics

## 19. Legal & Compliance

### Privacy
- No personal data collection (anonymous local storage only)
- Optional analytics with user consent
- Privacy policy page

### Terms of Service
- Fair use policy
- Content guidelines
- Disclaimer

## 20. Support & Maintenance

### Documentation
- README with setup instructions
- Contributing guidelines
- Code comments for complex logic
- API documentation (if applicable)

### Monitoring
- Error tracking (optional: Sentry)
- Analytics (optional: Vercel Analytics)
- Performance monitoring

### Updates
- Bug fixes: As needed
- New features: Monthly releases
- Security patches: Immediate

---

## Appendix A: Example Equations

**Easy:**
- `5 + 3 = 8`
- `9 - 4 = 5`
- `6 * 7 = 42`
- `16 / 4 = 4`

**Medium:**
- `23 + 45 = 68`
- `87 - 29 = 58`
- `12 * 8 = 96`
- `63 / 9 = 7`

**Hard:**
- `99 + 87 = 186`
- `88 - 29 = 59`
- `15 * 12 = 180`
- `96 / 12 = 8`

## Appendix B: Color Blind Mode

Alternative color schemes:
- Green → Blue (#0066CC)
- Yellow → Orange (#FF9500)
- Gray → Gray (same)

## Appendix C: Keyboard Layout

```
Calculator-style number pad:
[7] [8] [9]
[4] [5] [6]
[1] [2] [3]
    [0]

Operators:
[+] [-] [*] [/]

Controls:
[⌫] [=] [✓]
```

---

**Document Version**: 1.0
**Last Updated**: October 2025
**Author**: Product Team
**Status**: Ready for Development