# Numble Documentation Map

**Total Documentation**: ~2000 lines across 5 core documents
**Last Updated**: October 2024

---

## 📊 Documentation Overview

```
.agent/
├── 📖 README.md (345 lines)
│   └── Master index & getting started guide
│
├── 🏗️ system/ (Architecture & Design)
│   ├── 📘 project_architecture.md (550+ lines)
│   │   ├── Technology stack
│   │   ├── Project structure
│   │   ├── Core architecture
│   │   ├── UI components
│   │   └── Data flow
│   │
│   ├── 📗 database_schema.md (475+ lines)
│   │   ├── localStorage schema
│   │   ├── Redis session schema
│   │   ├── Storage utilities
│   │   └── Data lifecycle
│   │
│   └── 📙 core_algorithms.md (600+ lines)
│       ├── Puzzle generation (seeded RNG)
│       ├── Feedback algorithm (2-pass)
│       ├── Validation logic
│       ├── Statistics tracking
│       └── Share text generation
│
├── 📋 tasks/ (PRDs & Plans)
│   └── 📄 original_prd_reference.md (180 lines)
│       ├── PRD summary
│       ├── Implementation status
│       └── Feature tracking
│
└── 🔧 sop/ (Standard Operating Procedures)
    └── (To be populated as patterns emerge)
```

---

## 🎯 Quick Navigation

### By Role

**New Engineer** (Day 1 Onboarding)
```
1. README.md → Overview
2. project_architecture.md → System design
3. database_schema.md → Data structures
```

**Frontend Developer**
```
1. project_architecture.md → Component hierarchy
2. core_algorithms.md → Game logic (if needed)
3. Code: components/ folder
```

**Backend Developer**
```
1. database_schema.md → Storage systems
2. project_architecture.md → API design
3. Code: app/api/multiplayer/
```

**Game Designer**
```
1. original_prd_reference.md → Product vision
2. core_algorithms.md → Game mechanics
3. Original: numble_prd.md (root)
```

### By Topic

**Understanding the System**
- [README.md](README.md) - Start here
- [project_architecture.md](system/project_architecture.md) - Full overview
- [numble_prd.md](../numble_prd.md) - Original product spec

**Working with Data**
- [database_schema.md](system/database_schema.md) - All storage
- `lib/storage.ts` - localStorage code
- `lib/multiplayerStorage.ts` - Redis code

**Game Mechanics**
- [core_algorithms.md](system/core_algorithms.md) - All algorithms
- `lib/puzzle.ts` - Puzzle generation
- `lib/validation.ts` - Validation & feedback
- `lib/game.ts` - Statistics & utilities

**Building Features**
- [original_prd_reference.md](tasks/original_prd_reference.md) - Requirements
- [project_architecture.md](system/project_architecture.md) - Architecture patterns
- Future: sop/ folder for best practices

---

## 📚 Document Details

### [README.md](README.md)
**Purpose**: Master documentation index and navigation guide

**Contents**:
- Documentation structure overview
- Quick start guides by role
- Links to all other documentation
- Learning paths
- Contribution guidelines

**When to read**: First thing when joining the project

---

### [project_architecture.md](system/project_architecture.md)
**Purpose**: Comprehensive system architecture documentation

**Contents**:
- Technology stack (Next.js, TypeScript, Tailwind, Redis)
- Project structure (files, folders, organization)
- Core architecture (puzzle system, state management, UI)
- Multiplayer architecture (sessions, API, Redis)
- Key features overview
- Data flow diagrams
- Performance considerations
- Integration points

**When to read**:
- Understanding overall system design
- Planning new features
- Onboarding new engineers

**Key Sections**:
- Project Structure → File organization
- Core Architecture → System components
- Multiplayer Architecture → Session flow
- Data Flow → How data moves through app

---

### [database_schema.md](system/database_schema.md)
**Purpose**: Complete data storage reference

**Contents**:
- localStorage schema (5 keys)
  - Game state
  - Statistics
  - Settings
  - First-time flag
  - Player ID
- Redis schema (multiplayer sessions)
  - Session structure
  - TTL policies
  - Update operations
- Data lifecycle and migration
- Storage limits and quotas
- Privacy considerations
- Utility functions reference

**When to read**:
- Working with data persistence
- Debugging storage issues
- Adding new data fields
- Planning data migrations

**Key Sections**:
- localStorage Schema → Client-side storage
- Redis Schema → Server-side sessions
- Storage Utilities → Helper functions

---

### [core_algorithms.md](system/core_algorithms.md)
**Purpose**: Detailed algorithm documentation

**Contents**:
1. **Puzzle Generation**
   - Seeded random number generator (LCG)
   - Deterministic daily puzzles
   - Operator-specific logic

2. **Feedback Generation**
   - Two-pass color-coding algorithm
   - Priority system (green > yellow > gray)
   - Edge cases (duplicates)

3. **Validation**
   - Format validation (regex)
   - Mathematical correctness
   - Error messages

4. **Statistics Tracking**
   - Update rules
   - Streak calculations
   - Distribution tracking

5. **Keyboard Feedback**
   - Color aggregation across guesses
   - Priority system

6. **Hard Mode**
   - Constraint enforcement
   - Validation rules

