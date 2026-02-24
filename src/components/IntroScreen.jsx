import React from 'react';

export default function IntroScreen({ playerFaction, onContinue }) {
  const factionIntros = {
    us: {
      title: 'Welcome to the War of 1812',
      subtitle: 'You are commanding the United States forces',
      context: `The year is 1812. The United States, still a young nation, is tired of British interference with American shipping and the impressment of American sailors into the Royal Navy. Britain is also supporting Native American resistance to U.S. expansion in the Northwest Territory.`,
      yourRole: `As the American commander, your goal is to defend U.S. territory and expand into British-held Canada. You'll need to build public support (nationalism) while managing your military forces across multiple theaters of war.`,
      objectives: [
        'Control key strategic territories worth victory points',
        'Build nationalism through military victories and smart decisions',
        'Reach 50 victory points to win the war',
        'Answer historical questions correctly for bonuses',
      ],
      historicalNote: 'This conflict would later be called "The Second War of Independence" and would help establish the United States as a truly independent nation.',
    },
    british: {
      title: 'Welcome to the War of 1812',
      subtitle: 'You are commanding the British/Canadian forces',
      context: `The year is 1812. Britain is locked in a life-or-death struggle with Napoleon in Europe, but the upstart Americans have declared war! They seek to conquer Canada while Britain's attention is divided across the Atlantic.`,
      yourRole: `As the British commander, your goal is to defend Canada and protect your naval superiority. The Royal Navy rules the waves, and you must use this advantage while coordinating with Native allies to hold the line against American expansion.`,
      objectives: [
        'Defend Canadian territories from American invasion',
        'Use naval superiority to control coastal and Great Lakes territories',
        'Reach 50 victory points to win the war',
        'Answer historical questions correctly for bonuses',
      ],
      historicalNote: 'Britain successfully defended Canada despite fighting a two-front war, proving that even a young nation\'s ambitions could be checked by experienced military might.',
    },
    native: {
      title: 'Welcome to the War of 1812',
      subtitle: 'You are commanding the Native Coalition',
      context: `The year is 1812. For decades, American settlers have pushed westward into Native lands. Tecumseh has forged a powerful confederacy of tribes to resist this expansion, and the British-American conflict offers a chance to halt American aggression permanently.`,
      yourRole: `As the Native commander, your goal is to protect tribal lands and stop American expansion. You'll use guerrilla tactics and knowledge of the frontier to fight for your people's survival and sovereignty.`,
      objectives: [
        'Hold and expand control of frontier territories',
        'Maintain tribal resistance across multiple regions',
        'Reach 50 victory points to preserve Native sovereignty',
        'Answer historical questions correctly for bonuses',
      ],
      historicalNote: 'The Native coalition fought valiantly, but ultimately the war would mark the beginning of the end for organized Native resistance east of the Mississippi River.',
    },
  };

  const intro = factionIntros[playerFaction] || factionIntros.us;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 1000, background: 'radial-gradient(ellipse at center, rgba(20,30,48,0.95) 0%, rgba(10,10,8,0.98) 100%)' }}>
      <div className="w-full max-w-4xl max-h-full overflow-y-auto bg-war-navy border border-war-gold/30 shadow-modal rounded-lg animate-fadein">
        {/* Header */}
        <div className="px-8 py-6 border-b border-war-gold/20" style={{
          background: 'linear-gradient(135deg, rgba(139,26,26,0.3) 0%, rgba(20,30,48,0.95) 100%)',
        }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-war-gold/60" />
            <p className="text-war-copper text-xs tracking-[0.2em] uppercase font-body font-bold">Campaign Briefing</p>
          </div>
          <h1 className="text-3xl md:text-4xl font-display text-war-gold tracking-wide mb-1">
            {intro.title}
          </h1>
          <p className="text-parchment/80 font-body text-lg italic">{intro.subtitle}</p>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-6">
          {/* Historical Context */}
          <section>
            <h2 className="text-war-gold/80 font-display text-xl mb-3 border-b border-war-gold/15 pb-2 tracking-wide">
              Historical Context
            </h2>
            <p className="text-parchment/80 text-base leading-relaxed font-body">
              {intro.context}
            </p>
          </section>

          {/* Your Role */}
          <section className="bg-black/20 rounded-lg p-6 border-l-2 border-war-copper/50">
            <p className="text-xs text-war-copper/80 uppercase tracking-wider mb-2 font-body font-bold">Your Role</p>
            <p className="text-parchment/80 text-base leading-relaxed font-body">
              {intro.yourRole}
            </p>
          </section>

          {/* Objectives */}
          <section>
            <h2 className="text-war-gold/80 font-display text-xl mb-3 border-b border-war-gold/15 pb-2 tracking-wide">
              Your Objectives
            </h2>
            <ul className="space-y-3">
              {intro.objectives.map((objective, i) => (
                <li key={i} className="flex items-start text-parchment/80 text-base font-body">
                  <span className="text-war-gold font-bold mr-3 text-lg font-display">{i + 1}.</span>
                  <span className="leading-relaxed">{objective}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Historical Note */}
          <section className="bg-war-red/10 rounded-lg p-5 border-l-2 border-war-red/40">
            <p className="text-xs text-war-copper/80 uppercase tracking-wider mb-2 font-body font-bold">Historical Note</p>
            <p className="text-parchment/70 text-base leading-relaxed font-body italic">
              {intro.historicalNote}
            </p>
          </section>

          {/* Game Tips */}
          <section className="bg-war-gold/5 rounded-lg p-5 border border-war-gold/15">
            <p className="text-xs text-war-gold/80 uppercase tracking-wider mb-3 font-body font-bold">How to Play</p>
            <div className="space-y-2 text-parchment-dark/70 text-sm font-body">
              <p><span className="text-parchment/80">Each turn</span> has phases: Event &rarr; Allocate troops &rarr; Battle &rarr; Maneuver &rarr; Score</p>
              <p><span className="text-parchment/80">Read historical events</span> carefully &mdash; they include knowledge questions with bonuses</p>
              <p><span className="text-parchment/80">Click territories</span> during your turn to place troops, attack, or move forces</p>
              <p><span className="text-parchment/80">Use the tutorial</span> button if you need help understanding the game mechanics</p>
            </div>
          </section>
        </div>

        {/* Continue Button */}
        <div className="px-8 pb-8 sticky bottom-0 bg-war-navy pt-4">
          <button
            onClick={onContinue}
            className="w-full py-4 font-display text-lg rounded-lg font-bold tracking-wider
                       bg-war-gold text-war-ink hover:bg-war-brass cursor-pointer transition-colors
                       shadow-copper"
          >
            Begin Your Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
