# Unaffiliated Students on Teacher Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make students who played without a class code visible on the Teacher Dashboard, and let teachers assign them to a class.

**Architecture:** Add a second Firestore query for `class_id == null` in `fetchTeacherStats`, `fetchQuizGateStats`, and `fetchAllStudents`, merging results into existing return shapes. On the dashboard, add "Unassigned" as a filter option and an "Assign" action button per unaffiliated score row.

**Tech Stack:** React 19, Firebase Firestore, Tailwind CSS

---

### Task 1: Add unaffiliated score fetching to `fetchTeacherStats`

**Files:**
- Modify: `src/lib/firebase.js:376-440`
- Test: `src/lib/__tests__/firebase.test.js`

- [ ] **Step 1: Write the failing test**

Add to `src/lib/__tests__/firebase.test.js`. First, add `fetchTeacherStats` to the require line (line 41):

```js
const { hideScore, renameStudent, moveStudent, mergeStudents, fetchAllStudents, fetchLeaderboard, deleteClass, fetchTeacherStats } = require('../firebase');
```

Then add the test:

```js
describe('fetchTeacherStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('includes unaffiliated scores (class_id == null) alongside class scores', async () => {
    const classScoreDocs = [
      { id: 's1', data: () => ({ class_id: 'c1', faction: 'us', final_score: 100, knowledge_correct: 8, knowledge_total: 10, created_at: { seconds: 1000 } }) },
    ];
    const unaffiliatedScoreDocs = [
      { id: 's2', data: () => ({ class_id: null, faction: 'british', final_score: 200, knowledge_correct: 9, knowledge_total: 10, created_at: { seconds: 2000 } }) },
    ];
    getDocs
      .mockResolvedValueOnce({ docs: classScoreDocs })
      .mockResolvedValueOnce({ docs: unaffiliatedScoreDocs });

    const result = await fetchTeacherStats(['c1']);
    expect(result.error).toBeNull();
    expect(result.data.totalGames).toBe(2);
    expect(result.data.allScores).toHaveLength(2);

    const unassignedClass = result.data.classStats.find(cs => cs.classId === 'unassigned');
    expect(unassignedClass).toBeDefined();
    expect(unassignedClass.count).toBe(1);
    expect(unassignedClass.avgScore).toBe(200);
  });

  test('works when there are no unaffiliated scores', async () => {
    const classScoreDocs = [
      { id: 's1', data: () => ({ class_id: 'c1', faction: 'us', final_score: 100, knowledge_correct: 5, knowledge_total: 10, created_at: { seconds: 1000 } }) },
    ];
    getDocs
      .mockResolvedValueOnce({ docs: classScoreDocs })
      .mockResolvedValueOnce({ docs: [] });

    const result = await fetchTeacherStats(['c1']);
    expect(result.error).toBeNull();
    expect(result.data.totalGames).toBe(1);
    expect(result.data.classStats.find(cs => cs.classId === 'unassigned')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx react-scripts test --watchAll=false --testPathPattern=firebase.test`
Expected: FAIL — `fetchTeacherStats` currently only runs one query, so the second `getDocs` mock is never consumed.

- [ ] **Step 3: Implement the change**

In `src/lib/firebase.js`, modify `fetchTeacherStats` (lines 376-440). After the initial query and snapshot, add a second query for unaffiliated scores and merge:

