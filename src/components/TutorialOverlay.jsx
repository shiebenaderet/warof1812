import React, { useEffect, useState } from 'react';

function computeTooltipPosition(spotlightRect) {
  if (!spotlightRect) {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
  }

  const padding = 16;
  const tooltipHeight = 220;
  const tooltipWidth = 360;

  // Prefer positioning below the spotlight
  let top = spotlightRect.top + spotlightRect.height + padding;
  let left = spotlightRect.left + spotlightRect.width / 2 - tooltipWidth / 2;

  // If it would go off the bottom, position above
  if (top + tooltipHeight > window.innerHeight - padding) {
    top = spotlightRect.top - tooltipHeight - padding;
  }

  // Clamp to viewport
  if (top < padding) top = padding;
  if (left < padding) left = padding;
  if (left + tooltipWidth > window.innerWidth - padding) {
    left = window.innerWidth - tooltipWidth - padding;
  }

  return { top, left };
}

export default function TutorialOverlay({
  stepData,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  gameMode,
}) {
  const [spotlightRect, setSpotlightRect] = useState(null);
  const isExplorer = gameMode === 'explorer';

  useEffect(() => {
    if (!stepData?.target) {
      setSpotlightRect(null);
      return;
    }

    // Small delay to allow DOM to settle
    const timer = setTimeout(() => {
      const el = document.querySelector(stepData.target);
      if (el) {
        const rect = el.getBoundingClientRect();
        // If element is off-screen, center tooltip instead
        const offScreen =
          rect.right < 0 || rect.left > window.innerWidth ||
          rect.bottom < 0 || rect.top > window.innerHeight;
        if (offScreen) {
          setSpotlightRect(null);
          return;
        }
        setSpotlightRect({
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16,
        });
      } else {
        setSpotlightRect(null);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [stepData]);

  if (!stepData) return null;

  const tooltipPos = computeTooltipPosition(spotlightRect);
  const description = isExplorer && stepData.simpleDescription
    ? stepData.simpleDescription
    : stepData.description;

  return (
    <>
      {/* Dark backdrop */}
      <div
        className="tutorial-backdrop"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Spotlight cutout */}
      {spotlightRect && (
        <div
          className="tutorial-spotlight"
          style={{
            top: spotlightRect.top,
            left: spotlightRect.left,
            width: spotlightRect.width,
            height: spotlightRect.height,
          }}
        />
      )}

      {/* Tooltip */}
      <div className="tutorial-tooltip" style={tooltipPos}>
        <h3>{stepData.title}</h3>
        <p style={isExplorer ? { fontSize: '1rem', lineHeight: '1.75' } : undefined}>{description}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="text-parchment-dark/50 text-xs font-body">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {currentStep > 0 && (
              <button
                onClick={onPrev}
                className="px-3 py-1.5 text-xs border border-parchment-dark/20 text-parchment-dark/60 rounded
                           hover:border-war-gold/40 hover:text-war-gold transition-colors cursor-pointer font-body"
              >
                Back
              </button>
            )}
            <button
              onClick={onNext}
              className="px-4 py-1.5 text-xs bg-war-gold text-war-ink rounded font-bold
                         hover:bg-war-brass transition-colors cursor-pointer font-display tracking-wide"
            >
              {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
        <button
          onClick={onSkip}
          className="mt-3 text-parchment-dark/40 text-xs cursor-pointer hover:text-parchment-dark/60 transition-colors font-body underline"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          Skip Tutorial
        </button>
      </div>
    </>
  );
}
