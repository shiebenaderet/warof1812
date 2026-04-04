# War of 1812: Rise of the Nation

**Version 2.3.0** — Classroom-Ready Educational Strategy Game

[![Deploy to GitHub Pages](https://github.com/shiebenaderet/warof1812/actions/workflows/deploy.yml/badge.svg)](https://github.com/shiebenaderet/warof1812/actions/workflows/deploy.yml)

A browser-based educational strategy game for 8th-grade U.S. History classrooms. Players command American, British, or Native Coalition forces across historically accurate theaters of the War of 1812, learning through gameplay and integrated knowledge checks.

**🎮 Play Now:** [https://1812.mrbsocialstudies.org](https://1812.mrbsocialstudies.org)

---

## 🎯 Educational Features

### Historical Content
- **68 Knowledge Check Questions** covering causes, battles, leaders, and consequences
- **~31 Required Questions** ensuring diverse perspectives (women, African Americans, Native peoples)
- **African American History**: Questions on Naval service, Colonial Marines, Battle of New Orleans, enslaved people seeking freedom
- **Women's History**: Questions on home front, manufacturing, Native women, flagmaking, Dolley Madison's political role
- **Native Perspectives**: Questions on Tecumseh's confederacy, Creek War, broken treaty promises, post-war displacement
- **Event Cards** with historical context, quiz questions, and game effects

### People of 1812
- **20 Biographical Profiles** with primary source quotes and "Did You Know?" facts
- **13 Game Leaders** enriched with full biographies (Jackson, Perry, Tecumseh, Brock, de Salaberry, Black Hawk, etc.)
- **7 Additional Voices**: Dolley Madison, Mary Pickersgill, Charles Ball, Laura Secord, Jean Lafitte, John Norton, Creek Women (composite)
- **People Gallery** — Full-page browsable gallery with faction filters
- **People Panel** — In-game sidebar panel with expandable bios and quotes

### Learning Mechanics
- **Pre-Game Learning Mode** — 10-section interactive timeline with cause/effect analysis, primary source excerpts, geographic context, and sequencing/matching activities
- **"What Came Next"** — Post-game section connecting the war to the Era of Good Feelings, Indian Removal, Manifest Destiny
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

## 🆕 Latest Features (v2.2.1)

### v2.2.1 — Delete Classes & Version Display
- ✅ **Delete Classes** — Teachers can delete classes (student data preserved as unassigned)
- ✅ **Version Display** — Version number visible on landing page, teacher dashboard, and teacher guide

### Student Management & Leaderboard Moderation
- ✅ **Hide Scores** — Teachers can hide inappropriate or test scores from the public leaderboard
- ✅ **Rename Students** — Inline rename with display_name override (original name preserved)
- ✅ **Move Students** — Reassign students between classes or mark as unassigned
- ✅ **Merge Duplicates** — Auto-detect and merge duplicate student entries, consolidating all game data
- ✅ **Manage Students Section** — New dashboard section with student table, rename, move, and merge controls

### v2.1.0 — Firebase Migration
- ✅ **Google Sign-In** — One-click teacher authentication (no more magic links or passwords)
- ✅ **Firebase Backend** — Migrated from Supabase to Firebase for always-on reliability (no more pausing after inactivity)
- ✅ **Firestore** — All data stored in Cloud Firestore (scores, quiz results, classes, teacher profiles)
- ✅ **Teacher Dashboard Link** — Direct link on landing page for easy teacher access

### v2.0.0 — Class Code System
- ✅ **Teacher Accounts** — Google Sign-In authentication
- ✅ **Class Management** — Teachers create classes with shareable 6-character codes
- ✅ **Student Linking** — Students enter class code during onboarding or via direct link (`?class=CODE`)
- ✅ **Isolated Dashboards** — Each teacher sees only their own students' data
- ✅ **Late Join** — Students who forgot a code can enter it at score submission (retroactively links all data)
- ✅ **Scoped Analytics** — Quiz gate data and game scores filtered by class for teacher analytics
- ✅ **Global Leaderboard** — Unchanged; all students still appear regardless of class

### v1.7.0 — Quiz Gate Analytics
- ✅ **Pre-Game Quiz Tracking** — Retry attempts per question tracked in Firestore
- ✅ **Teacher Dashboard Analytics** — Per-question breakdown with expandable student detail
- ✅ **Quiz Gate CSV Export** — Export quiz gate data for offline analysis

### v1.6.0 — Content Expansion
- ✅ **25 New Knowledge Checks** — Canadian defense, frontier warfare, economic impacts, Colonial Marines, and diverse perspectives
- ✅ **12 New Event Cards** — Chateauguay, Crysler's Farm, River Raisin, Beaver Dams, Colonial Marines, Fort Meigs, and more
- ✅ **2 New Leaders** — Charles de Salaberry (British, +1 defense in Great Lakes) and Black Hawk (Native, +1 attack in Great Lakes)
- ✅ **New Profile** — De Salaberry biographical profile with primary sources and "Did You Know?"
- ✅ **Expanded Coverage** — Better content for mid-war (rounds 4-8) and late-war (rounds 8-12) periods
- ✅ **Leader Balance** — Now 4 US / 5 British / 4 Native leaders (was 4/4/3)

### v1.5.0 — Onboarding Redesign & AI Difficulty
- ✅ **Guided Onboarding Flow** — 5-step guided experience: Name → Difficulty → Learning → Quiz → Faction
- ✅ **AI Difficulty Levels** — Learning (Easy), Balanced (Medium), Commander (Hard) with distinct AI behavior
- ✅ **Pre-Game Quiz Gate** — 8 comprehension questions with retry-until-correct and Explorer Mode variants
- ✅ **Dedicated Name Entry** — Commander name + class period on focused first screen with saved game access
- ✅ **Difficulty Selection** — AI difficulty cards + Explorer/Historian reading level toggle
- ✅ **Teacher Skip Control** — `?skip=learning` URL parameter bypasses Learning Mode + Quiz Gate
- ✅ **Difficulty Tracking** — Displayed on Teacher Dashboard with CSV export

### v1.4.1 — Reading Improvements
- ✅ **Bold Text Rendering** — Markdown `**bold**` now renders as proper bold text instead of showing asterisks
- ✅ **Explorer Mode Sizing** — Larger text, more paragraph spacing, and max-width for readability on Chromebooks
- ✅ **Inline Vocabulary** — Tap vocab terms in Explorer Mode to see definitions in a tooltip
- ✅ **Key Idea Callouts** — Single-sentence takeaway at top of each Learning Mode section (Explorer only)
- ✅ **Improved Content Flow** — Did You Know moved above Key Terms in Explorer Mode
- ✅ **Section 9 Sub-sections** — Diverse Experiences split into African Americans, Women, Native Americans, Privateers
- ✅ **IntroScreen Explorer Mode** — Simplified campaign briefing text for Explorer Mode students
- ✅ **Tutorial Explorer Mode** — Simplified tutorial descriptions for Explorer Mode students

### v1.4.0 — Accessibility & Inclusion
- ✅ **Explorer Mode** — Simplified 3rd-grade reading level for IEP and multilingual learner students
- ✅ **Same Gameplay** — All 5 phases, 12 rounds, same AI — only text changes in Explorer Mode
- ✅ **Simplified Content** — All knowledge checks, event cards, and 10 learning sections rewritten at 3rd-grade level
- ✅ **OpenDyslexic Font Toggle** — Dyslexic-friendly font available on faction select and in-game header
- ✅ **Persistent Preferences** — Font choice saved in localStorage, independent of game saves

### v1.3.0 — Pedagogical Improvements
- ✅ **People of 1812** — 19 biographical profiles with primary sources, diverse perspectives
- ✅ **People Gallery** — Full-page browsable gallery accessible from main menu
- ✅ **People Panel** — In-game sidebar panel with expandable bios and quotes
- ✅ **"What Came Next"** — Post-game section linking the war to later American history
- ✅ **Enhanced Learning Mode** — Cause/effect analysis, primary source excerpts, geographic context, interactive activities
- ✅ **2 New Learning Sections** — "Diverse Experiences" and "Geography of the War"
- ✅ **Diverse Knowledge Checks** — 7 questions promoted to required, 3 new questions added
- ✅ **Teacher Guide** — Full page at `#guide` with C3 standards alignment, facilitation tips, assessment ideas
- ✅ **Teacher Dashboard** — Expanded with "Game Guide" summary section
- ✅ **Versioning** — In-app changelog with "What's New" UI

### v1.2.0 — War Room Cartography
- ✅ **Complete visual overhaul** — Playfair Display, Crimson Text, war-ink/war-navy/war-gold palette
- ✅ **Historian's Analysis** — Dynamic endscreen commentary based on game outcome
- ✅ **Leaderboard system** — Landing page preview, full modal, victory badges, dedup
- ✅ **Three victory types** — Domination (75%+ territories), elimination, treaty
- ✅ **AI Turn Replay** — Bottom panel with pulsing territory highlights

### v1.0–1.1 — Core Features
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
- **Learning objectives**: Aligned with 8th-grade U.S. History standards (C3 Framework)
- **Assessment ready**: Knowledge check scores track student comprehension
- **Discussion prompts**: Journal entries and "What Came Next" provide basis for class conversations
- **Diverse perspectives**: Required questions ensure exposure to women's, African American, and Native perspectives

### Setup Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for initial load (runs offline after caching)
- Devices: Desktop, laptop, tablet, or Chromebook
- No installation required (runs entirely in browser)

### Teacher Resources
- **Teacher Guide** (`#guide`) — C3 standards alignment, facilitation tips, assessment ideas, discussion questions, FAQ
- **Teacher Dashboard** (`#teacher`) — Sign in with Google, create classes with shareable codes, class-scoped analytics, score export, quiz gate analytics

**📄 Teacher Quick Start Guide:** See [`/docs/TEACHER_QUICK_START.md`](./docs/TEACHER_QUICK_START.md)

---

## 🛠️ Tech Stack

- **Frontend**: React 19.2.4
- **Maps**: Leaflet.js 1.9.4 + react-leaflet 5.0.0
- **Styling**: Tailwind CSS 3.4.19
- **Backend**: Firebase (Google Auth, Firestore for leaderboard, class management, quiz gate analytics)
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

- **[Teacher Quick Start Guide](./docs/TEACHER_QUICK_START.md)** — Setup, class codes, and facilitation guide

---

## 🗺️ Version History

| Version | Date | Changes |
|---------|------|---------|
| **2.2.1** | Mar 2026 | **Delete Classes & Version Display**: Delete classes with data preservation, version number on all pages. |
| **2.2.0** | Mar 2026 | **Student Management & Leaderboard Moderation**: Hide scores from leaderboard, inline student rename, move between classes, merge duplicate entries, new Manage Students dashboard section. |
| **2.1.0** | Mar 2026 | **Firebase Migration**: Google Sign-In for teachers, migrated from Supabase to Firebase (always-on free tier), Firestore for all data, teacher dashboard link on landing page. |
| **2.0.0** | Feb 2026 | **Class Code System**: Teacher accounts, class management with shareable codes, student linking via code or direct URL, isolated teacher dashboards, late-join support, scoped analytics. |
| **1.7.0** | Feb 2026 | **Quiz Gate Analytics**: Pre-game quiz retry tracking, Teacher Dashboard analytics section with per-question breakdown and expandable student detail, Quiz Gate CSV export, session ID linking for future cross-analysis. |
| **1.6.0** | Feb 2026 | **Content Expansion**: 25 new knowledge checks, 12 new event cards, 2 new leaders (de Salaberry, Black Hawk), expanded mid-war and late-war content coverage, new biographical profile. |
| **1.5.0** | Feb 2026 | **Onboarding Redesign & AI Difficulty**: 5-step guided onboarding flow, AI difficulty levels (Easy/Medium/Hard), pre-game quiz gate with 8 questions, teacher-controlled learning skip, difficulty tracking. |
| **1.4.1** | Feb 2026 | **Reading Improvements**: Bold text rendering, larger Explorer Mode text, inline vocabulary tooltips, Key Idea callouts, IntroScreen/Tutorial Explorer variants, Section 9 sub-sections. |
| **1.4.0** | Feb 2026 | **Accessibility & Inclusion**: Explorer Mode (3rd-grade reading level for IEP/ML students), OpenDyslexic font toggle, simplified text for all 43 knowledge checks, 29 event cards, 10 learning sections. |
| **1.3.0** | Feb 2026 | **Pedagogical Improvements**: People of 1812 profiles (19 bios with primary sources), What Came Next post-game section, enhanced Learning Mode (cause/effect, geography, activities), Teacher Guide page, expanded knowledge checks for diverse perspectives, versioning system. |
| **1.2.0** | Feb 2026 | **War Room Cartography**: Complete design overhaul, victory conditions (domination/elimination/treaty), historian's analysis, leaderboard preview + full modal, AI turn replay bottom panel with map highlighting, 10 bug fixes. |
| **1.1.0** | Feb 2026 | **Learning Mode**: Pre-game interactive timeline, guided notes, critical reinforcement bug fix. |
| **1.0.0** | Feb 2026 | **Phase 2C**: Victory progress, confirm dialogs, error recovery, required knowledge checks, women's history. |
| **0.3.0** | Feb 2026 | **Phase 2B**: Zoom-based font scaling, brighter colors, AI improvements, African American history. |
| **0.2.0** | Jan 2026 | Leaflet geographic map, auto-fit zoom, brighter faction colors. |
| **0.1.0** | Jan 2026 | Initial release — hexagonal map, event card quizzes, tutorial, leaderboard. |

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
- **Technology**: Built with React, Leaflet, Tailwind CSS, and Firebase
- **Claude Code**: AI pair programming assistant

---

## 📧 Contact

For classroom implementation questions or bug reports:
- **Issues**: [GitHub Issues](https://github.com/shiebenaderet/warof1812/issues)
- **Email**: [Add contact email]

---

**Current Status**: ✅ v2.2.1 Complete — Ready for Classroom Pilot

**Next Milestone**: Classroom Pilot (Target: March 2026)
