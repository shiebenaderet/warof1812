/**
 * Pre-game comprehension quiz — 8 questions tied to Learning Mode sections.
 * Students must answer each correctly (retry until correct) before playing.
 */

const quizGateQuestions = [
  {
    id: 'qg1',
    section: 1,
    question: 'What was impressment?',
    simpleQuestion: 'What did "impressment" mean?',
    answers: [
      'Forcing American sailors to serve in the British Navy',
      'A tax Britain placed on American goods',
      'A treaty between Britain and France',
      'A type of naval battle formation',
    ],
    correctIndex: 0,
    explanation: 'Impressment was the British practice of stopping American ships and forcing sailors to serve in the Royal Navy. Britain claimed the right to take anyone they considered a British subject, and thousands of American sailors were taken this way.',
    simpleExplanation: 'Impressment means the British grabbed American sailors from their ships and made them work on British ships. This happened to thousands of Americans and made people very angry.',
  },
  {
    id: 'qg2',
    section: 2,
    question: 'Why was the congressional vote to declare war so close?',
    simpleQuestion: 'Why did so many people in Congress vote against the war?',
    answers: [
      'The country was divided — New England merchants depended on trade with Britain',
      'Most Americans did not know who Britain was',
      'Congress had not yet been formed in 1812',
      'The President vetoed the declaration of war',
    ],
    correctIndex: 0,
    explanation: 'The war vote (79-49 in the House, 19-13 in the Senate) was the closest in American history. New England merchants opposed the war because they profited from trade with Britain, while the South and West supported it.',
    simpleExplanation: 'Many people in New England did not want war because they made money trading with Britain. People in the South and West wanted war because they were angry about impressment and wanted more land.',
  },
  {
    id: 'qg3',
    section: 3,
    question: 'Why was the USS Constitution nicknamed "Old Ironsides"?',
    simpleQuestion: 'Why did people call the USS Constitution "Old Ironsides"?',
    answers: [
      'British cannonballs bounced off its thick oak hull',
      'It was built entirely from iron',
      'Its captain was named Ironsides',
      'It was the oldest ship in the American fleet',
    ],
    correctIndex: 0,
    explanation: 'During its battle with HMS Guerriere, British cannonballs appeared to bounce off the Constitution\'s thick live-oak hull. Sailors shouted "Huzza! Her sides are made of iron!" and the nickname stuck.',
    simpleExplanation: 'When British cannonballs bounced right off the ship\'s thick wooden walls, people started calling it "Old Ironsides" because it seemed like the ship was made of iron.',
  },
  {
    id: 'qg4',
    section: 4,
    question: 'What was Tecumseh trying to build?',
    simpleQuestion: 'What was Tecumseh\'s big plan?',
    answers: [
      'A confederacy of Native tribes to resist American expansion',
      'A new capital city for the United States',
      'A fleet of warships on the Great Lakes',
      'A trade agreement with France',
    ],
    correctIndex: 0,
    explanation: 'Tecumseh, a Shawnee leader, traveled thousands of miles to unite Native tribes into a single confederacy strong enough to stop American settlers from taking their lands. He allied with Britain because they promised to help create an independent Native state.',
    simpleExplanation: 'Tecumseh wanted to bring all the Native tribes together into one big group. Together they would be strong enough to stop Americans from taking their land.',
  },
  {
    id: 'qg5',
    section: 5,
    question: 'Why was the Battle of Lake Erie a turning point in the war?',
    simpleQuestion: 'Why was winning the battle on Lake Erie so important?',
    answers: [
      'American control of the lake cut off British supply lines to Detroit',
      'It was the first time the British surrendered to Americans',
      'The battle destroyed all British ships in North America',
      'It led directly to the signing of the peace treaty',
    ],
    correctIndex: 0,
    explanation: 'Perry\'s victory gave America control of Lake Erie, which cut off British supply routes to Detroit and the entire western frontier. This forced the British to retreat into Canada, where Tecumseh was killed at the Battle of the Thames.',
    simpleExplanation: 'When Perry won on Lake Erie, the British could no longer send food and supplies to their soldiers at Detroit. They had to run away into Canada.',
  },
  {
    id: 'qg6',
    section: 6,
    question: 'What event inspired Francis Scott Key to write "The Star-Spangled Banner"?',
    simpleQuestion: 'What made Francis Scott Key write "The Star-Spangled Banner"?',
    answers: [
      'Watching Fort McHenry survive a night-long British bombardment',
      'Seeing the White House burn down',
      'Watching the Battle of New Orleans',
      'Hearing about the Treaty of Ghent',
    ],
    correctIndex: 0,
    explanation: 'British ships bombarded Fort McHenry in Baltimore Harbor all night. At dawn, Key saw the American flag still flying over the fort — proving the defenders had held. He wrote the poem that became the national anthem.',
    simpleExplanation: 'The British fired bombs at Fort McHenry all night long. In the morning, the American flag was still flying. Francis Scott Key saw this and wrote a poem about it that became our national anthem.',
  },
  {
    id: 'qg7',
    section: 8,
    question: 'What did the Treaty of Ghent actually change?',
    simpleQuestion: 'What changed because of the peace treaty?',
    answers: [
      'Nothing — borders returned to pre-war lines (status quo ante bellum)',
      'Britain gave Canada to the United States',
      'The United States paid Britain for war damages',
      'Native Americans received a protected homeland',
    ],
    correctIndex: 0,
    explanation: 'The Treaty of Ghent restored everything to pre-war conditions — no territory changed hands. "Status quo ante bellum" means "the way things were before the war." Native Americans were the biggest losers — the treaty said nothing about protecting their lands.',
    simpleExplanation: 'The treaty changed nothing on the map. Everything went back to how it was before the war. No one gained any land. The Latin words "status quo ante bellum" mean "back to how things were."',
  },
  {
    id: 'qg8',
    section: 9,
    question: 'How did approximately 4,000 enslaved people seek freedom during the war?',
    simpleQuestion: 'How did about 4,000 enslaved people try to become free during the war?',
    answers: [
      'They escaped to British lines, where they were offered freedom',
      'They signed petitions and sent them to Congress',
      'President Madison freed them by executive order',
      'They moved to Canada before the war started',
    ],
    correctIndex: 0,
    explanation: 'About 4,000 enslaved people escaped to British ships and camps, where they were offered freedom. Some joined the Colonial Marines and fought against their former enslavers. After the war, Britain resettled most in Nova Scotia and Trinidad.',
    simpleExplanation: 'About 4,000 enslaved people ran away to the British side. The British promised them freedom. Some even joined the British army and fought. After the war, Britain helped them start new lives in Canada and the Caribbean.',
  },
];

export default quizGateQuestions;
