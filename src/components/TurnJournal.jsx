import React, { useState } from 'react';

export default function TurnJournal({ entries, round }) {
  const [expanded, setExpanded] = useState(false);

  if (!entries || entries.length === 0) return null;

  // Show current round + last round by default, all when expanded
  const visible = expanded ? entries : entries.filter((e) => e.round >= round - 1);

  return (
    <div className="bg-war-navy/50 rounded-lg p-3 border border-parchment-dark/8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-war-gold/90 font-display text-base tracking-wide border-b border-war-gold/15 pb-2 flex-1">
          War Journal
        </h3>
        {entries.length > 2 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-parchment-dark/40 text-sm hover:text-war-gold/70 transition-colors cursor-pointer ml-2 font-body"
          >
            {expanded ? 'Recent' : `All (${entries.length})`}
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {visible.map((entry, i) => (
          <div key={i} className="border-l-2 border-war-copper/20 pl-3">
            <p className="text-war-gold/70 text-sm font-bold font-body">
              Round {entry.round} &mdash; {entry.season}
            </p>
            {entry.items.map((item, j) => (
              <p key={j} className="text-parchment/70 text-sm leading-relaxed font-body">
                {item}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
