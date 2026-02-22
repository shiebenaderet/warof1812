/**
 * Knowledge Check Questions for War of 1812: Rise of the Nation
 *
 * Multiple-choice questions that appear each round to test students'
 * understanding of the historical content. Correct answers give a small
 * in-game bonus (extra troops or nationalism).
 *
 * Questions are tied to round ranges so they appear after the student has
 * seen the relevant event cards and context. Each question includes a
 * detailed explanation to reinforce learning.
 *
 * Categories:
 *   - Causes & Context (rounds 1-4)
 *   - Military Campaigns (rounds 3-8)
 *   - Key Figures (rounds 1-12)
 *   - Naval Warfare (rounds 3-9)
 *   - Home Front & Society (rounds 5-12)
 *   - Diplomacy & Legacy (rounds 9-12)
 */

const knowledgeChecks = [
  // ══════════════════════════════════════════════════════════════
  // CAUSES & CONTEXT (Early War, Rounds 1-4)
  // ══════════════════════════════════════════════════════════════
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
      'Britain was forcibly recruiting (impressing) American sailors into the Royal Navy, which was a primary cause of the war. Between 1803 and 1812, the British impressed an estimated 6,000-10,000 American citizens.',
    roundRange: [2, 4],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
    required: true,
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
      'War Hawks like Henry Clay (Kentucky) and John C. Calhoun (South Carolina) were young Congressional leaders who demanded war with Britain. They saw an opportunity to expand into British Canada and end British support for Native resistance on the frontier.',
    roundRange: [1, 3],
    reward: { type: 'nationalism', count: 3, description: '+3 Nationalism' },
  },
  {
    id: 'kc_war_declaration',
    question: 'How close was the vote to declare war on Britain in 1812?',
    choices: [
      'It was the closest war vote in U.S. history — 79-49 in the House, 19-13 in the Senate',
      'It was unanimous — every member of Congress voted for war',
      'Congress never voted — the President declared war unilaterally',
      'It passed overwhelmingly with only 3 dissenting votes',
    ],
    correctIndex: 0,
    explanation:
      'The War of 1812 was declared by the narrowest margin of any war vote in American history. New England and the Federalist Party largely opposed the war, while Southern and Western states supported it. This regional divide would shape the entire conflict.',
    roundRange: [1, 3],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_orders_in_council',
    question: 'What were the British "Orders in Council" that angered Americans?',
    choices: [
      'Decrees that restricted neutral nations from trading with France and its allies',
      'Military orders to invade the American frontier',
      'Laws banning American ships from British ports',
      'Orders to arm Native Americans with British weapons',
    ],
    correctIndex: 0,
    explanation:
      'The Orders in Council (1807) were British trade restrictions during the Napoleonic Wars that prohibited neutral countries (including the U.S.) from trading with France. American merchants lost ships and cargoes, fueling anger toward Britain. Ironically, Britain repealed the Orders just days before the U.S. declared war — but news traveled too slowly to prevent the conflict.',
    roundRange: [1, 4],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
    required: true,
  },
  {
    id: 'kc_embargo_act',
    question: 'What was the Embargo Act of 1807 and why did it fail?',
    choices: [
      'A U.S. trade ban on all foreign nations that hurt American merchants more than Britain',
      'A British law blocking all American trade with Europe',
      'A French blockade of the American coast',
      'A treaty between the U.S. and Spain restricting trade',
    ],
    correctIndex: 0,
    explanation:
      'President Jefferson\'s Embargo Act banned all U.S. foreign trade, hoping to pressure Britain and France. Instead, it devastated the American economy — especially in New England — while barely affecting Britain. It was repealed in 1809 and replaced with weaker measures, but the failure convinced many Americans that only war could protect their rights.',
    roundRange: [1, 3],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },

  // ══════════════════════════════════════════════════════════════
  // KEY FIGURES (Spans the whole war)
  // ══════════════════════════════════════════════════════════════
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
      'Tecumseh, a Shawnee leader, sought to unite dozens of Native nations into a confederacy strong enough to stop American settlers from taking Native lands in the Northwest Territory. His vision was one of the most ambitious pan-Native political movements in history, and his alliance with Britain gave his confederacy military support.',
    roundRange: [1, 4],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
    required: true,
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
      'General William Hull surrendered Fort Detroit to a smaller British and Native force under General Brock without a fight in August 1812. Brock bluffed Hull into believing he faced overwhelming numbers and that Native warriors would massacre civilians. The shocking surrender demoralized the nation and led to Hull\'s court-martial.',
    roundRange: [2, 4],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
  },
  {
    id: 'kc_brock',
    question: 'Why is Sir Isaac Brock remembered as the "Hero of Upper Canada"?',
    choices: [
      'He captured Detroit and died defending Niagara at Queenston Heights',
      'He signed the Treaty of Ghent ending the war',
      'He led the burning of Washington D.C.',
      'He defeated the American navy on Lake Erie',
    ],
    correctIndex: 0,
    explanation:
      'Major General Isaac Brock captured Detroit through brilliant bluffing and aggressive action, then rushed to defend the Niagara frontier. He was killed leading a charge at the Battle of Queenston Heights in October 1812. His early victories saved Upper Canada from American invasion and made him a Canadian national hero.',
    roundRange: [2, 5],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_tenskwatawa',
    question: 'Who was Tenskwatawa, and what role did he play in the Native resistance?',
    choices: [
      'Tecumseh\'s brother, a spiritual leader known as "The Prophet" who inspired Native unity',
      'A British general who commanded Native forces',
      'An American diplomat who negotiated with Native nations',
      'A French fur trader who supplied weapons to the Natives',
    ],
    correctIndex: 0,
    explanation:
      'Tenskwatawa ("The Prophet") was Tecumseh\'s brother who led a spiritual revitalization movement among Native peoples. He preached rejection of American customs and a return to traditional ways. He established Prophetstown on the Tippecanoe River, which became the center of the resistance movement until Harrison destroyed it in 1811.',
    roundRange: [1, 5],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
  },
  {
    id: 'kc_jackson_background',
    question: 'Before the War of 1812, Andrew Jackson was known primarily as:',
    choices: [
      'A Tennessee militia commander and frontier politician',
      'A distinguished naval officer',
      'The Governor of Louisiana Territory',
      'A West Point military academy professor',
    ],
    correctIndex: 0,
    explanation:
      'Jackson was a self-made frontier lawyer, congressman, and militia general from Tennessee. He had no formal military training but was known for his iron will and fierce temper. The War of 1812 transformed him from a regional figure into a national hero, ultimately leading to his presidency in 1828.',
    roundRange: [5, 9],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
    required: true,
  },
  {
    id: 'kc_laura_secord',
    question: 'How did Laura Secord contribute to the British war effort?',
    choices: [
      'She walked 20 miles through enemy territory to warn British forces of an American attack',
      'She commanded a regiment of Canadian volunteers',
      'She nursed wounded soldiers at Fort York',
      'She carried supplies across Lake Ontario in a rowboat',
    ],
    correctIndex: 0,
    explanation:
      'In June 1813, Laura Secord overheard American officers planning a surprise attack on the British outpost at Beaver Dams. She walked 20 miles through swamps and forest to warn Lieutenant FitzGibbon. The resulting British-Native ambush captured over 500 American troops. Secord is one of Canada\'s most celebrated heroes of the war.',
    roundRange: [4, 7],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_mary_pickersgill',
    question: 'Who made the enormous flag that flew over Fort McHenry during the British bombardment?',
    choices: [
      'Mary Pickersgill and her daughter Caroline, professional flagmakers in Baltimore',
      'Betsy Ross in Philadelphia',
      'Dolley Madison at the White House',
      'British sailors who left it behind when they retreated',
    ],
    correctIndex: 0,
    explanation:
      'Mary Pickersgill was a skilled flagmaker who ran a successful business in Baltimore. In 1813, she and her 13-year-old daughter Caroline sewed the massive 30-by-42-foot garrison flag for Fort McHenry. The flag contained 15 stars and 15 stripes and required over 400 yards of fabric. This is the flag Francis Scott Key saw "still waving" after the 25-hour bombardment, inspiring "The Star-Spangled Banner." Pickersgill\'s work became one of the most important symbols in American history.',
    roundRange: [9, 12],
    reward: { type: 'nationalism', count: 3, description: '+3 Nationalism' },
  },
  {
    id: 'kc_women_home_front',
    question: 'How did women on the home front contribute to the American war effort?',
    choices: [
      'They managed farms, businesses, and plantations while men were away fighting',
      'They were forbidden from working outside the home during the war',
      'They mostly stayed in cities and avoided any involvement in the war',
      'They only contributed by writing letters to soldiers',
    ],
    correctIndex: 0,
    explanation:
      'When men left to fight, women took on critical economic roles that kept communities functioning. Farm women managed entire agricultural operations, making decisions about planting, harvesting, and selling crops. Business owners\' wives ran shops, taverns, and trade operations. Plantation mistresses supervised labor forces and production. Many women also organized aid for soldiers, producing supplies like bandages and uniforms. Their work demonstrated women\'s capability to manage complex economic enterprises and challenged traditional gender roles.',
    roundRange: [3, 10],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_native_women',
    question: 'What roles did Native American women play during the War of 1812?',
    choices: [
      'They participated in tribal councils, advocated for peace or war, and maintained communities during conflict',
      'They had no political voice and were excluded from all war decisions',
      'They fought in battles alongside men as warriors',
      'They all fled to Canada before the fighting began',
    ],
    correctIndex: 0,
    explanation:
      'Native American women held important political and social roles during the war. In many nations, including the Iroquois Confederacy, women participated in council meetings and influenced decisions about alliances and warfare. Some advocated for neutrality to protect their communities, while others supported joining British or American forces. Women also maintained food production, preserved cultural practices, and cared for refugees displaced by fighting. When Tecumseh traveled to recruit allies, he often addressed both male and female leaders. Their experiences show the diversity of Native responses to the war and women\'s significant political agency.',
    roundRange: [2, 8],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
  },
  {
    id: 'kc_women_manufacturing',
    question: 'How did the British blockade affect American women workers?',
    choices: [
      'Thousands of women found jobs in new textile mills and factories producing war supplies',
      'Women lost all employment opportunities during the war',
      'Only wealthy women were allowed to work in factories',
      'The blockade had no effect on women\'s employment',
    ],
    correctIndex: 0,
    explanation:
      'The British naval blockade cut off imported British cloth and manufactured goods, forcing Americans to produce their own. This created a manufacturing boom, especially in New England textile mills. Young women from farming families became some of the first factory workers in America, operating spinning machines and looms. Women also produced military supplies like uniforms, tents, and cartridges. In some towns, women organized "sewing circles" to make clothing for soldiers. This wartime work accelerated American industrialization and gave women new economic opportunities, though factory conditions were often difficult and dangerous.',
    roundRange: [5, 12],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_frontier_women',
    question: 'What challenges did frontier women face during the War of 1812?',
    choices: [
      'They defended homesteads from raids, evacuated families during attacks, and survived as refugees',
      'They lived in peaceful areas unaffected by the fighting',
      'They all moved to eastern cities for safety',
      'The government provided them with military protection at all times',
    ],
    correctIndex: 0,
    explanation:
      'Women on the frontier faced extreme danger as warfare swept through their communities. In areas like the Ohio Valley and the Canadian border, raids by various military forces destroyed homes and crops. Some women defended their cabins with rifles when attacks came. Many became refugees, fleeing with children to forts or safer territories, often walking for days with few supplies. Women like those at Fort Harrison (Indiana) helped defend the stockade during siege. After battles, women searched for missing family members and tried to rebuild destroyed farms. Their resilience was essential to frontier survival, though their stories are often overlooked.',
    roundRange: [2, 9],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },

  // ══════════════════════════════════════════════════════════════
  // MILITARY CAMPAIGNS (Mid War, Rounds 3-8)
  // ══════════════════════════════════════════════════════════════
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
      'After defeating the British fleet on Lake Erie on September 10, 1813, Perry sent this famous message to General Harrison. The victory gave the Americans control of Lake Erie, cut British supply lines, and forced the British to abandon Detroit — changing the war\'s trajectory in the Great Lakes.',
    roundRange: [5, 7],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
    required: true,
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
      "Napoleon's defeat freed up thousands of battle-hardened British veterans who were then sent to North America in 1814. These Peninsular War veterans significantly strengthened British forces, enabling the burning of Washington and the major offensives at Baltimore, Plattsburgh, and New Orleans.",
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
      'The Red Stick faction of the Creek Nation, inspired by Tecumseh and supported by British and Spanish agents, fought against American expansion in the Southern frontier. Andrew Jackson\'s campaign against the Red Sticks culminated at the Battle of Horseshoe Bend (1814), which broke Creek resistance and opened vast lands for American settlement.',
    roundRange: [5, 8],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_york_burning',
    question: 'What happened when Americans captured York (modern-day Toronto) in 1813?',
    choices: [
      'They burned government buildings, which later motivated the British burning of Washington',
      'They established a permanent American military base in Canada',
      'They freed hundreds of British prisoners of war',
      'Nothing — the Americans left immediately after capturing the city',
    ],
    correctIndex: 0,
    explanation:
      'In April 1813, American forces captured and burned the Parliament buildings and other public structures in York, the capital of Upper Canada. This act of destruction enraged the British and Canadians. When British forces later burned Washington D.C. in 1814, they explicitly cited the burning of York as justification — showing how the war escalated through retaliation.',
    roundRange: [4, 7],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
  },
  {
    id: 'kc_thames',
    question: 'What was the significance of the Battle of the Thames (1813)?',
    choices: [
      'Tecumseh was killed, shattering the Native confederacy and ending British influence in the Northwest',
      'The British captured Detroit for the second time',
      'The Americans lost control of Lake Ontario',
      'It was the final battle of the war',
    ],
    correctIndex: 0,
    explanation:
      'The Battle of the Thames (October 5, 1813) was a decisive American victory in Ontario. Tecumseh was killed and the British retreated. Without Tecumseh\'s leadership, the Native confederacy fractured. The battle effectively ended the Native military threat in the Northwest and restored American control over Detroit and the Michigan frontier.',
    roundRange: [5, 8],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
    required: true,
  },

  // ══════════════════════════════════════════════════════════════
  // AFRICAN AMERICAN PARTICIPATION (Rounds 3-10)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'kc_african_american_navy',
    question: 'What role did African Americans play in the U.S. Navy during the War of 1812?',
    choices: [
      'About 15-20% of American sailors were free Black men who served as equals alongside white sailors',
      'African Americans were prohibited from all military service',
      'They only served as cooks and servants, never as combat sailors',
      'Only enslaved people were allowed to serve, not free Black men',
    ],
    correctIndex: 0,
    explanation:
      'Free Black men made up an estimated 15-20% of the U.S. Navy during the War of 1812. Unlike the Army, the Navy offered relatively equal treatment — Black and white sailors received the same pay, shared the same quarters, and fought side-by-side. Many served on famous ships like USS Constitution and played crucial roles in naval victories. At the Battle of Lake Erie, Oliver Hazard Perry praised his Black sailors for their bravery.',
    roundRange: [3, 8],
    reward: { type: 'nationalism', count: 3, description: '+3 Nationalism' },
    required: true,
  },
  {
    id: 'kc_colonial_marines',
    question: 'What were the British "Colonial Marines" during the War of 1812?',
    choices: [
      'A military unit of formerly enslaved people who escaped to British lines in exchange for freedom',
      'British soldiers stationed in the American colonies before the war',
      'American naval officers who defected to Britain',
      'Native American scouts who worked for the British army',
    ],
    correctIndex: 0,
    explanation:
      'In 1814, the British offered freedom to enslaved people who escaped from American plantations and joined their forces. Over 4,000 people fled to British lines, with hundreds forming the Corps of Colonial Marines. They fought in several battles, including the burning of Washington D.C. After the war, Britain resettled most in Canada, Trinidad, and other colonies, honoring its promise of freedom — though the U.S. demanded their return.',
    roundRange: [7, 10],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_black_soldiers_jackson',
    question: 'How did Andrew Jackson use free Black soldiers at the Battle of New Orleans?',
    choices: [
      'He recruited free men of color into two battalions who fought bravely and were praised for their service',
      'He refused to allow any African Americans to fight',
      'He forced enslaved people to dig trenches but did not arm them',
      'He promised freedom to enslaved people but broke his promise after the battle',
    ],
    correctIndex: 0,
    explanation:
      'Facing a shortage of troops, Andrew Jackson recruited free Black men in Louisiana into two battalions of "Free Men of Color." Despite initial skepticism from some white officers, these soldiers fought with distinction at the Battle of New Orleans on January 8, 1815. Jackson publicly praised their courage, saying they had "not disappointed the hopes" placed in them. However, after the war, Black veterans received little recognition and continued to face systemic discrimination.',
    roundRange: [10, 12],
    reward: { type: 'nationalism', count: 3, description: '+3 Nationalism' },
  },

  // ══════════════════════════════════════════════════════════════
  // NAVAL WARFARE (Rounds 3-9)
  // ══════════════════════════════════════════════════════════════
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
      "The Royal Navy's blockade of the American coast was designed to cripple the U.S. economy and prevent military supplies from moving by sea. By 1814, the blockade covered nearly the entire coast. American exports plummeted from $61 million in 1811 to $7 million in 1814, devastating the economy.",
    roundRange: [4, 8],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
  },
  {
    id: 'kc_constitution',
    question: 'Why was USS Constitution nicknamed "Old Ironsides"?',
    choices: [
      'British cannonballs appeared to bounce off her thick oak hull',
      'She was plated with iron armor',
      'Her captain, William Hull, had the nickname "Iron Will"',
      'She survived a fire that destroyed the rest of the fleet',
    ],
    correctIndex: 0,
    explanation:
      'During her victory over HMS Guerriere in August 1812, sailors watched British cannonballs seemingly bounce off Constitution\'s hull (which was made of dense live oak up to 21 inches thick). A sailor reportedly cried "Huzza! Her sides are made of iron!" The nickname stuck and her victories were a massive morale boost for Americans facing setbacks on land.',
    roundRange: [2, 5],
    reward: { type: 'nationalism', count: 3, description: '+3 Nationalism' },
  },
  {
    id: 'kc_privateers',
    question: 'What role did American privateers play in the War of 1812?',
    choices: [
      'They captured over 1,500 British merchant ships, disrupting trade worldwide',
      'They blockaded British ports in Europe',
      'They transported troops across the Great Lakes',
      'They had no significant impact on the war',
    ],
    correctIndex: 0,
    explanation:
      'The U.S. government issued over 500 letters of marque, licensing private ships to attack British commerce. American privateers captured an estimated 1,500+ British merchant vessels, causing insurance rates to skyrocket and British merchants to pressure Parliament for peace. They were far more effective than the small U.S. Navy at disrupting British trade.',
    roundRange: [3, 8],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },

  // ══════════════════════════════════════════════════════════════
  // LATE WAR & TURNING POINTS (Rounds 9-12)
  // ══════════════════════════════════════════════════════════════
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
      'On August 24, 1814, British forces routed American defenders at Bladensburg and marched into Washington. They burned the White House, Capitol, Treasury, and other government buildings. President Madison and Congress had fled. A thunderstorm and tornado the next day helped extinguish the fires. It remains the only time a foreign power has captured and burned the American capital.',
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
      "Francis Scott Key, detained on a British ship, watched the 25-hour bombardment of Fort McHenry in Baltimore Harbor through the night of September 13-14, 1814. When he saw the enormous 42x30 foot American flag still flying at dawn, he wrote the poem 'Defence of Fort M'Henry,' which was set to music and eventually became the national anthem in 1931.",
    roundRange: [9, 11],
    reward: { type: 'nationalism', count: 5, description: '+5 Nationalism' },
    required: true,
  },
  {
    id: 'kc_dolley_madison',
    question: 'What did Dolley Madison famously do as the British approached Washington?',
    choices: [
      'She saved a portrait of George Washington and important state documents from the White House',
      'She led a militia defense of the Capitol',
      'She negotiated a ceasefire with the British commander',
      'She escaped to Canada disguised as a British officer',
    ],
    correctIndex: 0,
    explanation:
      'As British troops closed in on Washington, First Lady Dolley Madison refused to leave the White House until she secured Gilbert Stuart\'s full-length portrait of George Washington and cabinet documents. Her bravery in saving these national treasures while under threat of capture became a powerful symbol of American resilience and devotion to the republic.',
    roundRange: [9, 11],
    reward: { type: 'nationalism', count: 3, description: '+3 Nationalism' },
  },
  {
    id: 'kc_plattsburgh',
    question: 'Why was the American victory at Plattsburgh (1814) so important?',
    choices: [
      'It repelled a major British invasion from Canada and influenced peace negotiations',
      'It was the first American naval victory of the war',
      'It led directly to the burning of Washington D.C.',
      'It gave the Americans permanent control of Montreal',
    ],
    correctIndex: 0,
    explanation:
      'In September 1814, an outnumbered American force defeated a British army of 10,000+ veterans at Plattsburgh on Lake Champlain. The American naval victory on the lake forced the British to retreat to Canada. News of this defeat reached British negotiators at Ghent and convinced them that conquering the U.S. would be too costly, accelerating the peace treaty.',
    roundRange: [9, 12],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_lundys_lane',
    question: 'The Battle of Lundy\'s Lane (1814) is remembered as:',
    choices: [
      'One of the bloodiest battles of the war, ending in a tactical draw near Niagara Falls',
      'A decisive British victory that ended the war',
      'A minor skirmish with few casualties',
      'The first battle where the U.S. used artillery',
    ],
    correctIndex: 0,
    explanation:
      'Fought on July 25, 1814, Lundy\'s Lane was a brutal six-hour battle near Niagara Falls with over 1,700 combined casualties. Both sides claimed victory, but the Americans withdrew. The battle demonstrated that American regulars — trained by Winfield Scott — could now stand toe-to-toe with British professionals, a marked improvement from the war\'s early disasters.',
    roundRange: [8, 11],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },

  // ══════════════════════════════════════════════════════════════
  // DIPLOMACY, LEGACY & THE HOME FRONT (Rounds 9-12)
  // ══════════════════════════════════════════════════════════════
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
      'The Treaty of Ghent (signed December 24, 1814) essentially restored the "status quo ante bellum" — things as they were before the war. Neither side gained or lost territory. It did not address impressment (which had already stopped) or trade rights. The biggest losers were the Native peoples, who lost their British ally and faced unchecked American expansion.',
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
      "The Treaty of Ghent was signed on December 24, 1814, but news traveled by ship and didn't reach New Orleans in time. Jackson's stunning victory on January 8, 1815 — where his forces killed over 2,000 British while suffering only 71 casualties — made him a national hero and helped Americans believe they had 'won' the war, despite the treaty changing nothing.",
    roundRange: [11, 12],
    reward: { type: 'nationalism', count: 3, description: '+3 Nationalism' },
    required: true,
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
      "New England Federalists, opposed to the war and its devastating effect on their trade-based economy, met in Hartford, Connecticut (December 1814 - January 1815) to discuss grievances. Some delegates hinted at secession. But when news of the peace treaty and Jackson's victory arrived, the delegates looked unpatriotic. The Federalist Party never recovered and dissolved within a few years.",
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
      "The War of 1812 sparked a powerful wave of American nationalism known as the 'Era of Good Feelings.' It destroyed the Federalist Party, boosted American manufacturing (since British trade was cut off), created national heroes like Jackson, and produced enduring symbols like the Star-Spangled Banner. The U.S. emerged with a stronger sense of national identity.",
    roundRange: [11, 12],
    reward: { type: 'nationalism', count: 3, description: '+3 Nationalism' },
  },
  {
    id: 'kc_native_aftermath',
    question: 'What happened to Native American nations after the War of 1812?',
    choices: [
      'They lost their British ally and faced rapid displacement by American settlers',
      'They gained an independent homeland as promised in the Treaty of Ghent',
      'They formed a lasting alliance with the United States',
      'They migrated to British Canada where they received full citizenship',
    ],
    correctIndex: 0,
    explanation:
      'The War of 1812 was catastrophic for Native peoples. With Tecumseh dead and the British no longer willing to support Native interests, there was no check on American westward expansion. The Treaty of Ghent mentioned restoring Native lands to their 1811 status, but this was never enforced. Within two decades, most Eastern tribes would be forcibly removed via the Indian Removal Act of 1830.',
    roundRange: [10, 12],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_canadian_identity',
    question: 'How did the War of 1812 affect Canadian national identity?',
    choices: [
      'It became a founding story — Canadians saw themselves as having defended their homeland from invasion',
      'It had no lasting impact on Canada',
      'It convinced Canadians to join the United States',
      'It led to immediate Canadian independence from Britain',
    ],
    correctIndex: 0,
    explanation:
      'For English-speaking Canadians, the War of 1812 became a crucial founding myth. The defense of Upper Canada against repeated American invasions — with heroes like Brock, Secord, and the Canadian militia — helped forge a distinct Canadian identity separate from both Britain and the United States. It remains a significant part of Canadian heritage.',
    roundRange: [10, 12],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
  },
  {
    id: 'kc_manufacturing',
    question: 'How did the War of 1812 change the American economy?',
    choices: [
      'The British blockade forced Americans to build their own factories, jumpstarting industrialization',
      'It destroyed the American economy permanently',
      'It had no economic effects',
      'It made the U.S. completely dependent on French trade',
    ],
    correctIndex: 0,
    explanation:
      'Cut off from British manufactured goods by the blockade, Americans began producing their own textiles, iron, and other goods. Factories sprang up across New England and the Mid-Atlantic. After the war, Congress passed the Tariff of 1816 to protect these new industries. The war inadvertently jumpstarted the American Industrial Revolution.',
    roundRange: [8, 12],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_impressment_end',
    question: 'Why did British impressment of American sailors ultimately stop?',
    choices: [
      'The end of the Napoleonic Wars meant Britain no longer needed extra sailors',
      'The Treaty of Ghent specifically banned impressment',
      'The American Navy destroyed all British ships',
      'Congress passed a law making impressment illegal under international law',
    ],
    correctIndex: 0,
    explanation:
      'Impressment was one of the main causes of the war, yet the Treaty of Ghent never mentioned it. The practice simply stopped because Napoleon\'s defeat in 1814 ended Britain\'s desperate need for sailors. This irony highlights how the War of 1812 was deeply intertwined with European conflicts — a "second front" of the Napoleonic Wars.',
    roundRange: [10, 12],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
  },
];

