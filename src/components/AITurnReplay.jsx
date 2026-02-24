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

  const getActionLine = (action) => {
    if (!action) return '';
    switch (action.type) {
      case 'reinforce':
        return `Reinforced ${action.territory} (+${action.troops})`;
      case 'attack': {
        const won = action.result === 'captured' || action.result === 'won';
        const result = won ? 'Captured!' : 'Repelled';
        const casualties = action.casualties
          ? ` (lost ${action.casualties.attacker || 0}, killed ${action.casualties.defender || 0})`
          : '';
        return `${action.from} \u2192 ${action.to}: ${result}${casualties}`;
      }
      case 'maneuver':
        return `${action.from} \u2192 ${action.to}: moved ${action.troops}`;
      default:
        return action.message || 'Unknown action';
    }
  };

  const getActionIcon = (action) => {
    if (!action) return '\u2022';
    switch (action.type) {
      case 'reinforce': return '\u2694';
      case 'attack': {
        const won = action.result === 'captured' || action.result === 'won';
        return won ? '\uD83C\uDFF4' : '\uD83D\uDEE1\uFE0F';
      }
      case 'maneuver': return '\u2192';
      default: return '\u2022';
    }
  };

  const getResultColor = (action) => {
    if (!action) return 'text-parchment/80';
    if (action.type === 'attack') {
      const won = action.result === 'captured' || action.result === 'won';
      return won ? 'text-red-400' : 'text-green-400';
    }
    if (action.type === 'reinforce') return 'text-red-300/80';
    return 'text-parchment/80';
  };

  if (totalSteps === 0) {
    return null;
  }

  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="absolute bottom-0 left-0 right-0 animate-fadein" style={{ zIndex: 50 }}>
      {/* Progress bar at top edge */}
      <div className="h-1 bg-war-ink/80">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${progressPercent}%`, background: 'linear-gradient(to right, #854d0e, #c9a227)' }}
        />
      </div>

      {/* Panel body */}
      <div className="bg-war-navy/95 backdrop-blur border-t border-war-gold/20 px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Label + counter */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/80 flex-shrink-0" />
            <span className="text-red-400/80 text-xs tracking-[0.15em] uppercase font-body font-bold hidden sm:inline">Intel</span>
            <span className="text-parchment-dark/50 text-xs font-body">{currentStep + 1}/{totalSteps}</span>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-parchment-dark/15 flex-shrink-0" />

          {/* Action icon + description */}
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className="text-sm flex-shrink-0">{getActionIcon(currentAction)}</span>
            <p className={`text-sm font-body truncate ${getResultColor(currentAction)}`}>
              {getActionLine(currentAction)}
            </p>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-parchment-dark/15 flex-shrink-0" />

          {/* Controls */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-colors ${
                currentStep === 0
                  ? 'text-parchment-dark/20 cursor-not-allowed'
                  : 'text-parchment/60 hover:text-parchment hover:bg-white/5 cursor-pointer'
              }`}
              aria-label="Previous action"
            >
              &#x25C0;
            </button>

            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-colors cursor-pointer ${
                autoPlay
                  ? 'text-war-gold bg-war-gold/15 border border-war-gold/30'
                  : 'text-parchment/60 hover:text-war-gold hover:bg-war-gold/10'
              }`}
              aria-label={autoPlay ? 'Pause auto-play' : 'Auto-play'}
              title={autoPlay ? 'Pause' : 'Auto'}
            >
              {autoPlay ? '\u23F8' : '\u25B6'}
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep >= totalSteps - 1}
              className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-colors ${
                currentStep >= totalSteps - 1
                  ? 'text-parchment-dark/20 cursor-not-allowed'
                  : 'text-parchment/60 hover:text-parchment hover:bg-white/5 cursor-pointer'
              }`}
              aria-label="Next action"
            >
              &#x25B6;
            </button>

            {/* Divider before close/continue */}
            <div className="w-px h-6 bg-parchment-dark/15 mx-0.5" />

            <button
              onClick={onClose}
              className={`px-3 py-1.5 font-display text-xs rounded tracking-wide transition-colors cursor-pointer ${
                currentStep >= totalSteps - 1
                  ? 'bg-war-gold text-war-ink hover:bg-war-brass font-bold shadow-copper'
                  : 'text-parchment-dark/50 hover:text-parchment border border-parchment-dark/20 hover:border-parchment-dark/40'
              }`}
            >
              {currentStep >= totalSteps - 1 ? 'Done' : 'Skip'}
            </button>
          </div>
        </div>

        {/* Summary row */}
        <div className="mt-1.5 flex items-center gap-3">
          <p className="text-xs text-parchment-dark/30 font-body">
            {aiActions.filter((a) => a.type === 'attack').length} attacks, {aiActions.filter((a) => a.type === 'reinforce').length} reinforcements
            {aiActions.filter((a) => a.type === 'maneuver').length > 0 && (
              <>, {aiActions.filter((a) => a.type === 'maneuver').length} maneuvers</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
