/**
 * War of 1812 Vocabulary Definitions
 *
 * Key terms students should understand before and during gameplay.
 * Used for in-game tooltips and teacher prep materials.
 */

export const vocabulary = {
  // Military Terms
  impressment: {
    term: "Impressment",
    definition: "The British practice of forcing American sailors to serve in the Royal Navy against their will.",
    grade: "8th",
    useInSentence: "British impressment of American sailors was one of the main causes of the War of 1812."
  },

  militia: {
    term: "Militia",
    definition: "Citizen soldiers who are not part of the regular army but can be called to defend their communities in times of war.",
    grade: "8th",
    useInSentence: "American militia helped defend Baltimore during the Battle of Fort McHenry."
  },

  garrison: {
    term: "Garrison",
    definition: "Troops stationed in a fort or territory to defend it.",
    grade: "8th",
    useInSentence: "The garrison at Fort Detroit surrendered without a fight in 1812."
  },

  reinforcements: {
    term: "Reinforcements",
    definition: "Additional troops sent to strengthen an army or garrison.",
    grade: "8th",
    useInSentence: "British reinforcements arrived from Europe after Napoleon's defeat."
  },

  blockade: {
    term: "Blockade",
    definition: "Using ships to prevent supplies, troops, or trade goods from entering or leaving enemy ports.",
    grade: "8th",
    useInSentence: "The British naval blockade severely damaged American trade during the war."
  },

  privateers: {
    term: "Privateers",
    definition: "Privately owned ships authorized by the government to attack and capture enemy merchant vessels.",
    grade: "8th",
    useInSentence: "American privateers captured hundreds of British merchant ships during the war."
  },

  theater: {
    term: "Theater of War",
    definition: "A major geographic area where military operations take place during a war.",
    grade: "8th",
    useInSentence: "The War of 1812 had four main theaters: Great Lakes, Chesapeake, Southern, and Maritime."
  },

  fortification: {
    term: "Fortification",
    definition: "A military structure built to defend a location, such as a fort with walls, cannons, and defensive positions.",
    grade: "8th",
    useInSentence: "Fort McHenry's fortifications withstood 25 hours of British bombardment."
  },

  // Political/Diplomatic Terms
  nationalism: {
    term: "Nationalism",
    definition: "Strong pride in and loyalty to one's nation; a sense of national identity and unity.",
    grade: "8th",
    useInSentence: "American nationalism grew stronger after victories at Lake Erie and New Orleans."
  },

  sovereignty: {
    term: "Sovereignty",
    definition: "The authority of a nation to govern itself without interference from other nations.",
    grade: "8th",
    useInSentence: "Native tribes fought to maintain their sovereignty over traditional lands."
  },

  treaty: {
    term: "Treaty",
    definition: "A formal agreement between nations to end a war or establish peaceful relations.",
    grade: "8th",
    useInSentence: "The Treaty of Ghent ended the War of 1812 in December 1814."
  },

  neutral: {
    term: "Neutral Rights",
    definition: "The right of nations not involved in a war to trade freely with both sides without interference.",
    grade: "8th",
    useInSentence: "The United States claimed neutral rights to trade with both Britain and France during the Napoleonic Wars."
  },

  embargo: {
    term: "Embargo",
    definition: "A government order that stops trade with another country as a form of economic pressure.",
    grade: "8th",
    useInSentence: "The 1807 Embargo Act backfired by hurting American merchants more than British ones."
  },

  // Native American Terms
  confederacy: {
    term: "Confederacy",
    definition: "An alliance or union of groups (such as tribes) working together for a common purpose.",
    grade: "8th",
    useInSentence: "Tecumseh created a Native confederacy to resist American expansion into the Northwest Territory."
  },

  resistance: {
    term: "Resistance",
    definition: "The act of fighting back against an occupying or threatening force.",
    grade: "8th",
    useInSentence: "Native American resistance to westward expansion increased in the early 1800s."
  },

  // Geographic Terms
  frontier: {
    term: "Frontier",
    definition: "The border region between settled areas and wilderness; the edge of American settlement moving westward.",
    grade: "8th",
    useInSentence: "Fighting on the frontier was brutal as settlers and Native tribes clashed over land."
  },

  territory: {
    term: "Territory",
    definition: "A region of land under the control of a government but not yet a full state; also refers to areas controlled during war.",
    grade: "8th",
    useInSentence: "The Northwest Territory was disputed between the United States, Britain, and Native tribes."
  },

  // Naval Terms
  frigate: {
    term: "Frigate",
    definition: "A fast, medium-sized warship with powerful cannons, used for patrols and battles.",
    grade: "8th",
    useInSentence: "The USS Constitution was a famous American frigate nicknamed 'Old Ironsides.'"
  },

  flagship: {
    term: "Flagship",
    definition: "The ship carrying the commanding officer of a fleet or naval squadron.",
    grade: "8th",
    useInSentence: "Oliver Hazard Perry's flagship, the USS Lawrence, was badly damaged at the Battle of Lake Erie."
  },

  // Game-Specific Terms
  victoryPoints: {
    term: "Victory Points",
    definition: "Points earned by controlling strategic territories and achieving objectives; the first side to reach 50 points wins.",
    grade: "8th",
    useInSentence: "Washington D.C. is worth 2 victory points because it's the American capital."
  },

  maneuver: {
    term: "Maneuver",
    definition: "A strategic movement of troops from one territory to an adjacent friendly territory.",
    grade: "8th",
    useInSentence: "You can maneuver troops between your territories to reinforce weak positions."
  },

  adjacency: {
    term: "Adjacent",
    definition: "Neighboring or next to each other; territories that share a border.",
    grade: "8th",
    useInSentence: "You can only attack territories that are adjacent to ones you control."
  },

  // Historical Context Terms
  napoleonic: {
    term: "Napoleonic Wars",
    definition: "Series of wars (1803-1815) between France under Napoleon Bonaparte and various European powers, especially Britain.",
    grade: "8th",
    useInSentence: "Britain was focused on fighting Napoleon in Europe, which distracted them from the American war."
  },

  republicanism: {
    term: "Republicanism",
    definition: "A political ideology emphasizing representative government, citizen participation, and resistance to monarchy.",
    grade: "8th",
    useInSentence: "American republicanism clashed with British monarchical traditions during this era."
  },
};

