/**
 * AI difficulty configuration overrides.
 * Medium values match current AI_CONFIG exactly (baseline).
 * Only parameters that differ from the base AI_CONFIG are listed per difficulty.
 */

export const DIFFICULTY_CONFIGS = {
  easy: {
    BASE_REINFORCEMENTS: 2,
    MAX_ATTACKS_PER_TURN: 2,
    MIN_ATTACK_PROBABILITY: 0.55,
    CONCENTRATION_RATIO: 0.2,
    TOP_N_ATTACK_CHOICES: 5,
    ATTACK_PROBABILITY_WEIGHT: 8,
    ATTACK_FORT_PENALTY: 5,
    MAX_TROOPS_TO_MOVE: 1,
    MAX_MANEUVERS: 1,
  },
  medium: {
    // No overrides — uses base AI_CONFIG values as-is
  },
  hard: {
    BASE_REINFORCEMENTS: 6,
    MAX_ATTACKS_PER_TURN: 7,
    MIN_ATTACK_PROBABILITY: 0.15,
    CONCENTRATION_RATIO: 0.6,
    TOP_N_ATTACK_CHOICES: 1,
    ATTACK_PROBABILITY_WEIGHT: 2,
    ATTACK_FORT_PENALTY: 1,
    MAX_TROOPS_TO_MOVE: 5,
    MAX_MANEUVERS: 5,
  },
};

export const DIFFICULTY_LABELS = {
  easy: { name: 'Learning', description: 'The AI takes it easy. Good for learning the game.' },
  medium: { name: 'Balanced', description: 'A fair challenge. The AI plays smart.' },
  hard: { name: 'Commander', description: 'The AI is aggressive and relentless. For experienced players.' },
};