/**
 * Draw a knowledge check appropriate for the current round.
 * Prioritizes required questions until all have been seen, then shows optional questions.
 * Shuffles the answer choices so the correct answer isn't always in the same position.
 * Returns a question object or null.
 */
export function drawKnowledgeCheck(round, usedCheckIds = [], requiredChecksSeen = []) {
  // First, check if there are any required questions we haven't shown yet
  const unseenRequired = knowledgeChecks.filter(
    (kc) =>
      kc.required &&
      !usedCheckIds.includes(kc.id) &&
      !requiredChecksSeen.includes(kc.id) &&
      (!kc.roundRange || (round >= kc.roundRange[0] && round <= kc.roundRange[1]))
  );

  let original;
  if (unseenRequired.length > 0) {
    // Prioritize showing a required question
    original = unseenRequired[Math.floor(Math.random() * unseenRequired.length)];
  } else {
    // Fall back to any available question (required or optional)
    const available = knowledgeChecks.filter(
      (kc) =>
        !usedCheckIds.includes(kc.id) &&
        (!kc.roundRange || (round >= kc.roundRange[0] && round <= kc.roundRange[1]))
    );

    if (available.length === 0) return null;
    original = available[Math.floor(Math.random() * available.length)];
  }

  // Shuffle choices with a Fisher-Yates shuffle, tracking the correct answer
  const indices = original.choices.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return {
    ...original,
    choices: indices.map((i) => original.choices[i]),
    correctIndex: indices.indexOf(original.correctIndex),
  };
}

export default knowledgeChecks;
