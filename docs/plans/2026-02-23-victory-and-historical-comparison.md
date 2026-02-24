# Victory Conditions + Historical Comparison Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add domination victory (symmetric for all factions), a historian's analysis comparing the player's game to real 1812 history, and adapt the endscreen to the game-end reason.

**Architecture:** Domination check is a pure function called after player attacks and after AI turns. Historical analysis is a static data module with a template engine that generates paragraphs based on final game state. GameReport receives new props for game-end reason and renders the analysis section.

**Tech Stack:** React 19, existing reducer architecture, pure JS data modules.

---

### Task 1: Enrich GAME_OVER Payload

**Files:**
- Modify: `src/reducers/gameReducer.js:68-73`
- Modify: `src/hooks/useGameStateV2.js` (return block ~line 1309)

**Step 1: Update gameReducer to store structured game-over data**

In `src/reducers/gameReducer.js`, change the `GAME_OVER` case to store reason/winner:

```js
case GAME_OVER:
  return {
    ...state,
    status: 'game_over',
    message: typeof action.payload === 'string'
      ? action.payload
      : action.payload?.message || 'The War of 1812 has ended.',
    gameOverReason: action.payload?.reason || 'treaty',
    gameOverWinner: action.payload?.winner || null,
  };
```

Also add `gameOverReason: null` and `gameOverWinner: null` to `getInitialGameState()`.

**Step 2: Expose new fields from useGameStateV2**

In the return block of `useGameStateV2.js`, add:

```js
gameOverReason: gameState.gameOverReason,
gameOverWinner: gameState.gameOverWinner,
```

**Step 3: Build and verify**

Run: `npx react-scripts build`
Expected: Compiles clean. No behavior change yet.

**Step 4: Commit**

```
feat: enrich GAME_OVER payload with reason and winner
```

---

### Task 2: Add Domination Check

**Files:**
- Modify: `src/hooks/useGameStateV2.js` (attack function ~line 378, doAdvancePhase ~line 910)

**Step 1: Create domination check helper**

Add this function near the top of `useGameStateV2.js`, after the `calculateReinforcements` function:

```js
function checkDomination(territoryOwners) {
  const ownedTerritories = Object.entries(territoryOwners)
    .filter(([, owner]) => owner !== 'neutral');
  if (ownedTerritories.length === 0) return null;
  const firstOwner = ownedTerritories[0][1];
  const allSame = ownedTerritories.every(([, owner]) => owner === firstOwner);
  return allSame ? firstOwner : null;
}
```

**Step 2: Add domination check after player captures territory**

In the `attack` function, after each successful capture (the `conquered` branches), add a domination check. Find both places where `CAPTURE_TERRITORY` is dispatched for the player and the battle result is returned. Before the final `return result;` at the end of the attack function (~line 562), add:

```js
// Check for player domination after capture
if (conquered) {
  const postAttackOwners = { ...mapState.territoryOwners, [toId]: gameState.playerFaction };
  const dominator = checkDomination(postAttackOwners);
  if (dominator === gameState.playerFaction) {
    dispatchGame({ type: GAME_OVER, payload: {
      reason: 'domination',
      winner: gameState.playerFaction,
      message: `Total Victory! Your forces have achieved complete domination!`,
    }});
  }
}
```

This should be placed right before the `return result;` at line ~562 (after `dispatchGame SET_MESSAGE` but before `return`).

**Step 3: Add domination check after AI turn**

In `doAdvancePhase`, after the AI turn loop applies changes and before the elimination check (~line 910), add:

