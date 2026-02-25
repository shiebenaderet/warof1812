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
    simpleQuestion: 'What was one big reason the United States went to war with Britain in 1812?',
    simpleChoices: [
      'Britain was taking American sailors and making them work on British ships',
      'The two countries argued about the Louisiana Purchase',
      'Someone killed a U.S. leader in another country',
      'America and France were fighting over trade',
    ],
    simpleExplanation:
      'Britain forced American sailors to work on British ships. This was called impressment. It made Americans very angry and helped start the war.',
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
    simpleQuestion: 'Who were the "War Hawks" and what did they want?',
    simpleChoices: [
      'Members of Congress who wanted to go to war with Britain and take over Canada',
      'British generals who planned to attack Washington D.C.',
      'Native American leaders who worked with Tecumseh',
      'Merchants from New England who did not want the war',
    ],
    simpleExplanation:
      'The War Hawks were young leaders in Congress like Henry Clay. They wanted to fight Britain and take over Canada. They also wanted to stop Britain from helping Native Americans on the frontier.',
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
    simpleQuestion: 'How close was the vote in Congress to start the War of 1812?',
    simpleChoices: [
      'It was the closest war vote ever — many people in Congress voted no',
      'Everyone in Congress voted yes for the war',
      'Congress never voted — the President started the war on his own',
      'Almost everyone voted yes with only 3 people saying no',
    ],
    simpleExplanation:
      'The vote to start the war was very close. It was the closest war vote in American history. People in the North mostly said no, and people in the South and West mostly said yes.',
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
    simpleQuestion: 'What were the British "Orders in Council" that made Americans angry?',
    simpleChoices: [
      'Rules that stopped America from trading with France and other countries',
      'Orders for the British army to attack the American frontier',
      'Laws that kept American ships out of British ports',
      'Orders to give weapons to Native Americans',
    ],
    simpleExplanation:
      'The Orders in Council were British rules that stopped Americans from trading with France. American merchants lost their ships and goods. This made Americans very angry at Britain.',
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
    simpleQuestion: 'What was the Embargo Act of 1807 and why did it not work?',
    simpleChoices: [
      'A U.S. law that stopped all trade with other countries but hurt Americans more than Britain',
      'A British law that blocked American trade with Europe',
      'A French plan to stop ships from reaching America',
      'A deal between the U.S. and Spain to limit trade',
    ],
    simpleExplanation:
      'President Jefferson banned all trade with other countries. He hoped this would hurt Britain. But it hurt American businesses much more, so it was ended in 1809.',
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
    simpleQuestion: 'What was Tecumseh trying to do during the War of 1812?',
    simpleChoices: [
      'He wanted to bring Native nations together to stop Americans from taking their land',
      'He wanted to become the governor of Indiana',
      'He wanted to help Britain take over all of North America',
      'He wanted to make a peace deal with the United States',
    ],
    simpleExplanation:
      'Tecumseh was a Shawnee leader. He wanted to unite many Native nations into one group. Together, they could stop American settlers from taking Native lands.',
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
    simpleQuestion: 'Why was General Hull giving up Detroit a big deal?',
    simpleChoices: [
      'It was a shocking loss that made Americans feel bad about the war early on',
      'It ended the War of 1812 right away',
      'It gave Americans control of Lake Erie',
      'It caused the British to burn Washington D.C.',
    ],
    simpleExplanation:
      'General Hull gave up Fort Detroit without a fight. The British tricked him into thinking they had more soldiers. This loss shocked the whole country early in the war.',
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
    simpleQuestion: 'Why is Sir Isaac Brock called the "Hero of Upper Canada"?',
    simpleChoices: [
      'He captured Detroit and died fighting at the Battle of Queenston Heights',
      'He signed the peace treaty that ended the war',
      'He led the attack that burned Washington D.C.',
      'He beat the American navy on Lake Erie',
    ],
    simpleExplanation:
      'General Brock tricked the Americans and captured Detroit. Then he fought to protect Canada at Queenston Heights, where he died. Canadians see him as a great hero.',
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
    simpleQuestion: 'Who was Tenskwatawa and what did he do?',
    simpleChoices: [
      'Tecumseh\'s brother, a spiritual leader called "The Prophet" who helped unite Native peoples',
      'A British general who led Native fighters',
      'An American leader who talked with Native nations',
      'A French fur trader who gave weapons to Native peoples',
    ],
    simpleExplanation:
      'Tenskwatawa was Tecumseh\'s brother. People called him "The Prophet." He told Native peoples to keep their traditions and not follow American ways. He built a town called Prophetstown.',
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
    simpleQuestion: 'What was Andrew Jackson known for before the War of 1812?',
    simpleChoices: [
      'He was a militia leader and politician from Tennessee',
      'He was a famous Navy officer',
      'He was the Governor of Louisiana',
      'He was a teacher at a military school',
    ],
    simpleExplanation:
      'Andrew Jackson was a lawyer and militia leader from Tennessee. He never went to military school. The War of 1812 made him famous across the whole country.',
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
    simpleQuestion: 'How did Laura Secord help the British during the war?',
    simpleChoices: [
      'She walked 20 miles through enemy land to warn British soldiers about an American attack',
      'She led a group of Canadian fighters',
      'She took care of hurt soldiers at Fort York',
      'She rowed supplies across Lake Ontario',
    ],
    simpleExplanation:
      'Laura Secord heard American officers planning a surprise attack. She walked 20 miles through swamps and forests to warn the British. The British set a trap and captured over 500 American soldiers.',
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
    simpleQuestion: 'Who made the big flag that flew over Fort McHenry during the British attack?',
    simpleChoices: [
      'Mary Pickersgill and her daughter Caroline, who made flags in Baltimore',
      'Betsy Ross in Philadelphia',
      'Dolley Madison at the White House',
      'British sailors who left it behind when they left',
    ],
    simpleExplanation:
      'Mary Pickersgill and her daughter Caroline sewed a huge flag for Fort McHenry. It was 30 by 42 feet. This is the flag that inspired "The Star-Spangled Banner."',
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
    simpleQuestion: 'How did women help during the war while men were away fighting?',
    simpleChoices: [
      'They ran farms, shops, and businesses while the men were gone',
      'They were not allowed to work outside the home during the war',
      'They stayed in cities and did not get involved in the war',
      'They only helped by writing letters to soldiers',
    ],
    simpleExplanation:
      'When men left to fight, women took over important jobs. They ran farms, shops, and businesses. They also made supplies like bandages and uniforms for soldiers.',
    roundRange: [3, 10],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
    required: true,
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
    simpleQuestion: 'What did Native American women do during the War of 1812?',
    simpleChoices: [
      'They helped make decisions in councils, spoke for peace or war, and kept their communities going',
      'They had no voice and were kept out of all war decisions',
      'They fought in battles as warriors alongside men',
      'They all ran away to Canada before the fighting started',
    ],
    simpleExplanation:
      'Native American women played important roles during the war. In many nations, women helped make decisions about war and peace. They also grew food and took care of people who lost their homes.',
    roundRange: [2, 8],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
    required: true,
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
    simpleQuestion: 'How did the British blockade change work for American women?',
    simpleChoices: [
      'Many women got new jobs in factories making cloth and war supplies',
      'Women lost all their jobs during the war',
      'Only rich women were allowed to work in factories',
      'The blockade did not change anything for women',
    ],
    simpleExplanation:
      'The British blockade stopped cloth and goods from coming to America. Americans had to make their own. Many women started working in new factories making cloth, uniforms, and supplies.',
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
    simpleQuestion: 'What problems did women on the frontier face during the War of 1812?',
    simpleChoices: [
      'They protected their homes from attacks, fled with their children, and lived as refugees',
      'They lived in safe areas away from all the fighting',
      'They all moved to big cities in the East for safety',
      'The government sent soldiers to protect them at all times',
    ],
    simpleExplanation:
      'Women on the frontier faced great danger during the war. Attacks destroyed their homes and farms. Many women had to protect their families and run to safer places with their children.',
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
    simpleQuestion: 'What famous message did Oliver Hazard Perry send after winning on Lake Erie?',
    simpleChoices: [
      '"We have met the enemy and they are ours"',
      '"Don\'t give up the ship"',
      '"I have not yet begun to fight"',
      '"Full speed ahead"',
    ],
    simpleExplanation:
      'Perry beat the British fleet on Lake Erie in 1813. He sent the famous message "We have met the enemy and they are ours." This victory gave Americans control of Lake Erie.',
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
    simpleQuestion: 'How did the wars in Europe affect the War of 1812?',
    simpleChoices: [
      'When Napoleon lost in Europe, Britain sent experienced soldiers to fight in America',
      'Napoleon sent French soldiers to help America',
      'The wars in Europe did not affect the war in America',
      'Napoleon attacked Canada during the War of 1812',
    ],
    simpleExplanation:
      'Britain was fighting Napoleon in Europe at the same time. When Napoleon lost, Britain sent thousands of experienced soldiers to America. This made the British army much stronger.',
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
    simpleQuestion: 'How was the Creek War connected to the War of 1812?',
    simpleChoices: [
      'Some Creek people joined with the British to fight against American settlers in the South',
      'The Creek Nation went to war against Canada',
      'American soldiers went through Creek land to reach the Pacific Ocean',
      'The Creek gave weapons to the British Navy',
    ],
    simpleExplanation:
      'Some Creek people, called the Red Sticks, joined the British side. They fought against American settlers in the South. Andrew Jackson defeated them at the Battle of Horseshoe Bend in 1814.',
    roundRange: [5, 8],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
    required: true,
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
    simpleQuestion: 'What happened when Americans captured York (now called Toronto) in 1813?',
    simpleChoices: [
      'They burned government buildings, which later made the British burn Washington D.C.',
      'They set up a permanent American army base in Canada',
      'They freed hundreds of British prisoners',
      'Nothing — the Americans left the city right away',
    ],
    simpleExplanation:
      'American soldiers captured York and burned the government buildings there. This made the British very angry. Later, the British burned Washington D.C. to get back at the Americans.',
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
    simpleQuestion: 'Why was the Battle of the Thames in 1813 so important?',
    simpleChoices: [
      'Tecumseh was killed, which broke apart the Native alliance and ended British power in the area',
      'The British captured Detroit for the second time',
      'The Americans lost control of Lake Ontario',
      'It was the last battle of the whole war',
    ],
    simpleExplanation:
      'Tecumseh was killed at this battle. Without him, the Native alliance fell apart. The British lost their power in the Northwest, and Americans took back control of Detroit.',
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
    simpleQuestion: 'What role did African Americans play in the U.S. Navy during the war?',
    simpleChoices: [
      'About 1 out of every 5 American sailors were free Black men who worked as equals with white sailors',
      'African Americans were not allowed to serve in the military',
      'They only worked as cooks, never as fighters',
      'Only enslaved people could serve, not free Black men',
    ],
    simpleExplanation:
      'Free Black men made up about 15-20% of the U.S. Navy. They got the same pay as white sailors and fought side by side with them. They helped win important battles on the water.',
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
    simpleQuestion: 'What were the British "Colonial Marines" during the War of 1812?',
    simpleChoices: [
      'Enslaved people who escaped to the British side and were given freedom to fight for Britain',
      'British soldiers who lived in America before the war',
      'American Navy officers who joined the British side',
      'Native American scouts who worked for the British army',
    ],
    simpleExplanation:
      'The British promised freedom to enslaved people who escaped and joined them. Hundreds of these people formed the Colonial Marines. They fought in battles and were given their freedom after the war.',
    roundRange: [7, 10],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
    required: true,
  },
  {
    id: 'kc_enslaved_freedom',
    question: 'During the War of 1812, approximately how many enslaved people escaped to British lines seeking freedom?',
    choices: [
      'About 4,000 people self-emancipated by fleeing to British ships and camps',
      'Fewer than 100 people managed to escape during the war',
      'Over 50,000 enslaved people were freed by the British army',
      'No enslaved people attempted to escape during the conflict',
    ],
    correctIndex: 0,
    explanation:
      'Approximately 4,000 enslaved people escaped to British lines during the War of 1812, particularly in the Chesapeake Bay region. The British offered freedom to anyone who joined them, and many risked their lives to reach British ships. Some joined the Colonial Marines and fought against their former enslavers. After the war, most were resettled in Nova Scotia, Trinidad, or other British colonies. American slaveholders demanded their return, but Britain refused—one of the few times a major power honored its promise of freedom to formerly enslaved people.',
    simpleQuestion: 'About how many enslaved people escaped to the British side during the war?',
    simpleChoices: [
      'About 4,000 people escaped to British ships and camps to gain their freedom',
      'Fewer than 100 people escaped during the war',
      'Over 50,000 enslaved people were freed by the British army',
      'No enslaved people tried to escape during the war',
    ],
    simpleExplanation:
      'About 4,000 enslaved people escaped to the British side during the war. The British promised them freedom. After the war, Britain kept its promise and helped them start new lives in Canada and other places.',
    roundRange: [6, 10],
    reward: { type: 'nationalism', count: 3, description: '+3 Nationalism' },
    required: true,
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
    simpleQuestion: 'How did Andrew Jackson use free Black soldiers at the Battle of New Orleans?',
    simpleChoices: [
      'He put free Black men into two groups of soldiers who fought bravely and were praised',
      'He did not let any African Americans fight',
      'He made enslaved people dig ditches but did not give them weapons',
      'He promised enslaved people freedom but broke his promise after the battle',
    ],
    simpleExplanation:
      'Andrew Jackson needed more soldiers. He asked free Black men in Louisiana to fight. They fought bravely at the Battle of New Orleans, and Jackson praised them for their courage.',
    roundRange: [10, 12],
    reward: { type: 'nationalism', count: 3, description: '+3 Nationalism' },
    required: true,
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
    simpleQuestion: 'Why did the British Navy block American ports during the war?',
    simpleChoices: [
      'To stop American trade and keep supplies from reaching U.S. ports',
      'To protect British fishing areas in the Atlantic Ocean',
      'To stop French ships from reaching America',
      'To keep American settlers from crossing the Great Lakes',
    ],
    simpleExplanation:
      'The British Navy blocked American ports to hurt the U.S. economy. They wanted to stop trade and supplies. American exports dropped from $61 million to just $7 million.',
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
    simpleQuestion: 'Why was the ship USS Constitution called "Old Ironsides"?',
    simpleChoices: [
      'British cannonballs seemed to bounce off her thick wooden sides',
      'She had iron armor on her sides',
      'Her captain had the nickname "Iron Will"',
      'She survived a fire that destroyed the other ships',
    ],
    simpleExplanation:
      'The USS Constitution had very thick oak wood on her sides. British cannonballs seemed to bounce right off. A sailor yelled "Her sides are made of iron!" and the nickname stuck.',
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
    simpleQuestion: 'What did American privateers do during the War of 1812?',
    simpleChoices: [
      'They captured over 1,500 British trading ships all around the world',
      'They blocked British ports in Europe',
      'They moved troops across the Great Lakes',
      'They did not have any real effect on the war',
    ],
    simpleExplanation:
      'Privateers were private ships allowed by the government to attack British trading ships. They captured over 1,500 British ships. This hurt British trade and helped push Britain toward peace.',
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
    simpleQuestion: 'What happened when the British captured Washington D.C. in 1814?',
    simpleChoices: [
      'They burned the White House and the Capitol building',
      'They forced President Madison to give up',
      'They made Washington the new British capital',
      'Nothing — everyone left the city before they got there',
    ],
    simpleExplanation:
      'The British marched into Washington D.C. in August 1814. They burned the White House, the Capitol, and other government buildings. This is the only time another country has burned the American capital.',
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
    simpleQuestion: 'The battle at Fort McHenry inspired which famous American song?',
    simpleChoices: [
      'The Star-Spangled Banner (the national anthem)',
      'The Pledge of Allegiance',
      'The Liberty Bell tradition',
      'The bald eagle as a national symbol',
    ],
    simpleExplanation:
      'Francis Scott Key watched the British attack Fort McHenry for 25 hours. When he saw the American flag still flying in the morning, he wrote a poem. That poem became "The Star-Spangled Banner."',
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
    simpleQuestion: 'What did Dolley Madison do when the British were coming to Washington?',
    simpleChoices: [
      'She saved a painting of George Washington and important papers from the White House',
      'She led soldiers to protect the Capitol',
      'She talked the British commander into stopping the attack',
      'She escaped to Canada dressed as a British officer',
    ],
    simpleExplanation:
      'Dolley Madison would not leave the White House until she saved a famous painting of George Washington. She also saved important government papers. Her bravery made her a hero.',
    roundRange: [9, 11],
    reward: { type: 'nationalism', count: 3, description: '+3 Nationalism' },
    required: true,
  },
  {
    id: 'kc_dolley_political_role',
    question: 'Beyond saving Washington\'s portrait, what was Dolley Madison\'s broader role in American politics?',
    choices: [
      'She was a skilled political partner who hosted strategic social events and built political alliances for her husband',
      'She had no involvement in politics beyond her famous rescue of the portrait',
      'She served as an unofficial general, commanding troops during the British invasion',
      'She opposed the war and publicly criticized her husband\'s decision to fight',
    ],
    correctIndex: 0,
    explanation:
      'Dolley Madison was far more than a portrait-rescuer. She was one of the most politically influential First Ladies in American history. She hosted "Wednesday drawing rooms"—social gatherings where politicians from opposing parties mixed, negotiated, and built alliances. She helped her shy husband navigate Washington\'s social politics and was widely credited with helping him win reelection in 1812. Her political skills were so respected that after James Madison\'s death, Congress gave her an honorary seat on the House floor—the first woman to receive this honor.',
    simpleQuestion: 'Besides saving the painting, what else was Dolley Madison known for in politics?',
    simpleChoices: [
      'She hosted parties where leaders met, talked, and made deals to help her husband',
      'She had nothing to do with politics besides saving the painting',
      'She was a general who led soldiers during the British attack',
      'She spoke out against the war and argued with her husband about it',
    ],
    simpleExplanation:
      'Dolley Madison was very important in politics. She hosted parties where leaders from different sides could meet and work together. She helped her husband win support and get reelected as President.',
    roundRange: [7, 11],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
    required: true,
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
    simpleQuestion: 'Why was the American victory at Plattsburgh in 1814 so important?',
    simpleChoices: [
      'It stopped a big British attack from Canada and helped bring about the peace treaty',
      'It was the first American win on the water during the war',
      'It led to the burning of Washington D.C.',
      'It gave America permanent control of Montreal',
    ],
    simpleExplanation:
      'A smaller American force beat a big British army at Plattsburgh. The Americans also won the battle on the lake. This loss helped convince Britain to agree to a peace treaty.',
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
    simpleQuestion: 'What is the Battle of Lundy\'s Lane remembered for?',
    simpleChoices: [
      'One of the bloodiest battles of the war, ending in a tie near Niagara Falls',
      'A big British win that ended the war',
      'A small fight with very few people hurt',
      'The first battle where Americans used cannons',
    ],
    simpleExplanation:
      'The Battle of Lundy\'s Lane was a very bloody fight near Niagara Falls. It lasted 6 hours and over 1,700 soldiers were hurt or killed. Neither side truly won the battle.',
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
    simpleQuestion: 'What did the Treaty of Ghent actually do?',
    simpleChoices: [
      'Things went back to how they were before the war — no one gained land',
      'It gave Canada to the United States',
      'It created a new homeland for Native peoples in the Northwest',
      'It made Britain pay money to America for the war',
    ],
    simpleExplanation:
      'The Treaty of Ghent ended the war in December 1814. Things went back to how they were before the war. Neither side gained or lost any land. Native peoples lost the most because they lost British support.',
    roundRange: [10, 12],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_treaty_broken_promises',
    question: 'What happened to the Treaty of Ghent\'s promise to restore Native American lands to their pre-war status?',
    choices: [
      'The promise was ignored — the U.S. never returned any lands and accelerated westward expansion',
      'All Native lands were faithfully restored within two years',
      'Britain enforced the promise by sending troops to protect Native territories',
      'Native leaders voluntarily gave up their lands in exchange for payment',
    ],
    correctIndex: 0,
    explanation:
      'Article IX of the Treaty of Ghent required the U.S. to restore Native nations to their pre-war status and territories. The U.S. government completely ignored this provision. Without British military support, Native nations had no power to enforce the treaty terms. Instead of restoring lands, the U.S. accelerated its policy of forced removal. Within 15 years, President Andrew Jackson—the war\'s greatest hero—signed the Indian Removal Act of 1830, leading to the Trail of Tears and the displacement of tens of thousands of Native people from their ancestral homelands.',
    simpleQuestion: 'What happened to the treaty promise to give Native peoples their land back?',
    simpleChoices: [
      'The U.S. broke the promise and never gave back any lands, then pushed Native peoples off even more land',
      'All Native lands were given back within two years',
      'Britain sent soldiers to protect Native lands',
      'Native leaders chose to give up their lands in exchange for money',
    ],
    simpleExplanation:
      'The peace treaty said the U.S. would give Native peoples their lands back. The U.S. broke this promise. Without British help, Native peoples could not make the U.S. keep its word. The U.S. took even more Native land after the war.',
    roundRange: [10, 12],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
    required: true,
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
    simpleQuestion: 'Why is the Battle of New Orleans in 1815 considered ironic?',
    simpleChoices: [
      'The peace treaty had already been signed, but the news had not arrived yet',
      'It was the only battle the British won during the whole war',
      'Andrew Jackson lost the battle but became president anyway',
      'It took place in French land, not American land',
    ],
    simpleExplanation:
      'The peace treaty was already signed before the battle happened. But news traveled slowly by ship, so nobody in New Orleans knew. Jackson won a huge victory that made him a national hero.',
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
    simpleQuestion: 'What was the Hartford Convention?',
    simpleChoices: [
      'A meeting of New England leaders who were so upset about the war they talked about leaving the country',
      'A peace meeting between the U.S. and Britain',
      'A Native American council to talk about alliances',
      'A war planning meeting led by Andrew Jackson',
    ],
    simpleExplanation:
      'Leaders from New England met in Hartford because they hated the war. Some even talked about leaving the United States. But then the war ended, and they looked unpatriotic. Their party fell apart soon after.',
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
    simpleQuestion: 'What was one big result of the War of 1812 for the United States?',
    simpleChoices: [
      'Americans felt much more proud of their country and the Federalist Party fell apart',
      'America took over Canada for good',
      'The war ended slavery in the United States',
      'America and France joined together against Britain',
    ],
    simpleExplanation:
      'After the war, Americans felt very proud of their country. The war created heroes like Andrew Jackson and gave America the Star-Spangled Banner. The Federalist Party, which was against the war, fell apart.',
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
    simpleQuestion: 'What happened to Native American nations after the War of 1812?',
    simpleChoices: [
      'They lost British help and American settlers quickly took their lands',
      'They got their own homeland as the peace treaty promised',
      'They made a lasting friendship with the United States',
      'They moved to Canada where they became full citizens',
    ],
    simpleExplanation:
      'The war was terrible for Native peoples. Tecumseh was dead and Britain stopped helping them. American settlers took more and more Native land. Within 20 years, the government forced most Eastern nations off their lands.',
    roundRange: [10, 12],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
    required: true,
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
    simpleQuestion: 'How did the War of 1812 change how Canadians felt about their country?',
    simpleChoices: [
      'Canadians felt proud that they defended their homeland from American attacks',
      'The war had no lasting effect on Canada',
      'Canadians decided they wanted to join the United States',
      'Canada became independent from Britain right after the war',
    ],
    simpleExplanation:
      'Canadians were proud that they defended their country against American attacks. Heroes like Brock and Laura Secord became famous. The war helped Canadians feel like their own separate nation.',
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
    simpleQuestion: 'How did the War of 1812 change how Americans made things?',
    simpleChoices: [
      'The British blockade forced Americans to build their own factories and start making their own goods',
      'The war destroyed the American economy for good',
      'The war did not change the economy at all',
      'America became completely dependent on French trade',
    ],
    simpleExplanation:
      'The British blockade stopped goods from reaching America. Americans had to build their own factories to make cloth, iron, and other things. This was the start of American manufacturing.',
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
    simpleQuestion: 'Why did Britain stop taking American sailors and making them work on British ships?',
    simpleChoices: [
      'The wars in Europe ended, so Britain did not need extra sailors anymore',
      'The peace treaty said Britain had to stop',
      'The American Navy destroyed all British ships',
      'Congress passed a law that made it illegal',
    ],
    simpleExplanation:
      'Taking American sailors was a main cause of the war. But Britain stopped doing it because the wars in Europe ended. Britain no longer needed extra sailors. The peace treaty never even mentioned it.',
    roundRange: [10, 12],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
  },

  // ══════════════════════════════════════════════════════════════
  // CONTENT EXPANSION v1.6.0 (25 new questions)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'kc_de_salaberry',
    question: 'How did Charles de Salaberry defeat a much larger American force at the Battle of Chateauguay?',
    choices: [
      'He used buglers in the forest to make his 300 troops seem like a much larger army',
      'He received secret reinforcements from British ships on the St. Lawrence',
      'He used artillery to destroy the American supply wagons',
      'He negotiated a ceasefire while more British troops arrived',
    ],
    correctIndex: 0,
    explanation:
      'De Salaberry positioned buglers throughout the forest to create the illusion of a massive force. With roughly 300 Canadian Voltigeurs and Native warriors, he convinced over 3,000 American troops to retreat — saving Montreal from invasion.',
    simpleQuestion: 'How did de Salaberry win a battle with only 300 soldiers against 3,000 Americans?',
    simpleChoices: [
      'He used buglers to make his army sound much bigger than it was',
      'He got secret help from British ships',
      'He used big cannons to stop the Americans',
      'He asked for a truce while waiting for more soldiers',
    ],
    simpleExplanation:
      'De Salaberry spread buglers all over the forest. They blew their horns from different spots so the Americans thought a huge army was around them. The Americans ran away even though they had way more soldiers.',
    roundRange: [6, 9],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_black_hawk_war',
    question: 'What role did Black Hawk play during the War of 1812?',
    choices: [
      'He was a Sauk war chief who fought alongside the British at Fort Meigs and the Thames',
      'He led the American army at the Battle of New Orleans',
      'He served as a translator between the British and French Canadians',
      'He negotiated the Treaty of Ghent on behalf of Native nations',
    ],
    correctIndex: 0,
    explanation:
      'Black Hawk was a Sauk war chief who fought alongside the British during the War of 1812, participating in the battles of Fort Meigs and the Thames. He never accepted treaties surrendering his people\'s ancestral lands and later led the Black Hawk War of 1832.',
    simpleQuestion: 'What did Black Hawk do during the War of 1812?',
    simpleChoices: [
      'He was a Sauk war chief who fought with the British in important battles',
      'He led the American army at New Orleans',
      'He worked as a translator for the British',
      'He helped make the peace treaty',
    ],
    simpleExplanation:
      'Black Hawk was a Sauk war chief. He fought alongside the British in big battles like Fort Meigs. He never agreed with treaties that gave away his people\'s land.',
    roundRange: [4, 8],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_frenchtown',
    question: 'What event at the River Raisin became a powerful American rallying cry?',
    choices: [
      'Wounded American prisoners were killed after the battle, sparking "Remember the Raisin!"',
      'American forces burned a British supply depot on the river',
      'A major flood destroyed the American camp on the River Raisin',
      'The British surrendered their largest fortress on the river',
    ],
    correctIndex: 0,
    explanation:
      'After the British-Native victory at Frenchtown (modern Monroe, Michigan) in January 1813, Native warriors killed dozens of wounded American prisoners. "Remember the Raisin!" became one of the war\'s most powerful rallying cries, fueling recruitment across the American frontier.',
    simpleQuestion: 'Why did Americans shout "Remember the Raisin!" during the war?',
    simpleChoices: [
      'Because wounded American soldiers were killed after a battle near the River Raisin',
      'Because the Americans burned a British building on the river',
      'Because a flood destroyed an American camp',
      'Because the British gave up their biggest fort',
    ],
    simpleExplanation:
      'After a battle near the River Raisin, hurt American soldiers who could not fight were killed. Americans were very angry. "Remember the Raisin!" became a battle cry that made many people want to join the army.',
    roundRange: [3, 6],
    reward: { type: 'nationalism', count: 3, description: '+3 Nationalism' },
    required: true,
  },
  {
    id: 'kc_colonial_marines_role',
    question: 'Who were the Colonial Marines during the War of 1812?',
    choices: [
      'Formerly enslaved people who escaped to British lines and were formed into a military unit',
      'French-Canadian militia who defended Montreal against American attack',
      'American marines who fought at the Battle of New Orleans',
      'British soldiers recruited from prisons to fight in North America',
    ],
    correctIndex: 0,
    explanation:
      'The Corps of Colonial Marines were formed from enslaved people who escaped to British lines after Vice Admiral Cochrane\'s 1814 proclamation promising freedom. They fought with distinction at Bladensburg and in Chesapeake raids. After the war, most were resettled as free people in Trinidad, Nova Scotia, or New Brunswick.',
    simpleQuestion: 'Who were the Colonial Marines?',
    simpleChoices: [
      'Enslaved people who escaped to the British and became soldiers in exchange for freedom',
      'French-Canadian soldiers who defended Montreal',
      'American marines who fought at New Orleans',
      'British prisoners who were forced to fight',
    ],
    simpleExplanation:
      'The Colonial Marines were people who escaped from slavery. They joined the British army in exchange for freedom. They fought bravely and after the war, they lived as free people in places like Canada and the Caribbean.',
    roundRange: [7, 10],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
    required: true,
  },
  {
    id: 'kc_war_financing',
    question: 'Why was the U.S. government nearly bankrupt by 1814?',
    choices: [
      'New England banks refused to lend money and the British blockade destroyed customs revenue',
      'Congress voted to defund the military as a protest against the war',
      'The army spent all its money building a new capital city',
      'France demanded immediate repayment of Revolutionary War loans',
    ],
    correctIndex: 0,
    explanation:
      'By 1814, New England banks refused to fund a war they opposed, and the British blockade destroyed customs revenue — the government\'s main income source. This financial crisis, combined with British war exhaustion after 20 years of fighting Napoleon, pushed both sides toward peace at Ghent.',
    simpleQuestion: 'Why was America running out of money during the war?',
    simpleChoices: [
      'Banks would not lend money and the British blockade stopped trade income',
      'Congress voted to stop paying for the military',
      'The army spent all the money on a new capital',
      'France wanted old debts paid back right away',
    ],
    simpleExplanation:
      'Banks in New England did not want to lend money for a war they did not like. The British also blocked ships, so the government could not collect money from trade. Both sides were broke and wanted peace.',
    roundRange: [6, 10],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
  },
  {
    id: 'kc_new_england_opposition',
    question: 'How did New England express its opposition to the War of 1812?',
    choices: [
      'New England merchants smuggled goods to British Canada and some states considered secession at the Hartford Convention',
      'New England sent its largest militia force to fight in Canada',
      'New England immediately surrendered to the British navy',
      'New England governors signed a separate peace treaty with Britain',
    ],
    correctIndex: 0,
    explanation:
      'New England strongly opposed the war — merchants smuggled goods to British Canada, banks refused to fund the war, and in 1814, delegates met at the Hartford Convention to discuss possible secession. The British deliberately left New England ports unblockaded to encourage this division. Much of the British army in Canada was actually fed by American suppliers from New England.',
    simpleQuestion: 'How did people in New England show they did not like the war?',
    simpleChoices: [
      'They sold supplies to the enemy and some talked about leaving the United States',
      'They sent a big army to fight in Canada',
      'They gave up and let the British take over',
      'Their governors made a peace deal with Britain by themselves',
    ],
    simpleExplanation:
      'New England did not want the war. Merchants sold food and supplies to the British enemy. Banks would not lend money. Some leaders even talked about leaving the United States at a big meeting called the Hartford Convention.',
    roundRange: [4, 8],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
    required: true,
  },
  {
    id: 'kc_canadian_defense',
    question: 'What role did the Canadian militia play in defending Canada during the War of 1812?',
    choices: [
      'Canadian-born soldiers fought in key battles like Chateauguay and Beaver Dams, helping save Canada from invasion',
      'The Canadian militia did not participate — only British regulars defended Canada',
      'Canadian militia only guarded supply depots far from the fighting',
      'Canadian militia soldiers all deserted to the American side',
    ],
    correctIndex: 0,
    explanation:
      'Canadian militia, including French-Canadian Voltigeurs under de Salaberry and English-Canadian units, fought alongside British regulars and Native warriors. Their participation at battles like Chateauguay, Beaver Dams, and Queenston Heights was essential to Canada\'s defense and helped forge a sense of Canadian national identity.',
    simpleQuestion: 'Did Canadian soldiers help defend Canada during the war?',
    simpleChoices: [
      'Yes — they fought in important battles and helped save Canada from being taken over',
      'No — only British soldiers from England fought in Canada',
      'They only guarded supply buildings away from the fighting',
      'They all left and joined the American army',
    ],
    simpleExplanation:
      'Canadian soldiers fought in many important battles. French-Canadian soldiers under de Salaberry won at Chateauguay. Canadian and Native fighters won at Beaver Dams. These battles helped save Canada from being taken over.',
    roundRange: [3, 7],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
    required: true,
  },
  {
    id: 'kc_naval_strategy',
    question: 'Why was the British naval blockade of the American coast so devastating?',
    choices: [
      'It cut off customs revenue (the government\'s main income) and strangled American trade',
      'It sank all American merchant ships within the first month of the war',
      'It prevented Americans from fishing, causing widespread famine',
      'It allowed the British to land armies at any point along the coast',
    ],
    correctIndex: 0,
    explanation:
      'The British blockade was devastating because it cut off customs duties — the federal government\'s primary source of revenue. By 1814, American exports had fallen by over 90%, the treasury was nearly empty, and prices for imported goods soared. The blockade was arguably Britain\'s most effective weapon in the entire war.',
    simpleQuestion: 'Why did the British blocking American ports hurt so much?',
    simpleChoices: [
      'It stopped trade, which was how the government got most of its money',
      'It sank all American ships in the first month',
      'It stopped Americans from fishing and they ran out of food',
      'It let the British land soldiers anywhere on the coast',
    ],
    simpleExplanation:
      'The government got most of its money from taxes on trade. When the British blocked the ports, ships could not come in or go out. The government lost almost all its money, and everyday things became very expensive.',
    roundRange: [4, 8],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_native_allies_british',
    question: 'Why did most Native nations in the Great Lakes region ally with Britain rather than the United States?',
    choices: [
      'Britain promised to support a Native buffer state and had a history of trading partnerships with Native nations',
      'Britain offered Native nations control of all Canadian territory',
      'The United States refused to trade with any Native nations',
      'Native nations were required by treaty to fight for Britain',
    ],
    correctIndex: 0,
    explanation:
      'Native nations allied with Britain because the British had long-established trade relationships and supported the idea of a Native buffer state between the U.S. and Canada. American expansionism directly threatened Native lands, while British policy (at least officially) favored protecting them. For many nations, the British alliance was the last hope of resisting American settlement.',
    simpleQuestion: 'Why did most Native nations near the Great Lakes fight on the British side?',
    simpleChoices: [
      'Britain promised to help protect Native lands and had traded with them for a long time',
      'Britain offered to give them all of Canada',
      'America refused to trade with any Native nations',
      'Native nations were forced by an old treaty to fight for Britain',
    ],
    simpleExplanation:
      'Britain had been trading partners with Native nations for many years. Britain also promised to help protect their land from American settlers. Native nations saw the British as their best hope to keep their homes.',
    roundRange: [2, 5],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
    required: true,
  },
  {
    id: 'kc_fort_meigs',
    question: 'How did William Henry Harrison defend Fort Meigs against British siege in 1813?',
    choices: [
      'His troops built massive earthwork walls that absorbed British cannon fire',
      'He launched a surprise naval attack on the British supply ships',
      'He negotiated a temporary truce while waiting for reinforcements',
      'He surrendered the outer walls and retreated to a stone keep',
    ],
    correctIndex: 0,
    explanation:
      'Harrison\'s troops built massive earthwork walls at Fort Meigs on the Maumee River in Ohio. The earthen embankments absorbed British cannon fire, preventing the destruction the British expected. The fort survived two sieges in 1813, maintaining the American foothold in the Northwest.',
    simpleQuestion: 'How did the soldiers at Fort Meigs stop the British cannonballs?',
    simpleChoices: [
      'They built very thick dirt walls that soaked up the cannonballs',
      'They attacked British ships to stop the cannons',
      'They asked for a truce until more soldiers came',
      'They hid inside a stone building',
    ],
    simpleExplanation:
      'The soldiers built really thick walls out of dirt and earth. The cannonballs just got stuck in the dirt instead of breaking through. The fort survived two attacks this way.',
    roundRange: [4, 7],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_beaver_dams',
    question: 'What was Laura Secord\'s role in the British victory at Beaver Dams?',
    choices: [
      'She walked 20 miles through enemy territory to warn the British of an American attack',
      'She commanded the British artillery during the battle',
      'She decoded American military messages for the British',
      'She organized Canadian civilians to block the American advance',
    ],
    correctIndex: 0,
    explanation:
      'Laura Secord overheard American officers discussing their attack plans while they were quartered in her home. She walked 20 miles through swamps and enemy territory to warn the British outpost. Her warning enabled Mohawk warriors and British troops to prepare an ambush that captured over 500 American troops.',
    simpleQuestion: 'What did Laura Secord do to help the British at Beaver Dams?',
    simpleChoices: [
      'She walked 20 miles through dangerous land to warn them about an American attack',
      'She fired the cannons during the battle',
      'She read secret American letters for the British',
      'She got townspeople to block the American army',
    ],
    simpleExplanation:
      'Laura Secord heard American soldiers talking about their plans in her house. She walked 20 miles through swamps and enemy land to warn the British. Because of her, the British and Mohawk fighters were ready and captured over 500 Americans.',
    roundRange: [5, 8],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_uss_wasp',
    question: 'What ironic fate befell the USS Wasp after its victory over HMS Frolic?',
    choices: [
      'Hours after capturing the Frolic, both ships were seized by the massive British ship HMS Poictiers',
      'The Wasp ran aground on the Virginia coast and was abandoned',
      'The Wasp\'s crew mutinied and sailed to France',
      'The British recaptured the Frolic during a prisoner exchange',
    ],
    correctIndex: 0,
    explanation:
      'Just hours after the USS Wasp defeated HMS Frolic in October 1812, both ships were captured by the British ship-of-the-line HMS Poictiers. While American ships could win individual battles, Britain\'s overwhelming numbers (600+ warships vs. America\'s 16) gave it strategic control of the seas.',
    simpleQuestion: 'What happened to the USS Wasp right after it won a battle?',
    simpleChoices: [
      'A much bigger British ship came and captured both ships',
      'It got stuck on the beach and everyone had to leave',
      'The crew took over the ship and sailed to France',
      'The British got their ship back in a prisoner trade',
    ],
    simpleExplanation:
      'Right after the Wasp won, a much bigger British ship showed up and took both ships. Even though American ships could win one-on-one, Britain had way more ships — over 600 compared to America\'s 16.',
    roundRange: [3, 6],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_war_hawks_expansion',
    question: 'Beyond British impressment, what did the War Hawks hope to gain from war with Britain?',
    choices: [
      'Expansion into British Canada and an end to British support for Native resistance on the frontier',
      'Control of Britain\'s Caribbean sugar islands',
      'A permanent alliance with Napoleon\'s France',
      'The abolition of slavery throughout North America',
    ],
    correctIndex: 0,
    explanation:
      'The War Hawks, led by Henry Clay and John C. Calhoun, saw war as an opportunity to expand into British Canada and eliminate British support for Native nations resisting American settlement on the frontier. Western and Southern states particularly wanted to stop British agents from supplying weapons and encouragement to Tecumseh\'s confederacy.',
    simpleQuestion: 'Besides stopping impressment, what else did the War Hawks want?',
    simpleChoices: [
      'To take over Canada and stop Britain from helping Native nations fight against American settlers',
      'To take Britain\'s islands in the Caribbean',
      'To become best friends with France forever',
      'To end slavery across North America',
    ],
    simpleExplanation:
      'The War Hawks wanted to take over Canada. They also wanted Britain to stop helping Native nations who were fighting against American settlers moving west.',
    roundRange: [1, 4],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
  },
  {
    id: 'kc_detroit_significance',
    question: 'Why was Detroit strategically important during the War of 1812?',
    choices: [
      'It controlled access to the Great Lakes and the western frontier, connecting trade routes and military supply lines',
      'It was the largest city in North America at the time',
      'It contained the only bridge across the Great Lakes',
      'It was the capital of the United States during the war',
    ],
    correctIndex: 0,
    explanation:
      'Detroit sat at the junction of the Great Lakes waterway system and the western frontier. Controlling Detroit meant controlling access to the upper Great Lakes, trade routes with Native nations, and the military supply lines that fed armies on both sides. Its loss and recapture were major turning points in the war.',
    simpleQuestion: 'Why was Detroit so important during the war?',
    simpleChoices: [
      'It controlled the Great Lakes waterways and the roads to the western frontier',
      'It was the biggest city in North America',
      'It had the only bridge over the Great Lakes',
      'It was America\'s capital during the war',
    ],
    simpleExplanation:
      'Detroit was at an important crossroads. Whoever controlled Detroit controlled the Great Lakes waterways and the roads to the western frontier. That is why both sides fought so hard over it.',
    roundRange: [2, 5],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
    required: true,
  },
  {
    id: 'kc_great_lakes_control',
    question: 'Why was control of the Great Lakes so important to both sides during the war?',
    choices: [
      'The lakes were the primary transportation routes for moving troops, supplies, and trade goods in the Northwest',
      'Gold had been discovered on the shores of Lake Superior',
      'Both countries wanted to build permanent naval bases on every lake',
      'The Great Lakes were the main source of drinking water for both armies',
    ],
    correctIndex: 0,
    explanation:
      'In an era before railroads, the Great Lakes were the highways of the Northwest. Armies, supplies, and trade goods all moved primarily by water. Controlling the lakes meant controlling the ability to supply, reinforce, and move armies — which is why Perry\'s victory on Lake Erie was such a decisive turning point.',
    simpleQuestion: 'Why did both sides want to control the Great Lakes?',
    simpleChoices: [
      'The lakes were the main way to move soldiers, supplies, and trade goods',
      'There was gold near Lake Superior',
      'Both countries wanted to build military bases on every lake',
      'The lakes were the main source of water for drinking',
    ],
    simpleExplanation:
      'Before there were trains or highways, the Great Lakes were like roads on water. Armies, food, and supplies all traveled by boat on the lakes. Whoever controlled the lakes could move their army faster and keep them fed.',
    roundRange: [4, 8],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
    required: true,
  },
  {
    id: 'kc_nancy_hart',
    question: 'What essential roles did frontier women play during the War of 1812?',
    choices: [
      'They defended homesteads, manufactured ammunition, organized supply networks, and served as messengers',
      'They had no involvement in the war effort',
      'They only served as nurses in official military hospitals',
      'They were evacuated to coastal cities for their safety',
    ],
    correctIndex: 0,
    explanation:
      'Frontier women played critical roles that rarely made it into history books — defending homesteads when men were away, manufacturing ammunition, organizing community supply networks, and serving as messengers. In many frontier communities, women were the primary defenders of their homes and families.',
    simpleQuestion: 'What did women on the frontier do during the war?',
    simpleChoices: [
      'They protected their homes, made bullets, organized supplies, and carried messages',
      'They did not help with the war at all',
      'They only worked as nurses in army hospitals',
      'They were all sent to big cities to be safe',
    ],
    simpleExplanation:
      'Women on the frontier did many important jobs during the war. They protected their homes, made bullets, organized supplies, and carried messages. Most history books forgot to write about their work.',
    roundRange: [5, 9],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
  },
  {
    id: 'kc_impressment_numbers',
    question: 'Approximately how many American citizens were impressed into the Royal Navy between 1803 and 1812?',
    choices: [
      '6,000 to 10,000 Americans',
      'About 100 Americans',
      'Over 50,000 Americans',
      'Exactly 12 Americans',
    ],
    correctIndex: 0,
    explanation:
      'Between 1803 and 1812, the British impressed an estimated 6,000 to 10,000 American citizens into the Royal Navy. Britain was fighting Napoleon and desperately needed sailors. The Royal Navy would stop American ships at sea, line up the crew, and take anyone they claimed was a British subject — often ignoring American citizenship papers.',
    simpleQuestion: 'About how many Americans did the British force to work on their ships before the war?',
    simpleChoices: [
      'Between 6,000 and 10,000 people',
      'About 100 people',
      'More than 50,000 people',
      'Only 12 people',
    ],
    simpleExplanation:
      'Britain took between 6,000 and 10,000 American sailors and forced them to work on British ships. Britain needed sailors for their war against Napoleon. They would stop American ships and take people off them.',
    roundRange: [1, 4],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
  },
  {
    id: 'kc_native_confederacy_challenge',
    question: 'What was the greatest challenge Tecumseh faced in building his pan-Native confederacy?',
    choices: [
      'Different Native nations had their own interests, languages, and traditions, making a unified political alliance extremely difficult',
      'He lacked the ability to communicate with other Native nations',
      'The British refused to support his confederacy',
      'All Native nations had already signed peace treaties with the United States',
    ],
    correctIndex: 0,
    explanation:
      'Tecumseh\'s greatest challenge was that Native nations were diverse sovereign entities with different languages, traditions, priorities, and relationships with the U.S. Some nations, like the Cherokee, chose diplomacy. Others, like parts of the Creek Nation, were internally divided. Building a unified confederacy across such diversity required extraordinary diplomatic skill.',
    simpleQuestion: 'What was the hardest part about Tecumseh bringing Native nations together?',
    simpleChoices: [
      'Each nation had its own language, traditions, and goals, so it was very hard to agree on things',
      'He could not talk to other nations because he did not speak their languages',
      'The British would not help him at all',
      'Every Native nation had already made peace with the United States',
    ],
    simpleExplanation:
      'Every Native nation was different. They spoke different languages, had different traditions, and wanted different things. Getting them all to work together was extremely hard. Tecumseh traveled thousands of miles trying to convince them.',
    roundRange: [3, 7],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
    required: true,
  },
  {
    id: 'kc_british_veterans_impact',
    question: 'How did the end of the Napoleonic Wars in 1814 change the War of 1812?',
    choices: [
      'Britain could send thousands of veteran troops from Europe to North America, dramatically shifting the balance of power',
      'It had no effect on the War of 1812 since the conflicts were unrelated',
      'It forced Britain to immediately surrender to the United States',
      'It caused France to join the war on the American side',
    ],
    correctIndex: 0,
    explanation:
      'When Napoleon was defeated in 1814, Britain was free to send thousands of battle-hardened veterans to North America. These experienced troops led the burning of Washington and the attacks on Baltimore and New Orleans. The influx dramatically shifted the military balance, though it came too late to change the war\'s outcome.',
    simpleQuestion: 'What happened when the wars in Europe ended in 1814?',
    simpleChoices: [
      'Britain sent thousands of experienced soldiers from Europe to fight in America',
      'Nothing — the wars in Europe had nothing to do with the War of 1812',
      'Britain had to give up and surrender to America',
      'France joined the war to help America',
    ],
    simpleExplanation:
      'When the wars in Europe ended, Britain did not need soldiers there anymore. They sent thousands of experienced fighters to America. These soldiers burned Washington and attacked Baltimore and New Orleans.',
    roundRange: [8, 11],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_american_manufacturing',
    question: 'How did the British blockade unexpectedly benefit the American economy in the long term?',
    choices: [
      'It forced Americans to build their own factories, jumpstarting American manufacturing and industrialization',
      'It made American merchants richer by allowing them to charge higher prices',
      'It had no long-term economic effects on the United States',
      'It caused Americans to return to farming and abandon all trade',
    ],
    correctIndex: 0,
    explanation:
      'When the British blockade cut off imported manufactured goods, Americans had to make their own. Factories sprang up across New England and the Mid-Atlantic states. By war\'s end, American manufacturing had grown dramatically — laying the foundation for the Industrial Revolution in America. The war\'s disruption of trade permanently shifted the American economy toward domestic production.',
    simpleQuestion: 'What good thing happened because the British blocked American ports?',
    simpleChoices: [
      'Americans started building their own factories to make things they could no longer buy from other countries',
      'Merchants got richer by charging more money',
      'Nothing good happened — the blockade only caused problems',
      'Americans gave up on trade and went back to just farming',
    ],
    simpleExplanation:
      'When the British blocked the ports, Americans could not buy things from other countries. So they started building their own factories to make those things. This was the beginning of American manufacturing.',
    roundRange: [9, 12],
    reward: { type: 'nationalism', count: 2, description: '+2 Nationalism' },
  },
  {
    id: 'kc_war_of_1812_memory',
    question: 'How is the War of 1812 remembered differently by Americans, Canadians, and Native peoples?',
    choices: [
      'Americans see it as a "second independence"; Canadians as the defense of their homeland; Native peoples as a catastrophic loss of sovereignty',
      'All three groups remember it exactly the same way',
      'Only Americans remember the war — Canadians and Native peoples have forgotten it',
      'Everyone agrees that the British won the war decisively',
    ],
    correctIndex: 0,
    explanation:
      'The War of 1812 is remembered very differently by each group. Americans celebrate it as a "second war of independence" that confirmed their sovereignty. Canadians see it as the war that saved their country from American invasion and forged national identity. For Native peoples, it was a catastrophic turning point — the end of British military support and the beginning of accelerated dispossession and removal.',
    simpleQuestion: 'Do Americans, Canadians, and Native peoples remember the War of 1812 the same way?',
    simpleChoices: [
      'No — Americans see it as a win, Canadians as saving their country, and Native peoples as a terrible loss',
      'Yes — everyone remembers it the same way',
      'Only Americans remember the war at all',
      'Everyone agrees that Britain won the war',
    ],
    simpleExplanation:
      'Each group remembers the war differently. Americans see it as proving they were truly free. Canadians see it as saving their country. For Native peoples, it was a disaster — they lost British help and then lost more and more of their land.',
    roundRange: [10, 12],
    reward: { type: 'nationalism', count: 3, description: '+3 Nationalism' },
    required: true,
  },
  {
    id: 'kc_chryslers_farm',
    question: 'What was the significance of the Battle of Crysler\'s Farm in November 1813?',
    choices: [
      'Along with Chateauguay, it ended the American campaign to capture Montreal',
      'It was the first time the American navy defeated the British on a river',
      'It led to the immediate British surrender of Upper Canada',
      'It was where Andrew Jackson first gained fame as a military leader',
    ],
    correctIndex: 0,
    explanation:
      'At Crysler\'s Farm on November 11, 1813, about 800 British regulars defeated over 2,500 Americans. Combined with de Salaberry\'s victory at Chateauguay two weeks earlier, the twin defeats ended the American campaign to capture Montreal — Canada\'s most important city.',
    simpleQuestion: 'Why was the Battle of Crysler\'s Farm important?',
    simpleChoices: [
      'Together with another battle, it stopped the Americans from taking Montreal',
      'It was the first time Americans won a battle on a river',
      'It made the British surrender Upper Canada',
      'It was where Andrew Jackson became famous',
    ],
    simpleExplanation:
      'At Crysler\'s Farm, a small British force beat a much bigger American army. This battle plus the Battle of Chateauguay two weeks before meant the Americans could not capture Montreal.',
    roundRange: [6, 9],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_enslaved_escape_routes',
    question: 'How did enslaved people reach British lines during the War of 1812?',
    choices: [
      'They fled at night through swamps and forests to British ships anchored in the Chesapeake Bay and coastal waterways',
      'The British army invaded plantations and freed all enslaved people',
      'The U.S. government organized a formal exchange program with Britain',
      'Enslaved people were transported on American merchant ships',
    ],
    correctIndex: 0,
    explanation:
      'Enslaved people risked their lives escaping to British ships, often fleeing at night through swamps, forests, and waterways. British ships anchored in the Chesapeake Bay and along the coast served as beacons of freedom. Roughly 3,000-5,000 people escaped slavery this way. The journey was extremely dangerous — those caught faced brutal punishment or sale to the Deep South.',
    simpleQuestion: 'How did enslaved people get to the British during the war?',
    simpleChoices: [
      'They ran away at night through swamps and forests to reach British ships on the coast',
      'The British army attacked farms and freed everyone',
      'The U.S. government sent them to the British as part of a deal',
      'They traveled on American trading ships',
    ],
    simpleExplanation:
      'Enslaved people escaped at night, traveling through dangerous swamps and forests to reach British ships. Between 3,000 and 5,000 people escaped this way. It was very dangerous — if they were caught, they would be severely punished.',
    roundRange: [6, 10],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
    required: true,
  },
  {
    id: 'kc_frontier_warfare',
    question: 'How did frontier warfare during the War of 1812 differ from European-style battles?',
    choices: [
      'It relied on ambushes, raids, and guerrilla tactics rather than formations and open-field battles',
      'It was fought entirely on horseback using cavalry charges',
      'Both sides always followed formal European rules of engagement',
      'Frontier warfare used only naval combat on rivers and lakes',
    ],
    correctIndex: 0,
    explanation:
      'Frontier warfare looked nothing like European battles. Instead of neat formations on open fields, fighting in the forests and frontier involved ambushes, raids, and guerrilla tactics. Native warriors excelled at this style of warfare, using the terrain and surprise to offset their smaller numbers. This forced both the British and Americans to adapt their tactics.',
    simpleQuestion: 'How was fighting on the frontier different from fighting in Europe?',
    simpleChoices: [
      'It used surprise attacks and hiding in forests instead of standing in lines on open fields',
      'Everyone fought on horseback',
      'Both sides always followed the same rules as in Europe',
      'All the fighting was on rivers and lakes',
    ],
    simpleExplanation:
      'Fighting on the frontier was very different from Europe. Instead of standing in neat lines on open fields, soldiers hid in forests and used surprise attacks. Native warriors were very good at this kind of fighting.',
    roundRange: [3, 8],
    reward: { type: 'troops', count: 1, description: '+1 reinforcement troop' },
  },
  {
    id: 'kc_war_opposition_voices',
    question: 'Which groups most strongly opposed the War of 1812, and why?',
    choices: [
      'Federalists, New England merchants, and Quakers — they feared economic ruin, opposed expansion, or held religious objections to war',
      'Southern plantation owners who worried about losing enslaved workers',
      'Western frontier settlers who feared Native attacks',
      'The U.S. military officer corps who doubted they could win',
    ],
    correctIndex: 0,
    explanation:
      'The Federalist Party, New England merchants, and Quaker religious communities were the strongest opponents of the war. Federalists feared the war would ruin trade and strengthen their Republican political rivals. Merchants faced financial ruin from the British blockade. Quakers opposed all war on religious principles. This opposition led to the Hartford Convention, where some delegates discussed secession.',
    simpleQuestion: 'Who most strongly opposed the War of 1812?',
    simpleChoices: [
      'The Federalist political party, business owners in New England, and Quakers who were against all wars',
      'Southern farm owners who worried about losing workers',
      'People on the frontier who feared being attacked',
      'Army leaders who thought they could not win',
    ],
    simpleExplanation:
      'The Federalist Party, New England merchants, and Quakers were most against the war. Federalists thought the war was bad for business. Merchants were losing money. Quakers believed all war was wrong.',
    roundRange: [5, 10],
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
    shuffleIndices: indices,
  };
}

export default knowledgeChecks;
