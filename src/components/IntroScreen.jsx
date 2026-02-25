import React from 'react';

export default function IntroScreen({ playerFaction, onContinue, gameMode }) {
  const isExplorer = gameMode === 'explorer';

  const factionIntros = {
    us: {
      title: 'Welcome to the War of 1812',
      subtitle: 'You are commanding the United States forces',
      context: `The year is 1812. The United States, still a young nation, is tired of British interference with American shipping and the impressment of American sailors into the Royal Navy. Britain is also supporting Native American resistance to U.S. expansion in the Northwest Territory.`,
      simpleContext: `It is the year 1812. America is a young country. Britain keeps stopping American ships and taking American sailors. Britain is also helping Native Americans fight against American settlers moving west.`,
      yourRole: `As the American commander, your goal is to defend U.S. territory and expand into British-held Canada. You'll need to build public support (nationalism) while managing your military forces across multiple theaters of war.`,
      simpleYourRole: `You are the American leader. Your job is to protect American land and try to take over parts of Canada. You need to keep your people happy and lead your soldiers to victory.`,
      objectives: [
        'Control key strategic territories worth victory points',
        'Build nationalism through military victories and smart decisions',
        'Reach 50 victory points to win the war',
        'Answer historical questions correctly for bonuses',
      ],
      simpleObjectives: [
        'Take control of important territories to earn points',
        'Win battles to make your people proud',
        'Get to 50 points to win the game',
        'Answer history questions to get extra help',
      ],
      historicalNote: 'This conflict would later be called "The Second War of Independence" and would help establish the United States as a truly independent nation.',
      simpleHistoricalNote: 'This war helped America show the world it was a real, strong country that could stand on its own.',
      howToPlay: null,
      simpleHowToPlay: [
        'Each turn you will see a historical event, then place troops, fight battles, and move your army.',
        'Read the events carefully — they have quiz questions that give you bonuses!',
        'Click on territories to place troops, attack enemies, or move your army.',
        'Use the "?" button if you need help.',
      ],
    },
    british: {
      title: 'Welcome to the War of 1812',
      subtitle: 'You are commanding the British/Canadian forces',
      context: `The year is 1812. Britain is locked in a life-or-death struggle with Napoleon in Europe, but the upstart Americans have declared war! They seek to conquer Canada while Britain's attention is divided across the Atlantic.`,
      simpleContext: `It is the year 1812. Britain is busy fighting a big war in Europe against Napoleon. Now America has also declared war on Britain! Americans want to take over Canada.`,
      yourRole: `As the British commander, your goal is to defend Canada and protect your naval superiority. The Royal Navy rules the waves, and you must use this advantage while coordinating with Native allies to hold the line against American expansion.`,
      simpleYourRole: `You are the British leader. Your job is to protect Canada from American invaders. You have the strongest navy in the world. Work with Native allies to stop America from growing.`,
      objectives: [
        'Defend Canadian territories from American invasion',
        'Use naval superiority to control coastal and Great Lakes territories',
        'Reach 50 victory points to win the war',
        'Answer historical questions correctly for bonuses',
      ],
      simpleObjectives: [
        'Protect Canada from American attacks',
        'Use your strong navy to control the waters',
        'Get to 50 points to win the game',
        'Answer history questions to get extra help',
      ],
      historicalNote: 'Britain successfully defended Canada despite fighting a two-front war, proving that even a young nation\'s ambitions could be checked by experienced military might.',
      simpleHistoricalNote: 'Britain kept Canada safe even while fighting another war in Europe. This showed how powerful Britain\'s army and navy really were.',
      howToPlay: null,
      simpleHowToPlay: [
        'Each turn you will see a historical event, then place troops, fight battles, and move your army.',
        'Read the events carefully — they have quiz questions that give you bonuses!',
        'Click on territories to place troops, attack enemies, or move your army.',
        'Use the "?" button if you need help.',
      ],
    },
    native: {
      title: 'Welcome to the War of 1812',
      subtitle: 'You are commanding the Native Coalition',
      context: `The year is 1812. For decades, American settlers have pushed westward into Native lands. Tecumseh has forged a powerful confederacy of tribes to resist this expansion, and the British-American conflict offers a chance to halt American aggression permanently.`,
      simpleContext: `It is the year 1812. For many years, American settlers have been moving onto Native lands. A leader named Tecumseh has brought many tribes together to fight back. Now that Britain and America are at war, the tribes have a chance to protect their homeland.`,
      yourRole: `As the Native commander, your goal is to protect tribal lands and stop American expansion. You'll use guerrilla tactics and knowledge of the frontier to fight for your people's survival and sovereignty.`,
      simpleYourRole: `You are the Native leader. Your job is to protect your people's land from American settlers. You know the forests and rivers better than anyone. Use that knowledge to win.`,
      objectives: [
        'Hold and expand control of frontier territories',
        'Maintain tribal resistance across multiple regions',
        'Reach 50 victory points to preserve Native sovereignty',
        'Answer historical questions correctly for bonuses',
      ],
      simpleObjectives: [
        'Hold onto your land and take back what you can',
        'Keep your tribes strong across the frontier',
        'Get to 50 points to protect your homeland',
        'Answer history questions to get extra help',
      ],
      historicalNote: 'The Native coalition fought valiantly, but ultimately the war would mark the beginning of the end for organized Native resistance east of the Mississippi River.',
      simpleHistoricalNote: 'The Native tribes fought bravely, but sadly the war made it harder for them to keep their lands east of the Mississippi River.',
      howToPlay: null,
      simpleHowToPlay: [
        'Each turn you will see a historical event, then place troops, fight battles, and move your army.',
        'Read the events carefully — they have quiz questions that give you bonuses!',
        'Click on territories to place troops, attack enemies, or move your army.',
        'Use the "?" button if you need help.',
      ],
    },
  };

  const intro = factionIntros[playerFaction] || factionIntros.us;
  const context = isExplorer && intro.simpleContext ? intro.simpleContext : intro.context;
  const yourRole = isExplorer && intro.simpleYourRole ? intro.simpleYourRole : intro.yourRole;
  const objectives = isExplorer && intro.simpleObjectives ? intro.simpleObjectives : intro.objectives;
  const historicalNote = isExplorer && intro.simpleHistoricalNote ? intro.simpleHistoricalNote : intro.historicalNote;
  const howToPlayItems = isExplorer && intro.simpleHowToPlay ? intro.simpleHowToPlay : null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 1000, background: 'radial-gradient(ellipse at center, rgba(20,30,48,0.95) 0%, rgba(10,10,8,0.98) 100%)' }} role="presentation">
      <div className="w-full max-w-4xl max-h-full overflow-y-auto bg-war-navy border border-war-gold/30 shadow-modal rounded-lg animate-fadein" role="dialog" aria-modal="true" aria-label="Campaign briefing">
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
          <p className={`text-parchment/80 font-body italic ${isExplorer ? 'text-xl leading-relaxed' : 'text-lg'}`}>{intro.subtitle}</p>
        </div>

        {/* Content */}
        <div className={`px-8 space-y-6 ${isExplorer ? 'py-10' : 'py-8'}`}>
          {/* Historical Context */}
          <section>
            <h2 className="text-war-gold/80 font-display text-xl mb-3 border-b border-war-gold/15 pb-2 tracking-wide">
              Historical Context
            </h2>
            <p className={`text-parchment/80 font-body ${isExplorer ? 'text-lg leading-loose' : 'text-base leading-relaxed'}`}>
              {context}
            </p>
          </section>

          {/* Your Role */}
          <section className="bg-black/20 rounded-lg p-6 border-l-2 border-war-copper/50">
            <p className="text-xs text-war-copper/80 uppercase tracking-wider mb-2 font-body font-bold">Your Role</p>
            <p className={`text-parchment/80 font-body ${isExplorer ? 'text-lg leading-loose' : 'text-base leading-relaxed'}`}>
              {yourRole}
            </p>
          </section>

          {/* Objectives */}
          <section>
            <h2 className="text-war-gold/80 font-display text-xl mb-3 border-b border-war-gold/15 pb-2 tracking-wide">
              Your Objectives
            </h2>
            <ul className={`${isExplorer ? 'space-y-4' : 'space-y-3'}`}>
              {objectives.map((objective, i) => (
                <li key={i} className={`flex items-start text-parchment/80 font-body ${isExplorer ? 'text-lg' : 'text-base'}`}>
                  <span className="text-war-gold font-bold mr-3 text-lg font-display">{i + 1}.</span>
                  <span className={isExplorer ? 'leading-loose' : 'leading-relaxed'}>{objective}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Historical Note */}
          <section className="bg-war-red/10 rounded-lg p-5 border-l-2 border-war-red/40">
            <p className="text-xs text-war-copper/80 uppercase tracking-wider mb-2 font-body font-bold">Historical Note</p>
            <p className={`text-parchment/70 font-body italic ${isExplorer ? 'text-lg leading-loose' : 'text-base leading-relaxed'}`}>
              {historicalNote}
            </p>
          </section>

          {/* Game Tips */}
          <section className="bg-war-gold/5 rounded-lg p-5 border border-war-gold/15">
            <p className="text-xs text-war-gold/80 uppercase tracking-wider mb-3 font-body font-bold">How to Play</p>
            {howToPlayItems ? (
              <ul className={`space-y-3 text-parchment-dark/70 font-body ${isExplorer ? 'text-lg leading-loose' : 'text-sm'}`}>
                {howToPlayItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-war-gold/60 font-bold flex-shrink-0">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-2 text-parchment-dark/70 text-sm font-body">
                <p><span className="text-parchment/80">Each turn</span> has phases: Event &rarr; Allocate troops &rarr; Battle &rarr; Maneuver &rarr; Score</p>
                <p><span className="text-parchment/80">Read historical events</span> carefully &mdash; they include knowledge questions with bonuses</p>
                <p><span className="text-parchment/80">Click territories</span> during your turn to place troops, attack, or move forces</p>
                <p><span className="text-parchment/80">Use the tutorial</span> button if you need help understanding the game mechanics</p>
              </div>
            )}
          </section>
        </div>

        {/* Continue Button */}
        <div className="px-8 pb-8 sticky bottom-0 bg-war-navy pt-4">
          <button
            onClick={onContinue}
            className={`w-full font-display rounded-lg font-bold tracking-wider
                       bg-war-gold text-war-ink hover:bg-war-brass cursor-pointer transition-colors
                       shadow-copper ${isExplorer ? 'py-5 text-xl' : 'py-4 text-lg'}`}
          >
            Begin Your Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
