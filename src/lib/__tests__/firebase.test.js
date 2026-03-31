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
const { hideScore, renameStudent, moveStudent } = require('../firebase');
// eslint-disable-next-line import/first
const firestoreMock = require('firebase/firestore');

const { doc, updateDoc, getDocs, writeBatch } = firestoreMock;
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
