import React from 'react';

export default function KnowledgeCheckPanel({ totalAnswered, totalCorrect, onTakeCheck }) {
  const percent = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div className="bg-war-navy/50 rounded-lg p-3 border border-parchment-dark/8" data-tutorial="knowledge-check">
      <h3 className="text-war-gold/90 font-display text-sm tracking-wide border-b border-war-gold/15 pb-2 mb-3">
        History Quiz
      </h3>
      {totalAnswered > 0 ? (
        <div className="mb-3">
          <div className="flex justify-between text-sm text-parchment/70 mb-1.5 font-body">
            <span>{totalCorrect}/{totalAnswered} correct</span>
            <span className="text-war-gold font-bold">{percent}%</span>
          </div>
          <div className="w-full bg-war-ink rounded-full h-2 border border-parchment-dark/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${percent}%`, background: 'linear-gradient(to right, #854d0e, #c9a227)' }}
            />
          </div>
        </div>
      ) : (
        <p className="text-parchment-dark/40 text-sm italic mb-3 font-body">
          Test your knowledge of the War of 1812!
        </p>
      )}
      <button
        onClick={onTakeCheck}
        className="w-full py-2 bg-war-green text-parchment font-display text-xs rounded tracking-wide
                   hover:brightness-125 transition-all cursor-pointer border border-green-800/50"
      >
        Take a Quiz
      </button>
    </div>
  );
}
