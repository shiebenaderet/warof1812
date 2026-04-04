// Mock firebase modules — factories only use jest.fn() (no external refs, avoids hoisting issues)
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({ name: 'mock-app' })),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({})),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => {
  const batchMock = { update: jest.fn(), commit: jest.fn() };
  return {
    getFirestore: jest.fn(() => 'mock-db'),
    collection: jest.fn(),
    addDoc: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
    getDocs: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    serverTimestamp: jest.fn(() => 'mock-timestamp'),
    writeBatch: jest.fn(() => batchMock),
    _batchMock: batchMock,
  };
});

// Set env vars before the module is loaded (process.env runs after jest.mock hoisting, before require)
process.env.REACT_APP_FIREBASE_API_KEY = 'test-api-key';
process.env.REACT_APP_FIREBASE_PROJECT_ID = 'test-project-id';

// eslint-disable-next-line import/first
const { hideScore, renameStudent, moveStudent, mergeStudents, fetchAllStudents, fetchLeaderboard, deleteClass, fetchTeacherStats, fetchQuizGateStats } = require('../firebase');
// eslint-disable-next-line import/first
const firestoreMock = require('firebase/firestore');

const { doc, updateDoc, getDocs, writeBatch, deleteDoc } = firestoreMock;
const { update: batchUpdate, commit: batchCommit } = firestoreMock._batchMock;

describe('hideScore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    doc.mockReturnValue('mock-doc-ref');
    updateDoc.mockResolvedValue(undefined);
  });

  test('sets hidden field on score doc', async () => {
    const result = await hideScore('score123', true);
    expect(result.error).toBeNull();
    expect(doc).toHaveBeenCalledWith('mock-db', 'scores', 'score123');
    expect(updateDoc).toHaveBeenCalledWith('mock-doc-ref', { hidden: true });
  });

  test('can unhide a score', async () => {
    const result = await hideScore('score456', false);
    expect(result.error).toBeNull();
    expect(updateDoc).toHaveBeenCalledWith('mock-doc-ref', { hidden: false });
  });

  test('returns error on failure', async () => {
    updateDoc.mockRejectedValue(new Error('Permission denied'));
    const result = await hideScore('score789', true);
    expect(result.error).toBe('Permission denied');
  });
});

describe('renameStudent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    batchUpdate.mockReturnValue(undefined);
    batchCommit.mockResolvedValue(undefined);
    // Re-attach the batch mock since writeBatch returns the same batchMock object
    writeBatch.mockReturnValue(firestoreMock._batchMock);
  });

  test('updates display_name on all scores and quiz docs for session', async () => {
    const scoreDocs = [
      { ref: 'score-ref-1' },
      { ref: 'score-ref-2' },
    ];
    const quizDocs = [
      { ref: 'quiz-ref-1' },
    ];
    getDocs
      .mockResolvedValueOnce({ empty: false, docs: scoreDocs })
      .mockResolvedValueOnce({ empty: false, docs: quizDocs });

    const result = await renameStudent('session-abc', 'New Name');
    expect(result.error).toBeNull();
    expect(batchUpdate).toHaveBeenCalledTimes(3);
    expect(batchUpdate).toHaveBeenCalledWith('score-ref-1', { display_name: 'New Name' });
    expect(batchUpdate).toHaveBeenCalledWith('score-ref-2', { display_name: 'New Name' });
    expect(batchUpdate).toHaveBeenCalledWith('quiz-ref-1', { display_name: 'New Name' });
    expect(batchCommit).toHaveBeenCalledTimes(1);
  });

  test('returns error on failure', async () => {
    getDocs.mockRejectedValue(new Error('Network error'));
    const result = await renameStudent('session-abc', 'Name');
    expect(result.error).toBe('Network error');
  });
});

