# Changelog

All notable changes to the War of 1812: Rise of the Nation educational game will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-02-23

### Added
- **War Room Cartography Design System**: Complete visual overhaul with Playfair Display, Crimson Text, and IM Fell English fonts; war-ink/war-navy/war-gold/war-copper palette across all components
- **Victory Conditions**: Domination victory (75%+ territories), elimination victory, treaty ending (12 rounds)
- **Historian's Analysis**: Dynamic endscreen commentary engine generating faction-specific historical comparisons based on territory control, battle stats, and game outcome
- **Leaderboard Preview**: Top-5 "Hall of Commanders" widget on the landing page with faction icons, medal rankings, and victory type badges
- **Full Leaderboard Modal**: Filterable by class period and faction, accessible from both landing page and endscreen
- **Victory Type Badges**: DOM/TRT/ELM badges on leaderboard entries showing how each game ended
- **AI Turn Replay**: Compact bottom panel (replaces full-screen modal) showing AI actions with map territory highlighting via pulsing orange polygons
- **SVG Favicon**: War-gold "18" on war-navy background

### Fixed
- **Critical: Endscreen not showing** — `gameOver` status caused App.js to render FactionSelect instead of GameReport
- **Critical: Endscreen header cut off** — Flex centering clipped content above viewport on scroll overflow
- **Tutorial hidden behind map** — z-indexes bumped from 60-62 to 9990-9992 to exceed Leaflet layers (200-800)
- **Duplicate score submissions** — Client-side fingerprint dedup via localStorage
- **NaN troop corruption** — `Number.isFinite()` guards on all troop mutations in mapReducer
- **AI reinforcement infinite loop** — `MAX_ITERATIONS = 200` safety counter + `Number.isFinite()` validation
- **Stale scores after events** — Score recalculation dispatched after event effects modify territory ownership
- **Incomplete save/load** — All 9 reducers now handle `LOAD_*_STATE` actions; full game state restores correctly
- **Tutorial on save load** — Loading a save auto-marks tutorial as completed
- **"Anno Domini" label** — Replaced with "A Strategy Game" on landing page

### Changed
- AI balance overhaul: force concentration, risk assessment, win probability model
- Landing page UX: saved game moved below CTA, improved text contrast, delete confirmation dialog
- `game_over_reason` column added to Supabase `scores` table for victory type tracking
- LeaderboardPreview exports `VictoryBadge` component for reuse in full Leaderboard

## [1.1.0] - 2026-02-22

### Added
- **Pre-Game Learning Mode**: Interactive 8-event timeline teaching War of 1812 history before gameplay
- **Guided Notes Worksheet**: Printable PDF for structured note-taking during learning mode
- "Learn About the War (5 min)" button on faction select screen

### Fixed
- **Critical: Reinforcement placement bug** - Players can now place troops during allocate phase
- Quiz reward/penalty logic now applies to calculated reinforcements instead of stale values
- Reducer race condition fixed by separating ADVANCE_PHASE dispatch timing

### Changed
- Learning mode addresses pedagogical gap: students now learn content before being quizzed
- Version bumped to 1.1.0 to reflect new feature and critical bug fixes

## [1.0.0] - 2026-02-22

### Added - Phase 2C Features
- **Victory Progress Indicators**: Always-visible progress bar showing current score vs. 50-point goal with color coding (white → yellow → green)
- **Confirm Dialogs**: Preview troop placements and maneuvers before committing with keyboard shortcuts (Enter/Esc)
- **Undo Button**: Revert last action within allocate/maneuver phases
- **Error Boundaries**: React error boundaries wrap all major sections (GameBoard, FactionSelect, TeacherDashboard)
- **Auto-Save System**: Game state saved automatically on every phase change (~30-60 seconds)
- **Error Recovery UI**: User-friendly recovery options when crashes occur (Restore/Export/New Game)
- **Export/Import Saves**: Download and upload JSON backup files
- **Required Knowledge Checks**: 9 core questions guaranteed to show all students (war causes, key battles, leaders)
- **Women's History Expansion**: 5 new questions added (Mary Pickersgill, home front, Native women, manufacturing, frontier)

### Added - Phase 3A Deliverables
- **Teacher Quick Start Guide**: 1-page guide with setup, facilitation tips, assessment strategies
- **QA Testing Report**: Comprehensive 25-test validation (23 passed, GO decision for pilot)
- **Error Logging**: Last 10 errors tracked in localStorage for debugging

### Changed
- Knowledge check system now prioritizes unseen required questions
- Women's history coverage increased from 4.2% to 13.2% (3x improvement)
- Total questions expanded to 53 (from 48)
- Documentation reorganized into `/docs` folder

