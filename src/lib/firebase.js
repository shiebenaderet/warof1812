import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';

// Firebase config from env vars
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
};

const isConfigured = firebaseConfig.apiKey && firebaseConfig.projectId;

const app = isConfigured ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;

// ============================================
// Auth Functions
// ============================================

const googleProvider = new GoogleAuthProvider();
const ALLOWED_DOMAIN = 'edmonds.wednet.edu';

export async function signInWithGoogle() {
  if (!auth) return { user: null, error: 'Firebase not configured' };
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const email = result.user.email || '';
    if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      await firebaseSignOut(auth);
      return { user: null, error: `Sign-in is restricted to @${ALLOWED_DOMAIN} accounts.` };
    }
    return { user: result.user, error: null };
  } catch (err) {
    return { user: null, error: err.message || 'Sign in failed' };
  }
}

export async function signOut() {
  if (!auth) return { error: 'Firebase not configured' };
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (err) {
    return { error: err.message || 'Sign out failed' };
  }
}

export function onAuthStateChange(callback) {
  if (!auth) return { unsubscribe: () => {} };
  const unsubscribe = onAuthStateChanged(auth, (user) => callback(user));
  return { unsubscribe };
}

// ============================================
// Teacher Profile Functions
// ============================================

export async function getTeacherProfile(userId) {
  if (!db) return { data: null, error: 'Firebase not configured' };
  try {
    const docRef = doc(db, 'teachers', userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return { data: null, error: null };
    return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function createTeacherProfile({ userId, displayName, email }) {
  if (!db) return { data: null, error: 'Firebase not configured' };
  try {
    const docRef = doc(db, 'teachers', userId);
    const profile = {
      display_name: displayName,
      email,
      created_at: serverTimestamp(),
    };
    await setDoc(docRef, profile);
    return { data: { id: userId, ...profile }, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

// ============================================
// Class Management Functions
// ============================================

function generateClassCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createClass({ teacherId, name }) {
  if (!db) return { data: null, error: 'Firebase not configured' };
  try {
    for (let attempt = 0; attempt < 3; attempt++) {
      const code = generateClassCode();
      const q = query(collection(db, 'classes'), where('code', '==', code));
      const existing = await getDocs(q);
      if (!existing.empty) continue;

      const classData = {
        teacher_id: teacherId,
        name,
        code,
        created_at: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, 'classes'), classData);
      return { data: { id: docRef.id, ...classData }, error: null };
    }
    return { data: null, error: { message: 'Failed to generate unique code' } };
  } catch (err) {
    return { data: null, error: { message: err.message } };
  }
}

export async function fetchTeacherClasses(teacherId) {
  if (!db) return { data: [], error: 'Firebase not configured' };
  try {
    const q = query(
      collection(db, 'classes'),
      where('teacher_id', '==', teacherId),
      orderBy('created_at', 'asc')
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return { data, error: null };
  } catch (err) {
    return { data: [], error: err.message };
  }
}

export async function validateClassCode(code) {
  if (!db) return { data: null, error: 'Firebase not configured' };
  try {
    const q = query(
      collection(db, 'classes'),
      where('code', '==', code.toUpperCase().trim())
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return { data: null, error: null };
    const d = snapshot.docs[0];
    return { data: { id: d.id, name: d.data().name, code: d.data().code }, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

// ============================================
// Score Functions
// ============================================

export async function submitScore({
  playerName,
  classPeriod,
  faction,
  finalScore,
  baseScore,
  objectiveBonus,
  factionMultiplier,
  nationalismMeter,
  nativeResistance,
  navalDominance,
  knowledgeCorrect,
  knowledgeTotal,
  battlesWon,
  battlesFought,
  territoriesHeld,
  roundsPlayed,
  gameOverReason,
  difficulty,
  sessionId,
  classId,
}) {
  if (!db) return { error: 'Firebase not configured' };
  try {
    await addDoc(collection(db, 'scores'), {
      player_name: playerName,
      class_period: classPeriod,
      faction,
      final_score: finalScore,
      base_score: baseScore,
      objective_bonus: objectiveBonus,
      faction_multiplier: factionMultiplier,
      nationalism_meter: nationalismMeter,
      native_resistance: nativeResistance,
      naval_dominance: navalDominance,
      knowledge_correct: knowledgeCorrect,
      knowledge_total: knowledgeTotal,
      battles_won: battlesWon,
      battles_fought: battlesFought,
      territories_held: territoriesHeld,
      rounds_played: roundsPlayed,
      game_over_reason: gameOverReason || 'treaty',
      difficulty: difficulty || 'medium',
      session_id: sessionId || null,
      class_id: classId || null,
      created_at: serverTimestamp(),
    });
    return { data: true, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function fetchLeaderboard({ classPeriod, faction, limit: maxResults = 25 } = {}) {
  if (!db) return { data: [], error: 'Firebase not configured' };
  try {
    let constraints = [orderBy('final_score', 'desc'), firestoreLimit(maxResults)];
    if (classPeriod) constraints = [where('class_period', '==', classPeriod), ...constraints];
    if (faction) constraints = [where('faction', '==', faction), ...constraints];

    const q = query(collection(db, 'scores'), ...constraints);
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return { data, error: null };
  } catch (err) {
    return { data: [], error: err.message };
  }
}

export async function fetchClassPeriods() {
  if (!db) return [];
  try {
    const q = query(collection(db, 'scores'), orderBy('final_score', 'desc'), firestoreLimit(500));
    const snapshot = await getDocs(q);
    const periods = new Set();
    snapshot.docs.forEach(d => {
      const cp = d.data().class_period;
      if (cp) periods.add(cp);
    });
    return [...periods].sort();
  } catch {
    return [];
  }
}

// ============================================
// Quiz Gate Results Functions
// ============================================

export async function submitQuizGateResults({
  sessionId,
  playerName,
  classPeriod,
  gameMode,
  retries,
  classId,
}) {
  if (!db) return { error: 'Firebase not configured' };
  try {
    const batch = writeBatch(db);
    Object.entries(retries).forEach(([questionId, retryCount]) => {
      const docRef = doc(collection(db, 'quizGateResults'));
      batch.set(docRef, {
        session_id: sessionId,
        player_name: playerName,
        class_period: classPeriod || '',
        game_mode: gameMode || 'historian',
        question_id: questionId,
        retries: retryCount,
        class_id: classId || null,
        created_at: serverTimestamp(),
      });
    });
    await batch.commit();
    return { data: true, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function fetchQuizGateStats(classIds) {
  if (!db) return { data: null, error: 'Firebase not configured' };
  try {
    let q;
    if (classIds && classIds.length > 0) {
      q = query(
        collection(db, 'quizGateResults'),
        where('class_id', 'in', classIds),
        orderBy('created_at', 'desc')
      );
    } else {
      q = query(
        collection(db, 'quizGateResults'),
        orderBy('created_at', 'desc')
      );
    }
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

// ============================================
// Teacher Stats Functions
// ============================================

export async function fetchTeacherStats(classIds) {
  if (!db) return { data: null, error: 'Firebase not configured' };
  try {
    let q;
    if (classIds && classIds.length > 0) {
      q = query(
        collection(db, 'scores'),
        where('class_id', 'in', classIds),
        orderBy('created_at', 'desc')
      );
    } else {
      q = query(
        collection(db, 'scores'),
        orderBy('created_at', 'desc')
      );
    }
    const snapshot = await getDocs(q);
    const scores = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

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

// ============================================
// Link Session to Class (Late Join)
// ============================================

export async function linkSessionToClass({ sessionId, classId }) {
  if (!db || !sessionId || !classId) return { error: 'Missing params' };
  try {
    // Update quiz_gate_results
    const qgQuery = query(
      collection(db, 'quizGateResults'),
      where('session_id', '==', sessionId)
    );
    const qgSnapshot = await getDocs(qgQuery);
    if (!qgSnapshot.empty) {
      const batch1 = writeBatch(db);
      qgSnapshot.docs.forEach(d => {
        batch1.update(d.ref, { class_id: classId });
      });
      await batch1.commit();
    }

    // Update scores
    const scoresQuery = query(
      collection(db, 'scores'),
      where('session_id', '==', sessionId)
    );
    const scoresSnapshot = await getDocs(scoresQuery);
    if (!scoresSnapshot.empty) {
      const batch2 = writeBatch(db);
      scoresSnapshot.docs.forEach(d => {
        batch2.update(d.ref, { class_id: classId });
      });
      await batch2.commit();
    }

    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}
