import { useState, useCallback } from 'react';

const TUTORIAL_STEPS = [
  {
    title: 'Welcome, Commander!',
    description:
      'Welcome to War of 1812: Rise of the Nation! This brief tutorial will walk you through the game. You can revisit it anytime by clicking the "?" button in the header.',
    target: null,
  },
  {
    title: 'The War Board',
    description:
      'This is your war board. Each tile represents a territory from the War of 1812. The color of each tile shows which faction controls it: blue for the United States, red for the British, and brown for Native nations.',
    target: '[data-tutorial="map"]',
  },
  {
    title: 'Territory Tiles',
    description:
      'Click any territory to select it. Each tile shows the territory name, troop count (bottom-left badge), victory points (top-right star), and a fort icon if fortified. You can zoom in and out using the controls or your scroll wheel.',
    target: '[data-territory="detroit"]',
  },
  {
    title: 'Scoreboard',
    description:
      'Track scores for all three factions here. Your nationalism meter (US only) provides a score multiplier. The more territories you hold, the more points you earn each round.',
    target: '[data-tutorial="scoreboard"]',
  },
  {
    title: 'Your Leaders',
    description:
      'Your faction leaders provide combat bonuses in specific theaters. Keep them alive -- if they fall in battle, you lose their benefits!',
    target: '[data-tutorial="leaders"]',
  },
  {
    title: 'Objectives',
    description:
      'Complete faction-specific objectives for bonus victory points at the end of the war. Check your progress here throughout the game.',
    target: '[data-tutorial="objectives"]',
  },
  {
    title: 'Game Phases',
    description:
      'Each round has 5 phases: Event (draw a historical event), Allocate (place reinforcements), Battle (attack enemies), Maneuver (reposition troops), and Score (end your turn). The gold dot shows your current phase.',
    target: '[data-tutorial="phase-indicator"]',
  },
  {
    title: 'Battle Phase',
    description:
      'During battle, select one of your territories, then click an adjacent enemy territory to attack. Dice determine the outcome, with bonuses from forts and leaders. A knowledge check quiz may also appear!',
    target: '[data-tutorial="advance-btn"]',
  },
  {
    title: 'History Quiz',
    description:
      'Test your knowledge of the War of 1812! Quiz questions appear during battle phases, and you can also take them voluntarily from the sidebar. Correct answers earn bonus troops or nationalism points.',
    target: '[data-tutorial="knowledge-check"]',
  },
  {
    title: 'Ready for War!',
    description:
      'You are ready to lead your forces through 12 rounds of the War of 1812. Capture territories, complete objectives, and make history. Good luck, Commander!',
    target: null,
  },
];

const STORAGE_KEY = 'war1812_tutorial_completed';

export default function useTutorial() {
  const [tutorialActive, setTutorialActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const currentStepData = tutorialActive ? TUTORIAL_STEPS[currentStep] : null;
  const totalSteps = TUTORIAL_STEPS.length;

  const startTutorial = useCallback(() => {
    setCurrentStep(0);
    setTutorialActive(true);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setTutorialActive(false);
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const skipTutorial = useCallback(() => {
    setTutorialActive(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  const shouldAutoStart = useCallback(() => {
    return !localStorage.getItem(STORAGE_KEY);
  }, []);

  return {
    tutorialActive,
    currentStep,
    currentStepData,
    totalSteps,
    startTutorial,
    nextStep,
    prevStep,
    skipTutorial,
    shouldAutoStart,
  };
}
