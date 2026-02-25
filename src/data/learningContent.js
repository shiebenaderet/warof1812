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

    didYouKnow: 'The War Hawks included future leaders like Henry Clay and John C. Calhoun. They were young, aggressive, and eager to defend American honor—even if it meant war with the world\'s most powerful empire.',

    causeEffect: {
      cause: 'Britain needed sailors for its war against Napoleon and restricted American trade',
      effect: 'Americans felt their sovereignty was being violated, leading to demands for war',
      thinkAbout: 'Why might a young nation be especially sensitive about its rights being ignored by a former colonial power?',
    },

    geographicContext: {
      description: 'The Atlantic Ocean was the highway of global trade. British naval dominance meant they could stop American ships anywhere at sea. Meanwhile, the frontier between American settlements and Native territories stretched from the Great Lakes to the Gulf of Mexico.',
      keyLocations: ['Atlantic Ocean', 'Great Lakes frontier', 'Gulf of Mexico'],
    },

    primarySourceExcerpt: {
      quote: 'We shall drive the British from our Continent — they will no longer have an opportunity of intriguing with our Indian neighbors.',
      attribution: 'Andrew Jackson, letter to William Henry Harrison, 1812',
      analysisPrompt: 'What does this quote reveal about American motivations for the war? Who besides the British is Jackson concerned about?',
    },

    activity: {
      type: 'sequencing',
      instruction: 'Put these events in the correct order:',
      items: [
        'British begin impressing American sailors (1803)',
        'Chesapeake-Leopard Affair shocks Americans (1807)',
        'Jefferson signs the Embargo Act (1807)',
        'Embargo Act repealed — replaced by weaker measures (1809)',
        'War Hawks elected to Congress (1810)',
        'U.S. declares war on Britain (1812)',
      ],
    },
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

    didYouKnow: 'Madison was the smallest president in U.S. history—only 5\'4" and about 100 pounds. His wife Dolley was far more popular and charismatic, often serving as the face of his administration.',

    causeEffect: {
      cause: 'War Hawks pressured Madison, and British violations of American rights continued',
      effect: 'The closest war vote in U.S. history split the nation along regional lines',
      thinkAbout: 'What does a close vote tell us about how divided the country was? How might this division affect the war effort?',
    },

    geographicContext: {
      description: 'The war vote revealed America\'s regional divide: the South and West supported war (they wanted frontier expansion and freedom from British interference), while New England opposed it (they depended on trade with Britain).',
      keyLocations: ['New England (opposed)', 'South and West (supported)', 'Washington D.C.'],
    },

    primarySourceExcerpt: {
      quote: 'Our flag has been insulted, our commerce plundered, our citizens impressed... We must now oppose force to force.',
      attribution: 'Paraphrased from Madison\'s War Message to Congress, June 1, 1812',
      analysisPrompt: 'Madison lists several grievances. Which one do you think was most important to ordinary Americans? Why?',
    },

    activity: null,
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

    didYouKnow: 'The USS Constitution is still a commissioned U.S. Navy warship today—the oldest floating naval vessel in the world. You can visit it in Boston Harbor!',

    causeEffect: {
      cause: 'The U.S. invaded Canada with poorly trained militia and incompetent leadership',
      effect: 'Humiliating defeats at Detroit and Queenston Heights shattered American confidence',
      thinkAbout: 'Why might overconfidence lead to military failure? How did the Americans underestimate both the British and their Native allies?',
    },

    geographicContext: {
      description: 'The Great Lakes and St. Lawrence River formed the border between the U.S. and British Canada. Control of these waterways determined who could move troops and supplies. Detroit sat at the strategic junction of Lake Erie and the Michigan frontier.',
      keyLocations: ['Detroit', 'Niagara River', 'Lake Erie', 'Upper Canada (Ontario)'],
    },

    primarySourceExcerpt: {
      quote: 'The British force is composed of a body of regulars, militia, and Indians... I have deemed it a duty to avoid the risk of a general engagement.',
      attribution: 'General William Hull, explaining his surrender of Detroit, August 1812',
      analysisPrompt: 'Hull says he avoided battle to protect lives. Do you think this was wise leadership or cowardice? What information might have changed his decision?',
    },

    activity: null,
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

    didYouKnow: 'Tecumseh was one of the greatest Native American leaders in history. Even his enemies admired him. When he died in 1813, the Native confederacy collapsed—his leadership was irreplaceable.',

    causeEffect: {
      cause: 'American settlers pushed into Native lands while the British offered military alliance',
      effect: 'Tecumseh built a confederacy and allied with Britain, creating a three-sided war',
      thinkAbout: 'Why would Native nations choose to ally with Britain rather than remain neutral? What were they risking?',
    },

    geographicContext: {
      description: 'Native territories covered the vast interior of the continent from the Great Lakes to the Gulf of Mexico. The frontier was not a line but a contested zone where American settlements pushed into Native homelands.',
      keyLocations: ['Prophetstown (Indiana)', 'Creek Nation (Alabama)', 'Great Lakes region', 'Mississippi frontier'],
    },

    primarySourceExcerpt: {
      quote: 'Sell a country! Why not sell the air, the clouds and the great sea, as well as the earth?',
      attribution: 'Tecumseh, speaking to Governor Harrison at Vincennes, 1810',
      analysisPrompt: 'Tecumseh compares selling land to selling air and clouds. What does this reveal about how Native peoples viewed their relationship to the land compared to Americans?',
    },

    activity: {
      type: 'matching',
      instruction: 'Match each leader to their role:',
      items: [
        'Tecumseh \u2192 Built a pan-Native confederacy to resist American expansion',
        'Tenskwatawa \u2192 Spiritual leader known as "The Prophet" who inspired cultural renewal',
        'William Weatherford \u2192 Led the Red Stick Creek faction in the Southern frontier',
        'William Henry Harrison \u2192 American governor who fought Native resistance at Tippecanoe',
      ],
    },
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

    didYouKnow: 'Perry\'s famous message "We have met the enemy and they are ours" became one of the most quoted lines in American military history. He sent it on the back of an old envelope during the battle!',

    causeEffect: {
      cause: 'Perry\'s victory on Lake Erie cut British supply lines and forced them to abandon Detroit',
      effect: 'Harrison pursued the retreating British, and Tecumseh was killed at the Thames \u2014 ending the Native confederacy',
      thinkAbout: 'How did control of the Great Lakes determine who controlled the frontier? Why was naval power so important on inland waters?',
    },

    geographicContext: {
      description: 'Lake Erie was the key to the entire Great Lakes theater. Whoever controlled the lake controlled supply routes to Detroit and the Western frontier. Perry built his fleet at Presque Isle (Erie, Pennsylvania) using timber from local forests.',
      keyLocations: ['Lake Erie', 'Presque Isle (Erie, PA)', 'Detroit', 'Thames River (Ontario)'],
    },

    primarySourceExcerpt: {
      quote: 'We have met the enemy and they are ours: two ships, two brigs, one schooner and one sloop.',
      attribution: 'Oliver Hazard Perry, message to William Henry Harrison, September 10, 1813',
      analysisPrompt: 'Perry\'s message is famously short and direct. Why do you think this brief message became one of the most famous quotes in American military history?',
    },

    activity: null,
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

    didYouKnow: '"The Star-Spangled Banner" didn\'t become the official national anthem until 1931—more than 100 years after it was written!',

    causeEffect: {
      cause: 'Napoleon\'s defeat freed thousands of experienced British troops for service in America',
      effect: 'Britain launched major offensives \u2014 burning Washington but failing to take Baltimore or invade from Canada',
      thinkAbout: 'How were the Napoleonic Wars and the War of 1812 connected? How did events in Europe change the war in America?',
    },

    geographicContext: {
      description: 'The Chesapeake Bay gave the British navy direct access to Washington D.C. and Baltimore. The bay\'s many rivers and inlets made it impossible for the small American navy to defend everywhere. Fort McHenry sat at the narrow entrance to Baltimore Harbor.',
      keyLocations: ['Chesapeake Bay', 'Washington D.C.', 'Baltimore Harbor', 'Fort McHenry', 'Plattsburgh (Lake Champlain)'],
    },

    primarySourceExcerpt: {
      quote: 'Our country is the better for its trials. It has been taught a lesson which no experience could have anticipated.',
      attribution: 'Niles\' Weekly Register editorial after the burning of Washington, 1814',
      analysisPrompt: 'The editorial says the country is "better for its trials." How might defeat and destruction actually strengthen national unity? Can you think of other examples in history?',
    },

    activity: null,
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

    didYouKnow: 'The Battle of New Orleans made Jackson so popular that he won the presidency in 1828. His nickname "Old Hickory" came from his toughness—soldiers said he was as hard as hickory wood.',

    causeEffect: {
      cause: 'Jackson assembled a diverse army and built strong defensive positions at New Orleans',
      effect: 'The British frontal assault was a catastrophe \u2014 2,000+ casualties vs. 71 American \u2014 making Jackson a national hero',
      thinkAbout: 'The battle was fought after the peace treaty was signed. Does that make the sacrifice meaningless, or did the battle still matter? How did it change American politics?',
    },

    geographicContext: {
      description: 'New Orleans controlled the mouth of the Mississippi River \u2014 America\'s economic lifeline. Whoever held New Orleans controlled trade for the entire interior of the continent. Jackson used the swampy terrain to funnel the British into a killing zone.',
      keyLocations: ['New Orleans', 'Mississippi River', 'Gulf of Mexico', 'Chalmette Plantation'],
    },

    primarySourceExcerpt: {
      quote: 'I heard the bullets whistling all around me, and saw my brave men falling on every side. The field was covered with dead and wounded.',
      attribution: 'British officer\'s account of the Battle of New Orleans, January 8, 1815',
      analysisPrompt: 'This is written from the British perspective. How would this same battle be described by someone on the American side? How does perspective change how we tell the story?',
    },

    activity: {
      type: 'sequencing',
      instruction: 'Put these events in the correct order:',
      items: [
        'Jackson recruits free Black soldiers, Choctaw warriors, and pirates',
        'Treaty of Ghent signed in Belgium (December 24, 1814)',
        'British launch frontal assault on American defenses (January 8, 1815)',
        'News of the peace treaty reaches New Orleans (February 1815)',
        'Jackson is celebrated as a national hero',
      ],
    },
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

    didYouKnow: 'The War of 1812 is sometimes called "the war nobody won." Britain got nothing it wanted, America got nothing it wanted, and 20,000 people died for a treaty that changed nothing on paper—but changed everything about how Americans saw themselves.',

    causeEffect: {
      cause: 'Both sides were exhausted \u2014 Britain from the Napoleonic Wars, America from economic devastation',
      effect: 'The treaty changed nothing on paper but transformed American identity, destroyed the Federalist Party, and abandoned Native allies',
      thinkAbout: 'Can a war with no territorial changes still have enormous consequences? What changed even though the borders didn\'t?',
    },

    geographicContext: {
      description: 'The Treaty of Ghent was negotiated in Ghent, Belgium \u2014 thousands of miles from the battlefields. The distance meant that fighting continued for weeks after the treaty was signed. The treaty\'s failure to address Native lands opened the entire frontier to American expansion.',
      keyLocations: ['Ghent, Belgium', 'Northwest Territory', 'Creek Nation lands', 'New England (Hartford Convention)'],
    },

    primarySourceExcerpt: {
      quote: 'The war has renewed and reinstated the national feelings which the Revolution had given and which were daily lessened.',
      attribution: 'Albert Gallatin, former Treasury Secretary, 1816',
      analysisPrompt: 'Gallatin says the war restored national feelings from the Revolution. Why might Americans have lost some national pride between 1783 and 1812? How did the war restore it?',
    },

    activity: null,
  },

  {
    id: 9,
    year: '1812-1815',
    title: 'Diverse Experiences of the War',
    content: `The War of 1812 affected different groups in dramatically different ways. Understanding these diverse experiences gives us a fuller picture of the conflict.

**African Americans in the War:** About 15-20% of American sailors were free Black men who served alongside white sailors with equal pay. On land, Andrew Jackson recruited free men of color into two battalions at New Orleans. Meanwhile, approximately 4,000 enslaved people escaped to British lines, where they were offered freedom. Some formed the Colonial Marines and fought against their former enslavers. Britain resettled most in Nova Scotia and Trinidad after the war.

**Women's Roles:** Women managed farms, businesses, and plantations while men fought. Frontier women defended homesteads and survived as refugees. Dolley Madison saved national treasures from the burning White House. Mary Pickersgill sewed the enormous Fort McHenry flag. Laura Secord walked 20 miles through enemy territory to warn British forces. The British blockade created new factory jobs for women, accelerating American industrialization.

**Native American Experiences:** Native nations were not monolithic — they made complex choices about alliances. Some fought with the British, some with the Americans, some tried to stay neutral. Women in matrilineal societies like the Creek held political influence and bore the heaviest burden of displacement. After the war, all Native nations suffered regardless of which side they chose.`,

    keyTerms: [
      { term: 'Colonial Marines', definition: 'British military unit made up of formerly enslaved people who escaped from American plantations' },
      { term: 'Matrilineal', definition: 'A social system where family descent and inheritance pass through the mother\'s line' },
      { term: 'Self-emancipation', definition: 'The act of enslaved people freeing themselves by escaping to freedom' },
    ],

    didYouKnow: 'After the war, American slaveholders demanded Britain return the people who had escaped to freedom. Britain refused, and the issue was sent to international arbitration. In 1826, Tsar Alexander I of Russia ruled that Britain owed compensation \u2014 but for the "property," not for freeing human beings. The case reveals how slavery was intertwined with international diplomacy.',

    causeEffect: {
      cause: 'The war disrupted social structures and created opportunities for marginalized groups to seek freedom and new roles',
      effect: 'African Americans proved their valor in combat, women demonstrated economic capability, and Native nations faced catastrophic consequences regardless of their choices',
      thinkAbout: 'Why do we often hear about generals and politicians but rarely about ordinary people\'s wartime experiences? Whose stories are missing from most textbooks?',
    },

    geographicContext: {
      description: 'Diverse experiences varied by region: the Chesapeake Bay was where most enslaved people escaped to British ships; New England was where women entered factories; the Great Lakes frontier was where Native communities were displaced.',
      keyLocations: ['Chesapeake Bay', 'New England mills', 'Great Lakes frontier', 'Creek Nation'],
    },

    primarySourceExcerpt: {
      quote: 'I had been a slave, and knew what slavery was. I determined to get my liberty or lose my life.',
      attribution: 'Paraphrased from Charles Ball\'s memoir, an African American veteran of the war',
      analysisPrompt: 'What does Ball\'s statement tell us about how enslaved people viewed the war differently from free Americans? How might their motivations for fighting differ?',
    },

    activity: null,
  },

  {
    id: 10,
    year: '1812-1815',
    title: 'Geography of the War',
    content: `Geography shaped every major decision and outcome of the War of 1812. Understanding WHERE things happened helps explain WHY they happened.

**The Great Lakes Theater:** The chain of Great Lakes (Erie, Ontario, Huron, Superior) formed the border between the U.S. and Canada. Whoever controlled the lakes controlled supply routes, troop movements, and communication. This is why the naval battle on Lake Erie was so decisive \u2014 Perry's victory cut off British supplies to Detroit and the entire western frontier.

**The Chesapeake Bay:** This enormous bay gave the British navy access deep into the American heartland. Rivers flowing into the bay led directly to Washington D.C. and Baltimore. The British used this geographic advantage to burn the capital, but Fort McHenry's position at the narrow entrance to Baltimore Harbor denied them their next target.

**The Mississippi & New Orleans:** New Orleans sat at the mouth of the Mississippi River \u2014 the economic lifeline of the American interior. All trade from the Ohio Valley, Kentucky, Tennessee, and the frontier flowed down the Mississippi to New Orleans. Losing the city would have been catastrophic for the American economy, which is why its defense was so critical.

**The Canadian Frontier:** Americans believed conquering Canada would be easy, but geography proved them wrong. Long supply lines, dense forests, and the defensive advantage of the British along the St. Lawrence River made invasion extremely difficult.`,

    keyTerms: [
      { term: 'Theater of war', definition: 'A geographic area where military operations take place' },
      { term: 'Supply lines', definition: 'Routes used to transport food, ammunition, and equipment to armies' },
      { term: 'Strategic chokepoint', definition: 'A narrow passage that controls access to a larger area' },
    ],

    didYouKnow: 'The War of 1812 was fought across an area larger than all of Western Europe. Messages between Washington and frontier commanders could take weeks to arrive. This is why the Battle of New Orleans was fought after the peace treaty was signed \u2014 news simply couldn\'t travel fast enough.',

    causeEffect: {
      cause: 'The vast distances and geographic barriers of North America made coordinating military operations extremely difficult',
      effect: 'Battles were often fought without commanders knowing the full strategic picture, and control of waterways became more important than winning any single land battle',
      thinkAbout: 'How would the war have been different if the telephone or telegraph had existed? How does communication speed affect military strategy?',
    },

    geographicContext: {
      description: 'The war was fought across four main theaters: the Great Lakes/Canadian border, the Atlantic coast, the Chesapeake Bay, and the Gulf Coast. Each theater had unique geographic challenges that shaped the fighting.',
      keyLocations: ['Great Lakes', 'St. Lawrence River', 'Chesapeake Bay', 'Gulf of Mexico', 'New Orleans', 'Niagara frontier'],
    },

    primarySourceExcerpt: {
      quote: 'The conquest of Canada is in your power. I trust I shall not be deemed presumptuous when I state that I verily believe that the militia of Kentucky are alone competent to place Montreal and Upper Canada at your feet.',
      attribution: 'Henry Clay, War Hawk congressman, 1812',
      analysisPrompt: 'Clay was completely wrong \u2014 Canada was not easily conquered. What geographic factors did he fail to consider? Why might politicians underestimate military challenges?',
    },

    activity: null,
  },
];

export default timelineEvents;