### Removed
- Deleted obsolete SVG map generation scripts (9 files in `/scripts` directory)
- Removed redundant interim documentation (IMPLEMENTATION_COMPLETE.md, ERROR_RECOVERY_FLOW.md)
- Deleted empty `/src/utils` directory

### Fixed
- Combat bonus cap enforced (+2 max) to prevent stacking exploits
- First strike mechanic now deals fixed 1 damage instead of auto-win
- Black Hawk replaced with Red Eagle (historically accurate to War of 1812)

## [0.3.0] - 2026-02-21

### Added - Phase 2B Features
- **Zoom-based Font Scaling**: Territory labels resize dynamically (10px to 17px)
- **Brighter Territory Colors**: Accessibility-optimized colors (#2d6fd6, #e63946, #b8864e)
- **Visual Hierarchy**: Larger fort icons, visible victory points
- **AI Force Concentration**: AI puts 60% of reinforcements on top priority
- **AI Risk Assessment**: AI avoids attacks with <40% win probability
- **African American History**: 3 questions on Naval service, Colonial Marines, Battle of New Orleans

### Changed
- Improved mobile responsiveness (tested on tablets and Chromebooks)
- Enhanced AI win probability model considering troop ratios and bonuses

## [0.2.0] - 2026-01-XX

### Added
- **Leaflet Geographic Map**: Real lat/lng coordinates for all territories
- **Auto-fit Zoom**: Map centers and zooms to show all territories
- **Compact 6x5 Grid Layout**: Better visual organization
- **Red Eagle Leader**: Replaced Black Hawk with historically accurate Creek war chief

### Changed
- Replaced SVG hexagonal map with interactive Leaflet.js map
- Brighter faction colors for better visibility
- Restored territoryGeo.js with real coordinates

### Removed
- MapBackground.jsx (broken background component)
- SVG polygon-based map components

## [0.1.0] - 2026-01-XX

### Added - Initial Release
- **Three Playable Factions**: United States, British/Canada, Native Coalition
- **Event Card System**: Historical events with quiz questions
- **Turn-based Gameplay**: Event → Allocate → Battle → Maneuver → Score phases
- **Leader Cards**: Unique abilities for historical figures (Jackson, Perry, Harrison, Brock, Drummond, Ross, Tecumseh, Tenskwatawa)
- **Knowledge Check Questions**: 48 questions covering War of 1812 content
- **Tutorial System**: Interactive tutorial for new players
- **Supabase Leaderboard**: Score submission and class rankings
- **Teacher Dashboard**: View student scores and performance
- **Turn Journal**: Historical event log
- **Battle Statistics**: Track wins, losses, and performance
- **Hexagonal Map**: SVG-based territory control map
- **Faction-Specific Mechanics**:
  - US: Nationalism meter (score multiplier)
  - British: Naval superiority (+1 die on coastal attacks)
  - Native: Guerrilla warfare bonus (early-war advantage)

### Technical Stack
- React 19.2.4
- Leaflet.js 1.9.4 + react-leaflet 5.0.0
- Tailwind CSS 3.4.19
- Supabase (backend)
- GitHub Pages deployment
- GitHub Actions CI/CD

---

## Release Notes

### Version 1.0.0 - Production Ready
**Status**: ✅ Ready for Phase 3B Pilot Deployment

**Key Achievements**:
- 0 critical bugs (P0/P1)
- 53 knowledge check questions (9 required)
- Comprehensive error recovery system
- Teacher support documentation
- QA validated with GO decision

**Known Issues**:
- 3 medium issues (P2 - non-blocking)
- 4 low severity issues (P3 - future enhancements)

**Next Steps**:
- Deploy to 1-2 pilot classrooms
- Monitor for 2 weeks
- Collect student and teacher feedback
- Iterate based on pilot results

---

## Future Roadmap

### Phase 3B - Classroom Pilot (Target: March 2026)
- Deploy to pilot classrooms
- Gather feedback from students and teachers
- Monitor error logs and performance
- Iterate on UX improvements

### Phase 4 - Full Production (Target: April 2026)
- Cloud backup system (cross-device sync)
- Teacher error dashboard
- Advanced analytics and reporting
- Automated testing suite
- Performance optimizations

---

## Credits

- **Historical Consultants**: War of 1812 content reviewed by history educators
- **Playtesting**: 8th-grade students (pilot pending)
- **Technology**: React, Leaflet, Tailwind CSS, Supabase
- **Development**: Claude Code AI pair programming assistant

---

For detailed technical documentation, see:
- [Teacher Quick Start Guide](./docs/TEACHER_QUICK_START.md)
- [QA Testing Report](./docs/PHASE_3A_QA_REPORT.md)
- [Error Recovery Testing](./docs/ERROR_RECOVERY_TESTING.md)
- [Implementation Guide](./docs/PHASE_2C_PRIORITY_3_IMPLEMENTATION.md)
