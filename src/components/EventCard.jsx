import React, { useState, useEffect } from 'react';

export default function EventCard({ event, onDismiss }) {
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    setCountdown(4);
    if (!event) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [event]);

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end pointer-events-none">
      {/* Light backdrop so map stays visible */}
      <div className="absolute inset-0 bg-black bg-opacity-30 pointer-events-auto" />

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
            <div className="bg-war-navy bg-opacity-50 rounded-lg px-5 py-4 mb-5 border-l-4 border-war-gold">
              <p className="text-sm text-war-gold uppercase tracking-wide mb-1 font-bold">Did You Know?</p>
              <p className="text-parchment text-base leading-relaxed">{event.didYouKnow}</p>
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
            onClick={countdown > 0 ? undefined : onDismiss}
            disabled={countdown > 0}
            className={`w-full py-3 font-serif rounded-lg text-base font-bold tracking-wider transition-colors ${
              countdown > 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-war-gold text-war-navy hover:bg-yellow-500 cursor-pointer'
            }`}
          >
            {countdown > 0 ? `Reading... (${countdown}s)` : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
