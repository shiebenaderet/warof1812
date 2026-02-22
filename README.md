# War of 1812: Rise of the Nation

**Version 1.0.0** — Classroom-Ready Educational Strategy Game

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
- **Victory Conditions**: 50 points or last faction standing

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

## 🆕 Phase 2C Features (v1.0.0)

### User Experience
- ✅ **Victory Progress Bar** — Always visible, color-coded progress toward 50 points
- ✅ **Confirm Dialogs** — Preview troop placements before committing
- ✅ **Undo Button** — Revert last action within same phase
- ✅ **Auto-Save** — Game state saved every phase change (~30-60 seconds)
- ✅ **Error Recovery** — Crashes show "Restore Last Save" instead of losing progress
- ✅ **Export/Import Saves** — Download JSON backup files

### Visual Improvements
- ✅ **Zoom-based font scaling** — Territory labels resize dynamically (10px to 17px)
- ✅ **Brighter territory colors** — Accessibility-optimized (#2d6fd6, #e63946, #b8864e)
- ✅ **Better visual hierarchy** — Larger fort icons, visible victory points
- ✅ **Mobile responsive** — Tested on tablets and Chromebooks

### AI Enhancements
- ✅ **Force concentration** — AI puts 60% of reinforcements on top priority
- ✅ **Risk assessment** — AI avoids attacks with <40% win probability
- ✅ **Win probability model** — Considers troop ratios and bonuses

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

**📄 Teacher Quick Start Guide:** See `/docs/TEACHER_QUICK_START.md` (coming in Phase 3A)

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
| **1.0.0** | Feb 2026 | **Phase 2C Complete**: Victory progress indicators, confirm dialogs, error recovery, required knowledge checks, women's history expansion. Ready for classroom pilot testing. |
| **0.3.0** | Feb 2026 | **Phase 2B**: Zoom-based font scaling, brighter map colors, visual hierarchy improvements, AI force concentration, AI risk assessment, African American history (3 questions). |
| **0.2.0** | Jan 2026 | Leaflet geographic map, auto-fit zoom, brighter faction colors, compact 6x5 grid, Red Eagle leader. |
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

**Current Status**: ✅ Phase 3A Complete — Ready for Phase 3B Pilot Deployment

**Next Milestone**: Phase 3B Classroom Pilot (Target: March 2026)

See [CHANGELOG.md](./CHANGELOG.md) for complete version history.
