import React from 'react';

export default function KnowledgeCheckPanel({ totalAnswered, totalCorrect, onTakeCheck }) {
  const percent = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div className="bg-black bg-opacity-40 rounded-lg p-4" data-tutorial="knowledge-check">
      <h3 className="text-war-gold font-serif text-base border-b border-war-gold border-opacity-30 pb-2 mb-3">
        History Quiz
      </h3>
      {totalAnswered > 0 ? (
        <div className="mb-3">
          <div className="flex justify-between text-sm text-parchment mb-1.5">
            <span>{totalCorrect}/{totalAnswered} correct</span>
            <span className="text-war-gold font-bold">{percent}%</span>
          </div>
          <div className="kc-panel-bar">
            <div className="kc-panel-bar-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      ) : (
        <p className="text-parchment-dark text-sm italic mb-3">
          Test your knowledge of the War of 1812!
        </p>
      )}
      <button
        onClick={onTakeCheck}
        className="w-full py-2 bg-war-green text-parchment font-serif text-sm rounded-lg
                   hover:brightness-125 transition-all cursor-pointer border border-green-800"
      >
        Take a Quiz
      </button>
    </div>
  );
}