```js
export async function fetchTeacherStats(classIds) {
  if (!db) return { data: null, error: 'Firebase not configured' };
  try {
    let scores = [];

    if (classIds && classIds.length > 0) {
      // Fetch class-affiliated scores
      const classQuery = query(
        collection(db, 'scores'),
        where('class_id', 'in', classIds)
      );
      const classSnapshot = await getDocs(classQuery);
      scores = classSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      // Fetch unaffiliated scores (class_id == null)
      const unaffiliatedQuery = query(
        collection(db, 'scores'),
        where('class_id', '==', null)
      );
      const unaffiliatedSnapshot = await getDocs(unaffiliatedQuery);
      scores = scores.concat(
        unaffiliatedSnapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      );
    } else {
      const q = query(
        collection(db, 'scores'),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      scores = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }

    scores.sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0));

    const byClass = {};
    const byFaction = { us: [], british: [], native: [] };

    for (const s of scores) {
      const classId = s.class_id || 'unassigned';
      if (!byClass[classId]) byClass[classId] = [];
      byClass[classId].push(s);
      if (byFaction[s.faction]) byFaction[s.faction].push(s);
    }

    const classStats = Object.entries(byClass).map(([classId, entries]) => ({
      classId,
      count: entries.length,
      avgScore: Math.round(entries.reduce((a, e) => a + e.final_score, 0) / entries.length),
      avgQuizPercent: entries.filter(e => e.knowledge_total > 0).length > 0
        ? Math.round(
            entries.filter(e => e.knowledge_total > 0)
              .reduce((a, e) => a + (e.knowledge_correct / e.knowledge_total) * 100, 0)
            / entries.filter(e => e.knowledge_total > 0).length
          )
        : 0,
      topScore: Math.max(...entries.map(e => e.final_score)),
    }));

    const factionStats = Object.entries(byFaction).map(([faction, entries]) => ({
      faction,
      count: entries.length,
      avgScore: entries.length > 0
        ? Math.round(entries.reduce((a, e) => a + e.final_score, 0) / entries.length)
        : 0,
    }));

    return {
      data: {
        totalGames: scores.length,
        allScores: scores,
        classStats,
        factionStats,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err.message };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx react-scripts test --watchAll=false --testPathPattern=firebase.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/firebase.js src/lib/__tests__/firebase.test.js
git commit -m "feat: include unaffiliated scores in fetchTeacherStats"
```

---

### Task 2: Add unaffiliated data fetching to `fetchQuizGateStats` and `fetchAllStudents`

**Files:**
- Modify: `src/lib/firebase.js:347-370` (fetchQuizGateStats), `src/lib/firebase.js:606-649` (fetchAllStudents)
- Test: `src/lib/__tests__/firebase.test.js`

- [ ] **Step 1: Write the failing tests**

Add to `src/lib/__tests__/firebase.test.js`. First, add `fetchQuizGateStats` to the require line:

```js
const { hideScore, renameStudent, moveStudent, mergeStudents, fetchAllStudents, fetchLeaderboard, deleteClass, fetchTeacherStats, fetchQuizGateStats } = require('../firebase');
```

Then add:

```js
describe('fetchQuizGateStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('includes unaffiliated quiz results alongside class results', async () => {
    const classDocs = [
      { id: 'qg1', data: () => ({ class_id: 'c1', question_id: 'q1', created_at: { seconds: 1000 } }) },
    ];
    const unaffiliatedDocs = [
      { id: 'qg2', data: () => ({ class_id: null, question_id: 'q2', created_at: { seconds: 2000 } }) },
    ];
    getDocs
      .mockResolvedValueOnce({ docs: classDocs })
      .mockResolvedValueOnce({ docs: unaffiliatedDocs });

    const result = await fetchQuizGateStats(['c1']);
    expect(result.error).toBeNull();
    expect(result.data).toHaveLength(2);
  });
});
```

Update the existing `fetchAllStudents` test "includes unassigned students when no classIds" and add a new test:

```js
test('includes unaffiliated students alongside class students when classIds provided', async () => {
  const classScoreDocs = [
    { id: 's1', data: () => ({ session_id: 'sess-1', player_name: 'Alice', display_name: null, class_id: 'c1', final_score: 100 }) },
  ];
  const unaffiliatedDocs = [
    { id: 's2', data: () => ({ session_id: 'sess-2', player_name: 'Wanderer', display_name: null, class_id: null, final_score: 75 }) },
  ];
  getDocs
    .mockResolvedValueOnce({ docs: classScoreDocs })
    .mockResolvedValueOnce({ docs: unaffiliatedDocs });

  const result = await fetchAllStudents(['c1']);
  expect(result.error).toBeNull();
  expect(result.data).toHaveLength(2);
  expect(result.data.find(s => s.sessionId === 'sess-2').classId).toBeNull();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx react-scripts test --watchAll=false --testPathPattern=firebase.test`
Expected: FAIL

- [ ] **Step 3: Implement fetchQuizGateStats change**

In `src/lib/firebase.js`, replace `fetchQuizGateStats` (lines 347-370):

