import React, { useState } from 'react';

export default function QuizReviewPanel({ history }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!history || history.length === 0) return null;

  return (
    <div className="bg-war-navy/50 rounded-lg p-3 border border-parchment-dark/8">
      <h3 className="text-war-gold/90 font-display text-sm tracking-wide border-b border-war-gold/15 pb-2 mb-3">
        Quiz Review ({history.filter((h) => h.wasCorrect).length}/{history.length} correct)
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {history.map((entry, i) => {
          const isExpanded = expandedIndex === i;
          return (
            <div
              key={i}
              className={`p-2 rounded cursor-pointer transition-colors ${
                entry.wasCorrect ? 'bg-green-900/15' : 'bg-red-900/10'
              } hover:bg-black/15`}
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
            >
              <div className="flex items-start gap-2">
                <span className="text-sm mt-0.5 flex-shrink-0">
                  {entry.wasCorrect ? '\u2705' : '\u274C'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-parchment/80 text-sm font-bold leading-snug font-body">
                    {entry.question}
                    <span className="text-parchment-dark/40 font-normal ml-1">(Rd {entry.round})</span>
                  </p>
                  {isExpanded && (
                    <div className="mt-2 space-y-1">
                      <p className="text-green-400/80 text-sm font-body">
                        Correct: <span className="font-bold">{String.fromCharCode(65 + entry.correctIndex)}.</span> {entry.choices[entry.correctIndex]}
                      </p>
                      {!entry.wasCorrect && (
                        <p className="text-red-400/80 text-sm font-body">
                          Your answer: <span className="font-bold">{String.fromCharCode(65 + entry.selectedIndex)}.</span> {entry.choices[entry.selectedIndex]}
                        </p>
                      )}
                      {entry.explanation && (
                        <div className="mt-1.5 bg-black/20 rounded px-3 py-2 border-l-2 border-war-gold/20">
                          <p className="text-parchment-dark/60 text-sm leading-relaxed font-body">{entry.explanation}</p>
                        </div>
                      )}
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
