# Leaderboard Integration Design

## Problem

The leaderboard exists but is buried inside the endscreen modal. Students can't see rankings before playing, and there's no motivation to compete. The landing page has no social proof or competitive context. Additionally, the database doesn't capture victory type (domination vs treaty vs elimination).

## Design

### 1. Database: Add Victory Type Column

Add `game_over_reason` column to the existing `scores` table:

```sql
ALTER TABLE scores ADD COLUMN game_over_reason text DEFAULT 'treaty'
  CHECK (game_over_reason IN ('treaty', 'domination', 'elimination'));
```

Update `submitScore()` in `supabase.js` to include `game_over_reason`. Wire the value from `GameReport` → `ScoreSubmission` via a new `gameOverReason` prop.

### 2. Landing Page: Compact Top-5 Preview

New `LeaderboardPreview` component on the landing page (FactionSelect), positioned between the action buttons and the saved game section. Shows:

- Section header: "Hall of Commanders" — war-copper accent, tracking-[0.15em] uppercase, consistent with sidebar panel headers
- Top 5 scores in a compact table: rank (medal for top 3), commander name, faction icon, score, and a small victory type badge
- "See All Rankings" button at bottom → opens the full Leaderboard modal
- If Supabase isn't configured, the section doesn't render (same graceful degradation pattern)

Fetches on mount using existing `fetchLeaderboard()` with `limit: 5`. Shows all scores by default; users can filter by faction/period using the full modal.

### 3. Full Modal on Landing Page

"See All Rankings" opens the existing `Leaderboard` component in a modal overlay. Same modal pattern used throughout: backdrop-blur, border-war-gold/30, animate-fadein, close button. No new component — just render `<Leaderboard>` in a modal wrapper.

FactionSelect gets a `showLeaderboard` boolean state toggle.

### 4. Victory Type Badges in Leaderboard

Update existing `Leaderboard.jsx` rows to show a small badge next to the score:

- **Domination**: copper-colored "DOM" badge
- **Treaty**: muted parchment "TRT" badge
- **Elimination**: red-tinted "ELM" badge
- **null/missing**: no badge (backward compatible with existing records)

### 5. Endscreen (Already Done)

GameReport already has ScoreSubmission and a Leaderboard modal button. Only change: pass `gameOverReason` to ScoreSubmission so the new column gets populated.

## Files Changed

- `supabase-setup.sql` — add `game_over_reason` column + migration note
- `src/lib/supabase.js` — add `game_over_reason` to `submitScore()`, `fetchLeaderboard()`
- `src/components/ScoreSubmission.jsx` — accept and pass `gameOverReason` prop
- `src/components/GameReport.jsx` — pass `gameOverReason` to ScoreSubmission
- `src/components/Leaderboard.jsx` — add victory type badge to rows, return `game_over_reason` from query
- `src/components/LeaderboardPreview.jsx` — **NEW**: compact top-5 for landing page
- `src/components/FactionSelect.jsx` — add LeaderboardPreview section + full modal toggle
