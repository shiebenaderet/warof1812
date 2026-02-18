import React from 'react';

export default function EventCard({ event, onDismiss }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 p-4">
      <div className="bg-war-navy border-2 border-war-gold rounded-xl max-w-lg w-full overflow-hidden">
        {/* Header ribbon */}
        <div className="bg-gradient-to-r from-war-red to-war-navy px-6 py-3 border-b border-war-gold border-opacity-30">
          <p className="text-war-gold text-xs tracking-widest uppercase">Historical Event</p>
          <p className="text-parchment-dark text-xs">{event.year}</p>
        </div>

        {/* Card body */}
        <div className="px-6 py-5">
          <h2 className="text-2xl font-serif text-parchment mb-3">{event.title}</h2>

          <p className="text-parchment text-sm leading-relaxed mb-4 italic">
            "{event.description}"
          </p>

          <div className="bg-black bg-opacity-30 rounded-lg px-4 py-3 mb-4 border-l-4 border-war-gold">
            <p className="text-xs text-parchment-dark uppercase tracking-wide mb-1">Effect</p>
            <p className="text-parchment text-sm">{event.effect}</p>
          </div>
        </div>

        {/* Action */}
        <div className="px-6 pb-5">
          <button
            onClick={onDismiss}
            className="w-full py-3 bg-war-gold text-war-navy font-serif rounded-lg
                       hover:bg-yellow-500 transition-colors cursor-pointer text-sm tracking-wider"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
