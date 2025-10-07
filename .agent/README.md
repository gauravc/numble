# Numble Documentation Index

Welcome to the Numble project documentation! This folder contains comprehensive documentation to help you understand, develop, and maintain the Numble codebase.

---

## 📁 Documentation Structure

```
.agent/
├── README.md           # This file - documentation index
├── system/             # System architecture & design docs
├── tasks/              # PRDs & implementation plans
└── sop/                # Standard operating procedures
```

---

## 🎯 Quick Start

### For New Engineers
1. Start with [Project Architecture](system/project_architecture.md) for high-level overview
2. Review [Database Schema](system/database_schema.md) to understand data structures
3. Read [Core Algorithms](system/core_algorithms.md) for game logic details

### For Feature Development
1. Check `tasks/` folder for existing feature PRDs
2. Follow SOPs in `sop/` folder for implementation patterns
3. Update documentation after completing features

### For Bug Fixes
1. Understand the relevant system component from `system/` docs
2. Follow debugging procedures in SOPs
3. Document any architectural learnings

---

## 📚 System Documentation

Located in `.agent/system/`

### [Project Architecture](system/project_architecture.md)
Comprehensive overview of the Numble project including:
- Technology stack (Next.js, TypeScript, Tailwind, Redis)
- Project structure and file organization
- Core features and gameplay mechanics
- Component hierarchy and data flow
- Performance considerations
- Deployment configuration

**Read this first** to understand the overall system design.

### [Database Schema](system/database_schema.md)
Complete reference for all data storage including:
- localStorage schema (game state, statistics, settings)
- Redis schema (multiplayer sessions)
- Storage keys and data formats
- TTL (Time To Live) policies
- Data migration strategies
- Privacy and compliance considerations

**Essential** for working with data persistence.

### [Core Algorithms](system/core_algorithms.md)
Detailed explanation of key algorithms:
- Puzzle generation (seeded RNG, deterministic daily puzzles)
- Feedback generation (two-pass color-coding algorithm)
- Validation (format and mathematical correctness)
- Statistics tracking and updates
- Keyboard feedback aggregation
- Hard mode constraints
- Share text generation

**Critical** for understanding game logic and mechanics.

---

## 📋 Tasks & Features

Located in `.agent/tasks/`

This folder contains:
- **Product Requirements Documents (PRDs)**: Detailed feature specifications
- **Implementation Plans**: Step-by-step guides for building features
- **Technical Designs**: Architecture decisions for complex features

### How to Use
1. Before starting a new feature, create a PRD in this folder
2. Document implementation approach and technical decisions
3. Update after completion with lessons learned

### Format
```
.agent/tasks/
├── feature_name_prd.md
├── feature_name_implementation.md
└── feature_name_retrospective.md
```

---

## 🔧 Standard Operating Procedures (SOPs)

Located in `.agent/sop/`

Best practices and procedures for common development tasks:
- Adding new features
- Making database schema changes
- Writing tests
- Deploying to production
- Debugging common issues
- Performance optimization
- Code review guidelines

### How to Use
1. Reference SOPs before starting work
2. Add new SOPs when you discover repeatable patterns
3. Update SOPs when processes change

---

## 🗂️ Quick Reference

### Key Files by Use Case

**Understanding the Game**
- [Project Architecture](system/project_architecture.md) → High-level overview
- [Core Algorithms](system/core_algorithms.md) → Game mechanics

**Working with Data**
- [Database Schema](system/database_schema.md) → All storage formats
- See `lib/storage.ts` for localStorage utilities
- See `lib/multiplayerStorage.ts` for Redis operations

**Building UI Components**
- [Project Architecture](system/project_architecture.md) → Component hierarchy
- See `components/` folder in project root
- Follow React and Next.js best practices

**API Development**
- [Database Schema](system/database_schema.md) → Session data structures
- See `app/api/multiplayer/` for existing endpoints
- Follow Next.js API route patterns

**Game Logic**
- [Core Algorithms](system/core_algorithms.md) → All game algorithms
- See `lib/game.ts` for statistics and utilities
- See `lib/puzzle.ts` for puzzle generation
- See `lib/validation.ts` for feedback logic

---

## 📖 Documentation Standards

### When to Update Documentation

**Always update when:**
- Adding new features
- Changing data schemas
- Modifying core algorithms
- Adding API endpoints
- Changing deployment processes

**How to update:**
1. Edit relevant markdown files in `.agent/`
2. Keep documentation concise but complete
3. Include code examples where helpful
4. Update this README if adding new docs

