/**
 * Historical Analysis Engine for War of 1812: Rise of the Nation
 *
 * Generates paragraphs comparing the player's game outcome
 * to what actually happened during the War of 1812.
 */

// ── Historical Outcome Summaries ─────────────────────────────────
const HISTORICAL_OUTCOME = {
  us: 'In reality, the War of 1812 ended in a strategic draw for the United States. American invasions of Canada failed repeatedly \u2014 Detroit was surrendered without a fight, and three attempts to take Montreal were repulsed. However, Oliver Hazard Perry\u2019s victory on Lake Erie and Andrew Jackson\u2019s triumph at New Orleans boosted American nationalism. The Treaty of Ghent restored all borders to their pre-war positions, but the war forged a stronger national identity.',
  british: 'The British Empire successfully defended Canada throughout the war, which was their primary objective. They burned Washington D.C. in August 1814 but failed to take Baltimore when Fort McHenry withstood bombardment \u2014 inspiring \u2018The Star-Spangled Banner.\u2019 British forces were stretched thin fighting Napoleon in Europe simultaneously. The Treaty of Ghent was essentially a return to status quo ante bellum \u2014 no territory changed hands.',
  native: 'The War of 1812 was catastrophic for Native peoples. Tecumseh\u2019s confederacy, the most powerful pan-Indian alliance in North American history, collapsed when he was killed at the Battle of the Thames in October 1813. Without British support after the treaty, Native nations lost all leverage. The Creek War ended with the Treaty of Fort Jackson, stripping 23 million acres from the Creek Nation. The war accelerated westward expansion and Native displacement.',
};

// ── Territory-Specific Historical Notes ──────────────────────────
const TERRITORY_HISTORY = {
  detroit: 'Detroit was surrendered by General Hull to British and Native forces in August 1812 without a fight \u2014 one of America\u2019s most humiliating defeats. It was recaptured by General Harrison after the Battle of the Thames in October 1813.',
  washington_dc: 'British forces burned Washington D.C. in August 1814, including the White House and Capitol building. It was the only time a foreign power has captured and burned the American capital.',
  baltimore: 'The British bombardment of Fort McHenry in September 1814 failed to capture Baltimore. Francis Scott Key, watching from a British ship, wrote \u2018The Star-Spangled Banner\u2019 during the 25-hour bombardment.',
  new_orleans: 'Andrew Jackson\u2019s decisive victory at New Orleans in January 1815 was actually fought after the Treaty of Ghent was signed, but before news reached the city. It made Jackson a national hero.',
  lake_erie: 'Oliver Hazard Perry\u2019s victory at the Battle of Lake Erie in September 1813 gave the U.S. control of the lake and forced the British to retreat from Detroit. His message: \u2018We have met the enemy and they are ours.\u2019',
  montreal: 'American forces attempted to capture Montreal three times during the war and failed each time. The city was the key to British Canada, and its defense was crucial to the British war effort.',
  upper_canada: 'Upper Canada (modern Ontario) saw some of the war\u2019s fiercest fighting. The battles of Queenston Heights, Lundy\u2019s Lane, and the burning of York (Toronto) made this the war\u2019s most contested theater.',
  niagara: 'The Niagara frontier was the site of brutal back-and-forth fighting. The Battle of Lundy\u2019s Lane in July 1814 was one of the bloodiest battles ever fought on Canadian soil.',
  creek_nation: 'The Creek War (1813\u20141814) saw Andrew Jackson\u2019s forces defeat the Red Stick Creek at the Battle of Horseshoe Bend. The Treaty of Fort Jackson stripped the Creek Nation of 23 million acres.',
  indiana_territory: 'Indiana Territory was the heart of Tecumseh\u2019s confederacy. The Battle of Tippecanoe in 1811 weakened the confederacy before the war, and Tecumseh\u2019s death at the Thames in 1813 ended it.',
  halifax: 'Halifax served as the primary British naval base in North America. It was never seriously threatened and served as the staging point for the British blockade of the American coast.',
  fort_dearborn: 'Fort Dearborn (modern Chicago) was evacuated and its garrison massacred by Potawatomi warriors allied with the British in August 1812, one of the war\u2019s early Native victories.',
};

