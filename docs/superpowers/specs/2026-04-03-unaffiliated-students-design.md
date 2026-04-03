# Unaffiliated Students on Teacher Dashboard

**Date:** 2026-04-03
**Status:** Draft

## Problem

Students who play the game without entering a class code submit scores with `class_id: null`. The Teacher Dashboard only queries scores matching the teacher's class IDs, so these students are invisible to all teachers.

## Solution

Extend the existing query-and-filter pattern to include unaffiliated scores (`class_id == null`), surface them as an "Unassigned" pseudo-class in the dashboard, and allow teachers to assign unaffiliated students to one of their classes.

## Design

### 1. Firebase Query Changes

**`fetchTeacherStats(classIds)`** — after the existing `where('class_id', 'in', classIds)` query, run a second Firestore query: `where('class_id', '==', null)`. Merge results into the same return structure — unaffiliated scores grouped under the `'unassigned'` key in `byClass` (this key is already used internally).

**`fetchQuizGateStats(classIds)`** — same pattern. Add a second query for `class_id == null` and merge.

**`fetchAllStudents(classIds)`** — same pattern. Add null query and merge.

No new functions. Return shapes unchanged — `'unassigned'` is just another key in `byClass`.

### 2. Dashboard Filter UI

**Class dropdown:**
- Add "Unassigned" option at the bottom of the dropdown, separated by a visual divider
- "All Classes" (existing default) now includes unaffiliated students in its totals
- Selecting "Unassigned" filters to only unaffiliated students

**Scores table:**
- For `class_id === null`, display "Unassigned" in a muted/italic style in the Class column
- Summary cards update to include unaffiliated students when "All Classes" or "Unassigned" is selected

**"By Class" breakdown table:**
- Add an "Unassigned" row at the bottom showing aggregate stats for unaffiliated students

### 3. Assign-to-Class Action

**UI:**
- For rows where `class_id === null`, show an "Assign" button in the Actions column
- Clicking opens a small dropdown showing the teacher's classes
- After selection, calls `linkSessionToClass(sessionId, classId)` — this existing function uses Firestore batch writes to update both `scores` and `quizGateResults` documents

**After assignment:**
- Refresh dashboard data to reflect the change
- Student moves from "Unassigned" into the assigned class's stats
- Show a brief success message

**Edge cases:**
- If the student has no `sessionId` (pre-session-tracking scores), the Assign button is disabled with a tooltip
- If `linkSessionToClass` fails, show an error — no data corruption due to batch writes

## Files to Modify

- `src/lib/firebase.js` — `fetchTeacherStats`, `fetchQuizGateStats`, `fetchAllStudents`
- `src/components/TeacherDashboard.jsx` — filter dropdown, scores table, class breakdown, assign action

## Future Considerations

- Add a `school` field to teachers/classes to scope unaffiliated student visibility per school