```js
export async function fetchQuizGateStats(classIds) {
  if (!db) return { data: null, error: 'Firebase not configured' };
  try {
    let data = [];

    if (classIds && classIds.length > 0) {
      const classQuery = query(
        collection(db, 'quizGateResults'),
        where('class_id', 'in', classIds)
      );
      const classSnapshot = await getDocs(classQuery);
      data = classSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      const unaffiliatedQuery = query(
        collection(db, 'quizGateResults'),
        where('class_id', '==', null)
      );
      const unaffiliatedSnapshot = await getDocs(unaffiliatedQuery);
      data = data.concat(
        unaffiliatedSnapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      );
    } else {
      const q = query(
        collection(db, 'quizGateResults'),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }

    data.sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0));
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}
```

- [ ] **Step 4: Implement fetchAllStudents change**

In `src/lib/firebase.js`, replace `fetchAllStudents` (lines 606-649):

```js
export async function fetchAllStudents(classIds) {
  if (!db) return { data: [], error: 'Firebase not configured' };
  try {
    let allDocs = [];

    if (classIds && classIds.length > 0) {
      const classQuery = query(
        collection(db, 'scores'),
        where('class_id', 'in', classIds)
      );
      const classSnapshot = await getDocs(classQuery);
      allDocs = classSnapshot.docs;

      const unaffiliatedQuery = query(
        collection(db, 'scores'),
        where('class_id', '==', null)
      );
      const unaffiliatedSnapshot = await getDocs(unaffiliatedQuery);
      allDocs = allDocs.concat(unaffiliatedSnapshot.docs);
    } else {
      const q = query(
        collection(db, 'scores'),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      allDocs = snapshot.docs;
    }

    const bySession = {};
    allDocs.forEach(d => {
      const data = d.data();
      const sid = data.session_id;
      if (!sid) return;
      if (!bySession[sid]) {
        bySession[sid] = {
          sessionId: sid,
          playerName: data.player_name,
          displayName: data.display_name || null,
          classId: data.class_id || null,
          gameCount: 0,
          scores: [],
        };
      }
      bySession[sid].gameCount++;
      bySession[sid].scores.push({ id: d.id, ...data });
      if (data.display_name) {
        bySession[sid].displayName = data.display_name;
      }
    });

    return { data: Object.values(bySession), error: null };
  } catch (err) {
    return { data: [], error: err.message };
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx react-scripts test --watchAll=false --testPathPattern=firebase.test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/firebase.js src/lib/__tests__/firebase.test.js
git commit -m "feat: include unaffiliated data in fetchQuizGateStats and fetchAllStudents"
```

---

### Task 3: Add "Unassigned" filter option to class dropdown

**Files:**
- Modify: `src/components/TeacherDashboard.jsx`

- [ ] **Step 1: Update the class filter dropdown**

In `src/components/TeacherDashboard.jsx`, find the `<select>` for class filtering (around line 746-756). Replace it with:

```jsx
<select
  value={selectedClass}
  onChange={(e) => setSelectedClass(e.target.value)}
  className="bg-war-ink/50 text-parchment/80 border border-parchment-dark/15 rounded px-3 py-1.5 text-sm font-body cursor-pointer
             focus:border-war-gold/40 focus:outline-none"
>
  <option value="">All Classes</option>
  {classes.map((c) => (
    <option key={c.id} value={c.id}>{c.name}</option>
  ))}
  <option disabled>──────────</option>
  <option value="unassigned">Unassigned</option>
</select>
```

- [ ] **Step 2: Update the filteredScores logic**

Find the `filteredScores` and `filteredQGData` filter logic (around lines 349-355). Replace with:

```js
const filteredScores = selectedClass
  ? selectedClass === 'unassigned'
    ? (stats?.allScores || []).filter(s => !s.class_id)
    : (stats?.allScores || []).filter(s => s.class_id === selectedClass)
  : stats?.allScores || [];

const filteredQGData = selectedClass
  ? selectedClass === 'unassigned'
    ? quizGateData.filter(r => !r.class_id)
    : quizGateData.filter(r => r.class_id === selectedClass)
  : quizGateData;
```

