import React, { useState } from 'react';

export default function ObjectivesPanel({ objectives }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!objectives || objectives.length === 0) return null;

  const completed = objectives.filter((o) => o.completed).length;

  return (
    <div className="bg-black bg-opacity-40 rounded-lg p-4">
      <h3 className="text-war-gold font-serif text-base border-b border-war-gold border-opacity-30 pb-2 mb-3">
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
                obj.completed ? 'bg-green-900 bg-opacity-20' : 'hover:bg-black hover:bg-opacity-20'
              }`}
              onClick={() => setExpandedId(isExpanded ? null : obj.id)}
            >
              <div className="flex items-start gap-2">
                <span className="text-base mt-0.5 flex-shrink-0">
                  {obj.completed ? '\u2705' : '\u2B1C'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-bold ${obj.completed ? 'text-green-300' : 'text-parchment'}`}>
                    {obj.title}
                    <span className="text-war-gold font-normal ml-1">({obj.points} pts)</span>
                  </p>
                  <p className="text-parchment-dark text-sm">{obj.description}</p>

                  {/* Progress bar */}
                  {!obj.completed && progressInfo && (
                    <div className="mt-1.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-war-gold transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <span className="text-parchment-dark text-xs">
                          {progressInfo.current}/{progressInfo.total}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Historical context (expanded) */}
                  {isExpanded && obj.historicalContext && (
                    <div className="mt-2 bg-black bg-opacity-30 rounded px-3 py-2 border-l-2 border-blue-400">
                      <p className="text-blue-300 text-xs uppercase tracking-wide font-bold mb-0.5">Why It Matters</p>
                      <p className="text-parchment-dark text-xs leading-relaxed">{obj.historicalContext}</p>
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