```js
// Check for domination (any faction)
const dominator = checkDomination(aiOwners);
if (dominator) {
  if (dominator === gameState.playerFaction) {
    dispatchGame({ type: GAME_OVER, payload: {
      reason: 'domination',
      winner: dominator,
      message: 'Total Victory! Your forces have achieved complete domination!',
    }});
  } else {
    const factionNames = { us: 'United States', british: 'British/Canada', native: 'Native Coalition' };
    dispatchGame({ type: GAME_OVER, payload: {
      reason: 'domination',
      winner: dominator,
      message: `Defeated! ${factionNames[dominator] || dominator} has achieved total control of the theater.`,
    }});
  }
  // Apply the AI map changes before returning
  Object.keys(aiOwners).forEach(tid => {
    if (aiOwners[tid] !== mapState.territoryOwners[tid]) {
      dispatchMap({ type: CAPTURE_TERRITORY, payload: { territoryId: tid, newOwner: aiOwners[tid] } });
    }
  });
  Object.keys(aiTroops).forEach(tid => {
    dispatchMap({ type: SET_TROOPS, payload: { territoryId: tid, count: aiTroops[tid] } });
  });
  return;
}
```

**Step 4: Update existing GAME_OVER dispatches to use structured payload**

Change the elimination dispatch (~line 932):
```js
dispatchGame({ type: GAME_OVER, payload: {
  reason: 'elimination',
  winner: null,
  message: 'Your faction has been eliminated! The war is over.',
}});
```

Change the Treaty of Ghent dispatch (~line 939):
```js
dispatchGame({ type: GAME_OVER, payload: {
  reason: 'treaty',
  winner: null,
  message: 'The Treaty of Ghent has been signed. The war is over!',
}});
```

**Step 5: Build and test**

Run: `npx react-scripts build && npx react-scripts test --watchAll=false`
Expected: Compiles clean, all 35 tests pass.

**Step 6: Commit**

```
feat: add domination victory check for all factions
```

---

### Task 3: Create Historical Analysis Data Module

**Files:**
- Create: `src/data/historicalAnalysis.js`

**Step 1: Create the historical data and comparison engine**

Create `src/data/historicalAnalysis.js` with:

1. `HISTORICAL_OUTCOME` — per-faction summary of what really happened (3-4 sentences each)
2. `TERRITORY_HISTORY` — object keyed by territory ID, with a sentence about the real historical event there (cover ~12 key territories)
3. `generateHistoricalComparison(playerFaction, territoryOwners, battleStats, round, gameOverReason)` — exported function that returns an array of paragraph strings:
   - Paragraph 1: Overall outcome comparison (player result vs real 1812 outcome)
   - Paragraph 2: Territory-specific comparisons (which key territories they held vs history)
   - Paragraph 3: Tactical analysis (aggression level from battle stats, expansion pattern)
   - Paragraph 4: Historical lesson (what the real war teaches, based on faction)

The function should be pure — takes game state, returns strings. No React, no side effects.

Key historical facts to encode:
- **Detroit**: Surrendered by Hull to British/Native forces Aug 1812. Recaptured by Harrison Oct 1813.
- **Washington DC**: Burned by British Aug 1814.
- **Baltimore / Fort McHenry**: British bombardment failed Sep 1814 (Star-Spangled Banner).
- **New Orleans**: Jackson's decisive victory Jan 1815 (after treaty signed).
- **Lake Erie**: Perry's victory Sep 1813 ("We have met the enemy and they are ours").
- **Montreal**: Three failed American invasion attempts.
- **Upper Canada / Niagara**: Contested throughout; brutal back-and-forth battles.
- **Creek Nation**: Creek War 1813-14, Jackson's campaign, Treaty of Fort Jackson.
- **Halifax**: British naval base, never seriously threatened.
- **Indiana Territory**: Tecumseh's confederacy base; collapsed after his death at Thames Oct 1813.

**Step 2: Build and verify**

Run: `npx react-scripts build`
Expected: Compiles clean.

**Step 3: Commit**

```
feat: add historical analysis data and comparison engine
```

---

### Task 4: Update GameReport with Historian's Analysis

**Files:**
- Modify: `src/components/GameReport.jsx`
- Modify: `src/components/GameBoard.jsx` (~line 340, GameReport props)
- Modify: `src/App.js` (~line 137, pass new props)