// Historical starting owners used for comparison logic
const HISTORICAL_OWNERS = {
  detroit: 'us',
  fort_dearborn: 'us',
  washington_dc: 'us',
  baltimore: 'us',
  new_orleans: 'us',
  niagara: 'british',
  upper_canada: 'british',
  montreal: 'british',
  halifax: 'british',
  lake_erie: 'neutral',
  creek_nation: 'native',
  indiana_territory: 'native',
};

// Faction display labels
const FACTION_LABELS = {
  us: 'United States',
  british: 'British Empire',
  native: 'Native Confederacy',
};

// ── Tactical comparison text ─────────────────────────────────────
const REAL_WAR_CHARACTER = {
  us: 'The real American military was plagued by poor leadership and militia reluctance in the early war, improving significantly by 1814.',
  british: 'British regulars were among the world\u2019s finest soldiers, but they were stretched thin across a global war against Napoleon.',
  native: 'Native warriors excelled in guerrilla warfare and frontier combat, but were ultimately overwhelmed by numbers and the loss of key leaders.',
};

// ── Historical lesson text ───────────────────────────────────────
const HISTORICAL_LESSON = {
  us: 'The War of 1812 taught the young republic that military preparedness matters \u2014 the regular army that emerged was far more professional than the militia-dependent force that started the war. It also sparked the \u2018Era of Good Feelings\u2019 and a surge of American nationalism that shaped the nation\u2019s identity.',
  british: 'For Britain, the War of 1812 was always a sideshow to the Napoleonic Wars. The lesson was that defending Canada required both military strength and Native alliances \u2014 alliances that were abandoned at the Treaty of Ghent, with devastating consequences for Indigenous peoples.',
  native: 'The War of 1812 was the last realistic chance for Native peoples to resist American westward expansion through military alliance. Tecumseh\u2019s vision of a pan-Indian confederacy was the most ambitious attempt at unity, and its failure after his death opened the floodgates to removal policies that would culminate in the Trail of Tears.',
};

