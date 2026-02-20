/**
 * Historical Event Cards for War of 1812
 *
 * Each card has:
 * - id: unique key
 * - title: short event name
 * - year: when it happened historically
 * - description: 1-2 sentence historical context
 * - didYouKnow: educational "Did You Know?" blurb for deeper learning
 * - effect: game mechanic description shown to player
 * - apply(gameState): function that returns state mutations
 * - round: which rounds this card can appear (null = any)
 */

const eventCards = [
  // ── 1812 Events (Rounds 1-4) ──
  {
    id: 'chesapeake_affair',
    title: 'The Chesapeake-Leopard Affair Remembered',
    year: 1807,
    description:
      'The memory of HMS Leopard firing on USS Chesapeake still burns. Anti-British sentiment fuels recruitment.',
    didYouKnow:
      'In 1807, HMS Leopard fired on the unprepared USS Chesapeake just off the Virginia coast, killing 3 and wounding 18. The British boarded and seized 4 sailors they claimed were deserters. Americans were outraged, but President Jefferson chose economic pressure over war — a decision that only delayed the conflict.',
    effect: 'US gains +2 troops in Chesapeake territory. +5 Nationalism (US player).',
    roundRange: [1, 3],
    apply: ({ territoryOwners, playerFaction }) => ({
      troopBonus: { faction: 'us', count: 2, theater: 'Chesapeake' },
      nationalismChange: playerFaction === 'us' ? 5 : 0,
    }),
    quiz: {
      question: 'How many American sailors were killed when HMS Leopard fired on USS Chesapeake in 1807?',
      choices: ['3 killed, 18 wounded', '15 killed, 50 wounded', '1 killed, 3 wounded', 'No casualties occurred'],
      correctIndex: 0,
      explanation: 'The attack killed 3 American sailors and wounded 18. The British then boarded and seized 4 sailors they claimed were deserters, fueling outrage that led toward the War of 1812.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'war_hawks',
    title: 'War Hawks Demand Action',
    year: 1812,
    description:
      'Henry Clay, John C. Calhoun, and the War Hawks in Congress push for aggressive expansion into Canada.',
    didYouKnow:
      'Henry Clay of Kentucky became Speaker of the House at just 34 years old and used the position to stack committees with pro-war members. The War Hawks believed conquering Canada would be, as Thomas Jefferson predicted, "a mere matter of marching." They were very wrong.',
    effect: 'US gains +3 troops on Great Lakes border territories.',
    roundRange: [1, 2],
    apply: () => ({
      troopBonus: { faction: 'us', count: 3, theater: 'Great Lakes' },
    }),
    quiz: {
      question: 'What did Thomas Jefferson predict about conquering Canada?',
      choices: [
        'It would be "a mere matter of marching"',
        'It would require a navy of 100 ships',
        'It would take at least 10 years',
        'It was impossible without French support',
      ],
      correctIndex: 0,
      explanation: 'Jefferson famously predicted conquering Canada would be "a mere matter of marching," reflecting the War Hawks\' overconfidence. The actual invasions of Canada largely failed.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'hulls_surrender',
    title: "Hull's Surrender at Detroit",
    year: 1812,
    description:
      'General William Hull surrenders Fort Detroit to the British without a fight, shocking the nation.',
    didYouKnow:
      'General Brock sent Hull a message warning that once fighting began, he could not control his Native allies. Terrified of a massacre, Hull surrendered 2,500 troops to a force of only 1,300. He was later court-martialed and sentenced to death, though President Madison pardoned him due to his Revolutionary War service.',
    effect: 'Detroit defenders lose 2 troops. Nationalism drops if US controls Detroit.',
    roundRange: [1, 3],
    apply: ({ territoryOwners }) => ({
      troopPenalty: { territory: 'detroit', count: 2 },
      nationalismChange: territoryOwners.detroit === 'us' ? -5 : 0,
    }),
    quiz: {
      question: 'What happened to General Hull after surrendering Detroit?',
      choices: [
        'He was court-martialed and sentenced to death, but pardoned by President Madison',
        'He was promoted for saving his soldiers\' lives',
        'He defected to the British army',
        'He was immediately executed for treason',
      ],
      correctIndex: 0,
      explanation: 'Hull was court-martialed for cowardice and sentenced to death, but President Madison pardoned him due to his Revolutionary War service. He had surrendered 2,500 troops to a force of only 1,300.',
      reward: { nationalism: 3 },
      penalty: { troops: -1 },
    },
  },
  {
    id: 'tecumseh_alliance',
    title: "Tecumseh's Alliance with Britain",
    year: 1812,
    description:
      'Tecumseh forges a powerful alliance with British forces, uniting Native warriors across the frontier.',
    didYouKnow:
      'Tecumseh traveled thousands of miles — from the Great Lakes to the Gulf Coast — recruiting nations into his confederacy. He was one of the most gifted orators and military strategists of his era. British General Brock said of him: "A more sagacious or a more gallant Warrior does not I believe exist."',
    effect: 'Native Coalition gains +2 troops in their territories.',
    roundRange: [1, 4],
    apply: ({ territoryOwners }) => {
      // Only add troops to territories the Native faction actually owns
      const nativeTerrs = ['indiana_territory', 'creek_nation'].filter(
        (id) => territoryOwners[id] === 'native'
      );
      if (nativeTerrs.length === 0) return {};
      return { troopBonus: { faction: 'native', count: 2, territories: nativeTerrs } };
    },
    quiz: {
      question: 'What did British General Brock say about Tecumseh?',
      choices: [
        '"A more sagacious or a more gallant Warrior does not I believe exist"',
        '"He is a dangerous savage who cannot be trusted"',
        '"His warriors fight bravely but lack discipline"',
        '"He would make a fine British officer"',
      ],
      correctIndex: 0,
      explanation: 'Brock was deeply impressed by Tecumseh\'s military genius and leadership. Tecumseh traveled thousands of miles recruiting nations into his confederacy, making him one of the most gifted leaders of his era.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'constitution_guerriere',
    title: 'USS Constitution vs HMS Guerriere',
    year: 1812,
    description:
      '"Old Ironsides" defeats HMS Guerriere in a stunning frigate action, proving American naval capability.',
    didYouKnow:
      'USS Constitution\'s hull was made of dense Southern live oak, up to 21 inches thick. During the battle, British cannonballs literally bounced off her sides, leading a sailor to cry "Huzza! Her sides are made of iron!" The ship is still afloat today in Boston Harbor — the oldest commissioned warship still afloat in the world.',
    effect: '+5 Nationalism. British loses 1 troop on Atlantic Sea Lanes.',
    roundRange: [2, 4],
    apply: ({ territoryOwners }) => ({
      nationalismChange: 5,
      troopPenalty: territoryOwners.atlantic_sea_lanes === 'british'
        ? { territory: 'atlantic_sea_lanes', count: 1 }
        : null,
    }),
    quiz: {
      question: 'Why was USS Constitution nicknamed "Old Ironsides"?',
      choices: [
        'British cannonballs bounced off her thick live oak hull',
        'She was plated with iron armor',
        'Her crew wore iron helmets in battle',
        'She was painted iron-gray for camouflage',
      ],
      correctIndex: 0,
      explanation: 'Constitution\'s hull was made of dense Southern live oak, up to 21 inches thick. During battle, cannonballs literally bounced off, leading a sailor to cry "Her sides are made of iron!" She is still afloat today in Boston Harbor.',
      reward: { nationalism: 3 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'fort_dearborn_massacre',
    title: 'Fort Dearborn Massacre',
    year: 1812,
    description:
      'Potawatomi warriors attack the evacuating garrison of Fort Dearborn, killing soldiers and civilians.',
    didYouKnow:
      'Fort Dearborn stood where downtown Chicago is today. When Hull surrendered Detroit, he ordered Fort Dearborn evacuated. As the garrison marched out, Potawatomi warriors attacked. About 52 soldiers and civilians were killed. The event became a rallying cry for American frontier settlers demanding military protection.',
    effect: 'Fort Dearborn loses 2 troops. Native gains +1 troop in Indiana Territory.',
    roundRange: [1, 3],
    apply: ({ territoryOwners }) => {
      const effects = { troopPenalty: { territory: 'fort_dearborn', count: 2 } };
      if (territoryOwners.indiana_territory === 'native') {
        effects.troopBonus = { faction: 'native', count: 1, territories: ['indiana_territory'] };
      }
      return effects;
    },
    quiz: {
      question: 'Where was Fort Dearborn located (in modern terms)?',
      choices: [
        'Where downtown Chicago stands today',
        'In present-day Detroit, Michigan',
        'Near modern Buffalo, New York',
        'On the coast of Virginia',
      ],
      correctIndex: 0,
      explanation: 'Fort Dearborn stood where downtown Chicago is today. When Hull surrendered Detroit, he ordered the fort evacuated. About 52 soldiers and civilians were killed in the subsequent attack.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'queenston_heights',
    title: 'Battle of Queenston Heights',
    year: 1812,
    description:
      'British and Canadian forces repel an American invasion across the Niagara River. General Brock is killed but becomes a national hero.',
    didYouKnow:
      'Brock was killed leading a counterattack uphill against American positions. Many New York militiamen refused to cross the river into Canada, citing their constitutional right to only defend American soil. This left the American regulars who had crossed outnumbered and doomed. Brock\'s monument at Queenston Heights still stands today.',
    effect: 'British gains +2 troops at Niagara. Brock is removed from play.',
    roundRange: [2, 4],
    apply: ({ territoryOwners }) => {
      const effects = { removeLeader: 'brock' };
      if (territoryOwners.niagara === 'british') {
        effects.troopBonus = { faction: 'british', count: 2, territories: ['niagara'] };
      }
      return effects;
    },
    quiz: {
      question: 'Why did many New York militiamen refuse to cross the Niagara River into Canada?',
      choices: [
        'They cited their constitutional right to only defend American soil',
        'They were afraid of the Niagara Falls rapids',
        'They had not been paid in months',
        'Their commander ordered them to stay behind',
      ],
      correctIndex: 0,
      explanation: 'Many NY militia refused to cross into Canada, leaving American regulars outnumbered and doomed. General Brock was killed leading a counterattack, but the British won the battle. His monument at Queenston Heights still stands today.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },

  // ── 1813 Events (Rounds 5-8) ──
  {
    id: 'perry_lake_erie',
    title: "Perry's Victory on Lake Erie",
    year: 1813,
    description:
      '"We have met the enemy and they are ours." Oliver Hazard Perry wins control of Lake Erie.',
    didYouKnow:
      'Perry built his fleet from scratch at Presque Isle (Erie, PA) using local timber. During the battle, his flagship Lawrence was shot to pieces. He rowed through enemy fire to the Niagara and continued fighting. His victory gave the US control of Lake Erie and forced the British to abandon Detroit — one of the war\'s turning points.',
    effect: 'US takes control of Lake Erie. +5 Nationalism.',
    roundRange: [5, 7],
    apply: () => ({
      territoryChange: { territory: 'lake_erie', newOwner: 'us' },
      troopBonus: { faction: 'us', count: 3, territories: ['lake_erie'] },
      nationalismChange: 5,
    }),
    quiz: {
      question: 'Where did Perry build the fleet he used to win the Battle of Lake Erie?',
      choices: [
        'Presque Isle (Erie, Pennsylvania)',
        'Fort Dearborn (Chicago)',
        'Buffalo, New York',
        'Montreal, Canada',
      ],
      correctIndex: 0,
      explanation: 'Perry built his fleet from scratch at Presque Isle using local timber. During the battle his flagship was shot to pieces, so he rowed through enemy fire to another ship and continued fighting until victory.',
      reward: { troops: 1 },
      penalty: { nationalism: -3 },
    },
  },
  {
    id: 'thames_tecumseh_death',
    title: 'Battle of the Thames — Tecumseh Falls',
    year: 1813,
    description:
      "Tecumseh is killed at the Battle of the Thames. His death shatters the Native coalition's unity.",
    didYouKnow:
      'The circumstances of Tecumseh\'s death remain debated. Richard Mentor Johnson claimed credit and rode it to the Vice Presidency with the slogan "Rumpsey Dumpsey, Johnson killed Tecumseh!" The British commander, Henry Procter, had retreated against Tecumseh\'s wishes, leaving the Native warriors exposed. Tecumseh\'s death effectively ended the dream of a unified Native confederacy.',
    effect: 'Native Coalition loses 3 troops across all territories. Tecumseh removed from play.',
    roundRange: [5, 8],
    apply: () => ({
      troopPenalty: { faction: 'native', count: 3 },
      removeLeader: 'tecumseh',
    }),
    quiz: {
      question: 'Who claimed credit for killing Tecumseh and used it to advance his political career?',
      choices: [
        'Richard Mentor Johnson, who became Vice President',
        'Andrew Jackson, who became President',
        'William Henry Harrison, who led the battle',
        'Henry Clay, who started the war movement',
      ],
      correctIndex: 0,
      explanation: 'Richard Mentor Johnson claimed credit and rode it to the Vice Presidency with the slogan "Rumpsey Dumpsey, Johnson killed Tecumseh!" The true circumstances of Tecumseh\'s death remain debated.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'york_burning',
    title: 'Americans Burn York (Toronto)',
    year: 1813,
    description:
      'American forces capture and burn the capital of Upper Canada, enraging the British.',
    didYouKnow:
      'The burning of York\'s Parliament buildings was partly accidental and partly retaliatory. It set a dangerous precedent: when British forces later burned Washington D.C., they explicitly cited York as justification. The cycle of retaliation showed how quickly wars can escalate beyond anyone\'s intentions.',
    effect: 'British loses 2 troops in Upper Canada. British gains +2 troops at Montreal.',
    roundRange: [4, 6],
    apply: () => ({
      troopPenalty: { territory: 'upper_canada', count: 2 },
      troopBonus: { faction: 'british', count: 2, territories: ['montreal'] },
    }),
    quiz: {
      question: 'What did the British cite as justification for later burning Washington D.C.?',
      choices: [
        'The American burning of York\'s Parliament buildings',
        'The Boston Tea Party of 1773',
        'American attacks on British merchant ships',
        'The imprisonment of British diplomats',
      ],
      correctIndex: 0,
      explanation: 'The burning of York\'s Parliament was partly accidental and partly retaliatory. It set a dangerous precedent: the British explicitly cited York when they later burned Washington D.C., showing how quickly wars can escalate.',
      reward: { nationalism: 3 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'creek_war_begins',
    title: 'Creek War Erupts',
    year: 1813,
    description:
      'The Red Stick faction of the Creek Nation launches attacks against American settlements in the South.',
    didYouKnow:
      'The Creek Nation was divided: "Red Sticks" (inspired by Tecumseh) fought against American expansion, while other Creek factions allied with the Americans. This civil war within the Creek Nation was as devastating as their conflict with the US. The division would have lasting consequences for all Creek people.',
    effect: 'Native gains +3 troops in Creek Nation.',
    roundRange: [5, 7],
    apply: ({ territoryOwners }) => {
      if (territoryOwners.creek_nation === 'native') {
        return { troopBonus: { faction: 'native', count: 3, territories: ['creek_nation'] } };
      }
      return {};
    },
    quiz: {
      question: 'What divided the Creek Nation during this conflict?',
      choices: [
        '"Red Sticks" fought expansion while other Creek factions allied with the US',
        'Northern Creeks sided with Britain while Southern Creeks sided with Spain',
        'The Creek chief was assassinated, splitting the tribe',
        'Half the Creek warriors were captured and forced to fight for the US',
      ],
      correctIndex: 0,
      explanation: 'The Creek civil war was devastating — "Red Sticks" (inspired by Tecumseh) fought against American expansion, while other Creek factions allied with the Americans. This division had lasting consequences for all Creek people.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'british_blockade',
    title: 'British Naval Blockade Tightens',
    year: 1813,
    description:
      'The Royal Navy extends its blockade along the American coast, strangling trade.',
    didYouKnow:
      'By 1814, the British blockade was so effective that American exports dropped from $61 million (1811) to just $7 million. Prices for imported goods skyrocketed. However, the blockade had an unintended consequence: it forced Americans to manufacture their own goods, inadvertently jumpstarting American industrialization.',
    effect: 'British gains +2 troops on Atlantic Sea Lanes. US coastal territories lose 1 troop each.',
    roundRange: [4, 8],
    apply: ({ territoryOwners }) => {
      const effects = {};
      if (territoryOwners.atlantic_sea_lanes === 'british') {
        effects.troopBonus = { faction: 'british', count: 2, territories: ['atlantic_sea_lanes'] };
      }
      // Only penalize US-owned coastal territories
      const usPenaltyTerrs = ['chesapeake_bay', 'new_york', 'baltimore'].filter(
        (id) => territoryOwners[id] === 'us'
      );
      if (usPenaltyTerrs.length > 0) {
        effects.troopPenalty = { territories: usPenaltyTerrs, count: 1 };
      }
      return effects;
    },
    quiz: {
      question: 'How much did American exports drop due to the British blockade?',
      choices: [
        'From $61 million to just $7 million',
        'From $100 million to $50 million',
        'From $30 million to $15 million',
        'Exports were completely stopped',
      ],
      correctIndex: 0,
      explanation: 'The blockade was devastating to American trade, but had an unintended consequence: it forced Americans to manufacture their own goods, inadvertently jumpstarting American industrialization.',
      reward: { nationalism: 3 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'napoleon_defeated',
    title: "Napoleon's Setbacks in Europe",
    year: 1813,
    description:
      "Napoleon's losses free up British regulars to be sent to North America.",
    didYouKnow:
      'The War of 1812 is sometimes called America\'s "forgotten war," but it was really a sideshow of the massive Napoleonic Wars. When Napoleon was exiled to Elba in April 1814, over 10,000 Peninsular War veterans — battle-hardened from fighting in Spain and Portugal — were shipped to North America. Their arrival transformed the war.',
    effect: 'British gains +3 troops distributed across Halifax and Montreal.',
    roundRange: [5, 8],
    apply: ({ territoryOwners }) => {
      const britishTerrs = ['halifax', 'montreal'].filter(
        (id) => territoryOwners[id] === 'british'
      );
      if (britishTerrs.length === 0) return {};
      return { troopBonus: { faction: 'british', count: 3, territories: britishTerrs } };
    },
    quiz: {
      question: 'What were the battle-hardened British troops sent to North America called?',
      choices: [
        'Peninsular War veterans from Spain and Portugal',
        'Royal Guards from London',
        'Scottish Highlanders from the north',
        'Indian Army veterans from Bengal',
      ],
      correctIndex: 0,
      explanation: 'When Napoleon was exiled to Elba in 1814, over 10,000 veterans from the Peninsular War in Spain and Portugal were shipped to North America, dramatically shifting the balance of the war.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'fort_mims_massacre',
    title: 'Fort Mims Massacre',
    year: 1813,
    description:
      'Red Stick Creeks attack Fort Mims, killing hundreds. It galvanizes American resolve in the South.',
    didYouKnow:
      'The attack on Fort Mims in Alabama killed approximately 250-500 people — soldiers, settlers, and their Creek allies. It was the deadliest single event of the Creek War. The massacre outraged Americans and gave Andrew Jackson the political support to raise a large militia army and march against the Red Sticks.',
    effect: 'US gains +2 troops in Mobile. +3 Nationalism.',
    roundRange: [5, 7],
    apply: ({ territoryOwners }) => {
      const effects = { nationalismChange: 3 };
      if (territoryOwners.mobile === 'us') {
        effects.troopBonus = { faction: 'us', count: 2, territories: ['mobile'] };
      }
      return effects;
    },
    quiz: {
      question: 'Approximately how many people were killed in the Fort Mims attack?',
      choices: [
        '250 to 500 people',
        'About 50 soldiers',
        'Over 2,000 settlers',
        'Only 10 were killed',
      ],
      correctIndex: 0,
      explanation: 'The attack killed approximately 250-500 people — soldiers, settlers, and their Creek allies. It was the deadliest single event of the Creek War and gave Andrew Jackson political support to raise a large militia army.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'american_privateers',
    title: 'American Privateers Harass British Shipping',
    year: 1813,
    description:
      'Hundreds of American privateers prey on British merchant ships, disrupting supply lines.',
    didYouKnow:
      'Over 500 American privateers were commissioned during the war, capturing an estimated 1,500+ British merchant ships. Insurance rates for British shipping skyrocketed by 13%. British merchants petitioned Parliament for peace, showing that economic warfare could be as effective as battlefield victories.',
    effect: 'British loses 1 troop from Halifax. +2 Nationalism.',
    roundRange: [4, 8],
    apply: () => ({
      troopPenalty: { territory: 'halifax', count: 1 },
      nationalismChange: 2,
    }),
    quiz: {
      question: 'Approximately how many British merchant ships did American privateers capture during the war?',
      choices: [
        'Over 1,500 ships',
        'About 100 ships',
        'Exactly 50 ships',
        'Nearly 5,000 ships',
      ],
      correctIndex: 0,
      explanation: 'Over 500 American privateers captured an estimated 1,500+ British merchant ships. Insurance rates for British shipping skyrocketed by 13%, and British merchants petitioned Parliament for peace.',
      reward: { nationalism: 3 },
      penalty: { nationalism: -2 },
    },
  },

  // ── 1814 Events (Rounds 9-11) ──
  {
    id: 'washington_burned',
    title: 'The British Burn Washington D.C.',
    year: 1814,
    description:
      'British forces march into the capital and burn the White House and Capitol. A dark day for the republic.',
    didYouKnow:
      'British Admiral Cockburn reportedly sat in the Speaker\'s chair in the House of Representatives and asked his men, "Shall this harbor of Yankee democracy be burned?" They shouted "Aye!" A thunderstorm and possible tornado the next day helped extinguish the fires. Washington D.C. is the only capital of a major nation to be captured and burned by a foreign power in the modern era.',
    effect: 'Washington D.C. captured by British. -10 Nationalism.',
    roundRange: [9, 10],
    apply: () => ({
      territoryChange: { territory: 'washington_dc', newOwner: 'british' },
      troopBonus: { faction: 'british', count: 4, territories: ['washington_dc'] },
      nationalismChange: -10,
    }),
    quiz: {
      question: 'What did Admiral Cockburn ask in the House of Representatives before burning it?',
      choices: [
        '"Shall this harbor of Yankee democracy be burned?"',
        '"Where is the President hiding?"',
        '"Does anyone wish to surrender?"',
        '"Is there any gold in the treasury?"',
      ],
      correctIndex: 0,
      explanation: 'Cockburn sat in the Speaker\'s chair and asked "Shall this harbor of Yankee democracy be burned?" His men shouted "Aye!" A thunderstorm the next day helped extinguish the fires. Washington D.C. is the only major nation\'s capital to be captured and burned by a foreign power in the modern era.',
      reward: { troops: 2 },
      penalty: { nationalism: -3 },
    },
  },
  {
    id: 'fort_mchenry',
    title: 'The Bombardment of Fort McHenry',
    year: 1814,
    description:
      'The British bombard Fort McHenry through the night. At dawn, the flag still waves — inspiring Francis Scott Key.',
    didYouKnow:
      'The British fired over 1,500 cannonballs, rockets, and mortar shells during the 25-hour bombardment. Francis Scott Key, detained on a British ship 8 miles away, watched through the night. The flag he saw at dawn was enormous — 42 by 30 feet, sewn by Mary Pickersgill and her daughter. It now hangs in the Smithsonian.',
    effect: 'Baltimore cannot be captured this round. +10 Nationalism.',
    roundRange: [9, 11],
    apply: () => ({
      fortify: { territory: 'baltimore', invulnerable: true },
      nationalismChange: 10,
    }),
    quiz: {
      question: 'How long did the British bombardment of Fort McHenry last?',
      choices: [
        '25 hours',
        '3 hours',
        '48 hours',
        '7 days',
      ],
      correctIndex: 0,
      explanation: 'The British fired over 1,500 cannonballs, rockets, and mortar shells during the 25-hour bombardment. The enormous flag Key saw at dawn — 42 by 30 feet, sewn by Mary Pickersgill — now hangs in the Smithsonian.',
      reward: { nationalism: 5 },
      penalty: { nationalism: -3 },
    },
  },
  {
    id: 'star_spangled_banner',
    title: 'The Star-Spangled Banner',
    year: 1814,
    description:
      'Francis Scott Key pens the words that will become the national anthem after witnessing Fort McHenry\'s defense.',
    didYouKnow:
      'Key wrote the poem on the back of a letter while still on the British ship. It was set to the tune of a popular British drinking song, "To Anacreon in Heaven." The song became widely popular but wasn\'t made the official national anthem until 1931 — 117 years after Key wrote it.',
    effect: '+8 Nationalism. US gains +1 troop in Chesapeake.',
    roundRange: [9, 11],
    apply: () => ({
      nationalismChange: 8,
      troopBonus: { faction: 'us', count: 1, theater: 'Chesapeake' },
    }),
    quiz: {
      question: 'What tune was "The Star-Spangled Banner" poem originally set to?',
      choices: [
        '"To Anacreon in Heaven," a British drinking song',
        '"God Save the King," the British anthem',
        '"Yankee Doodle," an American folk song',
        'It was originally written as an opera',
      ],
      correctIndex: 0,
      explanation: 'Key wrote the poem on the back of a letter while still on a British ship. It was set to "To Anacreon in Heaven," a popular British drinking song. It didn\'t become the official national anthem until 1931 — 117 years later.',
      reward: { nationalism: 3 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'horseshoe_bend',
    title: 'Battle of Horseshoe Bend',
    year: 1814,
    description:
      'Andrew Jackson crushes the Red Stick Creeks at Horseshoe Bend, ending the Creek War.',
    didYouKnow:
      'Jackson\'s force included 2,600 American troops, 500 Cherokee, and 100 Lower Creek allies — showing that the conflict was not simply "settlers vs. Natives." Over 800 Red Stick warriors were killed. The resulting Treaty of Fort Jackson forced the Creek to cede 23 million acres — roughly half of present-day Alabama and part of Georgia.',
    effect: 'US takes Creek Nation. Native loses 3 troops across all territories.',
    roundRange: [8, 10],
    apply: () => ({
      territoryChange: { territory: 'creek_nation', newOwner: 'us' },
      troopBonus: { faction: 'us', count: 2, territories: ['creek_nation'] },
      troopPenalty: { faction: 'native', count: 3 },
    }),
    quiz: {
      question: 'Who fought alongside Andrew Jackson\'s US troops at Horseshoe Bend?',
      choices: [
        '500 Cherokee and 100 Lower Creek allies',
        'French soldiers from Louisiana',
        'Spanish troops from Florida',
        'Only American regulars fought in the battle',
      ],
      correctIndex: 0,
      explanation: 'Jackson\'s force included Cherokee and Lower Creek allies, showing that the conflict was not simply "settlers vs. Natives." Over 800 Red Stick warriors were killed, and the resulting treaty forced the Creek to cede 23 million acres.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'plattsburgh',
    title: 'Battle of Plattsburgh',
    year: 1814,
    description:
      'An outnumbered American force defeats a major British invasion from Canada at Plattsburgh Bay.',
    didYouKnow:
      'The British invasion force of 10,000+ veterans vastly outnumbered the 3,400 American defenders. But American Commodore Macdonough won the naval battle on Lake Champlain, cutting British supply lines. British General Prevost retreated despite his numerical advantage. News of this defeat convinced British negotiators at Ghent to accept peace.',
    effect: 'British loses 3 troops from Montreal. +3 Nationalism.',
    roundRange: [9, 11],
    apply: () => ({
      troopPenalty: { territory: 'montreal', count: 3 },
      nationalismChange: 3,
    }),
    quiz: {
      question: 'How did the British and American forces compare at the Battle of Plattsburgh?',
      choices: [
        '10,000+ British vs only 3,400 Americans',
        'Equal forces of about 5,000 each',
        '3,000 British vs 8,000 Americans',
        '20,000 British vs 15,000 Americans',
      ],
      correctIndex: 0,
      explanation: 'Despite vastly outnumbering the defenders, the British retreated after Commodore Macdonough won the naval battle on Lake Champlain, cutting British supply lines. This defeat helped convince British negotiators at Ghent to accept peace.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'british_veterans_arrive',
    title: 'Peninsular War Veterans Arrive',
    year: 1814,
    description:
      'With Napoleon exiled to Elba, battle-hardened British troops flood into North America.',
    didYouKnow:
      'These soldiers had spent years fighting Napoleon\'s armies across Spain and Portugal under the Duke of Wellington. They were among the finest soldiers in the world. Their arrival in 1814 shifted the war dramatically — enabling the Washington campaign, the attack on Baltimore, and the assault on New Orleans.',
    effect: 'British gains +4 troops across Halifax, Montreal, and Upper Canada.',
    roundRange: [9, 11],
    apply: ({ territoryOwners }) => {
      const britishTerrs = ['halifax', 'montreal', 'upper_canada'].filter(
        (id) => territoryOwners[id] === 'british'
      );
      if (britishTerrs.length === 0) return {};
      return { troopBonus: { faction: 'british', count: 4, territories: britishTerrs } };
    },
    quiz: {
      question: 'Where had the Peninsular War veterans fought before being sent to North America?',
      choices: [
        'Spain and Portugal under the Duke of Wellington',
        'Russia during Napoleon\'s invasion',
        'Egypt against the Ottoman Empire',
        'India against local rulers',
      ],
      correctIndex: 0,
      explanation: 'These soldiers had spent years fighting Napoleon\'s armies across Spain and Portugal. They were among the finest soldiers in the world, and their arrival enabled the Washington campaign, the attack on Baltimore, and the assault on New Orleans.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'lundy_lane',
    title: "Battle of Lundy's Lane",
    year: 1814,
    description:
      'One of the bloodiest battles of the war ends in a draw at Niagara. Both sides suffer heavy losses.',
    didYouKnow:
      'The battle raged for six hours, much of it in darkness, near Niagara Falls. Over 1,700 soldiers were killed or wounded. Winfield Scott, who had drilled American troops to professional standards, was badly wounded. Despite the tactical draw, the battle proved American regulars could match British veterans — a far cry from the humiliating defeats of 1812.',
    effect: 'Niagara loses 4 troops total (penalty to current owner).',
    roundRange: [9, 11],
    apply: () => ({
      troopPenalty: { territory: 'niagara', count: 4 },
    }),
    quiz: {
      question: 'How long did the Battle of Lundy\'s Lane rage, and under what conditions?',
      choices: [
        'Six hours, much of it in darkness',
        'Two days of continuous fighting',
        'Three hours in a blizzard',
        'Thirty minutes at dawn',
      ],
      correctIndex: 0,
      explanation: 'The battle raged for six hours, much of it in darkness near Niagara Falls. Over 1,700 soldiers were killed or wounded. Despite the draw, the battle proved American regulars could match British veterans.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },

  // ── 1815 / Endgame Events (Round 12) ──
  {
    id: 'treaty_of_ghent',
    title: 'Treaty of Ghent Signed',
    year: 1814,
    description:
      'Diplomats in Ghent sign a peace treaty restoring pre-war borders. But news travels slowly...',
    didYouKnow:
      'The negotiations in the Belgian city of Ghent lasted five months. The British initially demanded a Native buffer state, control of the Great Lakes, and territorial concessions. American victories at Plattsburgh and Baltimore weakened Britain\'s bargaining position. In the end, the treaty changed almost nothing — a "status quo ante bellum" that left the underlying issues unresolved.',
    effect: '+5 Nationalism. The war winds down.',
    roundRange: [11, 12],
    apply: () => ({
      nationalismChange: 5,
    }),
    quiz: {
      question: 'What was Britain\'s initial demand during the Treaty of Ghent negotiations?',
      choices: [
        'A Native buffer state, control of the Great Lakes, and territorial concessions',
        'Full American surrender and annexation',
        'Payment of $10 million in reparations',
        'Return of all British deserters',
      ],
      correctIndex: 0,
      explanation: 'Negotiations lasted five months. American victories at Plattsburgh and Baltimore weakened Britain\'s position. In the end, the treaty restored pre-war borders — "status quo ante bellum" — leaving the underlying issues unresolved.',
      reward: { nationalism: 3 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'battle_new_orleans',
    title: 'Battle of New Orleans',
    year: 1815,
    description:
      'Andrew Jackson wins a stunning victory at New Orleans — fought after the peace treaty was signed, but before news arrived.',
    didYouKnow:
      'Jackson assembled a remarkable force: US regulars, Kentucky and Tennessee militia, free Black soldiers, Choctaw warriors, French-speaking Creoles, and the pirate Jean Lafitte\'s men. Behind cotton-bale barricades, they annihilated a British force of 8,000 in just 30 minutes. British losses: 2,042. American losses: 71. It was the most lopsided major battle in American history.',
    effect: 'US gains +4 troops at New Orleans. +15 Nationalism.',
    roundRange: [11, 12],
    apply: () => ({
      troopBonus: { faction: 'us', count: 4, territories: ['new_orleans'] },
      nationalismChange: 15,
    }),
    quiz: {
      question: 'What were the casualty numbers at the Battle of New Orleans?',
      choices: [
        'British: 2,042 — American: 71',
        'British: 500 — American: 300',
        'British: 71 — American: 2,042',
        'Both sides lost about 1,000 each',
      ],
      correctIndex: 0,
      explanation: 'It was the most lopsided major battle in American history. Behind cotton-bale barricades, Jackson\'s diverse force annihilated 8,000 British troops in just 30 minutes. The battle was fought after the peace treaty was signed, but before news arrived.',
      reward: { troops: 2 },
      penalty: { nationalism: -3 },
    },
  },
  {
    id: 'hartford_convention',
    title: 'Hartford Convention',
    year: 1814,
    description:
      'New England Federalists meet in Hartford to discuss secession, but the war\'s end makes them look treasonous.',
    didYouKnow:
      'The Hartford Convention met in secret, which fueled rumors of treason. Their actual proposals were moderate — constitutional amendments to limit presidential power and war declarations. But when news of peace and Jackson\'s victory arrived simultaneously, the delegates appeared to be sore losers at best, traitors at worst. The Federalist Party never recovered.',
    effect: 'If US is winning: +5 Nationalism (Federalists humiliated). If losing: -5 Nationalism.',
    roundRange: [10, 12],
    apply: ({ scores }) => ({
      nationalismChange: (scores.us || 0) >= (scores.british || 0) ? 5 : -5,
    }),
    quiz: {
      question: 'Were the Hartford Convention\'s actual proposals radical or moderate?',
      choices: [
        'Moderate — constitutional amendments to limit presidential power',
        'Radical — they voted to secede from the Union',
        'Radical — they declared war on the US government',
        'Moderate — they only asked for lower taxes',
      ],
      correctIndex: 0,
      explanation: 'The convention met in secret, fueling rumors of treason. Their actual proposals were moderate constitutional amendments. But when peace and Jackson\'s victory arrived, the delegates appeared treasonous. The Federalist Party never recovered.',
      reward: { nationalism: 3 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'impressment_ends',
    title: 'Impressment Effectively Ends',
    year: 1815,
    description:
      'With the Napoleonic Wars over, Britain no longer needs to press American sailors into service.',
    didYouKnow:
      'The Treaty of Ghent never mentioned impressment — the very issue that caused the war. The practice simply stopped because Britain no longer needed extra sailors. This irony means the war\'s primary cause was resolved not by fighting, but by events in Europe. The War of 1812 was, in many ways, a "second front" of the Napoleonic Wars.',
    effect: '+3 Nationalism. A root cause of the war is resolved.',
    roundRange: [11, 12],
    apply: () => ({
      nationalismChange: 3,
    }),
    quiz: {
      question: 'Was impressment mentioned in the Treaty of Ghent?',
      choices: [
        'No — the practice simply stopped because Britain no longer needed extra sailors',
        'Yes — Britain formally agreed to end the practice',
        'Yes — both sides agreed to stop pressing sailors',
        'No — but a separate treaty specifically addressed it',
      ],
      correctIndex: 0,
      explanation: 'The Treaty of Ghent never mentioned impressment — the very issue that caused the war. The practice simply stopped because Britain no longer needed extra sailors after the Napoleonic Wars ended. The war\'s primary cause was resolved by events in Europe, not fighting.',
      reward: { nationalism: 3 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'american_manufacturing_boom',
    title: 'American Manufacturing Boom',
    year: 1814,
    description:
      'Cut off from British goods, American factories spring up across New England and the Mid-Atlantic.',
    didYouKnow:
      'Before the war, Americans imported most manufactured goods from Britain. The blockade forced them to build their own factories. Cotton mills, iron foundries, and other industries sprouted up. After the war, Congress passed the Tariff of 1816 — the first protectionist tariff — to shield these new industries. The war inadvertently kickstarted the American Industrial Revolution.',
    effect: 'US gains +1 troop in New York and Ohio Valley. +3 Nationalism.',
    roundRange: [8, 12],
    apply: ({ territoryOwners }) => {
      const usTerrs = ['new_york', 'ohio_valley'].filter(
        (id) => territoryOwners[id] === 'us'
      );
      if (usTerrs.length === 0) return { nationalismChange: 3 };
      return {
        troopBonus: { faction: 'us', count: 1, territories: usTerrs },
        nationalismChange: 3,
      };
    },
    quiz: {
      question: 'What tariff was passed after the war to protect new American industries?',
      choices: [
        'The Tariff of 1816',
        'The Tariff of 1812',
        'The Embargo Act of 1807',
        'The Navigation Act of 1815',
      ],
      correctIndex: 0,
      explanation: 'The British blockade forced Americans to build their own factories. After the war, Congress passed the Tariff of 1816 — the first protectionist tariff — to shield these new industries. The war inadvertently kickstarted the American Industrial Revolution.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'laura_secord',
    title: "Laura Secord's Warning",
    year: 1813,
    description:
      'Laura Secord walks 20 miles through enemy territory to warn British forces of an American attack at Beaver Dams.',
    didYouKnow:
      'Laura Secord walked through swamps, forests, and enemy-held territory to deliver her warning. The resulting Battle of Beaver Dams was a complete British-Native victory, capturing over 500 American troops. Secord received little recognition during her lifetime, but she is now one of Canada\'s most celebrated national heroes — and yes, the famous chocolate company is named after her.',
    effect: 'British gains +2 troops at Niagara.',
    roundRange: [5, 7],
    apply: ({ territoryOwners }) => {
      if (territoryOwners.niagara === 'british') {
        return { troopBonus: { faction: 'british', count: 2, territories: ['niagara'] } };
      }
      return {};
    },
    quiz: {
      question: 'What is Laura Secord famous for in modern Canadian culture?',
      choices: [
        'A famous chocolate company is named after her',
        'Her face appears on the Canadian $20 bill',
        'A major Canadian holiday celebrates her',
        'The capital of Ontario was renamed in her honor',
      ],
      correctIndex: 0,
      explanation: 'Laura Secord walked 20 miles through swamps and enemy territory to deliver her warning. She received little recognition during her lifetime but is now one of Canada\'s most celebrated heroes — and yes, the famous chocolate company is named after her.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'dolley_madison',
    title: 'Dolley Madison Saves the Portrait',
    year: 1814,
    description:
      'As the British approach Washington, First Lady Dolley Madison saves George Washington\'s portrait from the burning White House.',
    didYouKnow:
      'With British troops just miles away, Dolley Madison refused to leave until the large portrait of George Washington was cut from its frame and loaded onto a wagon. She also saved copies of the Declaration of Independence and other state papers. Her courage under fire made her an American icon and showed that the spirit of the nation couldn\'t be burned.',
    effect: '+5 Nationalism.',
    roundRange: [9, 11],
    apply: () => ({
      nationalismChange: 5,
    }),
    quiz: {
      question: 'What famous artwork did Dolley Madison save from the burning White House?',
      choices: [
        'A large portrait of George Washington by Gilbert Stuart',
        'The original Declaration of Independence',
        'A painting of the Battle of Bunker Hill',
        'Benjamin Franklin\'s portrait by Charles Willson Peale',
      ],
      correctIndex: 0,
      explanation: 'Dolley Madison refused to leave until George Washington\'s large portrait was cut from its frame and loaded onto a wagon. She also saved copies of state papers. Her courage under fire made her an American icon.',
      reward: { nationalism: 3 },
      penalty: { nationalism: -2 },
    },
  },
];

/**
 * Draw a random event card appropriate for the current round.
 * Returns a card object or null if no matching cards exist.
 */
export function drawEventCard(round, usedCardIds = []) {
  const available = eventCards.filter(
    (card) =>
      !usedCardIds.includes(card.id) &&
      (!card.roundRange || (round >= card.roundRange[0] && round <= card.roundRange[1]))
  );

  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

export default eventCards;
