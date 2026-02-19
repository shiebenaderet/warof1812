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
