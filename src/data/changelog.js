/**
 * Version & Changelog for War of 1812: Rise of the Nation
 */

export const CURRENT_VERSION = '1.6.0';

export const changelog = [
  {
    version: '1.6.0',
    date: '2026-02-25',
    title: 'Content Expansion',
    changes: [
      '25 new knowledge check questions covering Canadian defense, frontier warfare, economic impacts, and diverse perspectives',
      '12 new event cards including Chateauguay, River Raisin, Beaver Dams, Colonial Marines, and more',
      '2 new leaders: Charles de Salaberry (British) and Black Hawk (Native) — now 4 US / 5 British / 4 Native',
      'New biographical profile for Charles de Salaberry with primary sources',
      'Expanded round coverage for mid-war (rounds 4-8) and late-war (rounds 8-12) content gaps',
    ],
  },
  {
    version: '1.5.0',
    date: '2026-02-25',
    title: 'Onboarding Redesign & AI Difficulty',
    changes: [
      'New guided onboarding flow: Name → Difficulty → Learning → Quiz → Faction',
      'AI difficulty levels: Learning (Easy), Balanced (Medium), Commander (Hard)',
      'Pre-game quiz gate with 8 comprehension questions (retry until correct)',
      'Explorer/Historian mode moved to difficulty selection screen',
      'Teacher-controlled learning skip via ?skip=learning URL parameter',
      'Difficulty tracked in Supabase and shown on Teacher Dashboard',
    ],
  },
  {
    version: '1.4.1',
    date: '2026-02-24',
    title: 'Reading Improvements',
    changes: [
      'Bold text (**markdown**) now renders properly instead of showing asterisks',
      'Explorer Mode: larger text, more spacing, and max-width for readability on Chromebooks',
      'Inline vocabulary terms with tap-to-reveal definitions in Explorer Mode',
      'Key Idea callout box at top of each Learning Mode section (Explorer only)',
      'Did You Know moved above Key Terms in Explorer Mode for better flow',
      'Section 9 (Diverse Experiences) split into sub-sections with headers',
      'IntroScreen shows simplified text in Explorer Mode',
      'Tutorial shows simplified descriptions in Explorer Mode',
    ],
  },
  {
    version: '1.4.0',
    date: '2026-02-24',
    title: 'Accessibility & Inclusion',
    changes: [
      'Added Explorer Mode — simplified 3rd-grade reading level for IEP and multilingual learner students',
      'Explorer Mode toggle on faction select screen (gameplay stays identical, only text changes)',
      'Simplified text for all 43 knowledge check questions, 29 event cards, and 10 learning mode sections',
      'Added OpenDyslexic font toggle for dyslexic-friendly reading (persists across sessions)',
      'Font toggle available on both faction select and in-game header',
    ],
  },
  {
    version: '1.3.0',
    date: '2026-02-24',
    title: 'Pedagogical Improvements',
    changes: [
      'Added "People of 1812" profiles with biographies, primary sources, and diverse perspectives',
      'Added "What Came Next" post-game section connecting the war to later American history',
      'Enhanced Learning Mode with cause/effect analysis, primary source excerpts, and geographic context',
      'Expanded required knowledge checks to ensure diverse perspectives (women, African Americans, Native peoples)',
      'Added Teacher Guide page with standards alignment, facilitation tips, and assessment ideas',
      'Expanded Teacher Dashboard with game guide summary',
      'Added 3 new knowledge check questions on enslaved people, broken treaty promises, and Dolley Madison\'s political role',
      'Added 2 new Learning Mode sections: Diverse Experiences and Geography of the War',
    ],
  },
  {
    version: '1.2.0',
    date: '2025-01-15',
    title: 'War Room Cartography',
    changes: [
      'Complete visual redesign with War Room Cartography theme',
      'AI Turn Replay panel with map highlighting',
      'Leaderboard with Supabase backend and victory badges',
      'Tutorial system with step-by-step guidance',
      'Glossary panel with key vocabulary terms',
      'Victory progress tracker',
      'Sound effects and background music',
    ],
  },
  {
    version: '1.1.0',
    date: '2024-11-01',
    title: 'Knowledge & Assessment',
    changes: [
      'Knowledge check questions with historical explanations',
      'Quiz review panel showing past answers',
      'Score submission and leaderboard preview',
      'Teacher Dashboard with class analytics',
      'Save/load game system with export/import',
    ],
  },
  {
    version: '1.0.0',
    date: '2024-09-01',
    title: 'Initial Release',
    changes: [
      'Three playable factions: United States, British/Canada, Native Coalition',
      'Interactive Leaflet map with 30 territories',
      'Turn-based gameplay with 5 phases per round',
      'AI opponent with strategic decision-making',
      'Historical event cards tied to real war timeline',
      'Leader abilities and combat system',
      'Victory conditions: domination, elimination, treaty',
    ],
  },
];
