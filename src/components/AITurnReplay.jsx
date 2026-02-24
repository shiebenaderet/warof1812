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
            <p className="text-lg font-bold text-parchment font-display mb-2 tracking-wide">
              Reinforced {action.territory}
            </p>
            <p className="text-parchment-dark/70 font-body">
              Added {action.troops} {action.troops === 1 ? 'troop' : 'troops'}
            </p>
          </div>
        );

      case 'attack':
        const won = action.result === 'captured' || action.result === 'won';
        return (
          <div>
            <p className="text-lg font-bold text-parchment font-display mb-2 tracking-wide">
              Attacked {action.to} from {action.from}
            </p>
            <p className={`font-body font-bold ${won ? 'text-green-400' : 'text-red-400'}`}>
              {action.result === 'captured' && 'Territory Captured!'}
              {action.result === 'won' && 'Defenders Eliminated!'}
              {action.result === 'repelled' && 'Attack Repelled'}
              {action.result === 'failed' && 'Attack Failed'}
            </p>
            {action.casualties && (
              <div className="mt-2 text-sm text-parchment-dark/60 font-body">
                <p>Attacker losses: {action.casualties.attacker || 0}</p>
                <p>Defender losses: {action.casualties.defender || 0}</p>
              </div>
            )}
          </div>
        );

      case 'maneuver':
        return (
          <div>
            <p className="text-lg font-bold text-parchment font-display mb-2 tracking-wide">
              Moved Troops
            </p>
            <p className="text-parchment-dark/70 font-body">
              {action.from} &rarr; {action.to}: {action.troops} {action.troops === 1 ? 'troop' : 'troops'}
            </p>
          </div>
        );

      default:
        return <p className="text-parchment font-body">{action.message || 'Unknown action'}</p>;
    }
  };

  if (totalSteps === 0) {
    return null;
  }

  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 1000 }}>
      <div className="bg-war-navy border border-war-gold/30 rounded-lg max-w-2xl w-full shadow-modal animate-fadein">
        {/* Header */}
        <div className="px-6 py-4 border-b border-war-gold/20" style={{
          background: 'linear-gradient(135deg, rgba(139,26,26,0.3) 0%, rgba(20,30,48,0.95) 100%)',
        }}>
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                <p className="text-red-400/80 text-xs tracking-[0.2em] uppercase font-body font-bold">Intelligence Report</p>
              </div>
              <h2 className="text-parchment font-display text-lg tracking-wide">Opponent Turn Review</h2>
            </div>
            <button
              onClick={onClose}
              className="text-parchment-dark/40 hover:text-parchment text-xl transition-colors cursor-pointer"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>

        <div className="px-6 py-5">
          {/* Progress bar */}
          <div className="mb-5">
            <div className="flex justify-between text-xs text-parchment-dark/50 mb-1.5 font-body">
              <span>Action {currentStep + 1} of {totalSteps}</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-war-ink rounded-full h-2 border border-parchment-dark/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%`, background: 'linear-gradient(to right, #854d0e, #c9a227)' }}
              />
            </div>
          </div>

          {/* Action content */}
          <div className="bg-black/20 rounded px-6 py-5 mb-5 min-h-[120px] border-l-2 border-war-copper/30">
            {getActionDescription(currentAction)}
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-4 py-2.5 font-display text-sm rounded tracking-wide transition-colors ${
                currentStep === 0
                  ? 'bg-war-ink/50 text-parchment-dark/30 cursor-not-allowed'
                  : 'border border-parchment-dark/20 text-parchment/70 hover:border-war-gold/40 hover:text-parchment cursor-pointer'
              }`}
            >
              Previous
            </button>

            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className="px-4 py-2.5 font-display text-sm rounded bg-war-gold/20 text-war-gold border border-war-gold/30
                         hover:bg-war-gold/30 cursor-pointer transition-colors tracking-wide"
            >
              {autoPlay ? 'Pause' : 'Auto Play'}
            </button>

            {currentStep < totalSteps - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2.5 font-display text-sm rounded border border-parchment-dark/20 text-parchment/70
                           hover:border-war-gold/40 hover:text-parchment cursor-pointer transition-colors tracking-wide"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2.5 font-display text-sm rounded bg-war-gold text-war-ink
                           hover:bg-war-brass cursor-pointer transition-colors font-bold tracking-wide shadow-copper"
              >
                Continue
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="px-6 pb-4">
          <div className="pt-3 border-t border-parchment-dark/10">
            <p className="text-xs text-parchment-dark/40 text-center font-body">
              Total: {aiActions.filter((a) => a.type === 'attack').length} attacks,{' '}
              {aiActions.filter((a) => a.type === 'reinforce').length} reinforcements
              {aiActions.filter((a) => a.type === 'maneuver').length > 0 && (
                <>, {aiActions.filter((a) => a.type === 'maneuver').length} maneuvers</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
