/**
 * Historical Event Cards for War of 1812
 *
 * Each card has:
 * - id: unique key
 * - title: short event name
 * - year: when it happened historically
 * - description: 1-2 sentence historical context
 * - didYouKnow: educational "Did You Know?" blurb for deeper learning
 * - primarySource: { quote, attribution } — optional historical quote from the era
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
    primarySource: {
      quote: 'This affair has produced a great sensation... The feeling of independence is very strong and will, I think, be called into action.',
      attribution: 'Senator Samuel Smith of Maryland, 1807',
    },
    effect: 'US gains +2 troops in Chesapeake territory. +5 Nationalism (US player).',
    simpleDescription: 'A British warship attacked an American ship in 1807. Americans were very angry about it.',
    simpleDidYouKnow: 'Three Americans were killed and 18 were hurt in the attack. The British boarded the ship and took 4 sailors they said were runaways.',
    simpleEffect: 'The US gets 2 extra troops near Chesapeake and people feel more patriotic.',
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
      simpleQuestion: 'How many American sailors died when the British ship attacked the Chesapeake?',
      simpleChoices: ['3 died, 18 hurt', '15 died, 50 hurt', '1 died, 3 hurt', 'Nobody was hurt'],
      simpleExplanation: 'The British attack killed 3 American sailors and hurt 18 more. They also took 4 sailors off the ship. Americans were furious about this attack.',
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
    primarySource: {
      quote: 'The conquest of Canada is in your power. I trust I shall not be deemed presumptuous when I state that I verily believe that the militia of Kentucky are alone competent to place Montreal and Upper Canada at your feet.',
      attribution: 'Henry Clay, speech in the U.S. Senate, February 1810',
    },
    effect: 'US gains +3 troops on Great Lakes border territories.',
    simpleDescription: 'A group in Congress called the War Hawks wanted to invade Canada. They thought it would be easy.',
    simpleDidYouKnow: 'Thomas Jefferson said taking Canada would be as easy as marching. Henry Clay became Speaker of the House at just 34 years old and pushed hard for war.',
    simpleEffect: 'The US gets 3 extra troops near the Great Lakes border.',
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
      simpleQuestion: 'What did Thomas Jefferson say about taking over Canada?',
      simpleChoices: [
        'He said it would be as easy as marching',
        'He said they would need 100 ships',
        'He said it would take 10 years',
        'He said they needed help from France',
      ],
      simpleExplanation: 'Jefferson thought taking Canada would be very easy. He was wrong. The Americans tried to invade Canada many times and mostly failed.',
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
    primarySource: {
      quote: 'The force at my disposal does not exceed seven hundred... but the very circumstance of an enemy being in force upon your territory, I am persuaded, will be the signal for every man to quit his plow for the sword.',
      attribution: 'Major General Isaac Brock, message to General Hull, August 1812',
    },
    effect: 'Detroit defenders lose 2 troops. Nationalism drops if US controls Detroit.',
    simpleDescription: 'General Hull gave up Fort Detroit to the British without even fighting. The whole country was shocked.',
    simpleDidYouKnow: 'Hull surrendered 2,500 soldiers to only 1,300 British troops because he was scared. He was put on trial, but President Madison let him go.',
    simpleEffect: 'Detroit loses 2 troops. Americans feel less patriotic if they own Detroit.',
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
      simpleQuestion: 'What happened to General Hull after he gave up Detroit?',
      simpleChoices: [
        'He was put on trial but the President let him go',
        'He got a promotion for keeping soldiers safe',
        'He joined the British army',
        'He was punished right away',
      ],
      simpleExplanation: 'Hull was put on trial for giving up without a fight. He was supposed to be punished, but President Madison forgave him. Hull had fought in the Revolutionary War before.',
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
    primarySource: {
      quote: 'Where today are the Pequot? Where are the Narragansett, the Mohican, the Pocanet, and many other once powerful tribes of our people? They have vanished before the avarice and the oppression of the White Man, as snow before a summer sun.',
      attribution: 'Tecumseh, speech to the Osage, 1811',
    },
    effect: 'Native Coalition gains +2 troops in their territories.',
    simpleDescription: 'Tecumseh joined forces with the British. He brought together many Native nations to fight together.',
    simpleDidYouKnow: 'Tecumseh traveled thousands of miles to ask different Native nations to work together. British General Brock said Tecumseh was the bravest warrior he ever saw.',
    simpleEffect: 'The Native Coalition gets 2 extra troops in their lands.',
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
      simpleQuestion: 'What did British General Brock think about Tecumseh?',
      simpleChoices: [
        'He said Tecumseh was the bravest warrior he ever saw',
        'He called Tecumseh dangerous and untrustworthy',
        'He said Tecumseh\'s fighters lacked training',
        'He wanted Tecumseh to become a British officer',
      ],
      simpleExplanation: 'General Brock thought Tecumseh was an amazing leader and warrior. Tecumseh traveled thousands of miles to bring Native nations together. He was one of the greatest leaders of his time.',
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
    primarySource: {
      quote: 'Huzza! Her sides are made of iron!',
      attribution: 'Unnamed sailor aboard USS Constitution, August 19, 1812',
    },
    effect: '+5 Nationalism. British loses 1 troop on Atlantic Sea Lanes.',
    simpleDescription: 'The American ship "Old Ironsides" beat a British warship. Cannonballs bounced off its thick wooden sides!',
    simpleDidYouKnow: 'The USS Constitution is still floating in Boston Harbor today. It is the oldest warship still in the water.',
    simpleEffect: 'Americans feel more patriotic. The British lose 1 troop at sea.',
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
      simpleQuestion: 'Why did people call the ship "Old Ironsides"?',
      simpleChoices: [
        'Cannonballs bounced off its very thick wooden walls',
        'It was covered in iron plates',
        'The crew wore iron helmets',
        'It was painted to look like iron',
      ],
      simpleExplanation: 'The ship was made of very thick oak wood. Cannonballs bounced right off! A sailor yelled "Her sides are made of iron!" The ship is still in Boston Harbor today.',
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
    simpleDescription: 'Soldiers leaving Fort Dearborn were attacked. About 52 people were killed.',
    simpleDidYouKnow: 'Fort Dearborn was in the same spot where downtown Chicago is today.',
    simpleEffect: 'Fort Dearborn loses 2 troops. Native fighters gain 1 troop nearby.',
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
      simpleQuestion: 'Where was Fort Dearborn? What city is there now?',
      simpleChoices: [
        'Where Chicago is today',
        'Where Detroit is today',
        'Where Buffalo is today',
        'On the coast of Virginia',
      ],
      simpleExplanation: 'Fort Dearborn stood right where downtown Chicago is today. When the soldiers tried to leave, they were attacked. About 52 people were killed.',
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
    simpleDescription: 'The British stopped an American attack near Niagara. General Brock was killed but became a hero.',
    simpleDidYouKnow: 'Many American soldiers refused to cross the river into Canada. They said they only had to defend American land.',
    simpleEffect: 'The British get 2 extra troops at Niagara. General Brock is gone from the game.',
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
      simpleQuestion: 'Why did many New York soldiers refuse to cross into Canada?',
      simpleChoices: [
        'They said they only had to protect American land',
        'They were afraid of the waterfalls',
        'They had not been paid',
        'Their leader told them to stay behind',
      ],
      simpleExplanation: 'Many soldiers said they only had to fight on American soil. They would not cross into Canada. This left the Americans who did cross with too few fighters.',
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
    primarySource: {
      quote: 'We have met the enemy and they are ours: two ships, two brigs, one schooner and one sloop.',
      attribution: 'Oliver Hazard Perry, dispatch to General William Henry Harrison, September 10, 1813',
    },
    effect: 'US takes control of Lake Erie. +5 Nationalism.',
    simpleDescription: 'Oliver Perry won a big battle on Lake Erie. He said, "We have met the enemy and they are ours."',
    simpleDidYouKnow: 'Perry built his ships at Presque Isle in Pennsylvania from trees cut down nearby. When his first ship was destroyed, he rowed to another one and kept fighting.',
    simpleEffect: 'The US takes control of Lake Erie. Americans feel more patriotic.',
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
      simpleQuestion: 'Where did Perry build his ships for the battle?',
      simpleChoices: [
        'Presque Isle in Pennsylvania',
        'Fort Dearborn in Chicago',
        'Buffalo, New York',
        'Montreal, Canada',
      ],
      simpleExplanation: 'Perry built his ships from local trees at Presque Isle. During the fight, his first ship was destroyed. He rowed to another ship and kept fighting until he won.',
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
    simpleDescription: 'Tecumseh was killed in battle. Without him, the Native nations could not stay united.',
    simpleDidYouKnow: 'A man named Richard Johnson said he killed Tecumseh. He later became Vice President because of it.',
    simpleEffect: 'The Native Coalition loses 3 troops everywhere. Tecumseh is gone from the game.',
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
      simpleQuestion: 'Who said he killed Tecumseh and used that to get a big job?',
      simpleChoices: [
        'Richard Johnson, who became Vice President',
        'Andrew Jackson, who became President',
        'William Harrison, who led the battle',
        'Henry Clay, who started the war movement',
      ],
      simpleExplanation: 'Richard Johnson said he killed Tecumseh. He used that claim to become Vice President. No one knows for sure who really killed Tecumseh.',
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
    primarySource: {
      quote: 'We were told to burn and destroy everything that could give shelter to the enemy... it was done most effectually.',
      attribution: 'Lieutenant David Thomson, Pennsylvania Volunteers, April 1813',
    },
    effect: 'British loses 2 troops in Upper Canada. British gains +2 troops at Montreal.',
    simpleDescription: 'American soldiers burned the capital of Upper Canada. This made the British very angry.',
    simpleDidYouKnow: 'The British later burned Washington D.C. to get back at the Americans for burning York.',
    simpleEffect: 'The British lose 2 troops in Upper Canada but get 2 more at Montreal.',
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
      simpleQuestion: 'Why did the British say they burned Washington D.C.?',
      simpleChoices: [
        'Because Americans burned buildings in York first',
        'Because of the Boston Tea Party',
        'Because Americans attacked British trade ships',
        'Because Americans locked up British leaders',
      ],
      simpleExplanation: 'The Americans burned buildings in York, Canada. Later, the British burned Washington D.C. to get revenge. This shows how fighting can get worse and worse.',
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
    simpleDescription: 'A group of Creek people called the Red Sticks started fighting American settlers in the South.',
    simpleDidYouKnow: 'The Creek Nation was split. Some Creek people fought the Americans. Other Creek people helped the Americans.',
    simpleEffect: 'The Native Coalition gets 3 extra troops in Creek lands.',
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
      simpleQuestion: 'What split the Creek Nation during this war?',
      simpleChoices: [
        'Some Creeks fought Americans while others helped Americans',
        'Northern Creeks joined Britain while Southern Creeks joined Spain',
        'Their chief was killed and the tribe split apart',
        'Half the Creek fighters were forced to join the US army',
      ],
      simpleExplanation: 'The Creek Nation was divided. The "Red Sticks" fought against American settlers. Other Creek groups helped the Americans instead. This split hurt all Creek people.',
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
    simpleDescription: 'British warships blocked American ports. American ships could not trade with other countries.',
    simpleDidYouKnow: 'The blockade cut American trade from $61 million down to just $7 million. Americans had to start making their own goods in factories.',
    simpleEffect: 'The British get 2 more troops at sea. American coastal areas each lose 1 troop.',
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
      simpleQuestion: 'How much did American trade drop because of the British blockade?',
      simpleChoices: [
        'From $61 million to just $7 million',
        'From $100 million to $50 million',
        'From $30 million to $15 million',
        'Trade stopped completely',
      ],
      simpleExplanation: 'American trade fell a huge amount because of the blockade. But something good came from it. Americans started building their own factories to make things they used to buy from Britain.',
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
    simpleDescription: 'Napoleon lost battles in Europe. Now Britain could send more soldiers to fight in North America.',
    simpleDidYouKnow: 'Over 10,000 British soldiers who had been fighting in Spain and Portugal were sent to North America after Napoleon lost.',
    simpleEffect: 'The British get 3 extra troops at Halifax and Montreal.',
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
      simpleQuestion: 'Where had these tough British soldiers been fighting before?',
      simpleChoices: [
        'In Spain and Portugal',
        'In Russia',
        'In Egypt',
        'In India',
      ],
      simpleExplanation: 'These soldiers had been fighting in Spain and Portugal for years. They were very experienced. When Napoleon lost, over 10,000 of them came to North America.',
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
    simpleDescription: 'Red Stick Creek fighters attacked Fort Mims. Hundreds of people were killed. Americans wanted revenge.',
    simpleDidYouKnow: 'This attack gave Andrew Jackson support to build a big army and fight back.',
    simpleEffect: 'The US gets 2 extra troops at Mobile. Americans feel more patriotic.',
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
      simpleQuestion: 'About how many people died in the Fort Mims attack?',
      simpleChoices: [
        '250 to 500 people',
        'About 50 soldiers',
        'Over 2,000 settlers',
        'Only 10 people',
      ],
      simpleExplanation: 'Between 250 and 500 people died at Fort Mims. It was the deadliest event of the Creek War. After this, Andrew Jackson raised a big army to fight back.',
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
    simpleDescription: 'American ships attacked British trading ships. This hurt Britain and helped America.',
    simpleDidYouKnow: 'Over 500 American ships captured more than 1,500 British trading ships during the war.',
    simpleEffect: 'The British lose 1 troop from Halifax. Americans feel more patriotic.',
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
      simpleQuestion: 'How many British trading ships did American ships capture?',
      simpleChoices: [
        'Over 1,500 ships',
        'About 100 ships',
        'Exactly 50 ships',
        'Nearly 5,000 ships',
      ],
      simpleExplanation: 'American ships captured more than 1,500 British trading ships. This cost Britain a lot of money. British traders begged their government to make peace.',
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
    primarySource: {
      quote: 'Shall this harbor of Yankee democracy be burned? All for it will say Aye!',
      attribution: 'Rear Admiral George Cockburn, in the U.S. House of Representatives, August 24, 1814',
    },
    effect: 'Washington D.C. captured by British. -10 Nationalism.',
    simpleDescription: 'British soldiers marched into Washington D.C. They burned the White House and the Capitol building.',
    simpleDidYouKnow: 'A British admiral asked "Shall this harbor of Yankee democracy be burned?" before they set the Capitol on fire. Washington D.C. is the only major country\'s capital ever captured and burned by an enemy.',
    simpleEffect: 'The British take Washington D.C. Americans feel much less patriotic.',
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
      simpleQuestion: 'What did the British admiral ask before burning the Capitol building?',
      simpleChoices: [
        '"Should we burn this place?"',
        '"Where is the President hiding?"',
        '"Does anyone want to give up?"',
        '"Is there gold in the building?"',
      ],
      simpleExplanation: 'Admiral Cockburn sat in the Speaker\'s chair. He asked if they should burn the building. His soldiers shouted "Yes!" A big storm the next day helped put out the fires.',
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
    primarySource: {
      quote: 'It was a night of watchfulness and anxiety... but at early dawn our eyes were greeted with the proudly waving flag of our country.',
      attribution: 'Francis Scott Key, letter describing the night of September 13\u201314, 1814',
    },
    effect: 'Baltimore cannot be captured this round. +10 Nationalism.',
    simpleDescription: 'The British fired cannons at Fort McHenry all night long. In the morning, the American flag was still flying.',
    simpleDidYouKnow: 'The British fired cannons at the fort for 25 hours straight. The flag that flew over the fort was huge — 42 feet long and 30 feet tall. You can see it at the Smithsonian today.',
    simpleEffect: 'Baltimore is safe this round. Americans feel very patriotic.',
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
      simpleQuestion: 'How long did the British fire cannons at Fort McHenry?',
      simpleChoices: [
        '25 hours',
        '3 hours',
        '48 hours',
        '7 days',
      ],
      simpleExplanation: 'The British fired over 1,500 cannonballs for 25 hours straight. The big American flag was still waving in the morning. That flag now hangs in the Smithsonian museum.',
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
    primarySource: {
      quote: 'O say can you see, by the dawn\'s early light, / What so proudly we hail\'d at the twilight\'s last gleaming?',
      attribution: 'Francis Scott Key, "Defence of Fort M\'Henry," September 1814',
    },
    effect: '+8 Nationalism. US gains +1 troop in Chesapeake.',
    simpleDescription: 'Francis Scott Key watched the battle at Fort McHenry. He wrote a poem that became America\'s national anthem.',
    simpleDidYouKnow: 'The poem was set to a popular British song. It did not become the official national anthem until 1931.',
    simpleEffect: 'Americans feel very patriotic. The US gets 1 extra troop near Chesapeake.',
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
      simpleQuestion: 'What song was "The Star-Spangled Banner" set to?',
      simpleChoices: [
        'A popular British song',
        'The British national anthem',
        '"Yankee Doodle"',
        'It was written as an opera',
      ],
      simpleExplanation: 'Key wrote the poem on the back of a letter. The words were set to a popular British song. It did not become America\'s national anthem until 117 years later in 1931.',
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
    primarySource: {
      quote: 'The fiends of the Tallapoosa will no longer murder our women and children... They have disappeared from the face of the Earth.',
      attribution: 'Andrew Jackson, letter to his wife Rachel, March 28, 1814',
    },
    effect: 'US takes Creek Nation. Native loses 3 troops across all territories.',
    simpleDescription: 'Andrew Jackson beat the Red Stick Creeks at Horseshoe Bend. This ended the Creek War.',
    simpleDidYouKnow: 'Jackson\'s army included Cherokee and Creek fighters. Not all Native people were on the same side.',
    simpleEffect: 'The US takes Creek lands. The Native Coalition loses 3 troops everywhere.',
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
      simpleQuestion: 'Who fought alongside Jackson\'s US troops at Horseshoe Bend?',
      simpleChoices: [
        '500 Cherokee and 100 Creek allies',
        'French soldiers from Louisiana',
        'Spanish troops from Florida',
        'Only American soldiers fought there',
      ],
      simpleExplanation: 'Cherokee and Creek people fought alongside Jackson. Not all Native people were on the same side. Over 800 Red Stick fighters were killed in this battle.',
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
    simpleDescription: 'A small American force beat a much bigger British army at Plattsburgh. This helped end the war.',
    simpleDidYouKnow: 'The British had over 10,000 soldiers. The Americans had only 3,400. But the Americans still won.',
    simpleEffect: 'The British lose 3 troops from Montreal. Americans feel more patriotic.',
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
      simpleQuestion: 'How many soldiers did each side have at Plattsburgh?',
      simpleChoices: [
        'Over 10,000 British vs only 3,400 Americans',
        'About 5,000 on each side',
        '3,000 British vs 8,000 Americans',
        '20,000 British vs 15,000 Americans',
      ],
      simpleExplanation: 'The British had more than 10,000 soldiers. The Americans only had 3,400. But the Americans won the battle on the lake. This cut off British supplies and made them retreat.',
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
    simpleDescription: 'Experienced British soldiers arrived from Europe. They had been fighting Napoleon for years.',
    simpleDidYouKnow: 'These soldiers were some of the best in the world. They had fought for years in Spain and Portugal.',
    simpleEffect: 'The British get 4 extra troops at Halifax, Montreal, and Upper Canada.',
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
      simpleQuestion: 'Where had these soldiers fought before coming to North America?',
      simpleChoices: [
        'Spain and Portugal',
        'Russia',
        'Egypt',
        'India',
      ],
      simpleExplanation: 'These soldiers spent years fighting in Spain and Portugal. They were some of the best fighters in the world. They helped the British attack Washington, Baltimore, and New Orleans.',
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
    simpleDescription: 'A very bloody battle happened near Niagara Falls. Both sides lost many soldiers. Nobody won.',
    simpleDidYouKnow: 'The battle lasted six hours. Most of the fighting happened in the dark. Over 1,700 soldiers were killed or hurt.',
    simpleEffect: 'Niagara loses 4 troops total. Both sides suffer.',
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
      simpleQuestion: 'How long did the Battle of Lundy\'s Lane last?',
      simpleChoices: [
        'Six hours, mostly in the dark',
        'Two whole days',
        'Three hours in a snowstorm',
        'Thirty minutes at sunrise',
      ],
      simpleExplanation: 'The battle went on for six hours. Most of the fighting was in the dark near Niagara Falls. Over 1,700 soldiers were killed or hurt on both sides.',
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
    primarySource: {
      quote: 'All the under-signed Plenipotentiaries have agreed... that there shall be a firm and universal Peace between His Britannic Majesty and the United States.',
      attribution: 'Treaty of Ghent, Article the First, December 24, 1814',
    },
    effect: '+5 Nationalism. The war winds down.',
    simpleDescription: 'Leaders signed a peace deal in Belgium. Things went back to how they were before the war.',
    simpleDidYouKnow: 'At first, Britain wanted a Native homeland, control of the Great Lakes, and American land. But the talks lasted five months, and in the end the treaty changed almost nothing. Both sides kept what they had before.',
    simpleEffect: 'Americans feel more patriotic. The war is ending.',
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
      simpleQuestion: 'What did Britain first ask for during the peace talks?',
      simpleChoices: [
        'A Native homeland, the Great Lakes, and American land',
        'America to give up completely',
        '$10 million to pay for the war',
        'All British sailors returned',
      ],
      simpleExplanation: 'The talks lasted five months. At first, Britain wanted a lot. But American wins at Plattsburgh and Baltimore made Britain accept peace. Everything went back to how it was before the war.',
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
    primarySource: {
      quote: 'I will smash them, so help me God!',
      attribution: 'Major General Andrew Jackson, before the Battle of New Orleans, January 1815',
    },
    effect: 'US gains +4 troops at New Orleans. +15 Nationalism.',
    simpleDescription: 'Andrew Jackson won a huge battle at New Orleans. It happened after peace was signed, but nobody knew yet.',
    simpleDidYouKnow: 'The British lost over 2,000 soldiers. The Americans lost only 71. Jackson\'s army had all kinds of people — soldiers, pirates, free Black fighters, and Native warriors all fighting together.',
    simpleEffect: 'The US gets 4 extra troops at New Orleans. Americans feel very patriotic.',
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
      simpleQuestion: 'How many soldiers died on each side at New Orleans?',
      simpleChoices: [
        'British: 2,042 -- American: 71',
        'British: 500 -- American: 300',
        'British: 71 -- American: 2,042',
        'About 1,000 on each side',
      ],
      simpleExplanation: 'The British lost 2,042 soldiers. The Americans only lost 71. Jackson\'s fighters hid behind walls made of cotton bales. The battle only lasted about 30 minutes.',
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
    simpleDescription: 'Some leaders from New England had a secret meeting. People thought they were talking about leaving the country, but their ideas were actually mild — they just wanted to change some rules.',
    simpleDidYouKnow: 'The meeting was secret, so people feared the worst. But the real ideas were mild. When the war ended, these leaders looked like traitors anyway. Their political party never won again.',
    simpleEffect: 'If the US is winning, people feel more patriotic. If losing, people feel less patriotic.',
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
      simpleQuestion: 'Were the ideas from the Hartford Convention extreme or mild?',
      simpleChoices: [
        'Mild -- they just wanted to change some rules',
        'Extreme -- they voted to leave the country',
        'Extreme -- they declared war on the US',
        'Mild -- they only asked for lower taxes',
      ],
      simpleExplanation: 'The meeting was secret, so people thought it was about treason. The ideas were actually mild. But when the war ended, these leaders looked like traitors. Their party fell apart.',
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
    simpleDescription: 'Britain stopped taking American sailors and making them work on British ships. The war in Europe was over, so they did not need extra sailors.',
    simpleDidYouKnow: 'The peace treaty never talked about taking sailors. Britain just stopped doing it on their own.',
    simpleEffect: 'Americans feel more patriotic. A big reason for the war is gone.',
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
      simpleQuestion: 'Did the peace treaty say anything about taking American sailors?',
      simpleChoices: [
        'No -- Britain just stopped because they did not need more sailors',
        'Yes -- Britain promised to stop',
        'Yes -- both sides agreed to stop',
        'No -- but a different agreement covered it',
      ],
      simpleExplanation: 'The peace treaty never talked about taking sailors. That was the main reason for the war! Britain just stopped doing it because the war in Europe ended. They did not need extra sailors anymore.',
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
    simpleDescription: 'Americans could not buy British goods anymore. So they built their own factories to make things.',
    simpleDidYouKnow: 'After the war, Congress passed the Tariff of 1816 to protect these new American factories from cheaper British goods.',
    simpleEffect: 'The US gets 1 extra troop in New York and Ohio Valley. Americans feel more patriotic.',
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
      simpleQuestion: 'What law did Congress pass to help new American factories?',
      simpleChoices: [
        'The Tariff of 1816',
        'The Tariff of 1812',
        'The Embargo Act of 1807',
        'The Navigation Act of 1815',
      ],
      simpleExplanation: 'The British blockade made Americans build their own factories. After the war, Congress passed the Tariff of 1816. This law made British goods cost more so people would buy American-made things.',
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
    simpleDescription: 'Laura Secord walked 20 miles through dangerous land to warn the British about an American attack.',
    simpleDidYouKnow: 'A famous Canadian chocolate company is named after Laura Secord. She is a hero in Canada.',
    simpleEffect: 'The British get 2 extra troops at Niagara.',
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
      simpleQuestion: 'What is Laura Secord famous for in Canada today?',
      simpleChoices: [
        'A chocolate company is named after her',
        'Her face is on the Canadian $20 bill',
        'A big holiday celebrates her',
        'The capital of Ontario was renamed for her',
      ],
      simpleExplanation: 'Laura Secord walked 20 miles through swamps to deliver a warning. She is a hero in Canada now. A famous chocolate company is named after her.',
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
    primarySource: {
      quote: 'Our kind friend, Mr. Carroll, has come to hasten my departure, and is in a very bad humor with me because I insist on waiting until the large picture of Gen. Washington is secured.',
      attribution: 'Dolley Madison, letter to her sister Lucy, August 23, 1814',
    },
    effect: '+5 Nationalism.',
    simpleDescription: 'Dolley Madison saved a big painting of George Washington from the White House before the British burned it.',
    simpleDidYouKnow: 'She also saved important government papers. She would not leave until the painting was safe.',
    simpleEffect: 'Americans feel more patriotic because of Dolley Madison\'s bravery.',
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
      simpleQuestion: 'What did Dolley Madison save from the White House?',
      simpleChoices: [
        'A big painting of George Washington',
        'The Declaration of Independence',
        'A painting of the Battle of Bunker Hill',
        'A painting of Benjamin Franklin',
      ],
      simpleExplanation: 'Dolley Madison saved a large painting of George Washington. She would not leave until it was safe. She also saved important papers. Her bravery made her famous.',
      reward: { nationalism: 3 },
      penalty: { nationalism: -2 },
    },
  },
  // ── Content Expansion v1.6.0 (12 new cards) ──
  {
    id: 'chateauguay',
    title: 'Battle of Chateauguay',
    year: 1813,
    description:
      'Lieutenant Colonel de Salaberry and 300 Canadian Voltigeurs repel an American force of 3,000+ marching toward Montreal.',
    didYouKnow:
      'Charles de Salaberry used buglers positioned throughout the forest to create the illusion of a massive army. The Americans, convinced they were surrounded, retreated despite outnumbering the defenders nearly ten to one. It was one of the most remarkable defensive victories of the war.',
    primarySource: {
      quote: 'I have won a victory mounted on a wooden horse.',
      attribution: 'Charles de Salaberry, after the Battle of Chateauguay, 1813',
    },
    effect: 'British gains +2 troops in Great Lakes Theater. Canadian defenders hold firm.',
    simpleDescription: 'A small group of Canadian soldiers tricked a much bigger American army into retreating near Montreal.',
    simpleDidYouKnow: 'De Salaberry had buglers blow horns from different spots in the forest. The Americans thought they were surrounded and ran away.',
    simpleEffect: 'The British get 2 extra troops near the Great Lakes.',
    roundRange: [6, 8],
    apply: () => ({
      troopBonus: { faction: 'british', count: 2, theater: 'Great Lakes' },
    }),
    quiz: {
      question: 'How did de Salaberry defeat a much larger American force at Chateauguay?',
      choices: [
        'He used buglers in the forest to make his force seem much larger',
        'He received reinforcements from Britain at the last moment',
        'He used cannon fire to destroy the American supply lines',
        'He flooded the river to block the American advance',
      ],
      correctIndex: 0,
      explanation: 'De Salaberry positioned buglers throughout the forest to create the illusion of a massive army. With only about 300 men, he convinced the American commander to withdraw over 3,000 troops.',
      simpleQuestion: 'How did de Salaberry trick the Americans at Chateauguay?',
      simpleChoices: [
        'He used buglers to make his small army sound much bigger',
        'He got extra soldiers from Britain just in time',
        'He used big cannons to stop them',
        'He flooded the river to block them',
      ],
      simpleExplanation: 'De Salaberry had buglers blow horns from many spots in the forest. The Americans thought a huge army was surrounding them. They ran away even though they had way more soldiers.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'chryslers_farm',
    title: "Battle of Crysler's Farm",
    year: 1813,
    description:
      'A small British force defeats a much larger American army at Crysler\'s Farm on the St. Lawrence River, ending the American campaign against Montreal.',
    didYouKnow:
      'At Crysler\'s Farm on November 11, 1813, about 800 British regulars under Lieutenant Colonel Joseph Morrison defeated over 2,500 Americans in a textbook defensive battle. Combined with de Salaberry\'s victory at Chateauguay two weeks earlier, the twin defeats ended any realistic American hope of capturing Montreal — Canada\'s most important city.',
    primarySource: {
      quote: 'The enemy\'s loss must be very considerable... our troops behaved with the greatest gallantry.',
      attribution: 'Lieutenant Colonel Joseph Morrison, report on the Battle of Crysler\'s Farm, 1813',
    },
    effect: 'British gains +2 troops in Great Lakes. US loses -1 Nationalism.',
    simpleDescription: 'The British won another battle near the St. Lawrence River. The Americans could not capture Montreal.',
    simpleDidYouKnow: 'Only 800 British soldiers beat over 2,500 Americans at Crysler\'s Farm. This plus the loss at Chateauguay meant the Americans could not take Montreal.',
    simpleEffect: 'The British get 2 extra troops near the Great Lakes. Americans feel less patriotic.',
    roundRange: [6, 8],
    apply: ({ playerFaction }) => ({
      troopBonus: { faction: 'british', count: 2, theater: 'Great Lakes' },
      nationalismChange: playerFaction === 'us' ? -1 : 0,
    }),
    quiz: {
      question: 'What was the combined effect of the battles of Chateauguay and Crysler\'s Farm in 1813?',
      choices: [
        'They ended the American campaign to capture Montreal',
        'They gave the Americans control of the St. Lawrence River',
        'They forced the British to surrender Upper Canada',
        'They led to an immediate peace treaty',
      ],
      correctIndex: 0,
      explanation: 'The twin defeats at Chateauguay (October) and Crysler\'s Farm (November) in 1813 ended the American campaign against Montreal. In both battles, smaller British and Canadian forces defeated much larger American armies.',
      simpleQuestion: 'What happened after the Americans lost at both Chateauguay and Crysler\'s Farm?',
      simpleChoices: [
        'They gave up trying to capture Montreal',
        'They took control of the St. Lawrence River',
        'The British surrendered Upper Canada',
        'Both sides signed a peace treaty right away',
      ],
      simpleExplanation: 'After losing both battles, the Americans could not take Montreal. In both fights, small groups of British and Canadian soldiers beat much bigger American armies.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'frenchtown_massacre',
    title: 'River Raisin Massacre',
    year: 1813,
    description:
      '"Remember the Raisin!" After a British and Native victory at Frenchtown, wounded American prisoners are killed — sparking outrage across the frontier.',
    didYouKnow:
      'On January 22, 1813, a British-Native force defeated the Americans at the River Raisin near Frenchtown (modern-day Monroe, Michigan). The next day, Native warriors killed dozens of wounded American prisoners. The massacre became a powerful rallying cry — "Remember the Raisin!" — that fueled American recruitment in the West for the rest of the war. It remains the deadliest battle ever fought on Michigan soil.',
    primarySource: {
      quote: 'Remember the Raisin!',
      attribution: 'American rallying cry after the Frenchtown massacre, 1813',
    },
    effect: 'Native gains +2 troops in Great Lakes. US gains +3 Nationalism ("Remember the Raisin!").',
    simpleDescription: 'After a battle near the River Raisin, wounded American soldiers were killed. Americans were furious and shouted "Remember the Raisin!"',
    simpleDidYouKnow: 'The battle happened where Monroe, Michigan is today. "Remember the Raisin!" became a war cry that made many Americans want to join the army.',
    simpleEffect: 'Native fighters get 2 extra troops near the Great Lakes. Americans feel more patriotic.',
    roundRange: [3, 5],
    apply: ({ playerFaction }) => ({
      troopBonus: { faction: 'native', count: 2, theater: 'Great Lakes' },
      nationalismChange: playerFaction === 'us' ? 3 : 0,
    }),
    quiz: {
      question: 'What happened at the River Raisin in January 1813 that became a famous rallying cry?',
      choices: [
        'Wounded American prisoners were killed after the battle, sparking the cry "Remember the Raisin!"',
        'American forces burned a British supply depot, crying "Remember the Raisin!"',
        'A massive flood destroyed an American fort on the river',
        'A peace conference on the river broke down and fighting resumed',
      ],
      correctIndex: 0,
      explanation: 'After the British-Native victory at Frenchtown, Native warriors killed dozens of wounded American prisoners. "Remember the Raisin!" became a powerful rallying cry that fueled American recruitment for the rest of the war.',
      simpleQuestion: 'Why did Americans start shouting "Remember the Raisin!"?',
      simpleChoices: [
        'Because wounded American soldiers were killed after a battle near the River Raisin',
        'Because Americans burned a British fort on the river',
        'Because a big flood destroyed an American camp',
        'Because a peace meeting on the river went wrong',
      ],
      simpleExplanation: 'After a battle near the River Raisin, hurt American soldiers who could not fight back were killed. Americans were so angry that "Remember the Raisin!" became their battle cry.',
      reward: { nationalism: 3 },
      penalty: { troops: -1 },
    },
  },
  {
    id: 'colonial_marines',
    title: 'Colonial Marines Form',
    year: 1814,
    description:
      'The British form the Corps of Colonial Marines from formerly enslaved people who escaped to British lines, promising them freedom in exchange for military service.',
    didYouKnow:
      'During the war, the British offered freedom to any enslaved person who reached their lines. Roughly 3,000-5,000 people escaped slavery and joined the British, and several hundred formed the Corps of Colonial Marines. These men fought with distinction at the Battle of Bladensburg and in raids along the Chesapeake Bay. After the war, most were resettled as free people in Trinidad, Nova Scotia, or New Brunswick — never returned to slavery.',
    primarySource: {
      quote: 'Be it known to all... that all those who may be disposed to emigrate from the United States will... be received on board His Majesty\'s Ships or Vessels of War.',
      attribution: 'Vice Admiral Alexander Cochrane, British proclamation, April 1814',
    },
    effect: 'British gains +1 troop in Chesapeake Theater. A story of freedom and courage.',
    simpleDescription: 'Enslaved people escaped to the British side and became soldiers. The British promised them freedom.',
    simpleDidYouKnow: 'About 3,000 to 5,000 enslaved people escaped to the British during the war. Some became soldiers called Colonial Marines. After the war, they lived as free people.',
    simpleEffect: 'The British get 1 extra troop near the Chesapeake Bay.',
    roundRange: [7, 9],
    apply: () => ({
      troopBonus: { faction: 'british', count: 1, theater: 'Chesapeake' },
    }),
    quiz: {
      question: 'What did the British promise enslaved people who escaped to their lines during the War of 1812?',
      choices: [
        'Freedom and resettlement in British territories after the war',
        'Payment in gold for each year of military service',
        'Return to their owners after the war ended',
        'Land in the American West',
      ],
      correctIndex: 0,
      explanation: 'The British offered freedom to enslaved people who reached their lines. Roughly 3,000-5,000 people escaped slavery during the war. The Corps of Colonial Marines fought with distinction, and most were resettled as free people in Trinidad, Nova Scotia, or New Brunswick.',
      simpleQuestion: 'What did the British promise enslaved people who came to their side?',
      simpleChoices: [
        'They would be free and could live in British lands after the war',
        'They would be paid in gold for helping',
        'They would be sent back to their owners when the war ended',
        'They would get land in the American West',
      ],
      simpleExplanation: 'The British promised freedom to enslaved people who escaped to them. Thousands of people escaped slavery this way. After the war, most lived as free people in Canada or the Caribbean.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'nancy_hart',
    title: "Nancy Hart's Resistance",
    year: 1813,
    description:
      'Stories of frontier women like Nancy Hart defending their homes and families spread across the backcountry, symbolizing civilian resilience during wartime.',
    didYouKnow:
      'While most famous battles featured male soldiers, women on the frontier played critical roles in the war effort. They defended homesteads, organized supply networks, manufactured ammunition, and served as messengers. In many frontier communities, women were the primary defenders while their husbands were away fighting. Their contributions were rarely recorded in official histories but were essential to sustaining the war effort.',
    effect: 'US gains +1 Nationalism from civilian determination on the frontier.',
    simpleDescription: 'Women on the frontier defended their homes and helped the war effort in many ways.',
    simpleDidYouKnow: 'While men were fighting, women protected homes, made bullets, carried messages, and organized supplies. Their help was very important even though history books often forgot about them.',
    simpleEffect: 'Americans feel more patriotic because of brave people at home.',
    roundRange: [5, 8],
    apply: ({ playerFaction }) => ({
      nationalismChange: playerFaction === 'us' ? 1 : 0,
    }),
    quiz: {
      question: 'What role did frontier women play during the War of 1812?',
      choices: [
        'They defended homesteads, made ammunition, organized supplies, and served as messengers',
        'They were not involved in the war effort at all',
        'They only worked as nurses in military hospitals',
        'They served as official officers in the regular army',
      ],
      correctIndex: 0,
      explanation: 'Frontier women played critical roles during the war — defending homesteads, manufacturing ammunition, organizing supply networks, and serving as messengers. Their contributions were essential but rarely recorded in official histories.',
      simpleQuestion: 'How did women on the frontier help during the war?',
      simpleChoices: [
        'They protected homes, made bullets, carried messages, and organized supplies',
        'They did not help with the war at all',
        'They only worked as nurses',
        'They became officers in the army',
      ],
      simpleExplanation: 'Women on the frontier did many important things during the war. They protected their homes, made bullets, carried messages, and organized supplies. Most history books did not write about what they did.',
      reward: { nationalism: 2 },
      penalty: { nationalism: -1 },
    },
  },
  {
    id: 'economic_blockade_impact',
    title: 'New England Smuggling',
    year: 1813,
    description:
      'As the British blockade tightens, New England merchants defy their own government by smuggling goods to British Canada, deepening the nation\'s divisions.',
    didYouKnow:
      'New England, which had voted heavily against the war, saw smuggling to British Canada as justified civil disobedience. Some New England towns openly traded with the enemy, and the British deliberately left New England ports unblockaded until 1814 to encourage this division. The smuggling was so extensive that much of the British army in Canada was fed by American suppliers. This internal division nearly split the nation apart at the Hartford Convention.',
    effect: 'US loses -1 Nationalism (division). British gains +1 troop in Maritime.',
    simpleDescription: 'People in New England did not like the war. Some sold food and supplies to the British enemy.',
    simpleDidYouKnow: 'The British did not block New England ports at first because they wanted New England to keep trading with them. Some American merchants fed the British army!',
    simpleEffect: 'Americans feel less united. The British get 1 extra troop near the coast.',
    roundRange: [5, 8],
    apply: ({ playerFaction }) => ({
      nationalismChange: playerFaction === 'us' ? -1 : 0,
      troopBonus: { faction: 'british', count: 1, theater: 'Maritime' },
    }),
    quiz: {
      question: 'Why did the British deliberately leave New England ports unblockaded early in the war?',
      choices: [
        'To encourage New England merchants to keep smuggling goods to British Canada',
        'Because the British navy was too weak to blockade all American ports',
        'Because New England had already surrendered to Britain',
        'To allow their own merchants to trade with New England',
      ],
      correctIndex: 0,
      explanation: 'The British left New England ports open to encourage smuggling and deepen American divisions. New England had voted heavily against the war, and much of the British army in Canada was actually fed by American suppliers from New England.',
      simpleQuestion: 'Why did the British not block New England ports at first?',
      simpleChoices: [
        'They wanted New England to keep selling them food and supplies',
        'Their navy was not strong enough',
        'New England had already given up',
        'They wanted to trade with New England merchants',
      ],
      simpleExplanation: 'The British left New England ports open on purpose. They wanted New England merchants to keep selling them food and supplies. This made Americans argue with each other about the war.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'uss_wasp',
    title: 'USS Wasp Victories',
    year: 1812,
    description:
      'The sloop USS Wasp captures HMS Frolic in a fierce close-range action, proving American sailors can match the Royal Navy ship for ship.',
    didYouKnow:
      'The USS Wasp\'s victory over HMS Frolic in October 1812 was one of several shocking American naval victories that stunned Britain. While the Royal Navy had over 600 warships to America\'s 16, American frigates and sloops were often better built and better crewed. However, hours after capturing Frolic, both ships were seized by the massive British ship-of-the-line HMS Poictiers — a reminder of Britain\'s overwhelming naval advantage.',
    primarySource: {
      quote: 'In the annals of naval warfare, seldom has there been a more spirited engagement.',
      attribution: 'Contemporary newspaper account of the Wasp vs. Frolic action, 1812',
    },
    effect: 'US gains +2 troops in Maritime territories. Naval glory boosts morale.',
    simpleDescription: 'The small American ship USS Wasp beat a British warship in a close battle at sea.',
    simpleDidYouKnow: 'America only had 16 warships while Britain had over 600. But American ships were often built better and had better-trained crews.',
    simpleEffect: 'The US gets 2 extra troops near the coast.',
    roundRange: [3, 6],
    apply: () => ({
      troopBonus: { faction: 'us', count: 2, theater: 'Maritime' },
    }),
    quiz: {
      question: 'What happened to the USS Wasp just hours after it captured HMS Frolic?',
      choices: [
        'Both ships were seized by the massive British ship-of-the-line HMS Poictiers',
        'The Wasp sailed triumphantly back to Boston Harbor',
        'A storm sank both ships off the coast of Virginia',
        'The crew mutinied and surrendered to the British',
      ],
      correctIndex: 0,
      explanation: 'Hours after the Wasp captured the Frolic, both ships were seized by HMS Poictiers — a huge British ship-of-the-line. It was a reminder that while American ships could win individual battles, Britain\'s overwhelming naval numbers gave it control of the seas.',
      simpleQuestion: 'What happened right after the USS Wasp beat the British ship?',
      simpleChoices: [
        'A much bigger British ship captured both of them',
        'The Wasp sailed home to a big celebration',
        'A storm sank both ships',
        'The crew gave up and joined the British',
      ],
      simpleExplanation: 'Right after the Wasp won its battle, a much bigger British ship came along and captured both ships. Even though America could win small battles, Britain had way more ships overall.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'beaver_dams',
    title: 'Battle of Beaver Dams',
    year: 1813,
    description:
      'Laura Secord walks 20 miles through enemy territory to warn British forces. The resulting ambush at Beaver Dams captures over 500 American troops.',
    didYouKnow:
      'Laura Secord overheard American officers discussing their attack plans while they were quartered in her home. She walked 20 miles through swamps, forests, and enemy lines to reach the British outpost at Beaver Dams. Her warning allowed Mohawk warriors under Captain Dominique Ducharme and British troops to prepare a devastating ambush. Over 500 Americans were captured — one of the most complete victories of the entire war.',
    primarySource: {
      quote: 'I was determined to put the Americans off the guard, and I was determined to go to warn the British.',
      attribution: 'Laura Secord, describing her motivation for the dangerous journey',
    },
    effect: 'British gains +2 troops in Great Lakes Theater. Laura Secord\'s courage saves the day.',
    simpleDescription: 'A brave woman named Laura Secord walked 20 miles to warn the British about an American attack. The British won a big victory.',
    simpleDidYouKnow: 'Laura Secord heard American soldiers talking about their plans in her own house. She walked through swamps and forests to warn the British. Over 500 Americans were captured.',
    simpleEffect: 'The British get 2 extra troops near the Great Lakes.',
    roundRange: [5, 7],
    apply: () => ({
      troopBonus: { faction: 'british', count: 2, theater: 'Great Lakes' },
    }),
    quiz: {
      question: 'How did Laura Secord learn about the American attack on Beaver Dams?',
      choices: [
        'She overheard American officers discussing plans while quartered in her home',
        'She intercepted a secret letter from an American spy',
        'A British scout brought her the information',
        'She discovered the plans while working at an American hospital',
      ],
      correctIndex: 0,
      explanation: 'American officers were quartered in Secord\'s home and she overheard their attack plans. She then walked 20 miles through enemy territory to warn the British, enabling an ambush that captured over 500 American troops.',
      simpleQuestion: 'How did Laura Secord find out about the American attack plan?',
      simpleChoices: [
        'She heard American soldiers talking about it in her house',
        'She found a secret letter from an American spy',
        'A British scout told her about it',
        'She learned about it at an American hospital',
      ],
      simpleExplanation: 'American soldiers stayed at Laura Secord\'s house and talked about their plans. She heard them and walked 20 miles through dangerous land to tell the British. Over 500 Americans were captured.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'fort_meigs',
    title: 'Siege of Fort Meigs',
    year: 1813,
    description:
      'William Henry Harrison holds Fort Meigs against a British-Native siege on the Maumee River, keeping the American foothold in the Northwest.',
    didYouKnow:
      'Fort Meigs, built by Harrison on the Maumee River in northwest Ohio, was besieged twice in 1813 by British and Native forces under Henry Procter and Tecumseh. Harrison\'s troops survived the first siege by building massive earthwork walls that absorbed cannon fire. During a sortie to destroy British batteries, Kentucky reinforcements were ambushed and many were captured and killed — contributing to the "Remember the Raisin!" anger on the frontier.',
    effect: 'US gains +1 troop in Great Lakes Theater. Harrison\'s defense holds.',
    simpleDescription: 'General Harrison defended Fort Meigs against a British and Native attack in Ohio.',
    simpleDidYouKnow: 'Fort Meigs was attacked twice. Harrison built thick dirt walls that stopped cannonballs. The fort held both times.',
    simpleEffect: 'The US gets 1 extra troop near the Great Lakes.',
    roundRange: [4, 6],
    apply: () => ({
      troopBonus: { faction: 'us', count: 1, theater: 'Great Lakes' },
    }),
    quiz: {
      question: 'How did Harrison\'s troops at Fort Meigs survive British cannon bombardment?',
      choices: [
        'They built massive earthwork walls that absorbed the cannonballs',
        'They dug underground tunnels to escape the shelling',
        'They launched a surprise night attack on the British cannons',
        'They received reinforcements from Lake Erie by boat',
      ],
      correctIndex: 0,
      explanation: 'Harrison\'s troops built massive earthwork walls that absorbed cannon fire. The fort survived two sieges in 1813, maintaining the American foothold in the Northwest until Perry\'s victory on Lake Erie changed the balance of power.',
      simpleQuestion: 'How did the soldiers at Fort Meigs protect themselves from cannonballs?',
      simpleChoices: [
        'They built very thick dirt walls that stopped the cannonballs',
        'They dug tunnels underground to hide',
        'They attacked the British cannons at night',
        'They got help from boats on Lake Erie',
      ],
      simpleExplanation: 'The soldiers built really thick walls out of dirt. The cannonballs just got stuck in the dirt! The fort survived two attacks.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'detroit_recaptured',
    title: 'Recapture of Detroit',
    year: 1813,
    description:
      'After Perry\'s victory on Lake Erie, American forces retake Detroit without a fight. The humiliation of Hull\'s surrender is avenged.',
    didYouKnow:
      'After Perry\'s victory gave the Americans control of Lake Erie in September 1813, the British position at Detroit became untenable. British commander Henry Procter abandoned Detroit and retreated east along the Thames River, pursued by Harrison\'s army. The recapture of Detroit — lost in the war\'s most embarrassing moment — was a major morale boost for the American public.',
    effect: 'If US does not control Detroit, they reclaim it with 3 troops.',
    simpleDescription: 'After winning on Lake Erie, the Americans took back Detroit. The British had to run away.',
    simpleDidYouKnow: 'When the Americans won on Lake Erie, the British could no longer get supplies to Detroit. They left the city and tried to escape, but the Americans chased them.',
    simpleEffect: 'If the US lost Detroit, they get it back with 3 troops.',
    roundRange: [6, 8],
    apply: ({ territoryOwners }) => {
      if (territoryOwners.detroit !== 'us') {
        return {
          territoryChange: { territory: 'detroit', newOwner: 'us' },
          troopBonus: { faction: 'us', count: 3, territories: ['detroit'] },
          nationalismChange: 3,
        };
      }
      return { nationalismChange: 1 };
    },
    quiz: {
      question: 'Why did the British abandon Detroit in 1813?',
      choices: [
        'Perry\'s victory on Lake Erie cut off their supply line',
        'A massive American army attacked from three directions',
        'Native allies refused to defend the city',
        'A fire destroyed the British fortifications',
      ],
      correctIndex: 0,
      explanation: 'After Perry won the Battle of Lake Erie, the British could no longer supply or reinforce Detroit by water. Commander Procter abandoned the city and retreated east, where Harrison\'s army caught and defeated him at the Battle of the Thames.',
      simpleQuestion: 'Why did the British leave Detroit?',
      simpleChoices: [
        'The Americans won on Lake Erie so the British could not get supplies',
        'A huge American army attacked from all sides',
        'Native fighters would not help defend the city',
        'A fire burned down the British walls',
      ],
      simpleExplanation: 'When Perry won the battle on Lake Erie, the British could not get food or supplies to Detroit anymore. They had to leave the city and run away.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'native_displacement',
    title: 'Native Removal Begins',
    year: 1815,
    description:
      'With the war over and British support gone, American settlers flood into Native territories. Forced removal and treaty violations accelerate across the frontier.',
    didYouKnow:
      'The Treaty of Ghent (1814) included provisions for restoring Native lands to pre-war boundaries, but the United States largely ignored these terms. Without British military support, Native nations had no leverage to enforce treaty provisions. Within 15 years, the Indian Removal Act of 1830 would force tens of thousands of Native people from their ancestral homelands on the Trail of Tears — a direct consequence of the power shift caused by the War of 1812.',
    effect: 'Native Coalition loses -2 troops across all territories. The post-war displacement begins.',
    simpleDescription: 'After the war, Americans moved onto Native lands. The promises made in the peace treaty were broken.',
    simpleDidYouKnow: 'The peace treaty said Native lands should be given back. But America did not follow the treaty. Within 15 years, thousands of Native people would be forced to leave their homes.',
    simpleEffect: 'The Native Coalition loses 2 troops everywhere.',
    roundRange: [10, 12],
    apply: () => ({
      troopPenalty: { faction: 'native', count: 2 },
    }),
    quiz: {
      question: 'What happened to the Treaty of Ghent\'s provisions about restoring Native lands?',
      choices: [
        'The United States largely ignored them and continued expanding into Native territory',
        'They were fully honored, and all Native lands were restored',
        'Britain enforced the terms with military force',
        'Native nations voluntarily gave up their land claims',
      ],
      correctIndex: 0,
      explanation: 'Although the Treaty of Ghent included provisions to restore Native lands, the U.S. largely ignored them. Without British military backing, Native nations had no way to enforce the treaty. This led to the Indian Removal Act and the Trail of Tears.',
      simpleQuestion: 'Did America follow the peace treaty\'s rules about giving back Native lands?',
      simpleChoices: [
        'No — America ignored the rules and kept taking Native land',
        'Yes — all Native lands were given back',
        'Britain made America follow the rules',
        'Native nations decided they did not want their land back',
      ],
      simpleExplanation: 'America did not follow the rules about Native land. Without the British to help them, Native nations could not make America keep its promises. This led to even more Native people losing their homes.',
      reward: { troops: 1 },
      penalty: { nationalism: -2 },
    },
  },
  {
    id: 'war_financing',
    title: 'War Debt Crisis',
    year: 1814,
    description:
      'Both sides struggle to pay for the war. The American treasury is nearly bankrupt, and British taxpayers demand an end to expensive overseas campaigns.',
    didYouKnow:
      'By 1814, the U.S. government was nearly bankrupt. New England banks refused to lend money to fund a war they opposed, and the British blockade had destroyed customs revenue — the government\'s main income source. Britain, meanwhile, had spent over 20 years fighting Napoleon and its people were exhausted. Both sides\' financial desperation was a major factor in bringing them to the peace table at Ghent.',
    effect: 'Both factions lose -1 troop from war exhaustion.',
    simpleDescription: 'Both America and Britain were running out of money. The war was too expensive for everyone.',
    simpleDidYouKnow: 'The American government was almost out of money. Banks in New England would not lend money for a war they did not like. Britain had been fighting wars for 20 years and was tired too.',
    simpleEffect: 'Both sides lose 1 troop because everyone is running out of supplies.',
    roundRange: [8, 10],
    apply: () => ({
      troopPenalty: { faction: 'us', count: 1 },
      troopPenalty2: { faction: 'british', count: 1 },
    }),
    quiz: {
      question: 'Why was the U.S. government nearly bankrupt by 1814?',
      choices: [
        'New England banks refused to lend money and the British blockade destroyed customs revenue',
        'Congress had voted to stop funding the war',
        'The army had spent all the money on building forts',
        'France demanded repayment of Revolutionary War debts',
      ],
      correctIndex: 0,
      explanation: 'By 1814, New England banks refused to fund a war they opposed, and the British blockade destroyed customs revenue — the government\'s main income. This financial crisis was a major factor pushing both sides toward peace at Ghent.',
      simpleQuestion: 'Why did the American government run out of money during the war?',
      simpleChoices: [
        'Banks would not lend money and the British blockade stopped trade income',
        'Congress voted to stop paying for the war',
        'The army spent everything on building forts',
        'France wanted old debts paid back',
      ],
      simpleExplanation: 'Banks in New England would not lend money because they did not want the war. The British also blocked ships from coming in, so the government could not collect taxes on trade. Both sides were running out of money.',
      reward: { troops: 1 },
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