- [ ] **Step 3: Remove the `classes.length > 0` guard on the dropdown**

The `<select>` is currently wrapped in `{classes.length > 0 && (...)}` (line 745). Remove this guard so the dropdown always renders — a teacher with zero classes should still be able to filter to "Unassigned":

```jsx
<select
  value={selectedClass}
  onChange={(e) => setSelectedClass(e.target.value)}
  className="bg-war-ink/50 text-parchment/80 border border-parchment-dark/15 rounded px-3 py-1.5 text-sm font-body cursor-pointer
             focus:border-war-gold/40 focus:outline-none"
>
  <option value="">All Classes</option>
  {classes.map((c) => (
    <option key={c.id} value={c.id}>{c.name}</option>
  ))}
  <option disabled>──────────</option>
  <option value="unassigned">Unassigned</option>
</select>
```

- [ ] **Step 4: Verify in browser**

Run: `npm start`
Navigate to `#teacher`, sign in, verify:
- Dropdown shows "All Classes", real classes, divider, "Unassigned"
- Selecting "Unassigned" shows only unaffiliated scores
- "All Classes" shows everything including unaffiliated

- [ ] **Step 5: Commit**

```bash
git add src/components/TeacherDashboard.jsx
git commit -m "feat: add Unassigned filter option to class dropdown"
```

---

### Task 4: Show "Unassigned" row in the By Class breakdown table

**Files:**
- Modify: `src/components/TeacherDashboard.jsx`

- [ ] **Step 1: Add Unassigned row to the class breakdown table**

Find the "By Class" `<tbody>` (around lines 610-622). The current filter excludes `'unassigned'` on line 612: `.filter(cs => cs.classId !== 'unassigned' && classNameMap[cs.classId])`. Replace the entire `<tbody>`:

```jsx
<tbody>
  {(stats.classStats || [])
    .filter(cs => cs.classId !== 'unassigned' && classNameMap[cs.classId])
    .map((cs) => (
      <tr key={cs.classId} className="border-b border-parchment-dark/8">
        <td className="py-2 font-bold text-parchment/80">{classNameMap[cs.classId]}</td>
        <td className="py-2 text-right text-parchment-dark/60">{cs.count}</td>
        <td className="py-2 text-right text-war-gold font-bold font-display">{cs.avgScore}</td>
        <td className="py-2 text-right text-parchment-dark/60">{cs.topScore}</td>
        <td className="py-2 text-right text-parchment-dark/60">{cs.avgQuizPercent}%</td>
      </tr>
    ))}
  {(stats.classStats || []).find(cs => cs.classId === 'unassigned') && (
    <tr className="border-t border-parchment-dark/15">
      <td className="py-2 italic text-parchment-dark/50">Unassigned</td>
      <td className="py-2 text-right text-parchment-dark/60">
        {stats.classStats.find(cs => cs.classId === 'unassigned').count}
      </td>
      <td className="py-2 text-right text-war-gold/60 font-display">
        {stats.classStats.find(cs => cs.classId === 'unassigned').avgScore}
      </td>
      <td className="py-2 text-right text-parchment-dark/60">
        {stats.classStats.find(cs => cs.classId === 'unassigned').topScore}
      </td>
      <td className="py-2 text-right text-parchment-dark/60">
        {stats.classStats.find(cs => cs.classId === 'unassigned').avgQuizPercent}%
      </td>
    </tr>
  )}
</tbody>
```

- [ ] **Step 2: Show the By Class section even with no classes**

The entire "By Class" section is wrapped in `{classes.length > 0 && (...)}` (line 597). Change the guard to also show when unassigned data exists:

```jsx
{(classes.length > 0 || (stats.classStats || []).some(cs => cs.classId === 'unassigned')) && (
```

- [ ] **Step 3: Update the Class column in the scores table**

Find line 835 where the Class column renders: `{classNameMap[s.class_id] || s.class_period || '-'}`. Replace with:

```jsx
{s.class_id
  ? (classNameMap[s.class_id] || s.class_period || '-')
  : <span className="italic text-parchment-dark/40">Unassigned</span>
}
```

- [ ] **Step 4: Verify in browser**

Navigate to `#teacher`, verify:
- By Class table shows an "Unassigned" row at the bottom (italic, muted style)
- Scores table shows "Unassigned" in italic for classless students

