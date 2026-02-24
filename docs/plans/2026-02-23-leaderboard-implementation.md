# Leaderboard Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Surface the leaderboard on the landing page (compact top-5 preview + full modal) and add victory type tracking to the database.

**Architecture:** New LeaderboardPreview component fetches top 5 on mount using existing `fetchLeaderboard()`. VictoryBadge is a shared component exported from LeaderboardPreview for reuse in the full Leaderboard. Database gets a `game_over_reason` column. ScoreSubmission passes the new field through to Supabase.

**Tech Stack:** React 19, Supabase (@supabase/supabase-js), existing War Room Cartography design system.

---

### Task 1: Add game_over_reason to Database Schema and Submission Flow

**Files:**
- Modify: `supabase-setup.sql:23` (after rounds_played)
- Modify: `src/lib/supabase.js:13-56` (submitScore function)
- Modify: `src/components/ScoreSubmission.jsx:31,57-78` (accept and pass prop)
- Modify: `src/components/GameReport.jsx:260-275` (pass gameOverReason to ScoreSubmission)

**Step 1: Add migration comment to supabase-setup.sql**

At the end of `supabase-setup.sql`, add:

```sql
-- Migration: Add game_over_reason column
-- Run this if your table already exists:
-- ALTER TABLE scores ADD COLUMN IF NOT EXISTS game_over_reason text DEFAULT 'treaty'
--   CHECK (game_over_reason IN ('treaty', 'domination', 'elimination'));
```

And add the column to the `CREATE TABLE` statement after `rounds_played`:

```sql
  game_over_reason text default 'treaty' check (game_over_reason in ('treaty', 'domination', 'elimination'))
```

**Step 2: Update submitScore in supabase.js**

Add `gameOverReason` parameter to the function signature (after `roundsPlayed`):

```js
  gameOverReason,
```

Add to the insert object (after `rounds_played: roundsPlayed`):

```js
      game_over_reason: gameOverReason || 'treaty',
```

**Step 3: Update ScoreSubmission to accept and pass gameOverReason**

Add `gameOverReason` to the destructured props (after `roundsPlayed`).

Add to the `submitScore()` call (after `roundsPlayed`):

```js
      gameOverReason,
```

**Step 4: Update GameReport to pass gameOverReason to ScoreSubmission**

In `src/components/GameReport.jsx`, add after `roundsPlayed={round}` (line 274):

```jsx
            gameOverReason={gameOverReason}
```

**Step 5: Build and verify**

Run: `npx react-scripts build`
Expected: Compiles clean.

**Step 6: Commit**

```
feat: add game_over_reason to schema and score submission flow
```

---

### Task 2: Create LeaderboardPreview Component

**Files:**
- Create: `src/components/LeaderboardPreview.jsx`

**Step 1: Create the component**

Create `src/components/LeaderboardPreview.jsx` with:

