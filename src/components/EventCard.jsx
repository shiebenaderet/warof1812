import React from 'react';

export default function EventCard({ event, onDismiss }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end pointer-events-none">
      {/* Light backdrop so map stays visible */}
      <div
        className="absolute inset-0 bg-black bg-opacity-30 pointer-events-auto"
        onClick={onDismiss}
      />

      {/* Side panel */}
      <div
        className="relative w-full max-w-md h-full overflow-y-auto pointer-events-auto
                    bg-war-navy border-l-2 border-war-gold shadow-2xl"
      >
        {/* Header ribbon */}
        <div className="bg-gradient-to-r from-war-red to-war-navy px-6 py-4 border-b border-war-gold border-opacity-30 sticky top-0 z-10">
          <p className="text-war-gold text-sm tracking-widest uppercase font-bold">Historical Event</p>
          <p className="text-parchment-dark text-sm">{event.year}</p>
        </div>

        {/* Card body */}
        <div className="px-6 py-6">
          <h2 className="text-2xl font-serif text-parchment mb-4">{event.title}</h2>

          <p className="text-parchment text-base leading-relaxed mb-5 italic">
            "{event.description}"
          </p>

          {event.didYouKnow && (
            <div className="bg-war-navy bg-opacity-50 rounded-lg px-5 py-4 mb-5 border-l-4 border-blue-400">
              <p className="text-sm text-blue-300 uppercase tracking-wide mb-1 font-bold">Did You Know?</p>
              <p className="text-parchment text-sm leading-relaxed">{event.didYouKnow}</p>
            </div>
          )}

          <div className="bg-black bg-opacity-30 rounded-lg px-5 py-4 mb-4 border-l-4 border-war-gold">
            <p className="text-sm text-parchment-dark uppercase tracking-wide mb-1 font-bold">Effect</p>
            <p className="text-parchment text-base">{event.effect}</p>
          </div>
        </div>

        {/* Action */}
        <div className="px-6 pb-5 sticky bottom-0 bg-war-navy pt-3">
          <button
            onClick={onDismiss}
            className="w-full py-3 bg-war-gold text-war-navy font-serif rounded-lg
                       hover:bg-yellow-500 transition-colors cursor-pointer text-base font-bold tracking-wider"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