- [ ] **Step 5: Commit**

```bash
git add src/components/TeacherDashboard.jsx
git commit -m "feat: show Unassigned row in By Class table and scores"
```

---

### Task 5: Add "Assign to Class" action for unaffiliated scores

**Files:**
- Modify: `src/components/TeacherDashboard.jsx`

- [ ] **Step 1: Add `linkSessionToClass` to imports**

In `src/components/TeacherDashboard.jsx` line 1-19, add `linkSessionToClass` to the firebase import:

```js
import {
  fetchTeacherStats,
  fetchQuizGateStats,
  fetchAllStudents,
  hideScore,
  renameStudent,
  moveStudent,
  mergeStudents,
  linkSessionToClass,
  db,
  signInWithGoogle,
  signOut,
  onAuthStateChange,
  getTeacherProfile,
  createTeacherProfile,
  createClass,
  deleteClass,
  fetchTeacherClasses,
} from '../lib/firebase';
```

- [ ] **Step 2: Add state for the assign action**

In the `Dashboard` component, after the existing state declarations (around line 306), add:

```js
const [assigningScoreId, setAssigningScoreId] = useState(null);
const [assignLoading, setAssignLoading] = useState(false);
```

- [ ] **Step 3: Add the assign handler**

After the existing `handleHideScore` handler (around line 368), add:

```js
const handleAssignToClass = async (score, targetClassId) => {
  if (!score.session_id) return;
  setAssignLoading(true);
  const { error } = await linkSessionToClass({ sessionId: score.session_id, classId: targetClassId });
  setAssignLoading(false);
  setAssigningScoreId(null);
  if (error) {
    alert(`Failed to assign: ${error}`);
  } else {
    await refreshData();
  }
};
```

- [ ] **Step 4: Add the Assign button to the Actions column**

In the scores table Actions `<td>` (around line 848-868), add the assign button before the existing rename button. Find the `<td className="py-2 text-right whitespace-nowrap">` and add at the beginning:

```jsx
{!s.class_id && (
  <span className="relative inline-block">
    {assigningScoreId === s.id ? (
      <select
        autoFocus
        disabled={assignLoading}
        className="bg-war-ink/80 text-parchment/80 border border-war-gold/30 rounded px-2 py-1 text-xs font-body
                   focus:outline-none focus:border-war-gold/60 cursor-pointer"
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) handleAssignToClass(s, e.target.value);
        }}
        onBlur={() => setAssigningScoreId(null)}
      >
        <option value="" disabled>Assign to…</option>
        {classes.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    ) : s.session_id ? (
      <button
        onClick={() => setAssigningScoreId(s.id)}
        className="text-parchment-dark/40 hover:text-war-gold transition-colors cursor-pointer text-xs px-1"
        title="Assign to class"
      >
        &#x2795;
      </button>
    ) : (
      <span
        className="text-parchment-dark/20 text-xs px-1 cursor-not-allowed"
        title="No session ID — cannot assign"
      >
        &#x2795;
      </span>
    )}
  </span>
)}
```

- [ ] **Step 5: Verify in browser**

Navigate to `#teacher`, verify:
- Unaffiliated score rows show a "+" assign button
- Clicking opens a class picker dropdown
- Selecting a class moves the student into that class
- Rows without session_id show a disabled "+" with tooltip
- Data refreshes after assignment

- [ ] **Step 6: Commit**

```bash
git add src/components/TeacherDashboard.jsx
git commit -m "feat: add Assign to Class action for unaffiliated students"
```

---

### Task 6: Run full test suite and verify build

**Files:** None (verification only)

- [ ] **Step 1: Run all tests**

Run: `npx react-scripts test --watchAll=false`
Expected: All 105+ tests pass (including the new ones added in Tasks 1-2)

- [ ] **Step 2: Verify build succeeds**

Run: `npx react-scripts build`
Expected: Build completes with no errors (ESLint warnings are treated as errors)

- [ ] **Step 3: Final commit if any fixes were needed**

If any lint or test fixes were required, commit them:
```bash
git add -A
git commit -m "fix: resolve lint/test issues from unaffiliated students feature"
```
