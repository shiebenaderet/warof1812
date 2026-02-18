/**
 * Historical Event Cards for War of 1812
 *
 * Each card has:
 * - id: unique key
 * - title: short event name
 * - year: when it happened historically
 * - description: 1-2 sentence historical context
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
    effect: 'US gains +2 troops in any Chesapeake territory. British loses 1 Diplomacy point.',
    roundRange: [1, 3],
    apply: ({ territoryOwners, troops, playerFaction }) => ({
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
    effect: 'Native Coalition gains +2 troops in Indiana Territory and Creek Nation.',
    roundRange: [1, 4],
    apply: () => ({
      troopBonus: { faction: 'native', count: 2, territories: ['indiana_territory', 'creek_nation'] },
    }),
  },
  {
    id: 'constitution_guerriere',
    title: 'USS Constitution vs HMS Guerriere',
    year: 1812,
    description:
      '"Old Ironsides" defeats HMS Guerriere in a stunning frigate action, proving American naval capability.',
    effect: 'US gains +2 Nationalism. British naval control weakened in Atlantic.',
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
    effect: 'Fort Dearborn loses 2 troops. Native gains +1 troop in Indiana Territory.',
    roundRange: [1, 3],
    apply: () => ({
      troopPenalty: { territory: 'fort_dearborn', count: 2 },
      troopBonus: { faction: 'native', count: 1, territories: ['indiana_territory'] },
    }),
  },
  {
    id: 'queenston_heights',
    title: 'Battle of Queenston Heights',
    year: 1812,
    description:
      'British and Canadian forces repel an American invasion across the Niagara River. General Brock is killed but becomes a national hero.',
    effect: 'British gains +2 troops at Niagara. Brock is removed from play if active.',
    roundRange: [2, 4],
    apply: () => ({
      troopBonus: { faction: 'british', count: 2, territories: ['niagara'] },
      removeLeader: 'brock',
    }),
  },

  // ── 1813 Events (Rounds 5-8) ──
  {
    id: 'perry_lake_erie',
    title: "Perry's Victory on Lake Erie",
    year: 1813,
    description:
      '"We have met the enemy and they are ours." Oliver Hazard Perry wins control of Lake Erie.',
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
    effect: 'British loses 2 troops in Upper Canada. British gains motivation: +2 troops at Montreal.',
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
    effect: 'Native gains +3 troops in Creek Nation. Creek Nation attacks adjacent US territories.',
    roundRange: [5, 7],
    apply: () => ({
      troopBonus: { faction: 'native', count: 3, territories: ['creek_nation'] },
    }),
  },
  {
    id: 'british_blockade',
    title: 'British Naval Blockade Tightens',
    year: 1813,
    description:
      'The Royal Navy extends its blockade along the American coast, strangling trade.',
    effect: 'British gains +2 troops on Atlantic Sea Lanes. US coastal territories lose 1 troop each.',
    roundRange: [4, 8],
    apply: () => ({
      troopBonus: { faction: 'british', count: 2, territories: ['atlantic_sea_lanes'] },
      troopPenalty: { territories: ['chesapeake_bay', 'new_york', 'baltimore'], count: 1 },
    }),
  },
  {
    id: 'napoleon_defeated',
    title: "Napoleon's Setbacks in Europe",
    year: 1813,
    description:
      "Napoleon's losses free up British regulars to be sent to North America.",
    effect: 'British gains +3 troops distributed across Halifax and Montreal.',
    roundRange: [5, 8],
    apply: () => ({
      troopBonus: { faction: 'british', count: 3, territories: ['halifax', 'montreal'] },
    }),
  },
  {
    id: 'fort_mims_massacre',
    title: 'Fort Mims Massacre',
    year: 1813,
    description:
      'Red Stick Creeks attack Fort Mims, killing hundreds. It galvanizes American resolve in the South.',
    effect: 'US gains +2 troops in Mobile. Nationalism +3.',
    roundRange: [5, 7],
    apply: () => ({
      troopBonus: { faction: 'us', count: 2, territories: ['mobile'] },
      nationalismChange: 3,
    }),
  },
  {
    id: 'american_privateers',
    title: 'American Privateers Harass British Shipping',
    year: 1813,
    description:
      'Hundreds of American privateers prey on British merchant ships, disrupting supply lines.',
    effect: 'British loses 1 troop from Halifax. US gains +2 Nationalism.',
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
    effect: 'Washington D.C. captured by British. Nationalism drops 10 points.',
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
    effect: 'Baltimore cannot be captured this round. +10 Nationalism. "The Star-Spangled Banner" is born.',
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
    effect: 'US gains +8 Nationalism points. All US troops gain +1 morale.',
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
    effect: 'US takes Creek Nation. Native loses 3 troops.',
    roundRange: [8, 10],
    apply: () => ({
      territoryChange: { territory: 'creek_nation', newOwner: 'us' },
      troopBonus: { faction: 'us', count: 2, territories: ['creek_nation'] },
    }),
  },
  {
    id: 'plattsburgh',
    title: 'Battle of Plattsburgh',
    year: 1814,
    description:
      'An outnumbered American force defeats a major British invasion from Canada at Plattsburgh Bay.',
    effect: 'British loses 3 troops from Montreal. US gains +3 Nationalism.',
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
    effect: 'British gains +4 troops across Halifax, Montreal, and Upper Canada.',
    roundRange: [9, 11],
    apply: () => ({
      troopBonus: { faction: 'british', count: 4, territories: ['halifax', 'montreal', 'upper_canada'] },
    }),
  },
  {
    id: 'lundy_lane',
    title: "Battle of Lundy's Lane",
    year: 1814,
    description:
      'One of the bloodiest battles of the war ends in a draw at Niagara. Both sides suffer heavy losses.',
    effect: 'Both US and British lose 2 troops at Niagara.',
    roundRange: [9, 11],
    apply: () => ({
      troopPenalty: { territories: ['niagara'], count: 2, allFactions: true },
    }),
  },

  // ── 1815 / Endgame Events (Round 12) ──
  {
    id: 'treaty_of_ghent',
    title: 'Treaty of Ghent Signed',
    year: 1814,
    description:
      'Diplomats in Ghent sign a peace treaty restoring pre-war borders. But news travels slowly...',
    effect: 'No territory changes this round from events. Final scoring begins.',
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
    effect: 'US gains +4 troops at New Orleans. +15 Nationalism. Jackson becomes a national hero.',
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
    effect: 'One of the war\'s root causes is resolved. +3 Nationalism.',
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
    effect: 'US gains +1 troop in New York and Ohio Valley. +3 Nationalism.',
    roundRange: [8, 12],
    apply: () => ({
      troopBonus: { faction: 'us', count: 1, territories: ['new_york', 'ohio_valley'] },
      nationalismChange: 3,
    }),
  },
  {
    id: 'laura_secord',
    title: "Laura Secord's Warning",
    year: 1813,
    description:
      'Laura Secord walks 20 miles through enemy territory to warn British forces of an American attack at Beaver Dams.',
    effect: 'British gains +2 troops at Niagara. American attack plans revealed.',
    roundRange: [5, 7],
    apply: () => ({
      troopBonus: { faction: 'british', count: 2, territories: ['niagara'] },
    }),
  },
  {
    id: 'dolley_madison',
    title: 'Dolley Madison Saves the Portrait',
    year: 1814,
    description:
      'As the British approach Washington, First Lady Dolley Madison saves George Washington\'s portrait from the burning White House.',
    effect: 'A symbol of American resilience. +5 Nationalism.',
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
