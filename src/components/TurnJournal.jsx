import React, { useState } from 'react';

export default function TurnJournal({ entries, round }) {
  const [expanded, setExpanded] = useState(false);

  if (!entries || entries.length === 0) return null;

  // Show current round + last round by default, all when expanded
  const visible = expanded ? entries : entries.filter((e) => e.round >= round - 1);

  return (
    <div className="bg-black bg-opacity-40 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-war-gold font-serif text-base border-b border-war-gold border-opacity-30 pb-2 flex-1">
          War Journal
        </h3>
        {entries.length > 2 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-parchment-dark text-sm hover:text-war-gold transition-colors cursor-pointer ml-2"
          >
            {expanded ? 'Recent' : `All (${entries.length})`}
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {visible.map((entry, i) => (
          <div key={i} className="border-l-2 border-parchment-dark border-opacity-20 pl-3">
            <p className="text-war-gold text-sm font-bold">
              Round {entry.round} — {entry.season}
            </p>
            {entry.items.map((item, j) => (
              <p key={j} className="text-parchment text-base leading-relaxed">
                {item}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
