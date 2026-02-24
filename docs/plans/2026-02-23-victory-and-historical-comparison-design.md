# Victory Conditions + Historical Comparison Design

## Problem

1. No early victory condition. Capturing all territories on turn 8 does nothing — player clicks through 4 empty rounds.
2. No historical comparison. The endscreen shows score/objectives but never compares the player's game to what actually happened in 1812.
3. The endscreen (GameReport) only triggers at round 12 or elimination. If you dominate early, you never see it.

## Design

### 1. Domination Victory

**Trigger:** After any faction's turn, check if a single faction controls all occupied territories (every territory where `startingOwner !== 'neutral'` or that has been captured). If one faction owns everything, the game ends.

**Symmetric:** Works for player AND AI factions.
- Player domination = victory screen
- AI domination = defeat screen

**Check locations in useGameStateV2.js:**
- After AI turn completes (where elimination check already lives)
- After player captures a territory in the `attack` function

**GAME_OVER payload change:** From plain string to object:
```js
{ reason: 'treaty' | 'domination' | 'elimination', message: '...', winner: factionId, round: currentRound }
```

### 2. Historical Comparison ("Historian's Analysis")

New data file `src/data/historicalAnalysis.js` containing:

**Per-faction historical summaries** — what actually happened to US, British, Native in 1812.

**Territory-specific historical notes** — for key territories (Detroit, Washington DC, New Orleans, Lake Erie, Montreal, etc.), what historically happened there.

**Comparison engine** generates 3-5 paragraphs:
1. Outcome comparison — how the player's result compares to the real war's outcome
2. Tactic comparison — which key territories the player held vs. history
3. What worked/didn't — based on battle stats and territory changes

Output is template-generated from static data, not hardcoded prose.

### 3. GameReport Adaptations

**Header adapts to game-end reason:**
- Treaty of Ghent (round 12): "The War Is Over" / "Treaty of Ghent"
- Player domination: "Total Victory!" / "Complete domination achieved in [season] [year]"
- AI domination: "Defeated" / "[Faction] has achieved total control"
- Elimination: "Your faction has been eliminated!"

**New section:** "Historian's Analysis" inserted between verdict and objectives. Collapsible, expanded by default.

**Everything else unchanged:** Score, objectives, battle stats, knowledge checks, journal, leaderboard all stay as-is.

## Files Changed

- `src/hooks/useGameStateV2.js` — domination checks, GAME_OVER payload change
- `src/reducers/gameReducer.js` — handle object payload for GAME_OVER
- `src/data/historicalAnalysis.js` — NEW: historical data + comparison logic
- `src/components/GameReport.jsx` — adapted header, historian's analysis section
