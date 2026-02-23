/**
 * Learning Mode Content - War of 1812 Timeline
 *
 * This content teaches students about the War of 1812 BEFORE they play,
 * so they can answer knowledge check questions during the game.
 *
 * Aligned with knowledge checks in knowledgeChecks.js
 */

export const timelineEvents = [
  {
    id: 1,
    year: '1807-1812',
    title: 'Causes of the War',
    imageUrl: '/images/learning/impressment.jpg', // Optional: Can add later
    content: `The War of 1812 had three main causes that pushed the United States toward conflict with Britain.

**British Impressment:** British naval ships stopped American vessels at sea and forced American sailors to serve in the Royal Navy. Britain was fighting Napoleon in Europe and desperately needed sailors, so they claimed the right to search American ships and take anyone they considered a British subject. Thousands of American sailors were kidnapped this way.

**Trade Restrictions:** Britain and France were at war, and both sides tried to stop neutral countries like the United States from trading with the enemy. Britain's Orders in Council restricted American trade with Europe, devastating the American economy. President Jefferson tried an Embargo Act in 1807 to avoid war, but it backfired—American merchants suffered more than the British.

**Western Expansion & Native Resistance:** Americans wanted to expand westward into Native territories and blamed the British for supporting Native resistance. Tecumseh, a Shawnee leader, was building a confederacy to defend Native lands. Many Americans believed (correctly) that the British in Canada were supplying weapons to Native warriors.`,

    keyTerms: [
      { term: 'Impressment', definition: 'Forcing sailors to serve in the navy against their will' },
      { term: 'War Hawks', definition: 'Young congressmen from the West and South who pushed for war with Britain' },
      { term: 'Embargo Act', definition: 'Jefferson\'s failed attempt to avoid war by banning all foreign trade' },
    ],

    didYouKnow: 'The War Hawks included future leaders like Henry Clay and John C. Calhoun. They were young, aggressive, and eager to defend American honor—even if it meant war with the world\'s most powerful empire.'
  },

  {
    id: 2,
    year: 'June 18, 1812',
    title: 'Declaration of War',
    content: `On June 18, 1812, President James Madison asked Congress to declare war on Great Britain. The vote was close—79-49 in the House and 19-13 in the Senate. This was the closest war vote in American history.

**A Divided Nation:** The country was split. New England merchants opposed the war because they profited from trade with Britain. The South and West supported it, angry about impressment and eager to conquer Canada and Native lands.

**Madison's Reluctant Decision:** Madison didn't want war. He was a scholarly, peaceful man—totally unlike a war president. But the War Hawks in Congress, British impressment, and pressure to defend American honor left him little choice. In his war message, he listed British violations of American rights: impressment, trade restrictions, and support for Native attacks on the frontier.

**Poor Timing:** Ironically, Britain had actually repealed the Orders in Council (trade restrictions) two days before the U.S. declared war. But news traveled slowly across the Atlantic—by the time Madison learned this, the war had already begun.`,

    keyTerms: [
      { term: 'James Madison', definition: '4th U.S. President, led the country during the War of 1812' },
      { term: 'War Hawks', definition: 'Pro-war congressmen like Henry Clay who pushed for conflict with Britain' },
    ],

    didYouKnow: 'Madison was the smallest president in U.S. history—only 5\'4" and about 100 pounds. His wife Dolley was far more popular and charismatic, often serving as the face of his administration.'
  },

  {
    id: 3,
    year: '1812',
    title: 'Early Battles',
    content: `The first year of the war was a disaster for the United States.

**Hull's Surrender at Detroit (August 1812):** General William Hull invaded Canada but quickly retreated. British General Isaac Brock and Tecumseh surrounded Detroit and convinced Hull that thousands of Native warriors would massacre the American garrison. Hull surrendered without firing a shot—the most humiliating American defeat of the war.

**USS Constitution vs. HMS Guerriere (August 1812):** Not all news was bad. The American frigate USS Constitution defeated the British warship HMS Guerriere in a stunning naval victory. British cannonballs bounced off the Constitution's thick oak hull, earning it the nickname "Old Ironsides." This victory shocked the world and proved American ships could fight.

**Battle of Queenston Heights (October 1812):** Americans tried to invade Canada again, crossing the Niagara River. British General Isaac Brock was killed leading a charge to push them back. Brock became a Canadian hero, and the invasion failed miserably when New York militia refused to cross into Canada.`,

    keyTerms: [
      { term: 'Isaac Brock', definition: 'British general who defended Canada, killed at Queenston Heights' },
      { term: 'USS Constitution', definition: 'American warship nicknamed "Old Ironsides" for its thick hull' },
      { term: 'William Hull', definition: 'American general who surrendered Detroit without a fight' },
    ],

    didYouKnow: 'The USS Constitution is still a commissioned U.S. Navy warship today—the oldest floating naval vessel in the world. You can visit it in Boston Harbor!'
  },

  {
    id: 4,
    year: '1813',
    title: 'Native American Involvement',
    content: `Native Americans played a crucial role in the War of 1812, fighting to defend their lands from American expansion.

**Tecumseh's Vision:** Tecumseh, a Shawnee chief, dreamed of uniting all Native tribes into a confederacy strong enough to stop American settlers from taking their lands. He traveled thousands of miles recruiting warriors from the Great Lakes to the Gulf of Mexico. His brother Tenskwatawa, the "Prophet," provided spiritual leadership. Together they built Prophetstown in Indiana as the capital of their movement.

**Alliance with Britain:** Tecumseh allied with the British because he knew they were Native Americans' only hope of stopping U.S. expansion. The British promised to create an independent Native state in the Northwest if they won. Tecumseh's warriors were crucial to early British victories, especially at Detroit.

**Creek War in the South (1813-1814):** In Alabama, a civil war broke out among the Creek Nation. The Red Sticks (led by William Weatherford/Red Eagle) allied with the British and fought to resist American influence. The Creek War became part of the larger War of 1812, with Andrew Jackson leading American forces against the Red Sticks.`,

    keyTerms: [
      { term: 'Tecumseh', definition: 'Shawnee leader who built a confederacy to resist American expansion' },
      { term: 'Red Sticks', definition: 'Creek warriors who fought alongside the British in the South' },
      { term: 'Prophetstown', definition: 'Tecumseh\'s capital for the Native confederacy in Indiana' },
    ],

    didYouKnow: 'Tecumseh was one of the greatest Native American leaders in history. Even his enemies admired him. When he died in 1813, the Native confederacy collapsed—his leadership was irreplaceable.'
  },

  {
    id: 5,
    year: '1813',
    title: 'Turning Points',
    content: `1813 brought major turning points that shifted the war's momentum.

**Battle of Lake Erie (September 1813):** Commodore Oliver Hazard Perry built a fleet on Lake Erie and challenged the British for control of the Great Lakes. After a brutal battle, Perry sent his famous message: "We have met the enemy and they are ours." American control of Lake Erie forced the British to abandon Detroit.

**Battle of the Thames (October 1813):** General William Henry Harrison pursued the retreating British into Canada. At the Battle of the Thames, American forces defeated the British and killed Tecumseh. Tecumseh's death shattered the Native confederacy—without him, the alliance collapsed. This was the beginning of the end for Native resistance in the Northwest.

**Burning of York (April 1813):** Americans captured and burned York (now Toronto), the capital of Upper Canada. They torched the parliament building and looted the town. The British were furious—and later retaliated by burning Washington, D.C.`,

    keyTerms: [
      { term: 'Oliver Hazard Perry', definition: 'U.S. naval commander who won the Battle of Lake Erie' },
      { term: 'William Henry Harrison', definition: 'American general who defeated Tecumseh at the Thames' },
      { term: 'Battle of the Thames', definition: 'Victory where Tecumseh was killed, ending Native confederacy' },
    ],

    didYouKnow: 'Perry\'s famous message "We have met the enemy and they are ours" became one of the most quoted lines in American military history. He sent it on the back of an old envelope during the battle!'
  },

  {
    id: 6,
    year: '1814',
    title: 'British Offensive',
    content: `In 1814, Britain defeated Napoleon in Europe and sent veteran troops to crush the United States.

**Burning of Washington, D.C. (August 1814):** British forces invaded the Chesapeake Bay and marched on Washington. American militia fled in panic at the Battle of Bladensburg. The British entered the capital and burned the White House, the Capitol, and other government buildings. First Lady Dolley Madison barely escaped, saving a portrait of George Washington before the British torched her home. It was the only time in U.S. history that the capital has been captured.

**Battle of Baltimore (September 1814):** After burning Washington, the British attacked Baltimore. Fort McHenry guarded the harbor. British ships bombarded the fort all night, but the Americans held. At dawn, the American flag still flew. Watching the battle, Francis Scott Key wrote "The Star-Spangled Banner," which later became the national anthem.

**Battle of Plattsburgh (September 1814):** British forces invaded New York from Canada with 11,000 troops. At Plattsburgh on Lake Champlain, American naval and land forces defeated them. This victory convinced Britain that conquering the United States would be too costly.`,

    keyTerms: [
      { term: 'Dolley Madison', definition: 'First Lady who saved George Washington\'s portrait from the burning White House' },
      { term: 'Fort McHenry', definition: 'Fort that defended Baltimore, inspiring "The Star-Spangled Banner"' },
      { term: 'Francis Scott Key', definition: 'Lawyer who wrote "The Star-Spangled Banner" after watching Fort McHenry\'s defense' },
    ],

    didYouKnow: '"The Star-Spangled Banner" didn\'t become the official national anthem until 1931—more than 100 years after it was written!'
  },

  {
    id: 7,
    year: 'January 8, 1815',
    title: 'Battle of New Orleans',
    content: `The Battle of New Orleans was the greatest American victory of the war—fought after the peace treaty was signed.

**Andrew Jackson's Preparation:** General Andrew Jackson gathered a diverse army in New Orleans: regular soldiers, Kentucky and Tennessee militia, free Black troops, Choctaw warriors, and even pirates led by Jean Lafitte. He built defensive earthworks and positioned his forces brilliantly.

**The British Attack:** On January 8, 1815, British General Edward Pakenham led 8,000 veteran troops in a frontal assault. It was a slaughter. American riflemen and artillery mowed down the British in rows. Pakenham was killed, and the British suffered over 2,000 casualties. American losses: 13 killed, 39 wounded.

**The Irony:** The Treaty of Ghent had been signed on December 24, 1814—two weeks before the battle. But news traveled slowly. Neither side knew the war was over. The victory made Andrew Jackson a national hero and launched his political career. He later became the 7th president.`,

    keyTerms: [
      { term: 'Andrew Jackson', definition: 'General who won the Battle of New Orleans, later became president' },
      { term: 'Jean Lafitte', definition: 'Pirate who fought alongside Americans at New Orleans' },
    ],

    didYouKnow: 'The Battle of New Orleans made Jackson so popular that he won the presidency in 1828. His nickname "Old Hickory" came from his toughness—soldiers said he was as hard as hickory wood.'
  },

  {
    id: 8,
    year: '1814-1815',
    title: 'Treaty of Ghent & Legacy',
    content: `The War of 1812 ended with the Treaty of Ghent, signed on December 24, 1814, in Belgium.

**Status Quo Ante Bellum:** The treaty restored everything to how it was before the war. No territory changed hands. Britain didn't mention impressment or trade restrictions (because Napoleon was defeated, these issues no longer mattered). Native Americans, who had fought alongside Britain, were abandoned—the treaty said nothing about protecting their lands.

**Who Won?** Both sides claimed victory. Americans celebrated surviving against the British Empire. Canadians were proud they'd defended their country from invasion. The British were just glad to end a costly, unnecessary war. Native Americans were the real losers—they lost their British allies and faced unstoppable American expansion westward.

**Long-term Effects:**
- **American Nationalism:** The war created a surge of American pride and unity called the "Era of Good Feelings." The Federalist Party (which opposed the war) collapsed.
- **Manufacturing Boom:** The war forced America to build its own factories since British goods were cut off. This started American industrialization.
- **Native Displacement:** Without British support, Native tribes couldn't resist American expansion. Westward settlement accelerated.
- **Canadian Identity:** Canadians saw the war as their defining moment—the successful defense against American conquest helped create Canadian national identity.`,

    keyTerms: [
      { term: 'Treaty of Ghent', definition: 'Peace treaty that ended the War of 1812, restoring pre-war borders' },
      { term: 'Status Quo Ante Bellum', definition: 'Latin phrase meaning "the way things were before the war"' },
      { term: 'Era of Good Feelings', definition: 'Period of American nationalism and unity after the war' },
    ],

    didYouKnow: 'The War of 1812 is sometimes called "the war nobody won." Britain got nothing it wanted, America got nothing it wanted, and 20,000 people died for a treaty that changed nothing on paper—but changed everything about how Americans saw themselves.'
  },
];

export default timelineEvents;
