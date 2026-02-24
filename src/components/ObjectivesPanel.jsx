import React, { useState } from 'react';

export default function ObjectivesPanel({ objectives }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!objectives || objectives.length === 0) return null;

  const completed = objectives.filter((o) => o.completed).length;

  return (
    <div className="bg-war-navy/50 rounded-lg p-3 border border-parchment-dark/8">
      <h3 className="text-war-gold/90 font-display text-sm tracking-wide border-b border-war-gold/15 pb-2 mb-3">
        Objectives ({completed}/{objectives.length})
      </h3>
      <div className="space-y-2">
        {objectives.map((obj) => {
          const isExpanded = expandedId === obj.id;
          const progressInfo = obj.progressInfo;
          const progressPercent = progressInfo
            ? Math.round((progressInfo.current / progressInfo.total) * 100)
            : obj.completed ? 100 : 0;

          return (
            <div
              key={obj.id}
              className={`p-2 rounded cursor-pointer transition-colors ${
                obj.completed ? 'bg-green-900/15' : 'hover:bg-black/15'
              }`}
              onClick={() => setExpandedId(isExpanded ? null : obj.id)}
            >
              <div className="flex items-start gap-2">
                <span className="text-sm mt-0.5 flex-shrink-0">
                  {obj.completed ? '\u2705' : '\u2B1C'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-bold font-body ${obj.completed ? 'text-green-300/90' : 'text-parchment/80'}`}>
                    {obj.title}
                    <span className="text-war-gold/60 font-normal ml-1">({obj.points} pts)</span>
                  </p>
                  <p className="text-parchment-dark/50 text-sm font-body">{obj.description}</p>

                  {/* Progress bar */}
                  {!obj.completed && progressInfo && (
                    <div className="mt-1.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-war-ink rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%`, background: 'linear-gradient(to right, #854d0e, #c9a227)' }}
                          />
                        </div>
                        <span className="text-parchment-dark/40 text-xs font-body">
                          {progressInfo.current}/{progressInfo.total}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Historical context (expanded) */}
                  {isExpanded && obj.historicalContext && (
                    <div className="mt-2 bg-black/20 rounded px-3 py-2 border-l-2 border-war-copper/30">
                      <p className="text-war-copper/70 text-xs uppercase tracking-wide font-bold mb-0.5 font-body">Why It Matters</p>
                      <p className="text-parchment-dark/60 text-sm leading-relaxed font-body">{obj.historicalContext}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
