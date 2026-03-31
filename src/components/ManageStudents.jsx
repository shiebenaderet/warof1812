import React, { useState, useMemo } from 'react';

function MergeModal({ selectedStudents, onConfirm, onCancel }) {
  const [keptIndex, setKeptIndex] = useState(() => {
    let maxIdx = 0;
    selectedStudents.forEach((s, i) => {
      if (s.gameCount > selectedStudents[maxIdx].gameCount) maxIdx = i;
    });
    return maxIdx;
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 1100 }} role="presentation">
      <div className="bg-war-navy border border-war-gold/30 rounded-lg max-w-md w-full p-6 shadow-modal animate-fadein" role="dialog" aria-modal="true" aria-label="Merge students">
        <h3 className="text-war-gold font-display text-lg mb-1 tracking-wide">Merge Students</h3>
        <p className="text-parchment-dark/50 text-xs font-body mb-4">
          Select which name to keep. All games will be consolidated under the selected student.
        </p>
        <div className="space-y-2 mb-5">
          {selectedStudents.map((s, i) => (
            <label
              key={s.sessionId}
              className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-colors ${
                keptIndex === i
                  ? 'border-war-gold/40 bg-war-gold/5'
                  : 'border-parchment-dark/10 hover:border-parchment-dark/20'
              }`}
            >
              <input
                type="radio"
                name="kept-student"
                checked={keptIndex === i}
                onChange={() => setKeptIndex(i)}
                className="accent-war-gold"
              />
              <div className="flex-1">
                <p className="text-parchment/80 font-body text-sm font-bold">
                  {s.displayName || s.playerName}
                </p>
                {s.displayName && s.displayName !== s.playerName && (
                  <p className="text-parchment-dark/40 text-xs font-body">
                    Originally: {s.playerName}
                  </p>
                )}
              </div>
              <span className="text-parchment-dark/50 text-xs font-body">{s.gameCount} games</span>
            </label>
          ))}
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-parchment-dark/50 text-xs font-body hover:text-parchment/60 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selectedStudents[keptIndex])}
            className="px-5 py-2 bg-war-gold text-war-ink font-display text-xs rounded font-bold
                       hover:bg-war-brass transition-colors cursor-pointer tracking-wide"
          >
            Merge
          </button>
        </div>
      </div>
    </div>
  );
}

function detectDuplicates(students) {
  const groups = {};
  students.forEach(s => {
    const normalized = (s.displayName || s.playerName).toLowerCase().trim();
    if (!groups[normalized]) groups[normalized] = [];
    groups[normalized].push(s.sessionId);
  });

  const duplicateIds = new Set();

  Object.values(groups).forEach(ids => {
    if (ids.length > 1) ids.forEach(id => duplicateIds.add(id));
  });

  const names = Object.keys(groups);
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      if (names[i].startsWith(names[j]) || names[j].startsWith(names[i])) {
        groups[names[i]].forEach(id => duplicateIds.add(id));
        groups[names[j]].forEach(id => duplicateIds.add(id));
      }
    }
  }

  return duplicateIds;
}

export default function ManageStudents({
  students,
  classes,
  onRename,
  onMove,
  onMerge,
  selectedClass,
}) {
  const [selected, setSelected] = useState(new Set());
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showUnassigned, setShowUnassigned] = useState(false);
  const [mergeLoading, setMergeLoading] = useState(false);

  const filteredStudents = useMemo(() => {
    let list = students;
    if (selectedClass) {
      list = list.filter(s => s.classId === selectedClass);
    }
    if (!showUnassigned && !selectedClass) {
      list = list.filter(s => s.classId !== null);
    }
    return list;
  }, [students, selectedClass, showUnassigned]);

  const duplicateIds = useMemo(() => detectDuplicates(filteredStudents), [filteredStudents]);

  const toggleSelect = (sessionId) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(sessionId)) next.delete(sessionId);
      else next.add(sessionId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filteredStudents.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredStudents.map(s => s.sessionId)));
    }
  };

  const startRename = (student) => {
    setEditingId(student.sessionId);
    setEditValue(student.displayName || student.playerName);
  };

  const saveRename = async (student) => {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === (student.displayName || student.playerName)) {
      setEditingId(null);
      return;
    }
    await onRename(student.sessionId, trimmed);
    setEditingId(null);
  };

  const handleMergeConfirm = async (keptStudent) => {
    setMergeLoading(true);
    const absorbedIds = [...selected].filter(id => id !== keptStudent.sessionId);
    await onMerge(keptStudent.sessionId, absorbedIds);
    setSelected(new Set());
    setShowMergeModal(false);
    setMergeLoading(false);
  };

  if (students.length === 0) return null;

  const selectedStudentsList = filteredStudents.filter(s => selected.has(s.sessionId));
  const unassignedCount = students.filter(s => s.classId === null).length;

  return (
    <div className="bg-war-navy/50 rounded-lg p-5 border border-parchment-dark/8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-war-gold/80 font-display text-base tracking-wide">Manage Students</h2>
          <p className="text-parchment-dark/40 text-xs font-body mt-0.5">
            {filteredStudents.length} students &middot; Rename, move, or merge entries
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unassignedCount > 0 && !selectedClass && (
            <label className="flex items-center gap-2 text-xs font-body text-parchment-dark/50 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnassigned}
                onChange={(e) => setShowUnassigned(e.target.checked)}
                className="accent-war-gold"
              />
              Show unassigned ({unassignedCount})
            </label>
          )}
          {selected.size >= 2 && (
            <button
              onClick={() => setShowMergeModal(true)}
              disabled={mergeLoading}
              className="px-4 py-1.5 bg-war-copper text-war-ink font-display text-xs rounded font-bold
                         hover:bg-war-copper/80 transition-colors cursor-pointer tracking-wide"
            >
              {mergeLoading ? 'Merging...' : `Merge Selected (${selected.size})`}
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="text-parchment-dark/40 border-b border-parchment-dark/15 text-left">
              <th className="py-2 w-8 font-normal">
                <input
                  type="checkbox"
                  checked={filteredStudents.length > 0 && selected.size === filteredStudents.length}
                  onChange={toggleSelectAll}
                  className="accent-war-gold cursor-pointer"
                  aria-label="Select all students"
                />
              </th>
              <th className="py-2 font-normal">Name</th>
              <th className="py-2 font-normal">Class</th>
              <th className="py-2 text-right font-normal">Games</th>
              <th className="py-2 text-right font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr
                key={s.sessionId}
                className={`border-b border-parchment-dark/8 ${
                  duplicateIds.has(s.sessionId) ? 'bg-war-copper/5' : ''
                }`}
              >
                <td className="py-2">
                  <input
                    type="checkbox"
                    checked={selected.has(s.sessionId)}
                    onChange={() => toggleSelect(s.sessionId)}
                    className="accent-war-gold cursor-pointer"
                    aria-label={`Select ${s.displayName || s.playerName}`}
                  />
                </td>
                <td className="py-2">
                  {editingId === s.sessionId ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value.slice(0, 50))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveRename(s);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="bg-war-ink/50 border border-war-gold/30 rounded px-2 py-1 text-parchment/80 text-sm font-body
                                   focus:outline-none focus:border-war-gold/60 w-40"
                        autoFocus
                      />
                      <button
                        onClick={() => saveRename(s)}
                        className="text-green-400 hover:text-green-300 text-xs cursor-pointer px-1"
                        aria-label="Save name"
                      >
                        &#10003;
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-parchment-dark/40 hover:text-parchment/60 text-xs cursor-pointer px-1"
                        aria-label="Cancel rename"
                      >
                        &#10005;
                      </button>
                    </div>
                  ) : (
                    <div>
                      <span className="font-bold text-parchment/80">
                        {s.displayName || s.playerName}
                      </span>
                      {s.displayName && s.displayName !== s.playerName && (
                        <span className="text-parchment-dark/40 text-xs ml-2">
                          (was: {s.playerName})
                        </span>
                      )}
                      {duplicateIds.has(s.sessionId) && (
                        <span className="ml-2 text-[10px] text-war-copper/80 font-bold uppercase tracking-wider">
                          Possible duplicate
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className="py-2">
                  <select
                    value={s.classId || ''}
                    onChange={(e) => onMove(s.sessionId, e.target.value || null)}
                    className="bg-war-ink/50 text-parchment/80 border border-parchment-dark/15 rounded px-2 py-1 text-xs font-body
                               cursor-pointer focus:border-war-gold/40 focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </td>
                <td className="py-2 text-right text-parchment-dark/60">{s.gameCount}</td>
                <td className="py-2 text-right">
                  <button
                    onClick={() => startRename(s)}
                    className="text-parchment-dark/40 hover:text-war-gold transition-colors cursor-pointer text-xs px-1"
                    aria-label={`Rename ${s.displayName || s.playerName}`}
                    title="Rename"
                  >
                    &#9998;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showMergeModal && selectedStudentsList.length >= 2 && (
        <MergeModal
          selectedStudents={selectedStudentsList}
          onConfirm={handleMergeConfirm}
          onCancel={() => setShowMergeModal(false)}
        />
      )}
    </div>
  );
}
