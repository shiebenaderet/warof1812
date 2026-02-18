/**
 * Knowledge Check Questions for War of 1812: Rise of the Nation
 *
 * Multiple-choice questions that appear between rounds to test students'
 * understanding of the historical content. Correct answers give a small
 * in-game bonus (extra troops or nationalism).
 *
 * Questions are tied to round ranges so they appear after the student has
 * seen the relevant event cards and context.
 */

const knowledgeChecks = [
  // ── Early War (Rounds 1-4) ──
  {
    id: 'kc_war_causes',
    question: 'Which of the following was a major cause of the War of 1812?',
    choices: [
      'British impressment of American sailors',
      'Dispute over the Louisiana Purchase',
      'The assassination of a U.S. diplomat',
      'A trade war with France',
    ],
    correctIndex: 0,
    explanation:
      'Britain was forcibly recruiting (impressing) American sailors into the Royal Navy, which was a primary cause of the war.',
    roundRange: [2, 4],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_war_hawks',
    question: 'Who were the "War Hawks" and what did they want?',
    choices: [
      'Congressmen who pushed for war with Britain and expansion into Canada',
      'British generals planning the invasion of Washington D.C.',
      'Native American leaders allied with Tecumseh',
      'A group of New England merchants opposed to the war',
    ],
    correctIndex: 0,
    explanation:
      'War Hawks like Henry Clay and John C. Calhoun were young Congressional leaders who demanded war with Britain and saw an opportunity to expand into British Canada.',
    roundRange: [1, 3],
    reward: { type: 'nationalism', count: 3, description: '+3 Nationalism' },
  },
  {
    id: 'kc_tecumseh',
    question: "What was Tecumseh's primary goal in the War of 1812?",
    choices: [
      'To create a unified Native confederacy to resist American expansion',
      'To become the governor of Indiana Territory',
      'To help the British conquer all of North America',
      'To negotiate a peace treaty with the United States',
    ],
    correctIndex: 0,
    explanation:
      'Tecumseh sought to unite Native peoples into a confederacy strong enough to stop American settlers from taking Native lands in the Northwest Territory.',
    roundRange: [1, 4],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_hull_detroit',
    question: "Why was General Hull's surrender of Detroit significant?",
    choices: [
      'It was a shocking defeat that embarrassed the American military early in the war',
      'It ended the War of 1812 immediately',
      'It gave the Americans control of Lake Erie',
      'It led to the burning of Washington D.C.',
    ],
    correctIndex: 0,
    explanation:
      'Hull surrendered Fort Detroit to a smaller British and Native force without a fight, shocking the American public and military leadership.',
    roundRange: [2, 4],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
  },

  // ── Mid War (Rounds 5-8) ──
  {
    id: 'kc_perry',
    question: 'What famous message did Oliver Hazard Perry send after his victory on Lake Erie?',
    choices: [
      '"We have met the enemy and they are ours"',
      '"Don\'t give up the ship"',
      '"I have not yet begun to fight"',
      '"Damn the torpedoes, full speed ahead"',
    ],
    correctIndex: 0,
    explanation:
      'After defeating the British fleet on Lake Erie in 1813, Perry sent this famous message to General Harrison, signaling American naval control of the Great Lakes.',
    roundRange: [5, 7],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_napoleon',
    question: 'How did the Napoleonic Wars in Europe affect the War of 1812?',
    choices: [
      "When Napoleon was defeated, Britain sent experienced troops to fight in America",
      'Napoleon sent French troops to help the Americans',
      'The wars had no effect on events in North America',
      'Napoleon invaded Canada during the War of 1812',
    ],
    correctIndex: 0,
    explanation:
      "Napoleon's defeat freed up thousands of battle-hardened British veterans who were then sent to North America, significantly strengthening British forces in 1814.",
    roundRange: [5, 8],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
  },
  {
    id: 'kc_creek_war',
    question: 'The Creek War (1813-1814) was connected to the War of 1812 because:',
    choices: [
      'Some Creek factions allied with the British against American expansion in the South',
      'The Creek Nation declared war on Canada',
      'American troops invaded Creek territory to reach the Pacific Ocean',
      'The Creek supplied weapons to the British Navy',
    ],
    correctIndex: 0,
    explanation:
      'The Red Stick faction of the Creek Nation, inspired by Tecumseh and supported by British agents, fought against American expansion in the Southern frontier.',
    roundRange: [5, 8],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_blockade',
    question: 'What was the purpose of the British naval blockade during the war?',
    choices: [
      'To strangle American trade and prevent supplies from reaching U.S. ports',
      'To protect British fishing rights in the Atlantic',
      'To stop French ships from reaching America',
      'To prevent American settlers from crossing the Great Lakes',
    ],
    correctIndex: 0,
    explanation:
      "The Royal Navy's blockade of the American coast was designed to cripple the U.S. economy and prevent military supplies from moving by sea.",
    roundRange: [4, 8],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
  },

  // ── Late War (Rounds 9-12) ──
  {
    id: 'kc_washington_burned',
    question: 'What happened when the British captured Washington D.C. in 1814?',
    choices: [
      'They burned the White House and the Capitol building',
      'They forced President Madison to surrender',
      'They made Washington the new British capital',
      'Nothing — the city was abandoned before they arrived',
    ],
    correctIndex: 0,
    explanation:
      'British forces burned several government buildings including the White House and Capitol in August 1814, one of the most dramatic events of the war.',
    roundRange: [9, 11],
    reward: { type: 'troops', count: 2, description: '+2 reinforcement troops' },
  },
  {
    id: 'kc_fort_mchenry',
    question: 'The Battle of Fort McHenry inspired which famous American symbol?',
    choices: [
      'The Star-Spangled Banner (national anthem)',
      'The Pledge of Allegiance',
      'The Liberty Bell tradition',
      'The bald eagle as national symbol',
    ],
    correctIndex: 0,
    explanation:
      "Francis Scott Key watched the British bombardment of Fort McHenry through the night. When he saw the American flag still flying at dawn, he wrote the poem that became 'The Star-Spangled Banner.'",
    roundRange: [9, 11],
    reward: { type: 'nationalism', count: 5, description: '+5 Nationalism' },
  },
  {
    id: 'kc_treaty_ghent',
    question: 'What did the Treaty of Ghent (1814) actually accomplish?',
    choices: [
      'It restored pre-war borders — neither side gained territory',
      'It gave Canada to the United States',
      'It created an independent Native state in the Northwest',
      'It forced Britain to pay war reparations to America',
    ],
    correctIndex: 0,
    explanation:
      'The Treaty of Ghent essentially restored the status quo ante bellum (things as they were before the war). Neither side gained or lost territory officially.',
    roundRange: [10, 12],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_new_orleans',
    question: 'Why is the Battle of New Orleans (1815) historically ironic?',
    choices: [
      'It was fought after the peace treaty was already signed, but before news arrived',
      "It was the only battle the British won during the entire war",
      'Andrew Jackson lost the battle but became president anyway',
      'It took place in French territory, not American',
    ],
    correctIndex: 0,
    explanation:
      "The Treaty of Ghent was signed on December 24, 1814, but news didn't reach New Orleans in time. Jackson's stunning victory on January 8, 1815 made him a national hero.",
    roundRange: [11, 12],
    reward: { type: 'nationalism', count: 3, description: '+3 Nationalism' },
  },
  {
    id: 'kc_hartford',
    question: 'What was the Hartford Convention?',
    choices: [
      'A meeting of New England Federalists who considered secession over the war',
      'A peace conference between the U.S. and Britain',
      'A Native American council to discuss alliances',
      'A military strategy meeting led by Andrew Jackson',
    ],
    correctIndex: 0,
    explanation:
      "New England Federalists, opposed to the war and its economic impact, met in Hartford to discuss their grievances. The war's end made them appear unpatriotic and destroyed the Federalist Party.",
    roundRange: [10, 12],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
  },
  {
    id: 'kc_legacy',
    question: 'What was a major legacy of the War of 1812 for the United States?',
    choices: [
      'A surge of American nationalism and the decline of the Federalist Party',
      'The permanent conquest of Canada',
      'The end of slavery in the United States',
      'An alliance with France against Britain',
    ],
    correctIndex: 0,
    explanation:
      "The War of 1812 sparked a wave of American nationalism, ushered in the 'Era of Good Feelings,' and destroyed the Federalist Party, which had opposed the war.",
    roundRange: [11, 12],
    reward: { type: 'nationalism', count: 3, description: '+3 Nationalism' },
  },
];

/**
 * Draw a knowledge check appropriate for the current round.
 * Returns a question object or null.
 */
export function drawKnowledgeCheck(round, usedCheckIds = []) {
  const available = knowledgeChecks.filter(
    (kc) =>
      !usedCheckIds.includes(kc.id) &&
      (!kc.roundRange || (round >= kc.roundRange[0] && round <= kc.roundRange[1]))
  );

  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

export default knowledgeChecks;