7. **Share Text**
   - Emoji grid generation
   - Format specification

**When to read**:
- Understanding game logic
- Debugging gameplay issues
- Modifying game rules
- Performance optimization

**Key Sections**:
- Each algorithm has detailed explanation
- Includes code samples
- Shows complexity analysis

---

### [original_prd_reference.md](tasks/original_prd_reference.md)
**Purpose**: Reference to original product requirements

**Contents**:
- Summary of original PRD sections
- Current implementation status
- Deviations from original spec
- Feature tracking
- Version history

**When to read**:
- Planning feature development
- Checking what's been implemented
- Understanding product vision
- Making product decisions

**Key Sections**:
- Implementation Status → What's done
- Deviations → What changed
- Related Documentation → Links to specs

---

## 📈 Documentation Statistics

| Document | Lines | Focus Area |
|----------|-------|------------|
| project_architecture.md | 550+ | System design & structure |
| core_algorithms.md | 600+ | Game logic & algorithms |
| database_schema.md | 475+ | Data storage & persistence |
| README.md | 345 | Navigation & onboarding |
| original_prd_reference.md | 180 | Product requirements |
| **TOTAL** | **~2000** | **Complete system coverage** |

---

## 🗺️ Conceptual Map

```
                    ┌─────────────────┐
                    │   README.md     │
                    │  (Start Here)   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌────────────────┐   ┌──────────────┐
│    SYSTEM     │   │     TASKS      │   │     SOP      │
│ Architecture  │   │  Requirements  │   │  Procedures  │
└───────┬───────┘   └────────────────┘   └──────────────┘
        │
        ├──► project_architecture.md
        │    ├─ Tech Stack
        │    ├─ Project Structure
        │    ├─ Components
        │    └─ Data Flow
        │
        ├──► database_schema.md
        │    ├─ localStorage
        │    ├─ Redis
        │    └─ Utilities
        │
        └──► core_algorithms.md
             ├─ Puzzle Gen
             ├─ Feedback
             ├─ Validation
             └─ Statistics
```

---

## 🎓 Learning Paths

### Path 1: Complete Understanding (4-6 hours)
```
1. README.md (30 min)
   ↓
2. project_architecture.md (90 min)
   ↓
3. database_schema.md (60 min)
   ↓
4. core_algorithms.md (90 min)
   ↓
5. Browse actual code (60 min)
```

### Path 2: Quick Start (1-2 hours)
```
1. README.md - Quick Start section (10 min)
   ↓
2. project_architecture.md - Overview & Structure (30 min)
   ↓
3. database_schema.md - Skim schemas (20 min)
   ↓
4. Start coding with docs as reference
```

### Path 3: Specific Feature (30-60 min)
```
1. README.md - Find relevant section (5 min)
   ↓
2. Jump to specific doc section (15-30 min)
   ↓
3. Review related code (15-30 min)
```

---

## 🔍 Finding Information

### "Where is X documented?"

| What You Need | Where to Find It |
|---------------|------------------|
| **Overall architecture** | project_architecture.md |
| **Component structure** | project_architecture.md → UI section |
| **Data formats** | database_schema.md |
| **How puzzle generation works** | core_algorithms.md → Puzzle Generation |
| **How feedback colors are calculated** | core_algorithms.md → Feedback Generation |
| **What's been implemented** | original_prd_reference.md → Status |
| **Original product vision** | ../numble_prd.md |
| **Type definitions** | ../types/index.ts |
| **Component code** | ../components/ |
| **Game logic code** | ../lib/ |
| **API endpoints** | ../app/api/ |

---

## ✅ Documentation Health Checklist

- ✅ System architecture documented
- ✅ Data schemas documented
- ✅ Algorithms explained in detail
- ✅ Navigation guide created
- ✅ Cross-references added
- ✅ Code examples included
- ⚠️ SOPs to be added as patterns emerge
- ⚠️ Per-feature PRDs to be added as built
- ⚠️ Visual diagrams could be enhanced

---

## 🚀 Next Documentation Steps

### Priority 1 (As Needed)
- Add SOPs for common development tasks
- Create per-feature PRDs in tasks/ folder
- Add troubleshooting guide

### Priority 2 (Nice to Have)
- Add Mermaid diagrams for data flow
- Create component interaction diagrams
- Add API endpoint reference
- Create deployment guide

### Priority 3 (Future)
- Add contribution guidelines
- Create coding standards doc
- Add performance optimization guide
- Create testing strategy doc

---

## 📞 Documentation Support

**Can't find what you need?**
1. Search existing docs (Cmd/Ctrl+F)
2. Check the index in README.md
3. Review this map for navigation
4. Browse related code files
5. Ask team members
6. Consider adding documentation

**Found a gap?**
1. Document what you learned
2. Add to appropriate section
3. Update this map if needed
4. Share with team

---

## 📝 Maintenance Log

| Date | Action | Documents Affected |
|------|--------|-------------------|
| Oct 2024 | Initial creation | All 5 core documents |
| Oct 2024 | Added multiplayer docs | project_architecture.md, database_schema.md |

---

**Documentation Status**: ✅ **Complete & Current**

*This map will be updated as documentation evolves.*
