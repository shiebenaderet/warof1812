# Student Management & Leaderboard Moderation Design Spec

**Date**: 2026-03-31
**Status**: Approved
**Summary**: Add teacher controls for managing student data — hide scores from leaderboard, rename students, move between classes, and merge duplicate entries.

## Motivation

- Students sometimes enter inappropriate or misspelled names that appear on the public leaderboard
- Students sign in multiple times creating duplicate entries
- Students may need to be moved between classes
- Teachers need full control over what appears publicly without deleting data

## Data Model Changes

### `scores` collection — new fields
- `hidden` (boolean, default `false`) — when `true`, excluded from public leaderboard
- `display_name` (string, nullable) — teacher-set override for `player_name`. Leaderboard shows `display_name || player_name`.

### `quizGateResults` collection — new fields
- `display_name` (string, nullable) — kept in sync when teacher renames

### Existing docs
- Missing `hidden` field treated as `false` (not hidden) — no backfill needed
- Missing `display_name` treated as `null` — falls back to `player_name`

## Feature 1: Leaderboard Hide/Unhide

### Behavior
- Each score row in "All Scores" table gets an eye icon toggle button
- Hidden scores disappear from public leaderboard but remain in teacher dashboard
- Hidden rows show muted/strikethrough style with a "hidden" indicator
- Toggle again to unhide — score reappears on leaderboard

### Leaderboard filtering
- `fetchLeaderboard` filters out hidden scores client-side after fetching
- Display uses `display_name || player_name` for shown names

## Feature 2: Rename Student

### Quick rename (score row)
- Pencil icon on each row in "All Scores" table
- Click → name becomes inline editable text field
- Enter or checkmark to save, Escape to cancel
- Updates `display_name` on ALL docs with matching `session_id` (scores + quiz results)
- Original `player_name` is never modified — preserved as what student typed

### Propagation
- Single function updates all docs matching `session_id`:
  - All `scores` docs → set `display_name`
  - All `quizGateResults` docs → set `display_name`

### Display
- In Manage Students section: shows `display_name` with original `player_name` in smaller muted text if different
- In All Scores table: shows `display_name || player_name`

## Feature 3: Move Student Between Classes

### Location
- Manage Students section only (not on individual score rows — moving applies to all of a student's data)

### Behavior
- Each student row shows current class or "Unassigned"
- Dropdown to pick a different class from teacher's class list (or "Unassigned")
- Updates `class_id` on all `scores` and `quizGateResults` docs matching that `session_id`

### Claiming unassigned students
- Manage Students section shows unassigned students (no `class_id`)
- Teacher can assign them to any class via the same dropdown
- Essentially teacher-initiated late-join

## Feature 4: Merge Duplicate Students

### Auto-detection
- Groups scores by normalized name (lowercase, trimmed)
- When multiple `session_id`s share a similar name, shows "Possible duplicate" indicator
- Matching: case-insensitive exact match first, then prefix match (e.g., "Jake" matches "Jake S")

### Manual merge
- Checkboxes on each student row in Manage Students section
- When 2+ selected, "Merge Selected" button appears
- Confirmation modal shows which name to keep (radio buttons, defaults to student with most games)
- On confirm: all docs from absorbed sessions get updated to match kept student

### What merge does
- Absorbed student's docs updated: `session_id` → kept student's, `player_name` → kept student's, `display_name` → kept student's (if any), `class_id` → kept student's
- If absorbed student has quiz data for a `question_id` that kept student already has, skip the duplicate
- Result: one student with all games consolidated, absorbed student disappears from student list

## UI: Manage Students Section

### Location
- New section in TeacherDashboard, between Class Manager and summary cards
- Only renders when there are scores to manage

### Table columns
- Checkbox (for merge selection)
- **Name** — `display_name || player_name`
- **Original Name** — shown small/muted only if `display_name` differs from `player_name`
- **Class** — dropdown for move
- **Games** — count of scores for this session_id
- **Actions** — Rename (pencil icon)

### Merge flow
1. Check 2+ students
2. "Merge Selected" button appears above table
3. Confirmation modal with radio buttons to pick which name to keep
4. Possible duplicate rows have subtle highlight indicator

### Filtering
- Respects existing class filter dropdown
- "Show unassigned" toggle for students without class_id

## UI: All Scores Table Quick Actions

### New columns/actions
- Eye icon (toggle hide/unhide) — rightmost action
- Pencil icon (inline rename) — next to name
- Hidden rows shown with muted text + strikethrough + "Hidden" badge

## Firebase Functions

### New exports in `src/lib/firebase.js`
- `hideScore(scoreId, hidden)` — sets `hidden` on one score doc
- `renameStudent(sessionId, displayName)` — updates `display_name` on all scores + quiz docs for session
- `moveStudent(sessionId, newClassId)` — updates `class_id` on all scores + quiz docs for session
- `mergeStudents(keptSessionId, absorbedSessionIds)` — rewrites absorbed docs to match kept student, skips duplicate quiz entries
- `fetchAllStudents(classIds)` — fetches scores grouped by session_id for Manage Students view

### Modified exports
- `fetchLeaderboard` — filters out `hidden === true` client-side, returns `display_name || player_name` as the display name

## Security Rules

No changes needed. Existing rules already allow public updates on `scores` and `quizGateResults` (for late-join). Teacher operations use the same update path.

## What doesn't change
- Student onboarding flow (name entry, class code, quiz gate)
- Score submission
- Quiz gate submission
- Class code system
- Save/load game
