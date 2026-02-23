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
    <div className="min-h-screen bg-war-navy flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-serif text-war-gold mb-2">
            War of 1812: Historical Timeline
          </h1>
          <p className="text-parchment-dark text-sm md:text-base">
            Learn the history before you play. This will help you answer quiz questions during the game!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-parchment-dark mb-1">
            <span>Section {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-war-gold h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-black bg-opacity-40 border-2 border-war-gold rounded-xl p-6 md:p-8 shadow-2xl">
          {/* Year Badge */}
          <div className="inline-block bg-war-gold text-war-navy px-4 py-1 rounded-full font-bold text-sm mb-4">
            {event.year}
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-serif text-parchment mb-6">
            {event.title}
          </h2>

          {/* Content */}
          <div className="prose prose-invert max-w-none mb-6">
            <div className="text-parchment text-base leading-relaxed whitespace-pre-line">
              {event.content}
            </div>
          </div>

          {/* Key Terms */}
          {event.keyTerms && event.keyTerms.length > 0 && (
            <div className="bg-war-navy bg-opacity-50 rounded-lg p-4 mb-4">
              <h3 className="text-war-gold font-serif text-lg mb-3 border-b border-war-gold border-opacity-30 pb-2">
                Key Terms
              </h3>
              <div className="space-y-2">
                {event.keyTerms.map((term, index) => (
                  <div key={index}>
                    <span className="text-parchment font-bold">{term.term}:</span>{' '}
                    <span className="text-parchment-dark">{term.definition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Did You Know */}
          {event.didYouKnow && (
            <div className="bg-british-red bg-opacity-20 border-l-4 border-british-red rounded-r-lg p-4">
              <h3 className="text-war-gold font-bold text-sm uppercase tracking-wider mb-2">
                Did You Know?
              </h3>
              <p className="text-parchment text-sm italic">
                {event.didYouKnow}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between items-center gap-4">
          {/* Skip Button (only on first step) */}
          {currentStep === 0 && (
            <button
              onClick={onSkip}
              className="px-4 py-2 text-parchment-dark hover:text-parchment transition-colors text-sm"
            >
              Skip (Already learned this)
            </button>
          )}

          <div className={`flex gap-3 ${currentStep === 0 ? 'ml-auto' : 'w-full justify-between'}`}>
            {/* Previous Button */}
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-6 py-3 font-serif text-base rounded-lg border-2 border-parchment-dark text-parchment
                           hover:border-war-gold hover:text-war-gold transition-colors cursor-pointer"
              >
                ← Previous
              </button>
            )}

            {/* Next/Start Button */}
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-war-gold text-war-navy font-serif text-base rounded-lg
                         hover:bg-yellow-500 transition-colors cursor-pointer font-bold ml-auto"
            >
              {currentStep === totalSteps - 1 ? 'Start Playing! →' : 'Next →'}
            </button>
          </div>
        </div>

        {/* Optional: Mini-map of progress */}
        <div className="mt-6 flex justify-center gap-2">
          {timelineEvents.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-war-gold w-8'
                  : index < currentStep
                  ? 'bg-war-gold bg-opacity-50'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