```jsx
import React, { useState, useEffect } from 'react';
import { fetchLeaderboard, supabase } from '../lib/supabase';

const FACTION_ICONS = { us: '\u{1F985}', british: '\u{1F341}', native: '\u{1F3F9}' };
const FACTION_COLORS = { us: 'text-[#4a7ec7]', british: 'text-red-400', native: 'text-war-gold' };
const MEDALS = ['\u{1F947}', '\u{1F948}', '\u{1F949}'];

export function VictoryBadge({ victoryType }) {
  if (!victoryType) return null;
  const config = {
    domination: { label: 'DOM', cls: 'text-war-copper border-war-copper/40 bg-war-copper/10' },
    treaty: { label: 'TRT', cls: 'text-parchment-dark/50 border-parchment-dark/30 bg-parchment-dark/5' },
    elimination: { label: 'ELM', cls: 'text-red-400/70 border-red-400/30 bg-red-400/5' },
  };
  const c = config[victoryType];
  if (!c) return null;
  return (
    <span className={`ml-1.5 px-1 py-0.5 text-[9px] font-body font-bold tracking-wider border rounded ${c.cls}`}>
      {c.label}
    </span>
  );
}

export default function LeaderboardPreview({ onViewFull }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    fetchLeaderboard({ limit: 5 }).then(({ data, error: err }) => {
      if (cancelled) return;
      if (err) { setError(true); setLoading(false); return; }
      setScores(data);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  if (!supabase) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-8 animate-slideup" style={{ animationDelay: '0.4s' }}>
      <div className="bg-war-navy/60 backdrop-blur rounded-lg border border-war-gold/20 shadow-card overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-war-gold/15" style={{
          background: 'linear-gradient(135deg, rgba(184,115,51,0.1) 0%, rgba(20,30,48,0.5) 100%)',
        }}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-war-gold/60" />
            <span className="text-war-copper text-xs tracking-[0.15em] uppercase font-body font-bold">
              Hall of Commanders
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-3">
          {loading ? (
            <p className="text-parchment-dark/40 text-sm text-center py-4 font-body italic">Loading rankings...</p>
          ) : error ? (
            <p className="text-parchment-dark/40 text-sm text-center py-4 font-body italic">Could not load rankings.</p>
          ) : scores.length === 0 ? (
            <p className="text-parchment-dark/40 text-sm text-center py-4 font-body italic">No commanders have entered the record yet.</p>
          ) : (
            <div className="space-y-1">
              {scores.map((s, i) => (
                <div key={s.id} className={`flex items-center gap-2.5 py-1.5 ${i < 3 ? 'text-parchment/80' : 'text-parchment-dark/60'}`}>
                  <span className="w-6 text-center text-sm flex-shrink-0">
                    {MEDALS[i] || <span className="text-parchment-dark/40 font-body">{i + 1}</span>}
                  </span>
                  <span className={`text-sm flex-shrink-0 ${FACTION_COLORS[s.faction] || ''}`}>
                    {FACTION_ICONS[s.faction] || ''}
                  </span>
                  <span className="text-sm font-body truncate min-w-0 flex-1">{s.player_name}</span>
                  <span className={`text-sm font-display font-bold tabular-nums flex-shrink-0 ${i === 0 ? 'text-war-gold' : i < 3 ? 'text-war-brass' : 'text-parchment-dark/50'}`}>
                    {s.final_score}
                  </span>
                  <VictoryBadge victoryType={s.game_over_reason} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {onViewFull && (
          <div className="px-4 pb-3">
            <button
              onClick={onViewFull}
              className="w-full py-2 text-xs font-body tracking-wider uppercase text-parchment-dark/50
                         border border-parchment-dark/15 rounded hover:border-war-gold/40 hover:text-war-gold/80
                         transition-colors cursor-pointer"
            >
              See All Rankings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Build and verify**

Run: `npx react-scripts build`
Expected: Compiles clean (component not yet used, but file should have no errors).

**Step 3: Commit**

```
feat: create LeaderboardPreview component with VictoryBadge
```

---

### Task 3: Add Victory Badges to Full Leaderboard

**Files:**
- Modify: `src/components/Leaderboard.jsx:2,154`

**Step 1: Import VictoryBadge**

Add to imports (after line 2):

```js
import { VictoryBadge } from './LeaderboardPreview';
```

**Step 2: Add badge to score cell**

Replace line 154:

```jsx
                    <td className="py-2 text-right font-bold text-war-gold font-display">{s.final_score}</td>
```

With:

```jsx
                    <td className="py-2 text-right font-bold text-war-gold font-display">
                      {s.final_score}
                      <VictoryBadge victoryType={s.game_over_reason} />
                    </td>
```

**Step 3: Build and verify**

Run: `npx react-scripts build`
Expected: Compiles clean.

**Step 4: Commit**

```
feat: add victory type badges to full leaderboard
```

---

### Task 4: Wire LeaderboardPreview into Landing Page

**Files:**
- Modify: `src/components/FactionSelect.jsx:1,53,240-241`

**Step 1: Add imports and state**

Add to imports (line 1):

```jsx
import React, { useState } from 'react';
import LeaderboardPreview from './LeaderboardPreview';
import Leaderboard from './Leaderboard';
```

Add to component state (after `confirmingDelete` state, line 53):

```jsx
  const [showLeaderboard, setShowLeaderboard] = useState(false);
```

**Step 2: Add LeaderboardPreview between action buttons and saved game**

After the action buttons closing `</div>` (line 240) and before the saved game `{savedGame && (` block, insert:

```jsx
        {/* Leaderboard Preview */}
        <LeaderboardPreview onViewFull={() => setShowLeaderboard(true)} />
```

**Step 3: Add full Leaderboard modal**

Before the closing `</div>` of the root (the last `</div>` before the return's closing paren), add:

```jsx
      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
```

**Step 4: Build and test**

Run: `npx react-scripts build && npx react-scripts test --watchAll=false`
Expected: Compiles clean, all tests pass.

**Step 5: Commit**

```
feat: add leaderboard preview and full modal to landing page
```

---

### Task 5: Final Verification

**Step 1: Full build**

Run: `npx react-scripts build`
Expected: Clean compile.

**Step 2: Full tests**

Run: `npx react-scripts test --watchAll=false`
Expected: All 35 tests pass.

**Step 3: Commit any cleanup if needed**
