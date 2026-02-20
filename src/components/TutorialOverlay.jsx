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
}) {
  const [spotlightRect, setSpotlightRect] = useState(null);

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
        // If element is off-screen (e.g. sidebar hidden on mobile), center tooltip instead
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

  return (
    <>
      {/* Dark backdrop - clicking it does nothing (prevents interaction behind) */}
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
        <p>{stepData.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#d4c4a1', fontSize: '12px' }}>
            Step {currentStep + 1} of {totalSteps}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {currentStep > 0 && (
              <button
                onClick={onPrev}
                className="px-3 py-1.5 text-sm border border-parchment-dark text-parchment-dark rounded
                           hover:border-war-gold hover:text-war-gold transition-colors cursor-pointer"
              >
                Back
              </button>
            )}
            <button
              onClick={onNext}
              className="px-4 py-1.5 text-sm bg-war-gold text-war-navy rounded font-bold
                         hover:bg-yellow-500 transition-colors cursor-pointer"
            >
              {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
        <button
          onClick={onSkip}
          style={{
            marginTop: '12px',
            background: 'none',
            border: 'none',
            color: '#d4c4a1',
            fontSize: '12px',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0,
          }}
        >
          Skip Tutorial
        </button>
      </div>
    </>
  );
}
