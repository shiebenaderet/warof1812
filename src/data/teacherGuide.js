/**
 * Teacher Guide Content for War of 1812: Rise of the Nation
 *
 * Structured content for a standalone teacher guide page.
 * Covers setup, learning objectives, standards, facilitation, and assessment.
 */

export const teacherGuide = {
  overview: {
    title: 'About This Game',
    content: 'War of 1812: Rise of the Nation is a turn-based strategy game designed for 8th-grade U.S. History classrooms. Students choose a faction (United States, British/Canada, or Native Coalition), manage territories on an interactive map, and make strategic decisions while learning about the causes, events, and consequences of the War of 1812. The game integrates knowledge check questions, historical event cards, and primary source materials into gameplay.',
    targetAudience: '8th-grade U.S. History students',
    duration: '2-3 class periods (45-90 minutes each)',
    players: 'Individual play against AI opponent',
  },

  learningObjectives: {
    title: 'Learning Objectives',
    objectives: [
      {
        id: 'lo1',
        text: 'Analyze the political, economic, and social causes of the War of 1812',
        assessedBy: 'Knowledge checks (Rounds 1-4), Learning Mode pre-game content',
      },
      {
        id: 'lo2',
        text: 'Evaluate the roles of key military and political leaders from multiple perspectives',
        assessedBy: 'People Profiles, Leader abilities in gameplay, Knowledge checks',
      },
      {
        id: 'lo3',
        text: 'Examine the war\'s impact on diverse groups including women, African Americans, and Native Americans',
        assessedBy: 'Required knowledge checks on diverse perspectives, People Profiles "Other Voices"',
      },
      {
        id: 'lo4',
        text: 'Analyze the geographic factors that influenced military strategy and outcomes',
        assessedBy: 'Interactive map gameplay, territory control decisions, Learning Mode geography section',
      },
      {
        id: 'lo5',
        text: 'Connect the War of 1812 to broader themes in American history including nationalism, expansion, and Native displacement',
        assessedBy: '"What Came Next" post-game section, Historian\'s Analysis, Treaty of Ghent knowledge checks',
      },
      {
        id: 'lo6',
        text: 'Interpret primary source documents and excerpts in historical context',
        assessedBy: 'People Profiles primary sources, Learning Mode source excerpts, Event cards',
      },
    ],
  },

  standards: {
    title: 'Standards Alignment',
    framework: 'C3 Framework for Social Studies',
    alignments: [
      {
        code: 'D2.His.1.6-8',
        description: 'Analyze connections among events and developments in broader historical contexts.',
        gameConnection: 'Event cards show cause-and-effect chains; "What Came Next" connects to later history',
      },
      {
        code: 'D2.His.3.6-8',
        description: 'Use questions generated about individuals and groups to analyze why they, and the developments they shaped, are seen as historically significant.',
        gameConnection: 'People Profiles explore significance of leaders and ordinary people alike',
      },
      {
        code: 'D2.His.4.6-8',
        description: 'Analyze multiple factors that influenced the perspectives of people during different historical eras.',
        gameConnection: 'Three playable factions offer different perspectives; diverse knowledge checks',
      },
      {
        code: 'D2.His.5.6-8',
        description: 'Explain how and why perspectives of people have changed over time.',
        gameConnection: 'Historian\'s Analysis compares student outcomes to historical reality',
      },
      {
        code: 'D2.His.14.6-8',
        description: 'Explain multiple causes and effects of events and developments in the past.',
        gameConnection: 'Learning Mode cause/effect sections; event card consequences',
      },
      {
        code: 'D2.Geo.4.6-8',
        description: 'Explain how cultural patterns and economic decisions influence environments and the daily lives of people.',
        gameConnection: 'Territory control, resource management, geographic strategy on the map',
      },
    ],
  },

  classroomSetup: {
    title: 'Classroom Setup',
    sections: [
      {
        heading: 'Technology Requirements',
        items: [
          'Any device with a modern web browser (Chrome, Firefox, Safari, Edge)',
          'Internet connection for initial page load (game runs client-side after loading)',
          'Internet connection for leaderboard features (optional — game works offline)',
          'Works on Chromebooks, iPads, laptops, and desktop computers',
          'No installation or account creation required',
        ],
      },
      {
        heading: 'Before Class',
        items: [
          'Test the game URL on your school\'s network to ensure it loads',
          'Decide whether to assign factions or let students choose',
          'Consider having students complete the Learning Mode as homework before gameplay',
          'Create your teacher account at #teacher (sign in with email)',
          'Prepare discussion questions for post-game reflection',
        ],
      },
      {
        heading: 'Suggested Grouping Options',
        items: [
          'Individual play: Each student plays against the AI on their own device',
          'Partner play: Pairs collaborate on strategy decisions together',
          'Faction groups: Assign the same faction to a group, compare strategies afterward',
          'Jigsaw: Each group plays a different faction, then presents their faction\'s perspective',
        ],
      },
    ],
  },

  howToPlay: {
    title: 'How to Play',
    phases: [
      {
        name: 'Event Phase',
        description: 'A historical event card appears, describing a real event from the War of 1812. The event may affect troop counts, territory control, or available resources. Students read the event and consider its historical significance.',
      },
      {
        name: 'Allocate Phase',
        description: 'Students place reinforcement troops on their territories. Strategic decisions include whether to reinforce frontline territories or build reserves. The number of reinforcements depends on territories controlled and leader bonuses.',
      },
      {
        name: 'Battle Phase',
        description: 'Students can attack adjacent enemy territories. Combat uses a dice-based system modified by leader abilities, troop numbers, and terrain. Students must weigh risk vs. reward — attacking with too few troops is risky.',
      },
      {
        name: 'Maneuver Phase',
        description: 'Students can move troops between their own adjacent territories to reposition for defense or prepare future attacks.',
      },
      {
        name: 'Score Phase',
        description: 'Points are tallied based on territories controlled. The AI opponent then takes its turn. Knowledge check questions may appear, testing understanding of historical content.',
      },
    ],
    victoryConditions: [
      { type: 'Domination', description: 'Control 75% or more of all territories' },
      { type: 'Elimination', description: 'Eliminate all enemy factions from the map' },
      { type: 'Treaty', description: 'After 12 rounds, the Treaty of Ghent ends the war. Highest score wins.' },
    ],
  },

  facilitation: {
    title: 'Facilitation Tips',
    tips: [
      {
        heading: 'Introduce the Learning Mode First',
        content: 'Have students complete the Learning Mode before playing. This 5-10 minute overview covers the war\'s causes, key events, and outcomes. Students who complete it perform significantly better on in-game knowledge checks.',
      },
      {
        heading: 'Encourage the People Profiles',
        content: 'The People of 1812 gallery (accessible from the main menu) introduces students to historical figures beyond the military leaders. Assign specific profiles as reading before or after gameplay.',
      },
      {
        heading: 'Debrief Faction Perspectives',
        content: 'After gameplay, ask students to compare experiences across factions. What was different about playing as the Native Coalition vs. the United States? This naturally leads to discussions about perspective and bias.',
      },
      {
        heading: 'Use Knowledge Checks as Formative Assessment',
        content: 'The Teacher Dashboard shows each student\'s quiz performance. Use this data to identify content areas that need additional instruction. Required questions ensure all students encounter diverse perspectives.',
      },
      {
        heading: 'Connect to the "What Came Next" Section',
        content: 'The post-game "What Came Next" section links the war to the Era of Good Feelings, Indian Removal, Manifest Destiny, and other topics in your curriculum. Use this as a bridge to your next unit.',
      },
      {
        heading: 'Address Historical Sensitivity',
        content: 'The game deals with topics including slavery, Native displacement, and military violence. Preview the content and prepare students for sensitive material. The game treats these topics with historical accuracy and respect.',
      },
    ],
  },

  assessment: {
    title: 'Assessment Ideas',
    formative: [
      'Monitor Knowledge Check scores on the Teacher Dashboard during gameplay',
      'Circulate during gameplay to ask students about their strategic decisions and historical reasoning',
      'Use exit tickets asking students to name one thing they learned about a group they hadn\'t considered before',
      'Have students identify one decision they made in the game that paralleled a real historical decision',
    ],
    summative: [
      'Written reflection: "Choose one faction and explain how the war looked different from their perspective"',
      'Primary source analysis using quotes from the People Profiles',
      'Compare/contrast essay: "How did the War of 1812 affect two different groups in American society?"',
      'Create a timeline connecting the war to three events that happened afterward (using "What Came Next" as a starting point)',
      'Debate: "Who really won the War of 1812?" — students argue from their faction\'s perspective using evidence from gameplay',
    ],
  },

  discussionQuestions: {
    title: 'Discussion Questions',
    questions: [
      {
        question: 'The War of 1812 is sometimes called "the war nobody won." Do you agree? What evidence supports or challenges this claim?',
        category: 'Analysis',
      },
      {
        question: 'How did the War of 1812 affect Native American nations differently than the United States or Britain?',
        category: 'Perspective',
      },
      {
        question: 'Why do you think the Treaty of Ghent\'s promise to restore Native lands was never honored? What does this tell us about treaty-making?',
        category: 'Critical Thinking',
      },
      {
        question: 'How did women like Dolley Madison, Mary Pickersgill, and Laura Secord contribute to the war effort? Why are their stories often overlooked?',
        category: 'Perspective',
      },
      {
        question: 'About 4,000 enslaved people escaped to British lines during the war. What does this tell us about how enslaved people viewed the conflict?',
        category: 'Critical Thinking',
      },
      {
        question: 'Andrew Jackson became president because of his war fame, then signed the Indian Removal Act. How do you think his wartime experiences shaped his policies?',
        category: 'Connection',
      },
      {
        question: 'The burning of York (Toronto) led to the burning of Washington D.C. How does retaliation escalate conflicts? Can you think of modern examples?',
        category: 'Connection',
      },
      {
        question: 'How did geography influence the war\'s outcome? Why were the Great Lakes, the Chesapeake Bay, and New Orleans so important?',
        category: 'Analysis',
      },
    ],
  },

  faq: {
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'How long does a full game take?',
        answer: 'A complete game (12 rounds) takes 30-45 minutes. Students can save their progress and continue later.',
      },
      {
        question: 'Can students play against each other?',
        answer: 'Currently, the game is single-player against an AI opponent. Students can compare strategies and scores on the leaderboard.',
      },
      {
        question: 'Is the game historically accurate?',
        answer: 'Yes. All events, leaders, and knowledge check questions are based on historical research. The game simplifies some aspects for gameplay purposes but maintains historical integrity.',
      },
      {
        question: 'How do I access the Teacher Dashboard?',
        answer: 'Add #teacher to the game URL and sign in with your email. Create classes and share codes with students. The dashboard shows class-wide analytics, quiz scores, and exportable CSV data.',
      },
      {
        question: 'Does the game work offline?',
        answer: 'The game itself works after initial load, but the leaderboard and Teacher Dashboard require an internet connection.',
      },
      {
        question: 'Can I assign specific factions to students?',
        answer: 'Yes. Consider assigning different factions to create diverse perspectives for class discussion. The Native Coalition faction is particularly valuable for teaching perspective-taking.',
      },
    ],
  },
};

export default teacherGuide;
