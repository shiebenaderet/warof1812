import React, { useState } from 'react';

export default function QuizReviewPanel({ history }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!history || history.length === 0) return null;

  return (
    <div className="bg-black bg-opacity-40 rounded-lg p-4">
      <h3 className="text-war-gold font-serif text-base border-b border-war-gold border-opacity-30 pb-2 mb-3">
        Quiz Review ({history.filter((h) => h.wasCorrect).length}/{history.length} correct)
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {history.map((entry, i) => {
          const isExpanded = expandedIndex === i;
          return (
            <div
              key={i}
              className={`p-2 rounded cursor-pointer transition-colors ${
                entry.wasCorrect ? 'bg-green-900 bg-opacity-20' : 'bg-red-900 bg-opacity-20'
              } hover:bg-black hover:bg-opacity-20`}
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
            >
              <div className="flex items-start gap-2">
                <span className="text-base mt-0.5 flex-shrink-0">
                  {entry.wasCorrect ? '\u2705' : '\u274C'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-parchment text-sm font-bold leading-snug">
                    {entry.question}
                    <span className="text-parchment-dark font-normal ml-1">(Rd {entry.round})</span>
                  </p>
                  {isExpanded && (
                    <div className="mt-2 space-y-1">
                      <p className="text-green-300 text-sm">
                        Correct: <span className="font-bold">{String.fromCharCode(65 + entry.correctIndex)}.</span> {entry.choices[entry.correctIndex]}
                      </p>
                      {!entry.wasCorrect && (
                        <p className="text-red-300 text-sm">
                          Your answer: <span className="font-bold">{String.fromCharCode(65 + entry.selectedIndex)}.</span> {entry.choices[entry.selectedIndex]}
                        </p>
                      )}
                      {entry.explanation && (
                        <div className="mt-1.5 bg-black bg-opacity-30 rounded px-3 py-2 border-l-2 border-war-gold">
                          <p className="text-parchment-dark text-sm leading-relaxed">{entry.explanation}</p>
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
