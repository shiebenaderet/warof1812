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
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-war-navy via-black to-war-navy p-4" style={{ zIndex: 1000 }}>
      <div className="w-full max-w-4xl max-h-full overflow-y-auto bg-war-navy border-4 border-war-gold shadow-2xl rounded-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-war-red via-war-navy to-war-red px-8 py-6 border-b-2 border-war-gold">
          <h1 className="text-4xl font-serif text-war-gold text-center mb-2 font-bold tracking-wide">
            {intro.title}
          </h1>
          <p className="text-xl text-parchment text-center italic">{intro.subtitle}</p>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-6">
          {/* Historical Context */}
          <section>
            <h2 className="text-2xl font-serif text-war-gold mb-3 border-b border-war-gold border-opacity-30 pb-2">
              Historical Context
            </h2>
            <p className="text-parchment text-lg leading-relaxed">
              {intro.context}
            </p>
          </section>

          {/* Your Role */}
          <section className="bg-black bg-opacity-30 rounded-lg p-6 border-l-4 border-war-gold">
            <h2 className="text-2xl font-serif text-war-gold mb-3">
              Your Role
            </h2>
            <p className="text-parchment text-lg leading-relaxed">
              {intro.yourRole}
            </p>
          </section>

          {/* Objectives */}
          <section>
            <h2 className="text-2xl font-serif text-war-gold mb-3 border-b border-war-gold border-opacity-30 pb-2">
              Your Objectives
            </h2>
            <ul className="space-y-3">
              {intro.objectives.map((objective, i) => (
                <li key={i} className="flex items-start text-parchment text-lg">
                  <span className="text-war-gold font-bold mr-3 text-xl">{i + 1}.</span>
                  <span className="leading-relaxed">{objective}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Historical Note */}
          <section className="bg-war-red bg-opacity-20 rounded-lg p-6 border-l-4 border-war-red">
            <p className="text-sm text-war-gold uppercase tracking-wide mb-2 font-bold">Historical Note</p>
            <p className="text-parchment text-base leading-relaxed italic">
              {intro.historicalNote}
            </p>
          </section>

          {/* Game Tips */}
          <section className="bg-black bg-opacity-20 rounded-lg p-6">
            <h3 className="text-lg font-serif text-war-gold mb-3">How to Play</h3>
            <div className="space-y-2 text-parchment-dark text-sm">
              <p>• <span className="text-parchment">Each turn</span> has phases: Event → Allocate troops → Battle → Maneuver → Score</p>
              <p>• <span className="text-parchment">Read historical events</span> carefully - they include knowledge questions with bonuses</p>
              <p>• <span className="text-parchment">Click territories</span> during your turn to place troops, attack, or move forces</p>
              <p>• <span className="text-parchment">Use the tutorial</span> button if you need help understanding the game mechanics</p>
            </div>
          </section>
        </div>

        {/* Continue Button */}
        <div className="px-8 pb-8 sticky bottom-0 bg-war-navy pt-4">
          <button
            onClick={onContinue}
            className="w-full py-4 font-serif text-xl rounded-lg font-bold tracking-wider
                       bg-war-gold text-war-navy hover:bg-yellow-500 cursor-pointer transition-colors
                       shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-transform"
          >
            Begin Your Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