### Documentation Style

- Use clear, concise language
- Include code examples
- Add diagrams for complex flows (Mermaid, ASCII art)
- Link related documents
- Keep formatting consistent

---

## 🔗 External Resources

### Technology Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Redis Documentation](https://redis.io/docs/)

### Project Resources
- [Product Requirements Document](../numble_prd.md) → Original PRD (root folder)
- [GitHub Repository](https://github.com/your-repo/numble) → Source code
- [Deployment Dashboard](https://vercel.com) → Production environment

---

## 📝 Quick Links

| Topic | Document | Location |
|-------|----------|----------|
| **Overview** | Project Architecture | `system/project_architecture.md` |
| **Data Storage** | Database Schema | `system/database_schema.md` |
| **Game Logic** | Core Algorithms | `system/core_algorithms.md` |
| **Type Definitions** | TypeScript Types | `../types/index.ts` |
| **Components** | React Components | `../components/` |
| **Game Logic** | Library Functions | `../lib/` |
| **API Routes** | Multiplayer APIs | `../app/api/multiplayer/` |
| **Original PRD** | Product Requirements | `../numble_prd.md` |

---

## 🚀 Development Workflow

### Typical Feature Development Flow

1. **Plan**
   - Read relevant system documentation
   - Create PRD in `tasks/` folder
   - Design technical approach

2. **Implement**
   - Follow coding standards
   - Reference SOPs for patterns
   - Write tests alongside code

3. **Test**
   - Unit tests for logic
   - Integration tests for flows
   - Manual testing across devices

4. **Document**
   - Update system docs if needed
   - Add/update SOPs for new patterns
   - Document in code comments

5. **Deploy**
   - Follow deployment SOP
   - Monitor for issues
   - Update changelog

---

## 🎓 Learning Path

### For Frontend Developers
1. [Project Architecture](system/project_architecture.md) → UI component structure
2. Review `components/` folder → React component patterns
3. Study `app/page.tsx` → Main game flow
4. Understand Tailwind config → Styling patterns

### For Backend Developers
1. [Database Schema](system/database_schema.md) → Data structures
2. Review `app/api/multiplayer/` → API patterns
3. Study `lib/multiplayerStorage.ts` → Redis operations
4. Understand session management → TTL and expiration

### For Game Logic Developers
1. [Core Algorithms](system/core_algorithms.md) → All algorithms
2. Study `lib/puzzle.ts` → Puzzle generation
3. Review `lib/validation.ts` → Feedback logic
4. Understand `lib/game.ts` → Statistics and utilities

---

## 🤝 Contributing to Documentation

### Adding New Documentation

1. Determine appropriate folder:
   - `system/` → Architecture, design, technical specs
   - `tasks/` → Feature PRDs, implementation plans
   - `sop/` → Procedures, best practices

2. Create markdown file with clear naming:
   - Use snake_case: `feature_name.md`
   - Be descriptive: `multiplayer_session_management.md`

3. Follow template structure:
   ```markdown
   # Title

   ## Overview
   Brief description

   ## Details
   Main content

   ## Examples
   Code samples

   ## Related Documentation
   Links to other docs
   ```

4. Update this README:
   - Add to relevant section
   - Update quick reference table
   - Add to learning paths if applicable

### Maintaining Documentation

- Review quarterly for accuracy
- Update when features change
- Remove obsolete documentation
- Keep examples current

---

## 📧 Questions?

If you can't find what you're looking for:
1. Check the relevant system doc
2. Search codebase for examples
3. Review related PRD in tasks folder
4. Consult team members
5. Consider adding documentation if info is missing

---

## 📊 Documentation Health

**Last Major Update**: October 2024
**Current Status**: ✅ Complete
**Coverage**:
- ✅ System Architecture
- ✅ Database Schema
- ✅ Core Algorithms
- ⚠️ SOPs (to be added as patterns emerge)
- ⚠️ Task PRDs (to be added per feature)

**Maintenance Schedule**:
- Review after each major feature
- Update with breaking changes immediately
- Quarterly comprehensive review

---

## 🎯 Documentation Goals

1. **Onboarding**: New engineers productive within 1 day
2. **Reference**: Quick lookup for any system component
3. **Maintenance**: Clear patterns for common tasks
4. **Knowledge**: Preserve architectural decisions
5. **Compliance**: Track system evolution over time

---

**Happy coding! 🚀**

*This documentation is maintained by the Numble development team.*