// ── Territory comparison templates ───────────────────────────────
// Each entry: [territory, ownerCondition, comparisonSentence]
// ownerCondition: { faction, owns: true/false } means "if <faction> player owns/doesn't own this"
const TERRITORY_COMPARISONS = {
  us: [
    {
      territory: 'montreal',
      owns: true,
      text: 'You succeeded in capturing Montreal \u2014 something American forces attempted three times but never achieved historically.',
    },
    {
      territory: 'washington_dc',
      owns: false,
      text: 'Like the real war, your capital fell to enemy forces.',
    },
    {
      territory: 'washington_dc',
      owns: true,
      text: 'You managed to hold Washington D.C. \u2014 unlike the real war, where the British burned it in 1814.',
    },
    {
      territory: 'detroit',
      owns: false,
      text: 'You lost Detroit, echoing General Hull\u2019s humiliating surrender of the city in August 1812.',
    },
    {
      territory: 'detroit',
      owns: true,
      text: 'You held Detroit throughout \u2014 unlike history, where it was surrendered without a fight and had to be recaptured.',
    },
    {
      territory: 'upper_canada',
      owns: true,
      text: 'You conquered Upper Canada, achieving what the real American military never could despite multiple invasions.',
    },
    {
      territory: 'new_orleans',
      owns: true,
      text: 'Like Andrew Jackson\u2019s forces in reality, you held New Orleans against enemy attack.',
    },
    {
      territory: 'new_orleans',
      owns: false,
      text: 'You lost New Orleans \u2014 unlike history, where Jackson\u2019s decisive victory made it America\u2019s greatest triumph of the war.',
    },
    {
      territory: 'lake_erie',
      owns: true,
      text: 'You secured Lake Erie, mirroring Oliver Hazard Perry\u2019s famous naval victory in September 1813.',
    },
    {
      territory: 'niagara',
      owns: true,
      text: 'You captured the Niagara frontier \u2014 historically one of the bloodiest and most contested regions of the war.',
    },
  ],
  british: [
    {
      territory: 'washington_dc',
      owns: true,
      text: 'You captured Washington D.C., just as British forces did in August 1814 when they burned the White House and Capitol.',
    },
    {
      territory: 'baltimore',
      owns: true,
      text: 'Unlike history, where Fort McHenry\u2019s defense inspired \u2018The Star-Spangled Banner,\u2019 you managed to take Baltimore.',
    },
    {
      territory: 'baltimore',
      owns: false,
      text: 'Like the real war, Baltimore\u2019s defenses held firm against your forces.',
    },
    {
      territory: 'new_orleans',
      owns: true,
      text: 'Unlike history, where Jackson\u2019s forces crushed the British at New Orleans, you managed to take the city.',
    },
    {
      territory: 'montreal',
      owns: true,
      text: 'You held Montreal, just as the British did historically \u2014 repelling every American attempt to capture it.',
    },
    {
      territory: 'montreal',
      owns: false,
      text: 'You lost Montreal \u2014 something the real British forces never allowed, successfully defending it against three American invasions.',
    },
    {
      territory: 'detroit',
      owns: true,
      text: 'You captured Detroit, mirroring the real war\u2019s early British triumph when General Hull surrendered the city without a fight.',
    },
    {
      territory: 'upper_canada',
      owns: true,
      text: 'You defended Upper Canada successfully, just as British and Canadian forces did throughout the real war.',
    },
    {
      territory: 'upper_canada',
      owns: false,
      text: 'You lost Upper Canada \u2014 a devastating departure from history, where its defense was Britain\u2019s primary war objective.',
    },
    {
      territory: 'lake_erie',
      owns: true,
      text: 'You held Lake Erie \u2014 unlike history, where Perry\u2019s victory gave the Americans control of the lake.',
    },
  ],
  native: [
    {
      territory: 'detroit',
      owns: true,
      text: 'You captured Detroit, echoing the real war\u2019s early alliance victory when Tecumseh and British forces took the city.',
    },
    {
      territory: 'indiana_territory',
      owns: true,
      text: 'You held Indiana Territory \u2014 the heart of Tecumseh\u2019s confederacy \u2014 which was lost historically after his death.',
    },
    {
      territory: 'indiana_territory',
      owns: false,
      text: 'You lost Indiana Territory, the heartland of Tecumseh\u2019s confederacy, mirroring the historical collapse after his death at the Thames.',
    },
    {
      territory: 'creek_nation',
      owns: true,
      text: 'You defended the Creek Nation \u2014 unlike history, where the Treaty of Fort Jackson stripped 23 million acres from the Creek people.',
    },
    {
      territory: 'creek_nation',
      owns: false,
      text: 'Like history, the Creek Nation fell \u2014 echoing the devastating Treaty of Fort Jackson that followed the Battle of Horseshoe Bend.',
    },
    {
      territory: 'fort_dearborn',
      owns: true,
      text: 'You took Fort Dearborn, mirroring the real Potawatomi victory there in August 1812.',
    },
    {
      territory: 'ohio_valley',
      owns: true,
      text: 'You seized the Ohio Valley \u2014 a region Tecumseh\u2019s confederacy fought to reclaim from American settlers.',
    },
    {
      territory: 'upper_canada',
      owns: true,
      text: 'You conquered Upper Canada \u2014 a remarkable achievement beyond anything Native forces accomplished independently in the real war.',
    },
    {
      territory: 'washington_dc',
      owns: true,
      text: 'You captured the American capital \u2014 something no Native force achieved historically, though the British did burn it in 1814.',
    },
    {
      territory: 'new_orleans',
      owns: true,
      text: 'You took New Orleans, gaining control of the Mississippi \u2014 a strategic objective that would have transformed the war\u2019s outcome for Native peoples.',
    },
  ],
};

