import React, { useState } from 'react';
import { getTermsByCategory } from '../data/vocabulary';

const CATEGORY_LABELS = {
  military: 'Military',
  political: 'Political',
  nativeAmerican: 'Native American',
  geographic: 'Geographic',
  naval: 'Naval',
  gameplay: 'Gameplay',
  historicalContext: 'Historical Context',
};

export default function GlossaryPanel() {
  const [expanded, setExpanded] = useState(false);
  const [openTerm, setOpenTerm] = useState(null);
  const categories = getTermsByCategory();

  return (
    <div className="bg-war-navy/50 rounded-lg border border-parchment-dark/8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-3 py-2.5 flex items-center justify-between cursor-pointer hover:bg-white/3 transition-colors rounded-lg"
      >
        <h3 className="text-war-gold/90 font-display text-base tracking-wide">
          Glossary
        </h3>
        <span className="text-parchment-dark/40 text-sm font-body">
          {expanded ? '\u25B2' : '\u25BC'}
        </span>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2 max-h-64 overflow-y-auto">
          {Object.entries(categories).map(([catKey, terms]) => (
            <div key={catKey}>
              <p className="text-war-copper/70 text-xs uppercase tracking-widest font-body font-bold mb-1 mt-1">
                {CATEGORY_LABELS[catKey]}
              </p>
              {terms.map((entry) => {
                const isOpen = openTerm === entry.term;
                return (
                  <div key={entry.term} className="border-l-2 border-parchment-dark/10 ml-0.5">
                    <button
                      onClick={() => setOpenTerm(isOpen ? null : entry.term)}
                      className="w-full text-left pl-2.5 py-1 cursor-pointer hover:bg-white/3 transition-colors flex items-center justify-between"
                      aria-expanded={isOpen}
                    >
                      <span className="text-parchment/80 text-sm font-body font-bold">{entry.term}</span>
                      <span className="text-parchment-dark/30 text-xs">{isOpen ? '\u2212' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="pl-2.5 pb-1.5">
                        <p className="text-parchment/60 text-sm font-body leading-relaxed">{entry.definition}</p>
                        <p className="text-parchment-dark/40 text-xs font-body italic mt-1 leading-relaxed">
                          &ldquo;{entry.useInSentence}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
