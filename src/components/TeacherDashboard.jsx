import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchTeacherStats,
  fetchQuizGateStats,
  fetchAllStudents,
  hideScore,
  renameStudent,
  moveStudent,
  mergeStudents,
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
import ManageStudents from './ManageStudents';
import quizGateQuestions from '../data/quizGateQuestions';
import { CURRENT_VERSION } from '../data/changelog';

const factionLabels = {
  us: 'United States',
  british: 'British/Canada',
  native: 'Native Coalition',
};

const questionLabels = {};
quizGateQuestions.forEach(q => {
  questionLabels[q.id] = q.question;
});

// ============================================
// AuthGate — replaces old password LoginGate
// ============================================

function AuthGate({ onAuthenticated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const { user, error: err } = await signInWithGoogle();
    setLoading(false);
    if (err) {
      setError(err);
    } else if (user) {
      onAuthenticated(user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
      <div className="bg-war-navy border border-war-gold/20 rounded-lg p-8 max-w-sm w-full shadow-modal animate-fadein text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-war-gold/60" />
          <p className="text-war-copper text-xs tracking-[0.2em] uppercase font-body font-bold">Administration</p>
          <div className="w-1.5 h-1.5 rounded-full bg-war-gold/60" />
        </div>
        <h1 className="text-war-gold font-display text-2xl mb-1 tracking-wide">Teacher Dashboard</h1>
        <p className="text-parchment-dark/40 text-xs mb-6 font-body">War of 1812 &mdash; Class Analytics</p>

        {error && <p className="text-red-400 text-sm mb-3 font-body">{error}</p>}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`w-full py-3 font-display text-sm rounded font-bold tracking-wide shadow-copper transition-colors flex items-center justify-center gap-2 ${
            loading
              ? 'bg-parchment-dark/20 text-parchment-dark/40 cursor-not-allowed'
              : 'bg-war-gold text-war-ink hover:bg-war-brass cursor-pointer'
          }`}
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <a
          href={window.location.pathname}
          className="block text-center text-parchment-dark/40 text-xs mt-4 hover:text-war-gold/70 transition-colors font-body"
        >
          Back to Game
        </a>
      </div>
    </div>
  );
}

// ============================================
// SetupProfile — first-time teacher
// ============================================

function SetupProfile({ userId, email, onComplete }) {
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setLoading(true);
    setError('');
    const { data, error: err } = await createTeacherProfile({
      userId,
      displayName: displayName.trim(),
      email,
    });
    setLoading(false);
    if (err) {
      setError(typeof err === 'string' ? err : err.message || 'Failed to create profile');
    } else {
      onComplete(data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
      <form onSubmit={handleSubmit} className="bg-war-navy border border-war-gold/20 rounded-lg p-8 max-w-sm w-full shadow-modal animate-fadein">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-war-gold/60" />
          <p className="text-war-copper text-xs tracking-[0.2em] uppercase font-body font-bold">Welcome</p>
          <div className="w-1.5 h-1.5 rounded-full bg-war-gold/60" />
        </div>
        <h1 className="text-war-gold font-display text-2xl mb-1 text-center tracking-wide">Set Up Your Profile</h1>
        <p className="text-parchment-dark/40 text-xs text-center mb-6 font-body">This name will be visible to you on the dashboard.</p>
        {error && <p className="text-red-400 text-sm text-center mb-3 font-body">{error}</p>}
        <label htmlFor="display-name" className="sr-only">Display Name</label>
        <input
          id="display-name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value.slice(0, 50))}
          placeholder="e.g., Mr. B"
          className="w-full px-4 py-3 bg-war-ink/50 border border-parchment-dark/15 rounded
                     text-parchment/80 font-body text-sm placeholder-parchment-dark/30 focus:border-war-gold/40
                     focus:outline-none mb-4"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !displayName.trim()}
          className={`w-full py-3 font-display text-sm rounded font-bold tracking-wide shadow-copper transition-colors ${
            loading || !displayName.trim()
              ? 'bg-parchment-dark/20 text-parchment-dark/40 cursor-not-allowed'
              : 'bg-war-gold text-war-ink hover:bg-war-brass cursor-pointer'
          }`}
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}

// ============================================
// ClassManager — create and list classes
// ============================================

function ClassManager({ classes, teacherId, onClassCreated, onClassDeleted }) {
  const [creating, setCreating] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    setCreateLoading(true);
    setCreateError('');
    const { data, error } = await createClass({ teacherId, name: newClassName.trim() });
    setCreateLoading(false);
    if (error) {
      setCreateError(typeof error === 'string' ? error : error.message || 'Failed to create class');
    } else {
      onClassCreated(data);
      setNewClassName('');
      setCreating(false);
    }
  };

  const copyLink = (code) => {
    const url = `https://1812.mrbsocialstudies.org?class=${code}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }).catch(() => {});
  };

  return (
    <div className="bg-war-navy/50 rounded-lg p-5 border border-parchment-dark/8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-war-gold/80 font-display text-base tracking-wide">Your Classes</h2>
          <p className="text-parchment-dark/40 text-xs font-body mt-0.5">
            Share codes with students so their data appears here
          </p>
        </div>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="px-4 py-1.5 bg-war-gold text-war-ink font-display text-xs rounded font-bold
                       hover:bg-war-brass transition-colors cursor-pointer tracking-wide"
          >
            Create Class
          </button>
        )}
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="mb-4 flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-parchment/60 text-xs uppercase tracking-wider mb-1 font-body font-bold">
              Class Name
            </label>
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value.slice(0, 40))}
              placeholder="e.g., Period 3"
              className="w-full bg-war-ink/50 border border-parchment-dark/15 rounded px-3 py-2 text-parchment/90
                         placeholder-parchment-dark/30 font-body text-sm focus:border-war-gold/40 focus:outline-none transition-colors"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={createLoading || !newClassName.trim()}
            className={`px-4 py-2 font-display text-xs rounded font-bold tracking-wide transition-colors ${
              createLoading || !newClassName.trim()
                ? 'bg-parchment-dark/20 text-parchment-dark/40 cursor-not-allowed'
                : 'bg-war-gold text-war-ink hover:bg-war-brass cursor-pointer'
            }`}
          >
            {createLoading ? '...' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => { setCreating(false); setCreateError(''); }}
            className="px-3 py-2 text-parchment-dark/40 text-xs font-body hover:text-parchment/60 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </form>
      )}
      {createError && <p className="text-red-400 text-xs mb-3 font-body">{createError}</p>}

      {classes.length === 0 ? (
        <p className="text-parchment-dark/40 italic font-body text-sm">
          No classes yet. Create one and share the code with your students.
        </p>
      ) : (
        <div className="space-y-2">
          {classes.map((cls) => (
            <div key={cls.id} className="flex items-center justify-between bg-black/20 rounded px-4 py-3 border border-parchment-dark/8">
              <div>
                <p className="text-parchment/80 font-body text-sm font-bold">{cls.name}</p>
                <p className="text-parchment-dark/50 font-mono text-xs tracking-widest mt-0.5">
                  Code: <span className="text-war-gold/80 font-bold">{cls.code}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => copyLink(cls.code)}
                  className="px-3 py-1.5 text-xs border border-parchment-dark/15 text-parchment-dark/50 rounded
                             hover:border-war-gold/40 hover:text-war-gold transition-colors cursor-pointer font-body"
                >
                  {copiedCode === cls.code ? 'Copied!' : 'Copy Link'}
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${cls.name}"? Student data will be preserved but unassigned.`)) {
                      onClassDeleted(cls.id);
                    }
                  }}
                  className="px-2 py-1.5 text-xs text-parchment-dark/30 hover:text-red-400 transition-colors cursor-pointer"
                  aria-label={`Delete ${cls.name}`}
                  title="Delete class"
                >
                  &#10005;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// Dashboard — main dashboard content