// ── Main Export ───────────────────────────────────────────────────

/**
 * Generate an array of 4 paragraph strings comparing the player's
 * game to what actually happened in the War of 1812.
 *
 * @param {string} playerFaction - 'us' | 'british' | 'native'
 * @param {Object} territoryOwners - { [territoryId]: 'us'|'british'|'native'|'neutral' }
 * @param {{ fought: number, won: number, lost: number }} battleStats
 * @param {number} round - current round number
 * @param {string} gameOverReason - 'domination' | 'elimination' | 'treaty'
 * @returns {string[]} 4 paragraph strings
 */
export function generateHistoricalComparison(
  playerFaction,
  territoryOwners,
  battleStats,
  round,
  gameOverReason
) {
  const factionLabel = FACTION_LABELS[playerFaction] || playerFaction;
  const outcome = HISTORICAL_OUTCOME[playerFaction] || '';

  // ── Paragraph 1: Outcome comparison ──────────────────────────
  let paragraph1;
  if (gameOverReason === 'domination') {
    paragraph1 = `Your ${factionLabel} achieved total domination of the theater \u2014 something no faction came close to in the real war. ${outcome}`;
  } else if (gameOverReason === 'elimination') {
    const historicallyEliminated = playerFaction === 'native';
    const eliminationNote = historicallyEliminated
      ? 'a fate that tragically mirrors what happened to Native peoples, whose military power was effectively destroyed'
      : "a fate that didn't historically happen to this faction";
    paragraph1 = `Your ${factionLabel} was completely eliminated \u2014 ${eliminationNote}. ${outcome}`;
  } else {
    // treaty (default)
    paragraph1 = `The war ended with the Treaty of Ghent, just as it did historically. ${outcome}`;
  }

  // ── Paragraph 2: Territory-specific comparisons ──────────────
  const comparisons = TERRITORY_COMPARISONS[playerFaction] || [];
  const matched = [];

  for (const comp of comparisons) {
    if (matched.length >= 3) break;
    const currentOwner = territoryOwners[comp.territory];
    const playerOwns = currentOwner === playerFaction;
    if (playerOwns === comp.owns) {
      matched.push(comp.text);
    }
  }

  let paragraph2;
  if (matched.length > 0) {
    paragraph2 = matched.join(' ');
  } else {
    // Fallback if no comparisons matched
    paragraph2 = `The territorial outcome of your game diverged significantly from the historical war. ${TERRITORY_HISTORY[Object.keys(TERRITORY_HISTORY)[0]]}`;
  }

  // ── Paragraph 3: Tactical analysis ───────────────────────────
  const fought = battleStats?.fought || 0;
  const won = battleStats?.won || 0;
  const winRate = fought > 0 ? won / fought : 0;
  const winPct = Math.round(winRate * 100);

  let tacticalOpener;
  if (fought === 0) {
    tacticalOpener = `Your forces avoided direct combat entirely across ${round} rounds \u2014 an unusual but historically defensible strategy.`;
  } else if (winRate > 0.7) {
    tacticalOpener = `Your aggressive strategy paid off with a ${winPct}% victory rate across ${fought} battles.`;
  } else if (winRate < 0.4) {
    tacticalOpener = `Your forces struggled in combat, winning only ${winPct}% of ${fought} battles.`;
  } else {
    tacticalOpener = `Your balanced approach yielded a ${winPct}% victory rate across ${fought} engagements.`;
  }

  const paragraph3 = `${tacticalOpener} ${REAL_WAR_CHARACTER[playerFaction] || ''}`;

  // ── Paragraph 4: Historical lesson ───────────────────────────
  const paragraph4 = HISTORICAL_LESSON[playerFaction] || '';

  return [paragraph1, paragraph2, paragraph3, paragraph4];
}
