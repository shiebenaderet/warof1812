# War of 1812: Rise of the Nation

**Version 1.2.0** — Classroom-Ready Educational Strategy Game

[![Deploy to GitHub Pages](https://github.com/shiebenaderet/warof1812/actions/workflows/deploy.yml/badge.svg)](https://github.com/shiebenaderet/warof1812/actions/workflows/deploy.yml)

A browser-based educational strategy game for 8th-grade U.S. History classrooms. Players command American, British, or Native Coalition forces across historically accurate theaters of the War of 1812, learning through gameplay and integrated knowledge checks.

**🎮 Play Now:** [https://shiebenaderet.github.io/warof1812](https://shiebenaderet.github.io/warof1812)

---

## 🎯 Educational Features

### Historical Content
- **53 Knowledge Check Questions** covering causes, battles, leaders, and consequences
- **9 Required Questions** ensure all students learn core content
- **African American History**: 3 questions on Naval service, Colonial Marines, Battle of New Orleans
- **Women's History**: 7 questions on home front, manufacturing, Native women, flagmaking
- **Multiple Perspectives**: U.S., British/Canadian, and Native Coalition viewpoints
- **Event Cards** with historical context, quiz questions, and game effects

### Learning Mechanics
- **Intro Screen** with faction-specific historical context for 8th graders
- **Round-based timeline** (12 rounds = 1812-1815)
- **Knowledge rewards** for correct answers (+troops or +nationalism)
- **Turn Journal** documenting major events
- **Battle Statistics** tracking student performance

---

## 🎲 Gameplay Features

### Strategic Depth
- **Geographic Map** using Leaflet.js with real lat/lng coordinates
- **Four Theaters**: Great Lakes, Chesapeake, Southern, Maritime
- **Faction-Specific Mechanics**:
  - **U.S.**: Nationalism meter boosts score
  - **British**: Naval superiority on coastal territories
  - **Native Coalition**: Early-war guerrilla bonus
- **Leader Cards** with unique abilities (Perry, Jackson, Tecumseh, Brock, etc.)
- **Victory Conditions**: Domination (75%+ territories), elimination, or treaty (12 rounds)

### Turn Phases
1. **Event** — Historical event card with knowledge check
2. **Allocate** — Deploy reinforcement troops
3. **Battle** — Attack adjacent territories (Risk-style dice combat)
4. **Maneuver** — Reposition forces
5. **Score** — Calculate victory points

### Game Balance
- **Combat bonus cap** (+2 max) prevents stacking exploits
- **First strike** deals fixed 1 damage (not auto-win)
- **50-point victory** provides alternate win condition
- **Faction multipliers** reward strategic play
- **AI difficulty** uses force concentration and risk assessment

---

## 🆕 Latest Features (v1.2.0)

### War Room Cartography Design
- ✅ **Complete visual overhaul** — Playfair Display, Crimson Text, war-ink/war-navy/war-gold palette
- ✅ **Historian's Analysis** — Dynamic endscreen commentary based on game outcome
- ✅ **SVG favicon** — Themed "18" icon

### Leaderboard System
- ✅ **Landing page preview** — Top-5 "Hall of Commanders" with medals and faction icons
- ✅ **Full leaderboard modal** — Filterable by class period and faction
- ✅ **Victory badges** — DOM/TRT/ELM badges showing how each game ended
- ✅ **Duplicate prevention** — Client-side fingerprint dedup

### Victory & Endgame
- ✅ **Three victory types** — Domination (75%+ territories), elimination, treaty
- ✅ **Historical comparison engine** — Faction-specific analysis of your campaign

### AI Turn Replay
- ✅ **Bottom panel replay** — See AI actions without losing sight of the map
- ✅ **Territory highlighting** — Pulsing orange polygons show where AI is acting

### Core Features (v1.0-1.1)
- ✅ **Victory Progress Bar** — Always visible, color-coded progress
- ✅ **Confirm Dialogs** — Preview troop placements before committing
- ✅ **Undo Button** — Revert last action within same phase
- ✅ **Auto-Save + Export/Import** — Game state saved every phase change
- ✅ **Error Recovery** — Crashes show "Restore Last Save"
- ✅ **Pre-Game Learning Mode** — Interactive timeline teaching War of 1812 history
- ✅ **AI Force Concentration + Risk Assessment** — Smarter opponents

---

## 🏫 For Teachers

### Classroom Integration
- **45-minute sessions**: Students typically complete 8-12 rounds per class period
- **Learning objectives**: Aligned with 8th-grade U.S. History standards (NCSS, C3 Framework)
- **Assessment ready**: Knowledge check scores track student comprehension
- **Discussion prompts**: Journal entries provide basis for class conversations

### Setup Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for initial load (runs offline after caching)
- Devices: Desktop, laptop, tablet, or Chromebook
- No installation required (runs entirely in browser)

### Teacher Dashboard
- View class leaderboard
- Export student scores
- Monitor knowledge check performance
- Track game completion rates

**📄 Teacher Quick Start Guide:** See [`/docs/TEACHER_QUICK_START.md`](./docs/TEACHER_QUICK_START.md)

---

## 🛠️ Tech Stack

- **Frontend**: React 19.2.4
- **Maps**: Leaflet.js 1.9.4 + react-leaflet 5.0.0
- **Styling**: Tailwind CSS 3.4.19
- **Backend**: Supabase (leaderboard, score submission)
- **Deployment**: GitHub Pages + GitHub Actions CI/CD
- **Build Tool**: Create React App 5.0.1

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/shiebenaderet/warof1812.git
cd warof1812

# Install dependencies
npm install

# Start development server
npm start
```

Opens at http://localhost:3000

### Build for Production

```bash
# Create optimized build
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

## 📚 Documentation

- **[Teacher Quick Start Guide](./docs/TEACHER_QUICK_START.md)** — Setup and facilitation guide
- **[QA Testing Report](./docs/PHASE_3A_QA_REPORT.md)** — Production readiness validation
- **[Error Recovery Testing](./docs/ERROR_RECOVERY_TESTING.md)** — QA test scenarios
- **[Implementation Guide](./docs/PHASE_2C_PRIORITY_3_IMPLEMENTATION.md)** — Technical details
- **[Changelog](./CHANGELOG.md)** — Complete version history and release notes

---

## 🗺️ Version History

| Version | Date | Changes |
|---------|------|---------|
| **1.2.0** | Feb 2026 | **War Room Cartography**: Complete design overhaul, victory conditions (domination/elimination/treaty), historian's analysis, leaderboard preview + full modal, AI turn replay bottom panel with map highlighting, 10 bug fixes. |
| **1.1.0** | Feb 2026 | **Learning Mode**: Pre-game interactive timeline, guided notes, critical reinforcement bug fix. |
| **1.0.0** | Feb 2026 | **Phase 2C**: Victory progress, confirm dialogs, error recovery, required knowledge checks, women's history. |
| **0.3.0** | Feb 2026 | **Phase 2B**: Zoom-based font scaling, brighter colors, AI improvements, African American history. |
| **0.2.0** | Jan 2026 | Leaflet geographic map, auto-fit zoom, brighter faction colors. |
| **0.1.0** | Jan 2026 | Initial release — hexagonal map, event card quizzes, tutorial, Supabase leaderboard. |

---

## 🤝 Contributing

This is an educational project for 8th-grade classrooms. Contributions welcome for:
- Historical accuracy improvements
- Accessibility enhancements
- Bug fixes
- Additional knowledge check questions
- Lesson plan materials

Please open an issue before submitting major pull requests.

---

## 📜 License

Educational use only. Not for commercial distribution.

---

## 🙏 Acknowledgments

- **Historical Consultants**: War of 1812 content reviewed by history educators
- **Playtesting**: 8th-grade students at [school name pending]
- **Technology**: Built with React, Leaflet, Tailwind CSS, and Supabase
- **Claude Code**: AI pair programming assistant

---

## 📧 Contact

For classroom implementation questions or bug reports:
- **Issues**: [GitHub Issues](https://github.com/shiebenaderet/warof1812/issues)
- **Email**: [Add contact email]

---

**Current Status**: ✅ v1.2.0 Complete — Ready for Classroom Pilot

**Next Milestone**: Phase 3B Classroom Pilot (Target: March 2026)

See [CHANGELOG.md](./CHANGELOG.md) for complete version history.