**Step 1: Pass new props through the chain**

In `src/hooks/useGameStateV2.js`, the return block already exposes `gameOverReason` and `gameOverWinner` (from Task 1). Add `territoryOwners` is already exposed.

In `src/App.js`, pass the new props to GameBoard:
```js
gameOverReason={game.gameOverReason}
gameOverWinner={game.gameOverWinner}
```

In `src/components/GameBoard.jsx`:
- Add `gameOverReason` and `gameOverWinner` to the destructured props
- Pass them to GameReport:
```jsx
{gameOver && <GameReport
  ...existing props...
  gameOverReason={gameOverReason}
  gameOverWinner={gameOverWinner}
  territoryOwners={territoryOwners}
/>}
```

**Step 2: Adapt GameReport header to game-end reason**

In `src/components/GameReport.jsx`:

Add import: `import { generateHistoricalComparison } from '../data/historicalAnalysis';`

Add `gameOverReason`, `gameOverWinner`, `territoryOwners` to props destructuring.

Replace the static header title/subtitle with:
```jsx
const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
const getSeasonYear = (r) => `${SEASONS[(r - 1) % 4]} ${1812 + Math.floor((r - 1) / 4)}`;

const headerTitle = gameOverReason === 'domination'
  ? (gameOverWinner === playerFaction ? 'Total Victory!' : 'Defeated')
  : gameOverReason === 'elimination'
  ? 'Defeated'
  : 'The War Is Over';

const headerSubtitle = gameOverReason === 'domination'
  ? `Complete domination achieved \u2014 ${getSeasonYear(round)}`
  : gameOverReason === 'elimination'
  ? `${factionLabels[playerFaction]} eliminated \u2014 ${getSeasonYear(round)}`
  : 'Treaty of Ghent \u2014 December 24, 1814';
```

Replace the hardcoded strings in the header JSX with `{headerTitle}` and `{headerSubtitle}`.

**Step 3: Add Historian's Analysis section**

After the verdict `<p>` (line ~103) and before the Objectives section (line ~106), add:

```jsx
{/* Historian's Analysis */}
<HistorianAnalysis
  playerFaction={playerFaction}
  territoryOwners={territoryOwners}
  battleStats={battleStats}
  round={round}
  gameOverReason={gameOverReason}
/>
```

Create the `HistorianAnalysis` component inside `GameReport.jsx` (above the default export):

```jsx
function HistorianAnalysis({ playerFaction, territoryOwners, battleStats, round, gameOverReason }) {
  const [expanded, setExpanded] = useState(true);
  const paragraphs = generateHistoricalComparison(playerFaction, territoryOwners, battleStats, round, gameOverReason);

  return (
    <div className="border border-war-copper/20 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
        style={{ background: 'linear-gradient(135deg, rgba(184,115,51,0.1) 0%, rgba(20,30,48,0.5) 100%)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-war-copper text-xs tracking-[0.15em] uppercase font-body font-bold">
            Historian's Analysis
          </span>
        </div>
        <span className="text-parchment-dark/40 text-sm">{expanded ? '\u25B2' : '\u25BC'}</span>
      </button>
      {expanded && (
        <div className="px-5 py-4 space-y-3 bg-black/10">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-parchment/70 text-sm font-body leading-relaxed">{p}</p>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 4: Build and test**

Run: `npx react-scripts build && npx react-scripts test --watchAll=false`
Expected: Compiles clean, all tests pass.

**Step 5: Commit**

```
feat: add historian's analysis to endscreen, adapt header to game-end reason
```

---

### Task 5: Final Verification

**Step 1: Full build**

Run: `npx react-scripts build`
Expected: Clean compile.

**Step 2: Full tests**

Run: `npx react-scripts test --watchAll=false`
Expected: All 35 tests pass.

**Step 3: Commit any cleanup**

If any lint or minor fixes are needed, commit them.
