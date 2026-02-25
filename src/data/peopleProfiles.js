/**
 * People Profiles for War of 1812: Rise of the Nation
 *
 * Biographical profiles of key historical figures, including game leaders
 * and additional voices that broaden the narrative beyond military commanders.
 *
 * Each profile includes:
 *  - id: unique key (matches leaders.js id for game leaders)
 *  - name: display name
 *  - years: birth-death string
 *  - faction: 'us' | 'british' | 'native'
 *  - category: 'military' | 'political' | 'civilian' | 'native_leader'
 *  - isGameLeader: whether this person is a playable leader in the game
 *  - title: rank or role
 *  - biography: array of 2-3 paragraph strings
 *  - primarySources: array of { quote, attribution, context }
 *  - didYouKnow: fun-fact string
 */

const profiles = [
  // ═══════════════════════════════════════════════════════════════════════════
  //  UNITED STATES — Game Leaders
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'jackson',
    name: 'Andrew Jackson',
    years: '1767–1845',
    faction: 'us',
    category: 'military',
    isGameLeader: true,
    title: 'Major General',
    biography: [
      'Andrew Jackson was a self-made Tennessee frontiersman who became the War of 1812\'s greatest American hero. Born into poverty along the Carolina frontier, he rose through sheer force of will to become a lawyer, congressman, and militia commander. He had no formal military training, but his iron determination and fierce temper earned him the nickname "Old Hickory" from soldiers who said he was as tough as the hardest wood.',
      'His victory at the Battle of New Orleans in January 1815 made him a national icon. Commanding one of the most diverse armies in American history — regulars, frontier militia, free Black troops, Choctaw warriors, and Jean Lafitte\'s pirates — Jackson inflicted over 2,000 British casualties while losing only 71 of his own men. It was the most lopsided American victory of the war.',
      'Jackson\'s wartime fame launched him to the presidency in 1828. As president, however, he signed the Indian Removal Act of 1830, which forced tens of thousands of Native people from their homelands — a dark irony given his wartime alliances with Choctaw and Cherokee warriors who had fought beside him.',
    ],
    primarySources: [
      {
        quote: 'I have always been ready to lay down my life for my country.',
        attribution: 'Andrew Jackson',
        context: 'A sentiment Jackson expressed throughout his military and political career.',
      },
    ],
    didYouKnow:
      'Jackson fought his first battle at age 13 during the American Revolution and carried a British officer\'s saber scar on his face for life.',
  },

  {
    id: 'perry',
    name: 'Oliver Hazard Perry',
    years: '1785–1819',
    faction: 'us',
    category: 'military',
    isGameLeader: true,
    title: 'Commodore',
    biography: [
      'Oliver Hazard Perry built a fleet from scratch on the shores of Lake Erie and won the decisive naval battle of the war. Only 27 years old during the engagement, Perry supervised the construction of an entire squadron using green timber cut from the surrounding forests. His determination to control the Great Lakes was critical to the American war effort in the west.',
      'When his flagship Lawrence was shattered by British cannon fire and most of its crew killed or wounded, Perry refused to surrender. He climbed into a small rowboat and, under a hail of enemy fire, rowed to the undamaged brig Niagara. From there he broke through the British line and forced the entire enemy squadron to surrender. His message to General William Henry Harrison — "We have met the enemy and they are ours" — became one of the most famous dispatches in American military history.',
    ],
    primarySources: [
      {
        quote: 'We have met the enemy and they are ours: two ships, two brigs, one schooner and one sloop.',
        attribution: 'Oliver Hazard Perry, September 10, 1813',
        context: 'Perry\'s dispatch to General Harrison after the Battle of Lake Erie.',
      },
    ],
    didYouKnow:
      'Perry praised his African American sailors, who made up about 25% of his crew, saying they "seemed absolutely insensible to danger."',
  },

  {
    id: 'harrison',
    name: 'William Henry Harrison',
    years: '1773–1841',
    faction: 'us',
    category: 'military',
    isGameLeader: true,
    title: 'Major General',
    biography: [
      'William Henry Harrison was Governor of Indiana Territory before the war and was already famous for leading American forces at the Battle of Tippecanoe in 1811, where he destroyed Prophetstown, the spiritual center of Tecumseh\'s confederacy. When the War of 1812 began, he was appointed commander of the Army of the Northwest.',
      'After Perry\'s victory on Lake Erie opened the water route into Canada, Harrison pursued the retreating British army and defeated them at the Battle of the Thames in October 1813. During that battle, Tecumseh was killed — shattering the pan-Native alliance. Harrison became a national hero and later rode his fame to the White House, winning the 1840 presidential election with the famous slogan "Tippecanoe and Tyler Too."',
    ],
    primarySources: [
      {
        quote: 'The American backwoodsmen are the best soldiers in the world for a campaign in the wilderness.',
        attribution: 'William Henry Harrison',
        context: 'Harrison\'s assessment of frontier fighters during the Northwest campaign.',
      },
    ],
    didYouKnow:
      'Harrison served the shortest presidency in history — just 31 days. He caught pneumonia at his inauguration and died a month later.',
  },

  {
    id: 'winfield_scott',
    name: 'Winfield Scott',
    years: '1786–1866',
    faction: 'us',
    category: 'military',
    isGameLeader: true,
    title: 'Brigadier General',
    biography: [
      'Winfield Scott was a young officer who transformed the professionalism of the American army during the War of 1812. Captured by the British at the disastrous Battle of Queenston Heights early in the war, he was exchanged and returned to service with a fierce determination to train American soldiers to match British regulars.',
      'Scott drilled his troops rigorously using French military manuals, insisting on discipline, proper formations, and bayonet practice. His efforts paid off spectacularly at the battles of Chippawa and Lundy\'s Lane in 1814, where his brigade stood toe-to-toe with British veterans and proved that American regulars could fight as well as any army in the world. Scott went on to serve as commanding general during the Mexican-American War and was still in command at the start of the Civil War.',
    ],
    primarySources: [
      {
        quote: 'Take care of your men, and they will take care of you.',
        attribution: 'Attributed to Winfield Scott',
        context: 'A principle Scott followed throughout his long military career.',
      },
    ],
    didYouKnow:
      'Scott served in the military for over 50 years — from the War of 1812 through the start of the Civil War. He was the longest-serving general in American history.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  BRITISH / CANADA — Game Leaders
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'brock',
    name: 'Isaac Brock',
    years: '1769–1812',
    faction: 'british',
    category: 'military',
    isGameLeader: true,
    title: 'Major General',
    biography: [
      'Isaac Brock was the bold and charismatic commander who saved Upper Canada in the opening months of the War of 1812. When American General William Hull invaded Canada with a larger force, Brock responded with audacity — marching rapidly to Detroit and using a brilliant combination of bluff, psychological warfare, and his alliance with Tecumseh to convince Hull that he faced overwhelming numbers. Hull surrendered Detroit without a fight, a humiliation that shocked the American public.',
      'Brock was killed leading a charge at the Battle of Queenston Heights on October 13, 1812. His death was a devastating blow to British morale, but his early victories inspired the defense of Canada for the rest of the war. He remains one of Canada\'s greatest national heroes, celebrated for saving the colony when it seemed most vulnerable.',
    ],
    primarySources: [
      {
        quote: 'Push on, brave York Volunteers!',
        attribution: 'Isaac Brock, October 13, 1812',
        context: 'Brock\'s last words as he led a charge up the heights at Queenston.',
      },
    ],
    didYouKnow:
      'Brock\'s monument at Queenston Heights is 56 meters tall — one of the tallest monuments in Canada. He was mourned by both British and Native allies.',
  },

  {
    id: 'drummond',
    name: 'Gordon Drummond',
    years: '1772–1854',
    faction: 'british',
    category: 'military',
    isGameLeader: true,
    title: 'Lieutenant General',
    biography: [
      'Gordon Drummond was the first Canadian-born officer to command all British forces in Canada. He took over leadership after Brock\'s death and directed the defense of the Niagara frontier during some of the war\'s most intense fighting.',
      'Drummond commanded British forces at the brutal Battle of Lundy\'s Lane on July 25, 1814 — one of the bloodiest engagements of the entire war. Fighting raged into the night at close range, with both sides suffering heavy casualties. Drummond was wounded during the battle but refused to leave the field, rallying his men to hold their ground. His leadership helped keep Upper Canada in British hands through the final year of the war.',
    ],
    primarySources: [
      {
        quote: 'The troops have behaved with a gallantry and discipline which cannot be surpassed.',
        attribution: 'Gordon Drummond',
        context: 'Drummond\'s official report on the Battle of Lundy\'s Lane.',
      },
    ],
    didYouKnow:
      'Drummond was born in Quebec City, making him the first person born in Canada to command all British forces in the province.',
  },

  {
    id: 'ross',
    name: 'Robert Ross',
    years: '1766–1814',
    faction: 'british',
    category: 'military',
    isGameLeader: true,
    title: 'Major General',
    biography: [
      'Robert Ross was a veteran of the Napoleonic Wars who led the most dramatic British operation of the war — the burning of Washington, D.C. in August 1814. After routing American defenders at the Battle of Bladensburg, his troops marched straight into the American capital, making Ross the only foreign commander to capture Washington in American history.',
      'Just weeks after his triumph in Washington, Ross was killed by an American sniper at the Battle of North Point near Baltimore on September 12, 1814. His death disrupted the British attack on Baltimore and may have saved the city from the same fate as Washington. The British assault on Fort McHenry that followed — and failed — inspired Francis Scott Key to write "The Star-Spangled Banner."',
    ],
    primarySources: [
      {
        quote: 'I will sup in Baltimore tonight, or in hell.',
        attribution: 'Attributed to Robert Ross',
        context: 'Said before the Battle of North Point, September 12, 1814.',
      },
    ],
    didYouKnow:
      'When Ross\'s troops entered the White House, they found dinner still set on the table — Dolley Madison had fled just hours before. The officers ate the meal before burning the building.',
  },

  {
    id: 'prevost',
    name: 'George Prevost',
    years: '1767–1816',
    faction: 'british',
    category: 'political',
    isGameLeader: true,
    title: 'Governor General',
    biography: [
      'George Prevost served as Governor General of Canada and the overall British commander in North America during the War of 1812. A cautious administrator by nature, he prioritized the defense of Canada over offensive operations, a strategy that frustrated more aggressive officers like Brock but ultimately kept the colony intact.',
      'Prevost\'s reputation was badly damaged when he led a large British invasion force into New York in 1814, only to retreat at the Battle of Plattsburgh despite outnumbering the Americans on land. The defeat was caused in part by the loss of the British naval squadron on Lake Champlain. Prevost was recalled to England to face a court-martial, but he died before the trial could take place. History has judged him harshly, though his overall defensive strategy did succeed in its primary goal — preserving Canada.',
    ],
    primarySources: [
      {
        quote: 'The preservation of Canada is the first object.',
        attribution: 'George Prevost',
        context: 'Prevost\'s guiding principle throughout the war.',
      },
    ],
    didYouKnow:
      'Prevost was fluent in French and popular with French-Canadian civilians, which helped maintain loyalty in Lower Canada during the war.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  NATIVE COALITION — Game Leaders
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'tecumseh',
    name: 'Tecumseh',
    years: '1768–1813',
    faction: 'native',
    category: 'native_leader',
    isGameLeader: true,
    title: 'War Chief',
    biography: [
      'Tecumseh was a Shawnee leader who built the most ambitious pan-Native alliance in North American history. He traveled thousands of miles — from the Great Lakes to the Gulf of Mexico — recruiting warriors from dozens of nations. His central argument was powerful and radical: no single nation had the right to sell land that belonged to all Native peoples collectively.',
      'When the War of 1812 began, Tecumseh allied with the British, and his tactical genius played a crucial role in the capture of Detroit. He led Native warriors with a combination of strategic brilliance and personal courage that earned the respect of both allies and enemies. He was killed at the Battle of the Thames in October 1813, and his death shattered the confederacy, ending the last realistic chance for an independent Native state east of the Mississippi River.',
      'Even his enemies recognized his greatness. William Henry Harrison called him "one of those uncommon geniuses which spring up occasionally to produce revolutions." Tecumseh\'s vision of Native unity and sovereignty inspired resistance movements for generations and continues to resonate today.',
    ],
    primarySources: [
      {
        quote: 'Sell a country! Why not sell the air, the clouds and the great sea, as well as the earth?',
        attribution: 'Tecumseh',
        context: 'Tecumseh\'s argument against individual land sales by any single Native nation.',
      },
    ],
    didYouKnow:
      'After Tecumseh\'s death, the exact location of his burial was kept secret by his followers to prevent his body from being desecrated. His grave has never been found.',
  },

  {
    id: 'tenskwatawa',
    name: 'Tenskwatawa',
    years: '1775–1836',
    faction: 'native',
    category: 'native_leader',
    isGameLeader: true,
    title: 'The Prophet',
    biography: [
      'Tenskwatawa was Tecumseh\'s younger brother and a powerful spiritual leader who inspired a revitalization movement among Native peoples across the Great Lakes and Ohio Valley. He preached the rejection of American trade goods, alcohol, and cultural assimilation, calling on Native people to return to traditional ways of life. He established Prophetstown at the junction of the Tippecanoe and Wabash rivers as the spiritual and political center of the resistance movement.',
      'After the defeat at Tippecanoe in 1811 and Tecumseh\'s death in 1813, Tenskwatawa\'s influence declined sharply. He eventually settled in Kansas, where he lived until 1836. Though his spiritual movement was ultimately unsuccessful, it represented one of the most significant Native cultural resistance efforts in American history — an attempt to preserve identity and sovereignty through spiritual renewal rather than military force alone.',
    ],
    primarySources: [
      {
        quote: 'The Great Spirit told me to tell the Indians that they must not drink whiskey, nor steal, nor fight one another.',
        attribution: 'Tenskwatawa',
        context: 'A central teaching of Tenskwatawa\'s spiritual movement.',
      },
    ],
    didYouKnow:
      'Tenskwatawa lost an eye in a childhood accident and was considered a failure by his community before his spiritual transformation. His dramatic reinvention gave hope to thousands of Native people.',
  },

  {
    id: 'red_eagle',
    name: 'Red Eagle (William Weatherford)',
    years: '1780–1824',
    faction: 'native',
    category: 'native_leader',
    isGameLeader: true,
    title: 'Red Stick War Chief',
    biography: [
      'William Weatherford, also known as Red Eagle, led the Red Stick faction of the Creek Nation during the Creek War of 1813-1814. Of mixed Creek, Scottish, and French heritage, he chose to fight against American expansion into the South. He led the devastating attack on Fort Mims in August 1813, which killed over 250 people — soldiers, settlers, and mixed-heritage Creek who had sided with the Americans. The attack shocked the nation and triggered Andrew Jackson\'s punishing military campaign against the Creek.',
      'After the devastating Creek defeat at Horseshoe Bend in March 1814, Red Eagle surrendered personally to Andrew Jackson, reportedly saying "I am in your power — do with me as you please." Remarkably, Jackson was so impressed by his courage that he released him on the condition that he seek peace. Red Eagle settled as a planter in southern Alabama and lived quietly until his death in 1824.',
    ],
    primarySources: [
      {
        quote: 'I am in your power. Do with me as you please. I am a soldier. I have done the white people all the harm I could.',
        attribution: 'Red Eagle (William Weatherford)',
        context: 'Red Eagle\'s surrender speech to Andrew Jackson after the Creek War.',
      },
    ],
    didYouKnow:
      'Despite being enemies during the war, Jackson and Red Eagle developed a mutual respect. Jackson reportedly said Red Eagle was the bravest man he had ever met.',
  },

  {
    id: 'black_hawk',
    name: 'Black Hawk',
    years: '1767–1838',
    faction: 'native',
    category: 'native_leader',
    isGameLeader: true,
    title: 'War Chief',
    biography: [
      'Black Hawk was a Sauk war chief who fought alongside the British during the War of 1812, leading warriors at the battles of Fort Meigs and the Thames. A fierce opponent of American expansion, he never accepted the treaties that surrendered his people\'s ancestral lands along the Mississippi River, arguing that the chiefs who signed them had no authority to do so.',
      'After the War of 1812, Black Hawk continued to resist American settlement, eventually leading the Black Hawk War of 1832 — one of the last major Native military conflicts east of the Mississippi. After his capture, he dictated an autobiography that remains one of the most important Native American memoirs ever recorded, offering a powerful firsthand account of what it meant to lose a homeland.',
    ],
    primarySources: [
      {
        quote: 'I fought hard. But your guns were well aimed. The bullets flew like birds in the air, and whizzed by our ears like the wind through the trees in the winter.',
        attribution: 'Black Hawk',
        context: 'From Black Hawk\'s autobiography, reflecting on his military experiences.',
      },
    ],
    didYouKnow:
      'After his capture, Black Hawk was taken on a tour of Eastern cities so he could see American power firsthand. Instead, he became a celebrity — crowds gathered to see him and he was more popular than President Jackson.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  ADDITIONAL FIGURES — Not Game Leaders
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'dolley_madison',
    name: 'Dolley Madison',
    years: '1768–1849',
    faction: 'us',
    category: 'political',
    isGameLeader: false,
    title: 'First Lady',
    biography: [
      'Dolley Madison was one of the most influential First Ladies in American history. Far more than a social hostess, she was James Madison\'s political partner, using her famous "Wednesday drawing rooms" to build alliances across party lines. Her charm, warmth, and social skills helped her shy, bookish husband navigate the treacherous world of Washington politics at a time when the young nation was deeply divided.',
      'When the British invaded Washington in August 1814, Dolley Madison refused to leave the White House until she had secured Gilbert Stuart\'s famous portrait of George Washington and important state documents. While government officials and soldiers fled in panic, she calmly organized the rescue of irreplaceable national treasures. Her courage under fire made her a national hero and an enduring symbol of American resilience.',
      'After James Madison\'s death in 1836, Congress awarded Dolley an honorary seat on the floor of the House of Representatives — the first woman to receive this honor. She remained one of Washington\'s most prominent and beloved citizens until her death in 1849.',
    ],
    primarySources: [
      {
        quote: 'I am determined not to go myself until I see Mr. Madison safe, so that he can accompany me.',
        attribution: 'Dolley Madison',
        context: 'From a letter written during the British invasion of Washington, August 1814.',
      },
    ],
    didYouKnow:
      'Dolley Madison was so popular that when she died in 1849, President Zachary Taylor called her "the first lady of the land" — one of the earliest uses of the title "First Lady."',
  },

  {
    id: 'mary_pickersgill',
    name: 'Mary Pickersgill',
    years: '1776–1857',
    faction: 'us',
    category: 'civilian',
    isGameLeader: false,
    title: 'Flagmaker',
    biography: [
      'Mary Pickersgill was a professional flagmaker who ran a successful business in Baltimore. In 1813, Major George Armistead, the commander of Fort McHenry, commissioned her to create an enormous garrison flag — 30 by 42 feet, with 15 stars and 15 stripes. Pickersgill, along with her daughter Caroline, her nieces, and an indentured servant named Grace Wisher, spent six weeks sewing the massive banner, spreading it out on the floor of a nearby brewery because it was too large for her workshop.',
      'The flag Mary Pickersgill made became one of the most important symbols in American history. When Francis Scott Key watched the British bombardment of Fort McHenry on the night of September 13-14, 1814, it was Pickersgill\'s flag he saw "by the dawn\'s early light," still flying over the fort. That moment inspired "The Star-Spangled Banner." Today, the original flag hangs in the Smithsonian\'s National Museum of American History. Pickersgill continued her flagmaking business and became active in charitable work for the rest of her life.',
    ],
    primarySources: [
      {
        quote: 'The flag being so large, I was obliged to obtain permission to spread it out in the malt house of Claggett\'s brewery.',
        attribution: 'Mary Pickersgill',
        context: 'Pickersgill describing the practical challenges of creating the enormous garrison flag.',
      },
    ],
    didYouKnow:
      'The Star-Spangled Banner flag required 400 yards of wool bunting. Each star was two feet across. Mary Pickersgill was paid $405.90 for the garrison flag — equivalent to about $10,000 today.',
  },

  {
    id: 'charles_ball',
    name: 'Charles Ball',
    years: '1781–unknown',
    faction: 'us',
    category: 'military',
    isGameLeader: false,
    title: 'Sailor & Soldier',
    biography: [
      'Charles Ball was born enslaved in Maryland but escaped and served in the United States Navy during the War of 1812. He fought at the Battle of Bladensburg in August 1814, defending Washington, D.C. against the British invasion. His memoir, published in 1836, is one of the few firsthand accounts of an African American\'s experience during the war, providing a perspective that most histories of the conflict have ignored.',
      'Ball\'s story highlights the painful contradictions of fighting for a nation that enslaved his people. After the war, he was recaptured and re-enslaved before managing to escape a second time. His narrative, "Fifty Years in Chains," describes both the camaraderie of military service — where Black and white sailors fought side by side — and the brutal reality of American slavery that awaited African Americans after the guns fell silent.',
    ],
    primarySources: [
      {
        quote: 'I had been a slave, and felt the value of freedom. I was willing to risk my life in its defense.',
        attribution: 'Charles Ball (paraphrased from his memoir)',
        context: 'Ball reflecting on his decision to serve in the military despite the injustices he faced.',
      },
    ],
    didYouKnow:
      'Ball\'s autobiography, "Fifty Years in Chains," was one of the earliest slave narratives published in the United States and provides unique insights into both military service and the institution of slavery.',
  },

  {
    id: 'laura_secord',
    name: 'Laura Secord',
    years: '1775–1868',
    faction: 'british',
    category: 'civilian',
    isGameLeader: false,
    title: 'Heroine',
    biography: [
      'Laura Secord was a Canadian heroine who walked 20 miles through swamps and enemy territory to warn British forces of an impending American attack on Beaver Dams in June 1813. A mother of five whose husband had been seriously wounded at the Battle of Queenston Heights, she overheard American officers discussing their plans while they were billeted in her home. Despite the enormous danger, she set out alone at dawn to carry the warning.',
      'Her information helped British and Mohawk forces prepare an ambush that captured over 500 American troops — one of the most complete victories of the war. Despite her heroism, Secord received little recognition during her lifetime. It was not until 1860, when the Prince of Wales visited Canada and heard her story, that she received a modest reward of 100 pounds. Today she is celebrated as one of Canada\'s most famous historical figures.',
    ],
    primarySources: [
      {
        quote: 'I was determined to put the Americans off the guard, and I was determined to go to warn the British.',
        attribution: 'Laura Secord',
        context: 'Secord describing her motivation for the dangerous journey to Beaver Dams.',
      },
    ],
    didYouKnow:
      'Laura Secord is now one of Canada\'s most famous historical figures. A popular Canadian chocolate company is named after her, and her image has appeared on Canadian stamps and currency.',
  },

  {
    id: 'jean_lafitte',
    name: 'Jean Lafitte',
    years: '1780–unknown',
    faction: 'us',
    category: 'military',
    isGameLeader: false,
    title: 'Pirate & Privateer',
    biography: [
      'Jean Lafitte was a French pirate and smuggler who operated out of Barataria Bay near New Orleans. When the British offered him a captain\'s commission and $30,000 to fight against the Americans, Lafitte made a surprising choice — he warned the Americans instead and offered his men, ships, and supplies to Andrew Jackson for the defense of New Orleans.',
      'Lafitte\'s pirates provided crucial artillery expertise, gunflints, and ammunition at the Battle of New Orleans, contributing significantly to the American victory. Jackson had initially dismissed Lafitte\'s men as "hellish banditti" but later publicly praised their bravery and skill. Lafitte received a presidential pardon from James Madison for his service, but true to form, he returned to piracy after the war and eventually disappeared from the historical record.',
    ],
    primarySources: [
      {
        quote: 'I am the stray sheep wishing to return to the flock.',
        attribution: 'Jean Lafitte',
        context: 'From Lafitte\'s letter offering his services to the American cause before the Battle of New Orleans.',
      },
    ],
    didYouKnow:
      'Nobody knows how Lafitte died or where he went. Legends place his death everywhere from the Yucatan Peninsula to Illinois. He remains one of the most mysterious figures in American history.',
  },

  {
    id: 'john_norton',
    name: 'John Norton (Teyoninhokarawen)',
    years: '1770–1831',
    faction: 'native',
    category: 'native_leader',
    isGameLeader: false,
    title: 'War Chief',
    biography: [
      'Born in Scotland to a Cherokee father and Scottish mother, John Norton — known by his Mohawk name Teyoninhokarawen — became a Mohawk war chief and one of the most important Native leaders during the War of 1812. He led Haudenosaunee (Iroquois) warriors at the critical Battle of Queenston Heights, where his forces played a decisive role in the British victory that killed General Brock but saved Upper Canada.',
      'Norton was a unique bridge between European and Native worlds. Educated in both traditions and fluent in multiple languages, he was respected by British officers and Native communities alike. He translated the Gospel of John into Mohawk and fought tirelessly for Native land rights and sovereignty. After the war, he traveled to England to advocate for his people before disappearing from the historical record around 1831.',
    ],
    primarySources: [
      {
        quote: 'We are the faithful allies of the King, and we will fight for our lands.',
        attribution: 'John Norton (Teyoninhokarawen)',
        context: 'Norton expressing the Haudenosaunee position on their British alliance and land rights.',
      },
    ],
    didYouKnow:
      'Norton\'s journal of the War of 1812 is one of the most detailed Native accounts of the conflict. It was lost for over a century before being rediscovered and published in the 1970s.',
  },

  {
    id: 'creek_woman_composite',
    name: 'A Creek Woman\'s Experience',
    years: 'Unknown',
    faction: 'native',
    category: 'civilian',
    isGameLeader: false,
    title: 'Composite Profile',
    biography: [
      'This profile represents a composite of Creek women\'s experiences during the War of 1812 and Creek War, drawn from historical records. She is not a single historical individual. Creek women held significant social and political roles in their matrilineal society. They controlled agricultural production, owned family homes, and participated in clan council decisions. When the Creek War erupted in 1813, women\'s lives were upended — they faced the destruction of their towns, separation from family members, and the loss of the agricultural lands that had sustained their communities for generations.',
      'After the devastating Treaty of Fort Jackson in 1814, which stripped 23 million acres from the Creek Nation, women bore the heaviest burden of displacement. They had to rebuild communities, feed families without their traditional farmland, and maintain cultural practices under impossible conditions. Many Creek women walked the Trail of Tears in the 1830s, carrying children and preserving seeds and cultural knowledge that would sustain their people in Indian Territory. Their resilience ensured the survival of Creek culture through one of the darkest chapters in American history.',
    ],
    primarySources: [
      {
        quote: 'The women wept as they looked back at the homes they had built, the fields they had planted, the graves of their ancestors they would never visit again.',
        attribution: 'Composite account drawn from removal-era records',
        context: 'A representative description of Creek women\'s experiences during forced removal, based on multiple historical sources.',
      },
    ],
    didYouKnow:
      'In Creek (Muscogee) society, clan membership and property passed through the mother\'s line. Women owned the family home and controlled the harvest. The destruction of this matrilineal system was one of the most devastating — and least discussed — consequences of the Creek War and removal.',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
//  Utility Functions
// ═══════════════════════════════════════════════════════════════════════════

export function getProfileById(id) {
  return profiles.find((p) => p.id === id);
}

export function getProfilesByFaction(faction) {
  return profiles.filter((p) => p.faction === faction);
}

export function getProfilesByCategory(category) {
  return profiles.filter((p) => p.category === category);
}

export function getGameLeaderProfiles() {
  return profiles.filter((p) => p.isGameLeader);
}

export function getOrdinaryPeopleProfiles() {
  return profiles.filter((p) => !p.isGameLeader);
}

export default profiles;