describe('moveStudent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    batchUpdate.mockReturnValue(undefined);
    batchCommit.mockResolvedValue(undefined);
    writeBatch.mockReturnValue(firestoreMock._batchMock);
  });

  test('updates class_id on all scores and quiz docs for session', async () => {
    const scoreDocs = [{ ref: 'score-ref-1' }];
    const quizDocs = [{ ref: 'quiz-ref-1' }, { ref: 'quiz-ref-2' }];
    getDocs
      .mockResolvedValueOnce({ empty: false, docs: scoreDocs })
      .mockResolvedValueOnce({ empty: false, docs: quizDocs });

    const result = await moveStudent('session-abc', 'class-xyz');
    expect(result.error).toBeNull();
    expect(batchUpdate).toHaveBeenCalledWith('score-ref-1', { class_id: 'class-xyz' });
    expect(batchUpdate).toHaveBeenCalledWith('quiz-ref-1', { class_id: 'class-xyz' });
    expect(batchUpdate).toHaveBeenCalledWith('quiz-ref-2', { class_id: 'class-xyz' });
    expect(batchCommit).toHaveBeenCalledTimes(1);
  });

  test('sets class_id to null for unassigned', async () => {
    getDocs
      .mockResolvedValueOnce({ empty: false, docs: [{ ref: 'ref-1' }] })
      .mockResolvedValueOnce({ empty: false, docs: [] });

    const result = await moveStudent('session-abc', null);
    expect(result.error).toBeNull();
    expect(batchUpdate).toHaveBeenCalledWith('ref-1', { class_id: null });
  });
});

describe('mergeStudents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    batchUpdate.mockReturnValue(undefined);
    batchCommit.mockResolvedValue(undefined);
    writeBatch.mockReturnValue(firestoreMock._batchMock);
  });

  test('rewrites absorbed student docs to match kept student', async () => {
    const keptScoreDocs = [{
      ref: 'kept-score-ref',
      data: () => ({ session_id: 'kept-sess', player_name: 'Jake Smith', display_name: null, class_id: 'class-1' }),
    }];
    const keptQuizDocs = [{
      ref: 'kept-quiz-ref',
      data: () => ({ question_id: 'q1' }),
    }];
    const absorbedScoreDocs = [{
      ref: 'absorbed-score-ref',
      data: () => ({ session_id: 'absorbed-sess', player_name: 'jake' }),
    }];
    const absorbedQuizDocs = [{
      ref: 'absorbed-quiz-ref-1',
      data: () => ({ question_id: 'q2' }),
    }, {
      ref: 'absorbed-quiz-ref-2',
      data: () => ({ question_id: 'q1' }),
    }];

    getDocs
      .mockResolvedValueOnce({ docs: keptScoreDocs })
      .mockResolvedValueOnce({ docs: keptQuizDocs })
      .mockResolvedValueOnce({ docs: absorbedScoreDocs })
      .mockResolvedValueOnce({ docs: absorbedQuizDocs });

    const result = await mergeStudents('kept-sess', ['absorbed-sess']);
    expect(result.error).toBeNull();

    expect(batchUpdate).toHaveBeenCalledWith('absorbed-score-ref', {
      session_id: 'kept-sess',
      player_name: 'Jake Smith',
      display_name: null,
      class_id: 'class-1',
    });

    expect(batchUpdate).toHaveBeenCalledWith('absorbed-quiz-ref-1', {
      session_id: 'kept-sess',
      player_name: 'Jake Smith',
      display_name: null,
      class_id: 'class-1',
    });

    // Duplicate quiz doc (q1) should NOT be updated
    const allUpdateCalls = batchUpdate.mock.calls.map(c => c[0]);
    expect(allUpdateCalls).not.toContain('absorbed-quiz-ref-2');

    expect(batchCommit).toHaveBeenCalled();
  });
});