// ============================================

function Dashboard({ session, profile, onSignOut }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [quizGateData, setQuizGateData] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [editingScoreId, setEditingScoreId] = useState(null);
  const [editScoreValue, setEditScoreValue] = useState('');

  const loadData = useCallback(async (classIds) => {
    setLoading(true);
    try {
      const [statsResult, qgResult, studentsResult] = await Promise.all([
        fetchTeacherStats(classIds),
        fetchQuizGateStats(classIds),
        fetchAllStudents(classIds),
      ]);
      setStats(statsResult.data);
      setQuizGateData(qgResult.data || []);
      setStudentData(studentsResult.data || []);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: classList } = await fetchTeacherClasses(session.user.id);
      setClasses(classList || []);
      const classIds = (classList || []).map(c => c.id);
      await loadData(classIds.length > 0 ? classIds : undefined);
    };
    init();
  }, [session.user.id, loadData]);

  const handleClassCreated = (newClass) => {
    setClasses(prev => [...prev, newClass]);
  };

  const handleSignOut = async () => {
    await signOut();
    onSignOut();
  };

  // Filter by selected class
  const classNameMap = {};
  classes.forEach(c => { classNameMap[c.id] = c.name; });

  const filteredScores = selectedClass
    ? (stats?.allScores || []).filter(s => s.class_id === selectedClass)
    : stats?.allScores || [];

  const filteredQGData = selectedClass
    ? quizGateData.filter(r => r.class_id === selectedClass)
    : quizGateData;

  const allClassIds = classes.map(c => c.id);
  const refreshData = () => loadData(allClassIds.length > 0 ? allClassIds : undefined);

  const handleClassDeleted = async (classId) => {
    await deleteClass(classId);
    setClasses(prev => prev.filter(c => c.id !== classId));
    await refreshData();
  };

  const handleHideScore = async (scoreId, hidden) => {
    await hideScore(scoreId, hidden);
    await refreshData();
  };

  const handleRenameStudent = async (sessionId, displayName) => {
    await renameStudent(sessionId, displayName);
    await refreshData();
  };

  const handleMoveStudent = async (sessionId, newClassId) => {
    await moveStudent(sessionId, newClassId);
    await refreshData();
  };

  const handleMergeStudents = async (keptSessionId, absorbedSessionIds) => {
    await mergeStudents(keptSessionId, absorbedSessionIds);
    await refreshData();
  };

  const startScoreRename = (score) => {
    setEditingScoreId(score.id);
    setEditScoreValue(score.display_name || score.player_name);
  };

  const saveScoreRename = async (score) => {
    const trimmed = editScoreValue.trim();
    if (!trimmed || trimmed === (score.display_name || score.player_name)) {
      setEditingScoreId(null);
      return;
    }
    await handleRenameStudent(score.session_id, trimmed);
    setEditingScoreId(null);
  };

  const qgSessions = new Set(filteredQGData.map(r => r.session_id));

  const qgQuestionStats = quizGateQuestions.map(q => {
    const rows = filteredQGData.filter(r => r.question_id === q.id);
    const totalStudents = rows.length;
    const totalRetries = rows.reduce((sum, r) => sum + r.retries, 0);
    const firstTryCount = rows.filter(r => r.retries === 0).length;
    return {
      id: q.id,
      question: q.question,
      totalStudents,
      avgRetries: totalStudents > 0 ? (totalRetries / totalStudents) : 0,
      firstTryPercent: totalStudents > 0 ? Math.round((firstTryCount / totalStudents) * 100) : 0,
      rows,
    };
  }).sort((a, b) => b.avgRetries - a.avgRetries);

  const exportCSV = () => {
    const headers = ['Name', 'Class', 'Faction', 'Difficulty', 'Score', 'Quiz Correct', 'Quiz Total', 'Quiz %', 'Battles Won', 'Battles Fought', 'Territories', 'Date'];
    const rows = filteredScores.map((s) => [
      s.display_name || s.player_name,
      classNameMap[s.class_id] || s.class_period || 'Unassigned',
      factionLabels[s.faction] || s.faction,
      s.difficulty || 'medium',
      s.final_score,
      s.knowledge_correct,
      s.knowledge_total,
      s.knowledge_total > 0 ? Math.round((s.knowledge_correct / s.knowledge_total) * 100) : 0,
      s.battles_won,
      s.battles_fought,
      s.territories_held,
      new Date(s.created_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `war1812_scores${selectedClass ? `_${classNameMap[selectedClass] || selectedClass}` : ''}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportQuizGateCSV = () => {
    const headers = ['Student', 'Class', 'Mode', 'Question', 'Retries', 'Date'];
    const rows = filteredQGData.map(r => [
      r.player_name,
      classNameMap[r.class_id] || r.class_period || 'Unassigned',
      r.game_mode,
      questionLabels[r.question_id] || r.question_id,
      r.retries,
      new Date(r.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `war1812_quiz_gate${selectedClass ? `_${classNameMap[selectedClass] || selectedClass}` : ''}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
        <p className="text-parchment/60 font-body text-base italic">Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
        <p className="text-red-400/80 font-body text-base">Failed to load data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-parchment" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
      {/* Header */}
      <header className="bg-war-navy/80 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 border-b border-war-gold/15 flex items-center justify-between gap-3 sticky top-0 z-10">
        <div>
          <h1 className="text-war-gold font-display text-lg md:text-xl tracking-wide">
            Welcome, {profile.display_name}
          </h1>
          <p className="text-parchment-dark/40 text-xs font-body">
            War of 1812 v{CURRENT_VERSION} &mdash; {stats.totalGames} games played
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={window.location.pathname}
            className="px-3 md:px-4 py-2 border border-parchment-dark/15 text-parchment-dark/50 rounded
                       hover:border-war-gold/40 hover:text-war-gold transition-colors text-xs font-body cursor-pointer"
          >
            Back to Game
          </a>
          <button
            onClick={handleSignOut}
            className="px-3 md:px-4 py-2 border border-parchment-dark/15 text-parchment-dark/50 rounded
                       hover:border-war-red/40 hover:text-war-red/80 transition-colors text-xs font-body cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="p-3 md:p-6 max-w-6xl mx-auto space-y-4 md:space-y-6">
        {/* Class Manager */}
        <ClassManager
          classes={classes}
          teacherId={session.user.id}
          onClassCreated={handleClassCreated}
          onClassDeleted={handleClassDeleted}
        />

        {/* Manage Students */}
        <ManageStudents
          students={studentData}
          classes={classes}
          onRename={handleRenameStudent}
          onMove={handleMoveStudent}
          onMerge={handleMergeStudents}
          selectedClass={selectedClass}
        />

        {/* Game Guide Summary */}
        <div className="bg-war-navy/50 rounded-lg p-5 border border-parchment-dark/8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-war-gold/80 font-display text-base tracking-wide">Game Guide</h2>
            <a
              href="#guide"
              className="text-war-gold/60 hover:text-war-gold text-xs font-body transition-colors"
            >
              Full Teacher Guide &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-l-2 border-war-gold/20 pl-3">
              <p className="text-parchment/80 text-sm font-body font-bold mb-1">How It Works</p>
              <p className="text-parchment/50 text-xs font-body leading-relaxed">
                Students choose a faction, manage territories on an interactive map, and answer knowledge checks while learning about the War of 1812. Games take 30-45 minutes with save/resume support.
              </p>
            </div>
            <div className="border-l-2 border-war-copper/20 pl-3">
              <p className="text-parchment/80 text-sm font-body font-bold mb-1">What Students Learn</p>
              <p className="text-parchment/50 text-xs font-body leading-relaxed">
                Causes and events of the war, multiple perspectives (U.S., British, Native), diverse experiences (women, African Americans), geographic reasoning, and connections to later American history.
              </p>
            </div>
            <div className="border-l-2 border-parchment-dark/15 pl-3">
              <p className="text-parchment/80 text-sm font-body font-bold mb-1">Using This Dashboard</p>
              <p className="text-parchment/50 text-xs font-body leading-relaxed">
                Create classes and share codes. Monitor quiz scores, compare classes, track faction choices, and export CSV data. Use quiz performance to identify topics needing additional instruction.
              </p>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-war-navy/50 rounded-lg p-4 text-center border border-parchment-dark/8">
            <p className="text-3xl font-bold text-war-gold font-display">{stats.totalGames}</p>
            <p className="text-xs text-parchment-dark/40 font-body">Total Games</p>
          </div>
          <div className="bg-war-navy/50 rounded-lg p-4 text-center border border-parchment-dark/8">
            <p className="text-3xl font-bold text-parchment/80 font-display">
              {stats.totalGames > 0
                ? Math.round(stats.allScores.reduce((a, s) => a + s.final_score, 0) / stats.totalGames)
                : 0}
            </p>
            <p className="text-xs text-parchment-dark/40 font-body">Avg Score</p>
          </div>
          <div className="bg-war-navy/50 rounded-lg p-4 text-center border border-parchment-dark/8">
            <p className="text-3xl font-bold text-green-400 font-display">
              {stats.allScores.filter((s) => s.knowledge_total > 0).length > 0
                ? Math.round(
                    stats.allScores
                      .filter((s) => s.knowledge_total > 0)
                      .reduce((a, s) => a + (s.knowledge_correct / s.knowledge_total) * 100, 0)
                    / stats.allScores.filter((s) => s.knowledge_total > 0).length
                  )
                : 0}%
            </p>
            <p className="text-xs text-parchment-dark/40 font-body">Avg Quiz Score</p>
          </div>
          <div className="bg-war-navy/50 rounded-lg p-4 text-center border border-parchment-dark/8">
            <p className="text-3xl font-bold text-parchment/80 font-display">{classes.length}</p>
            <p className="text-xs text-parchment-dark/40 font-body">Classes</p>
          </div>
        </div>

        {/* Class Breakdown */}
        {classes.length > 0 && (
          <div className="bg-war-navy/50 rounded-lg p-5 border border-parchment-dark/8">
            <h2 className="text-war-gold/80 font-display text-base mb-4 tracking-wide">By Class</h2>
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="text-parchment-dark/40 border-b border-parchment-dark/15 text-left">
                  <th className="py-2 font-normal">Class</th>
                  <th className="py-2 text-right font-normal">Games</th>
                  <th className="py-2 text-right font-normal">Avg Score</th>
                  <th className="py-2 text-right font-normal">Top Score</th>
                  <th className="py-2 text-right font-normal">Avg Quiz %</th>
                </tr>
              </thead>
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
              </tbody>
            </table>
          </div>
        )}

        {/* Faction Distribution */}
        <div className="bg-war-navy/50 rounded-lg p-5 border border-parchment-dark/8">
          <h2 className="text-war-gold/80 font-display text-base mb-4 tracking-wide">Faction Distribution</h2>
          <div className="grid grid-cols-3 gap-4">
            {stats.factionStats.map((f) => (
              <div key={f.faction} className="text-center">
                <p className="text-2xl font-bold text-parchment/80 font-display">{f.count}</p>
                <p className="text-xs text-parchment-dark/50 font-body">{factionLabels[f.faction]}</p>
                <p className="text-xs text-war-gold/60 font-body">Avg: {f.avgScore}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Gate Analytics */}
        <div className="bg-war-navy/50 rounded-lg p-5 border border-parchment-dark/8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-war-gold/80 font-display text-base tracking-wide">Quiz Gate Analytics</h2>
              <p className="text-parchment-dark/40 text-xs font-body mt-0.5">
                {qgSessions.size} students attempted the pre-game quiz
              </p>
            </div>
            {filteredQGData.length > 0 && (
              <button
                onClick={exportQuizGateCSV}
                className="px-4 py-1.5 text-xs border border-parchment-dark/15 text-parchment-dark/50 rounded
                           hover:border-war-gold/40 hover:text-war-gold transition-colors cursor-pointer font-body"
              >
                Export Quiz CSV
              </button>
            )}
          </div>

          {filteredQGData.length === 0 ? (
            <p className="text-parchment-dark/40 italic font-body text-sm">No quiz gate data yet</p>
          ) : (
            <div className="space-y-1">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="text-parchment-dark/40 border-b border-parchment-dark/15 text-left">
                    <th className="py-2 font-normal">#</th>
                    <th className="py-2 font-normal">Question</th>
                    <th className="py-2 text-right font-normal">Avg Retries</th>
                    <th className="py-2 text-right font-normal">First-Try %</th>
                    <th className="py-2 text-right font-normal">Students</th>
                  </tr>
                </thead>
                <tbody>
                  {qgQuestionStats.map((q, idx) => (
                    <React.Fragment key={q.id}>
                      <tr
                        className="border-b border-parchment-dark/8 cursor-pointer hover:bg-war-gold/5 transition-colors"
                        onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                      >
                        <td className="py-2 text-parchment-dark/50">{idx + 1}</td>
                        <td className="py-2 text-parchment/80 max-w-xs">
                          <span className="line-clamp-1">{q.question}</span>
                        </td>
                        <td className="py-2 text-right font-bold font-display text-parchment/80">
                          {q.avgRetries.toFixed(1)}
                        </td>
                        <td className="py-2 text-right">
                          <span className={`font-bold font-display ${
                            q.firstTryPercent >= 70 ? 'text-green-400' :
                            q.firstTryPercent >= 40 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {q.firstTryPercent}%
                          </span>
                        </td>
                        <td className="py-2 text-right text-parchment-dark/60">{q.totalStudents}</td>
                      </tr>
                      {expandedQuestion === q.id && q.rows.length > 0 && (
                        <tr>
                          <td colSpan={5} className="p-0">
                            <div className="bg-black/20 border-l-2 border-war-gold/20 ml-4 mb-2 rounded-r">
                              <table className="w-full text-xs font-body">
                                <thead>
                                  <tr className="text-parchment-dark/40 border-b border-parchment-dark/10">
                                    <th className="py-1.5 px-3 font-normal text-left">Student</th>
                                    <th className="py-1.5 px-3 font-normal text-left">Class</th>
                                    <th className="py-1.5 px-3 font-normal text-left">Mode</th>
                                    <th className="py-1.5 px-3 font-normal text-right">Retries</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {[...q.rows].sort((a, b) => b.retries - a.retries).map((r) => (
                                    <tr key={r.session_id} className="border-b border-parchment-dark/5">
                                      <td className="py-1.5 px-3 text-parchment/70">{r.player_name}</td>
                                      <td className="py-1.5 px-3 text-parchment-dark/50">{classNameMap[r.class_id] || r.class_period || '-'}</td>
                                      <td className="py-1.5 px-3 text-parchment-dark/50 capitalize">{r.game_mode}</td>
                                      <td className="py-1.5 px-3 text-right">
                                        <span className={`font-bold ${r.retries === 0 ? 'text-green-400' : r.retries <= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                                          {r.retries}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Individual Scores */}
        <div className="bg-war-navy/50 rounded-lg p-5 border border-parchment-dark/8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-war-gold/80 font-display text-base tracking-wide">All Scores</h2>
            <div className="flex items-center gap-3">
              {classes.length > 0 && (
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
                </select>
              )}
              <button
                onClick={exportCSV}
                className="px-4 py-1.5 text-xs border border-parchment-dark/15 text-parchment-dark/50 rounded
                           hover:border-war-gold/40 hover:text-war-gold transition-colors cursor-pointer font-body"
              >
                Export CSV
              </button>
            </div>
          </div>

          {filteredScores.length === 0 ? (
            <p className="text-parchment-dark/40 italic font-body text-sm">No scores found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="text-parchment-dark/40 border-b border-parchment-dark/15 text-left">
                    <th className="py-2 font-normal">Name</th>
                    <th className="py-2 font-normal">Class</th>
                    <th className="py-2 font-normal">Faction</th>
                    <th className="py-2 font-normal">Difficulty</th>
                    <th className="py-2 text-right font-normal">Score</th>
                    <th className="py-2 text-right font-normal">Quiz</th>
                    <th className="py-2 text-right font-normal">Battles</th>
                    <th className="py-2 text-right font-normal">Date</th>
                    <th className="py-2 text-right font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScores.map((s) => (
                    <tr
                      key={s.id}
                      className={`border-b border-parchment-dark/8 ${
                        s.hidden ? 'opacity-50' : ''
                      }`}
                    >
                      <td className="py-2">
                        {editingScoreId === s.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={editScoreValue}
                              onChange={(e) => setEditScoreValue(e.target.value.slice(0, 50))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveScoreRename(s);
                                if (e.key === 'Escape') setEditingScoreId(null);
                              }}
                              className="bg-war-ink/50 border border-war-gold/30 rounded px-2 py-1 text-parchment/80 text-sm font-body
                                         focus:outline-none focus:border-war-gold/60 w-32"
                              autoFocus
                            />
                            <button
                              onClick={() => saveScoreRename(s)}
                              className="text-green-400 hover:text-green-300 text-xs cursor-pointer px-1"
                              aria-label="Save name"
                            >
                              &#10003;
                            </button>
                            <button
                              onClick={() => setEditingScoreId(null)}
                              className="text-parchment-dark/40 hover:text-parchment/60 text-xs cursor-pointer px-1"
                              aria-label="Cancel rename"
                            >
                              &#10005;
                            </button>
                          </div>
                        ) : (
                          <span className={`font-bold ${s.hidden ? 'line-through text-parchment-dark/40' : 'text-parchment/80'}`}>
                            {s.display_name || s.player_name}
                            {s.hidden && (
                              <span className="ml-2 text-[10px] text-red-400/60 font-bold uppercase tracking-wider no-underline inline-block">
                                Hidden
                              </span>
                            )}
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-parchment-dark/60">{classNameMap[s.class_id] || s.class_period || '-'}</td>
                      <td className="py-2 text-parchment-dark/60">{factionLabels[s.faction]}</td>
                      <td className="py-2 text-parchment-dark/60 capitalize">{s.difficulty || 'medium'}</td>
                      <td className="py-2 text-right text-war-gold font-bold font-display">{s.final_score}</td>
                      <td className="py-2 text-right text-parchment-dark/60">
                        {s.knowledge_total > 0
                          ? `${s.knowledge_correct}/${s.knowledge_total} (${Math.round((s.knowledge_correct / s.knowledge_total) * 100)}%)`
                          : '-'}
                      </td>
                      <td className="py-2 text-right text-parchment-dark/60">{s.battles_won}/{s.battles_fought}</td>
                      <td className="py-2 text-right text-parchment-dark/40">
                        {new Date(s.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-2 text-right whitespace-nowrap">
                        <button
                          onClick={() => startScoreRename(s)}
                          className="text-parchment-dark/40 hover:text-war-gold transition-colors cursor-pointer text-xs px-1"
                          aria-label={`Rename ${s.display_name || s.player_name}`}
                          title="Rename"
                        >
                          &#9998;
                        </button>
                        <button
                          onClick={() => handleHideScore(s.id, !s.hidden)}
                          className={`transition-colors cursor-pointer text-xs px-1 ${
                            s.hidden
                              ? 'text-red-400/50 hover:text-green-400'
                              : 'text-parchment-dark/40 hover:text-red-400'
                          }`}
                          aria-label={s.hidden ? 'Unhide score' : 'Hide score'}
                          title={s.hidden ? 'Unhide from leaderboard' : 'Hide from leaderboard'}
                        >
                          {s.hidden ? '\u25CB' : '\u25CF'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// TeacherDashboard — main export
// ============================================

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const { unsubscribe } = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const { data: prof } = await getTeacherProfile(firebaseUser.uid);
        setProfile(prof);
      } else {
        setUser(null);
        setProfile(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (!db) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
        <div className="text-center">
          <h1 className="text-war-gold font-display text-2xl mb-4 tracking-wide">Teacher Dashboard</h1>
          <p className="text-parchment-dark/50 mb-4 font-body text-sm">
            Firebase is not configured. Add your credentials to .env to enable the dashboard.
          </p>
          <a
            href={window.location.pathname}
            className="text-war-gold/70 hover:text-war-gold transition-colors font-body text-sm"
          >
            Back to Game
          </a>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
        <p className="text-parchment/60 font-body text-base italic">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthGate onAuthenticated={(u) => setUser(u)} />;
  }

  if (!profile) {
    return (
      <SetupProfile
        userId={user.uid}
        email={user.email}
        onComplete={(prof) => setProfile(prof)}
      />
    );
  }

  const session = { user: { id: user.uid, email: user.email } };

  return (
    <Dashboard
      session={session}
      profile={profile}
      onSignOut={() => { setUser(null); setProfile(null); }}
    />
  );
}
