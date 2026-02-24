import React, { useState } from 'react';
import timelineEvents from '../data/learningContent';

export default function LearningMode({ onComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = timelineEvents.length;
  const event = timelineEvents[currentStep];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-war-gold/60" />
            <p className="text-war-copper text-xs tracking-[0.2em] uppercase font-body font-bold">Historical Timeline</p>
            <div className="w-1.5 h-1.5 rounded-full bg-war-gold/60" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display text-war-gold tracking-wide mb-2">
            War of 1812
          </h1>
          <p className="text-parchment-dark/50 text-sm font-body">
            Learn the history before you play. This will help you answer quiz questions during the game!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-parchment-dark/40 mb-1.5 font-body">
            <span>Section {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-war-ink rounded-full h-2 border border-parchment-dark/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: 'linear-gradient(to right, #854d0e, #c9a227)' }}
            />
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-war-navy border border-war-gold/20 rounded-lg p-6 md:p-8 shadow-modal animate-fadein">
          {/* Year Badge */}
          <div className="inline-block bg-war-gold/15 text-war-gold px-4 py-1 rounded-full font-bold text-xs mb-4 font-body border border-war-gold/20">
            {event.year}
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-display text-parchment/90 mb-6 tracking-wide">
            {event.title}
          </h2>

          {/* Content */}
          <div className="mb-6">
            <div className="text-parchment/70 text-base leading-relaxed whitespace-pre-line font-body">
              {event.content}
            </div>
          </div>

          {/* Key Terms */}
          {event.keyTerms && event.keyTerms.length > 0 && (
            <div className="bg-black/20 rounded-lg p-4 mb-4 border border-parchment-dark/8">
              <h3 className="text-war-gold/80 font-display text-sm mb-3 border-b border-war-gold/15 pb-2 tracking-wide">
                Key Terms
              </h3>
              <div className="space-y-2 font-body">
                {event.keyTerms.map((term, index) => (
                  <div key={index}>
                    <span className="text-parchment/80 font-bold text-sm">{term.term}:</span>{' '}
                    <span className="text-parchment-dark/60 text-sm">{term.definition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Did You Know */}
          {event.didYouKnow && (
            <div className="bg-war-red/10 border-l-2 border-war-red/30 rounded-r-lg p-4">
              <p className="text-war-copper/80 text-xs uppercase tracking-wider mb-1 font-body font-bold">Did You Know?</p>
              <p className="text-parchment/70 text-sm italic font-body">{event.didYouKnow}</p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between items-center gap-4">
          {/* Skip Button (only on first step) */}
          {currentStep === 0 && (
            <button
              onClick={onSkip}
              className="px-4 py-2 text-parchment-dark/40 hover:text-parchment/70 transition-colors text-xs font-body cursor-pointer"
            >
              Skip (Already learned this)
            </button>
          )}

          <div className={`flex gap-3 ${currentStep === 0 ? 'ml-auto' : 'w-full justify-between'}`}>
            {/* Previous Button */}
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-6 py-3 font-display text-sm rounded border border-parchment-dark/20 text-parchment/70
                           hover:border-war-gold/40 hover:text-parchment transition-colors cursor-pointer tracking-wide"
              >
                Previous
              </button>
            )}

            {/* Next/Start Button */}
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-war-gold text-war-ink font-display text-sm rounded
                         hover:bg-war-brass transition-colors cursor-pointer font-bold ml-auto tracking-wide shadow-copper"
            >
              {currentStep === totalSteps - 1 ? 'Start Playing!' : 'Next'}
            </button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="mt-6 flex justify-center gap-2">
          {timelineEvents.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-war-gold w-6'
                  : index < currentStep
                  ? 'bg-war-gold/40 w-1.5'
                  : 'bg-parchment-dark/15 w-1.5'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