describe('fetchAllStudents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('groups scores by session_id and returns student list', async () => {
    const scoreDocs = [
      { id: 's1', data: () => ({ session_id: 'sess-1', player_name: 'Alice', display_name: null, class_id: 'c1', final_score: 100 }) },
      { id: 's2', data: () => ({ session_id: 'sess-1', player_name: 'Alice', display_name: null, class_id: 'c1', final_score: 200 }) },
      { id: 's3', data: () => ({ session_id: 'sess-2', player_name: 'Bob', display_name: 'Robert', class_id: 'c1', final_score: 150 }) },
    ];
    getDocs
      .mockResolvedValueOnce({ docs: scoreDocs })
      .mockResolvedValueOnce({ docs: [] }); // unaffiliated (none)

    const result = await fetchAllStudents(['c1']);
    expect(result.error).toBeNull();
    expect(result.data).toHaveLength(2);

    const alice = result.data.find(s => s.sessionId === 'sess-1');
    expect(alice.playerName).toBe('Alice');
    expect(alice.displayName).toBeNull();
    expect(alice.gameCount).toBe(2);

    const bob = result.data.find(s => s.sessionId === 'sess-2');
    expect(bob.playerName).toBe('Bob');
    expect(bob.displayName).toBe('Robert');
    expect(bob.gameCount).toBe(1);
  });

  test('includes unassigned students when no classIds', async () => {
    const scoreDocs = [
      { id: 's1', data: () => ({ session_id: 'sess-1', player_name: 'Unassigned Kid', display_name: null, class_id: null, final_score: 50 }) },
    ];
    getDocs.mockResolvedValueOnce({ docs: scoreDocs });

    const result = await fetchAllStudents();
    expect(result.error).toBeNull();
    expect(result.data).toHaveLength(1);
    expect(result.data[0].classId).toBeNull();
  });

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
});

describe('fetchLeaderboard (hidden + display_name)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('filters out hidden scores and preserves display_name', async () => {
    const scoreDocs = [
      { id: 's1', data: () => ({ player_name: 'Alice', display_name: 'Allie', hidden: false, final_score: 200 }) },
      { id: 's2', data: () => ({ player_name: 'Bob', display_name: null, hidden: true, final_score: 300 }) },
      { id: 's3', data: () => ({ player_name: 'Charlie', final_score: 100 }) },
    ];
    getDocs.mockResolvedValueOnce({ docs: scoreDocs });

    const result = await fetchLeaderboard({ limit: 25 });
    expect(result.data).toHaveLength(2);
    expect(result.data[0].display_name).toBe('Allie');
    expect(result.data[0].player_name).toBe('Alice');
    expect(result.data[1].player_name).toBe('Charlie');
  });
});

describe('deleteClass', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    doc.mockReturnValue('mock-doc-ref');
    deleteDoc.mockResolvedValue(undefined);
    batchUpdate.mockReturnValue(undefined);
    batchCommit.mockResolvedValue(undefined);
    writeBatch.mockReturnValue(firestoreMock._batchMock);
  });

  test('deletes class doc and unassigns linked scores and quiz docs', async () => {
    const scoreDocs = [{ ref: 'score-ref-1' }];
    const quizDocs = [{ ref: 'quiz-ref-1' }];
    getDocs
      .mockResolvedValueOnce({ docs: scoreDocs })
      .mockResolvedValueOnce({ docs: quizDocs });

    const result = await deleteClass('class-123');
    expect(result.error).toBeNull();
    expect(deleteDoc).toHaveBeenCalledWith('mock-doc-ref');
    expect(batchUpdate).toHaveBeenCalledWith('score-ref-1', { class_id: null });
    expect(batchUpdate).toHaveBeenCalledWith('quiz-ref-1', { class_id: null });
    expect(batchCommit).toHaveBeenCalled();
  });

  test('skips batch when no linked docs', async () => {
    getDocs
      .mockResolvedValueOnce({ docs: [] })
      .mockResolvedValueOnce({ docs: [] });

    const result = await deleteClass('class-456');
    expect(result.error).toBeNull();
    expect(deleteDoc).toHaveBeenCalled();
    expect(batchCommit).not.toHaveBeenCalled();
  });
});

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
