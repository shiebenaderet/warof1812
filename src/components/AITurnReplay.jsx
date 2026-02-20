import React, { useState, useEffect } from 'react';

export default function AITurnReplay({ aiActions, onClose, onHighlightTerritory }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const totalSteps = aiActions.length;
  const currentAction = aiActions[currentStep];

  // Auto-advance when autoPlay is enabled
  useEffect(() => {
    if (!autoPlay || currentStep >= totalSteps - 1) return;

    const timer = setTimeout(() => {
      setCurrentStep((s) => s + 1);
    }, 1500);

    return () => clearTimeout(timer);
  }, [autoPlay, currentStep, totalSteps]);

  // Highlight territories involved in current action
  useEffect(() => {
    if (!currentAction) return;

    const territories = [];
    if (currentAction.from) territories.push(currentAction.from);
    if (currentAction.to) territories.push(currentAction.to);
    if (currentAction.territory) territories.push(currentAction.territory);

    onHighlightTerritory(territories);

    return () => onHighlightTerritory([]);
  }, [currentAction, onHighlightTerritory]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const getActionDescription = (action) => {
    switch (action.type) {
      case 'reinforce':
        return (
          <div>
            <p className="text-lg font-bold text-parchment mb-2">
              Reinforced {action.territory}
            </p>
            <p className="text-parchment-dark">
              Added {action.troops} {action.troops === 1 ? 'troop' : 'troops'}
            </p>
          </div>
        );

      case 'attack':
        const won = action.result === 'captured' || action.result === 'won';
        return (
          <div>
            <p className="text-lg font-bold text-parchment mb-2">
              Attacked {action.to} from {action.from}
            </p>
            <p className={won ? 'text-green-400' : 'text-red-400'}>
              {action.result === 'captured' && '✓ Territory Captured!'}
              {action.result === 'won' && '✓ Defenders Eliminated!'}
              {action.result === 'repelled' && '✗ Attack Repelled'}
              {action.result === 'failed' && '✗ Attack Failed'}
            </p>
            {action.casualties && (
              <div className="mt-2 text-sm text-parchment-dark">
                <p>Attacker losses: {action.casualties.attacker || 0}</p>
                <p>Defender losses: {action.casualties.defender || 0}</p>
              </div>
            )}
          </div>
        );

      case 'maneuver':
        return (
          <div>
            <p className="text-lg font-bold text-parchment mb-2">
              Moved Troops
            </p>
            <p className="text-parchment-dark">
              {action.from} → {action.to}: {action.troops} {action.troops === 1 ? 'troop' : 'troops'}
            </p>
          </div>
        );

      default:
        return <p className="text-parchment">{action.message || 'Unknown action'}</p>;
    }
  };

  if (totalSteps === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-war-navy border-4 border-war-gold rounded-xl max-w-2xl w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-war-gold font-serif">Opponent Turn Review</h2>
          <button
            onClick={onClose}
            className="text-parchment hover:text-war-gold text-2xl font-bold"
            title="Close"
          >
            ×
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-parchment-dark mb-1">
            <span>Action {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-war-gold h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Action content */}
        <div className="bg-black bg-opacity-30 rounded-lg p-6 mb-4 min-h-[120px]">
          {getActionDescription(currentAction)}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-4 py-2 font-serif rounded-lg transition-colors ${
              currentStep === 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-parchment-dark text-war-navy hover:bg-parchment cursor-pointer'
            }`}
          >
            ← Previous
          </button>

          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className="px-4 py-2 font-serif rounded-lg bg-war-gold text-war-navy hover:bg-yellow-500 cursor-pointer"
          >
            {autoPlay ? '⏸ Pause' : '▶ Auto Play'}
          </button>

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 font-serif rounded-lg bg-parchment-dark text-war-navy hover:bg-parchment cursor-pointer"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 font-serif rounded-lg bg-war-gold text-war-navy hover:bg-yellow-500 cursor-pointer font-bold"
            >
              Continue ✓
            </button>
          )}
        </div>

        {/* Summary at bottom */}
        <div className="mt-4 pt-4 border-t border-parchment-dark border-opacity-30">
          <p className="text-sm text-parchment-dark text-center">
            Total: {aiActions.filter((a) => a.type === 'attack').length} attacks,{' '}
            {aiActions.filter((a) => a.type === 'reinforce').length} reinforcements
          </p>
        </div>
      </div>
    </div>
  );
}