/**
 * Get vocabulary definition by term (case-insensitive)
 */
export function getDefinition(term) {
  const key = Object.keys(vocabulary).find(
    k => vocabulary[k].term.toLowerCase() === term.toLowerCase()
  );
  return key ? vocabulary[key] : null;
}

/**
 * Get all terms as array (for display lists)
 */
export function getAllTerms() {
  return Object.values(vocabulary).sort((a, b) =>
    a.term.localeCompare(b.term)
  );
}

/**
 * Get terms by category
 */
export function getTermsByCategory() {
  return {
    military: [
      vocabulary.impressment,
      vocabulary.militia,
      vocabulary.garrison,
      vocabulary.reinforcements,
      vocabulary.blockade,
      vocabulary.privateers,
      vocabulary.theater,
      vocabulary.fortification,
    ],
    political: [
      vocabulary.nationalism,
      vocabulary.sovereignty,
      vocabulary.treaty,
      vocabulary.neutral,
      vocabulary.embargo,
    ],
    nativeAmerican: [
      vocabulary.confederacy,
      vocabulary.resistance,
    ],
    geographic: [
      vocabulary.frontier,
      vocabulary.territory,
    ],
    naval: [
      vocabulary.frigate,
      vocabulary.flagship,
    ],
    gameplay: [
      vocabulary.victoryPoints,
      vocabulary.maneuver,
      vocabulary.adjacency,
    ],
    historicalContext: [
      vocabulary.napoleonic,
      vocabulary.republicanism,
    ],
  };
}

export default vocabulary;
