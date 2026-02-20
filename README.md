# War of 1812: Rise of the Nation

**Version 0.2.0**

A browser-based educational hex-map strategy game set during the War of 1812. Players command American, British, or Native faction forces across four historically-grounded theaters of operation: the Great Lakes, Chesapeake Bay, the Southern frontier, and the Maritime Atlantic.

## Features

- Hex-grid gameboard with four theaters: Great Lakes, Chesapeake, Southern, Maritime
- Turn-based gameplay: allocate troops, maneuver forces, resolve battles
- Click any territory to see logical neighbors highlighted with a gold outline
- Clearly color-coded terrain: water (blue), mountains (brown-grey), forests (green), naval zones (deep navy)
- Knowledge check questions tied to real historical events and leaders
- Faction-specific starting positions, troop counts, and objectives
- Fort bonuses for defense (+1 die)
- Leaderboard via Supabase
- Zoom and scroll map navigation with gameboard frame

## How to Run

### Prerequisites
- Node.js 18+
- npm

### Install dependencies
```
npm install
```

### Start development server
```
npm start
```
Opens at http://localhost:3000

### Build for production
```
npm run build
```

### Deploy to GitHub Pages
```
npm run deploy
```

## Tech Stack
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) — leaderboard and score submission
- [GitHub Pages](https://pages.github.com/) — hosting

## Version History

| Version | Changes |
|---------|---------|
| **0.2.0** | Smaller hex grid for better US map proportions; neighbor territory outlines on click/hover replace SVG lines; vivid terrain colors (water, mountain, forest); deep navy naval zones; gameboard gold frame |
| **0.1.0** | Initial release — hexagonal map, event card quizzes, tutorial, Supabase leaderboard |
