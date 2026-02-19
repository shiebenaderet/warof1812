import React from 'react';

export default function ObjectivesPanel({ objectives }) {
  if (!objectives || objectives.length === 0) return null;

  const completed = objectives.filter((o) => o.completed).length;

  return (
    <div className="bg-black bg-opacity-40 rounded-lg p-4">
      <h3 className="text-war-gold font-serif text-base border-b border-war-gold border-opacity-30 pb-2 mb-3">
        Objectives ({completed}/{objectives.length})
      </h3>
      <div className="space-y-2">
        {objectives.map((obj) => (
          <div
            key={obj.id}
            className={`flex items-start gap-2 p-2 rounded ${
              obj.completed ? 'bg-green-900 bg-opacity-20' : ''
            }`}
          >
            <span className="text-base mt-0.5 flex-shrink-0">
              {obj.completed ? '\u2705' : '\u2B1C'}
            </span>
            <div className="min-w-0">
              <p className={`text-sm font-bold ${obj.completed ? 'text-green-300' : 'text-parchment'}`}>
                {obj.title}
                <span className="text-war-gold font-normal ml-1">({obj.points} pts)</span>
              </p>
              <p className="text-parchment-dark text-sm">{obj.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
