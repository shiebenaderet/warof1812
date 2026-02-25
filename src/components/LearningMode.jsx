import React, { useState, useCallback } from 'react';
import timelineEvents from '../data/learningContent';
import renderBoldText from '../utils/renderBoldText';
import injectVocabTerms from '../utils/injectVocabTerms';

function renderParagraphs(text, isExplorer, keyTerms) {
  const paragraphs = text.split('\n\n');
  return paragraphs.map((para, i) => {
    const trimmed = para.trim();
    if (!trimmed) return null;
    const content = isExplorer
      ? injectVocabTerms(trimmed, keyTerms, true)
      : renderBoldText(trimmed);
    return (
      <p key={i} className={isExplorer ? 'mb-5' : 'mb-4'}>
        {content}
      </p>
    );
  });
}

function ActivitySection({ activity }) {
  const [order, setOrder] = useState(activity.items.map((_, i) => i));
  const [selectedIdx, setSelectedIdx] = useState(null);

  const handleClick = useCallback((clickedPosition) => {
    if (activity.type === 'sequencing') {
      if (selectedIdx === null) {
        setSelectedIdx(clickedPosition);
      } else {
        // Swap the two items
        setOrder(prev => {
          const next = [...prev];
          [next[selectedIdx], next[clickedPosition]] = [next[clickedPosition], next[selectedIdx]];
          return next;
        });
        setSelectedIdx(null);
      }
    }
  }, [selectedIdx, activity.type]);

  if (activity.type === 'matching') {
    return (
      <div className="bg-black/20 rounded-lg p-4 mb-4 border border-parchment-dark/8">
        <h3 className="text-war-gold/80 font-display text-sm mb-2 border-b border-war-gold/15 pb-2 tracking-wide">
          Activity: Matching
        </h3>
        <p className="text-parchment/60 text-sm font-body mb-3">{activity.instruction}</p>
        <div className="space-y-2">
          {activity.items.map((item, i) => (
            <div key={i} className="bg-war-navy/50 border border-parchment-dark/8 rounded px-3 py-2">
              <p className="text-parchment/70 text-sm font-body">{item}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sequencing activity — click to select, click another to swap
  return (
    <div className="bg-black/20 rounded-lg p-4 mb-4 border border-parchment-dark/8">
      <h3 className="text-war-gold/80 font-display text-sm mb-2 border-b border-war-gold/15 pb-2 tracking-wide">
        Activity: Put in Order
      </h3>
      <p className="text-parchment/60 text-sm font-body mb-1">{activity.instruction}</p>
      <p className="text-parchment-dark/40 text-xs font-body mb-3 italic">Click two items to swap their positions.</p>
      <div className="space-y-1.5">
        {order.map((itemIdx, position) => (
          <button
            key={position}
            onClick={() => handleClick(position)}
            className={`w-full text-left px-3 py-2 rounded border transition-all cursor-pointer flex items-center gap-2 ${
              selectedIdx === position
                ? 'border-war-gold/50 bg-war-gold/10 text-parchment/90'
                : 'border-parchment-dark/10 bg-war-navy/50 text-parchment/70 hover:border-parchment-dark/25'
            }`}
          >
            <span className="text-war-gold/50 text-xs font-display font-bold w-5 flex-shrink-0">{position + 1}.</span>
            <span className="text-sm font-body">{activity.items[itemIdx]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function LearningMode({ onComplete, onSkip, gameMode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const isExplorer = gameMode === 'explorer';
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
  const contentText = isExplorer && event.simpleContent ? event.simpleContent : event.content;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
      <div className={isExplorer ? 'max-w-3xl w-full' : 'max-w-4xl w-full'}>
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
          <p className={`text-parchment-dark/50 font-body ${isExplorer ? 'text-base' : 'text-sm'}`}>
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
        <div className={`bg-war-navy border border-war-gold/20 rounded-lg shadow-modal animate-fadein ${isExplorer ? 'p-8 md:p-10' : 'p-6 md:p-8'}`}>
          {/* Year Badge */}
          <div className={`inline-block bg-war-gold/15 text-war-gold px-4 py-1 rounded-full font-bold font-body border border-war-gold/20 ${isExplorer ? 'text-sm mb-5' : 'text-xs mb-4'}`}>
            {event.year}
          </div>

          {/* Title */}
          <h2 className={`font-display text-parchment/90 tracking-wide ${isExplorer ? 'text-3xl md:text-4xl mb-8' : 'text-2xl md:text-3xl mb-6'}`}>
            {event.title}
          </h2>

          {/* Key Idea (Explorer only) */}
          {isExplorer && event.keyIdea && (
            <div className="bg-war-gold/10 border border-war-gold/25 rounded-lg p-4 mb-6">
              <p className="text-xs text-war-gold/80 uppercase tracking-wider mb-1 font-body font-bold">Key Idea</p>
              <p className={`text-parchment/90 font-body font-bold leading-relaxed ${isExplorer ? 'text-lg' : 'text-base'}`}>
                {event.keyIdea}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="mb-6">
            {isExplorer && event.simpleContentSections ? (
              /* Section 9 sub-sections in Explorer mode */
              <div className={`text-parchment/70 font-body ${isExplorer ? 'text-lg md:text-xl leading-loose max-w-2xl' : 'text-base leading-relaxed'}`}>
                {/* Intro paragraph */}
                <p className="mb-5">{contentText.split('\n\n')[0]}</p>
                {/* Sub-sections */}
                {event.simpleContentSections.map((section, i) => (
                  <div key={i} className="mb-6">
                    <p className="text-war-copper/80 uppercase tracking-wider text-xs font-body font-bold mb-2">
                      {section.heading}
                    </p>
                    <p className="mb-5">{injectVocabTerms(section.content, event.keyTerms, true)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-parchment/70 font-body ${isExplorer ? 'text-lg md:text-xl leading-loose max-w-2xl' : 'text-base leading-relaxed'}`}>
                {renderParagraphs(contentText, isExplorer, event.keyTerms)}
              </div>
            )}
          </div>

          {/* Did You Know — moved up in Explorer mode (after content, before Key Terms) */}
          {isExplorer && event.didYouKnow && (
            <div className="bg-war-red/10 border-l-2 border-war-red/30 rounded-r-lg p-4 mb-4">
              <p className="text-war-copper/80 text-xs uppercase tracking-wider mb-1 font-body font-bold">Did You Know?</p>
              <p className={`text-parchment/70 italic font-body ${isExplorer ? 'text-base' : 'text-sm'}`}>{event.didYouKnow}</p>
            </div>
          )}

          {/* Key Terms */}
          {event.keyTerms && event.keyTerms.length > 0 && (
            <div className="bg-black/20 rounded-lg p-4 mb-4 border border-parchment-dark/8">
              <h3 className="text-war-gold/80 font-display text-sm mb-3 border-b border-war-gold/15 pb-2 tracking-wide">
                Key Terms
              </h3>
              <div className="space-y-2 font-body">
                {event.keyTerms.map((term, index) => (
                  <div key={index}>
                    <span className={`text-parchment/80 font-bold ${isExplorer ? 'text-base' : 'text-sm'}`}>{term.term}:</span>{' '}
                    <span className={`text-parchment-dark/60 ${isExplorer ? 'text-base' : 'text-sm'}`}>{isExplorer && term.simpleDefinition ? term.simpleDefinition : term.definition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cause & Effect (hidden in explorer mode) */}
          {event.causeEffect && !isExplorer && (
            <div className="bg-black/20 rounded-lg p-4 mb-4 border border-parchment-dark/8">
              <h3 className="text-war-gold/80 font-display text-sm mb-3 border-b border-war-gold/15 pb-2 tracking-wide">
                Cause &amp; Effect
              </h3>
              <div className="flex flex-col sm:flex-row items-stretch gap-2 mb-3">
                <div className="flex-1 bg-war-navy/50 rounded-lg p-3 border border-parchment-dark/8">
                  <p className="text-war-copper/70 text-[10px] uppercase tracking-widest font-body font-bold mb-1">Cause</p>
                  <p className="text-parchment/70 text-sm font-body">{event.causeEffect.cause}</p>
                </div>
                <div className="flex items-center justify-center text-war-gold/40 text-xl px-2 hidden sm:flex">&rarr;</div>
                <div className="flex items-center justify-center text-war-gold/40 text-xl sm:hidden">&darr;</div>
                <div className="flex-1 bg-war-navy/50 rounded-lg p-3 border border-parchment-dark/8">
                  <p className="text-war-copper/70 text-[10px] uppercase tracking-widest font-body font-bold mb-1">Effect</p>
                  <p className="text-parchment/70 text-sm font-body">{event.causeEffect.effect}</p>
                </div>
              </div>
              <div className="bg-war-gold/5 border border-war-gold/10 rounded-lg p-3">
                <p className="text-war-gold/70 text-xs font-body font-bold mb-0.5">Think About It</p>
                <p className="text-parchment/60 text-sm font-body italic">{event.causeEffect.thinkAbout}</p>
              </div>
            </div>
          )}

          {/* Primary Source Excerpt (hidden in explorer mode) */}
          {event.primarySourceExcerpt && !isExplorer && (
            <div className="bg-war-red/5 border-l-2 border-war-red/20 rounded-r-lg p-4 mb-4">
              <p className="text-war-copper/80 text-xs uppercase tracking-wider mb-2 font-body font-bold">Primary Source</p>
              <blockquote className="text-parchment/80 text-sm font-body italic leading-relaxed mb-2 pl-2 border-l border-parchment-dark/15">
                &ldquo;{event.primarySourceExcerpt.quote}&rdquo;
              </blockquote>
              <p className="text-parchment-dark/50 text-xs font-body mb-2">&mdash; {event.primarySourceExcerpt.attribution}</p>
              <div className="bg-war-gold/5 border border-war-gold/10 rounded p-2.5">
                <p className="text-war-gold/70 text-xs font-body font-bold mb-0.5">Analysis Question</p>
                <p className="text-parchment/60 text-sm font-body italic">{event.primarySourceExcerpt.analysisPrompt}</p>
              </div>
            </div>
          )}

          {/* Geographic Context (hidden in explorer mode) */}
          {event.geographicContext && !isExplorer && (
            <div className="bg-black/20 rounded-lg p-4 mb-4 border border-parchment-dark/8">
              <h3 className="text-war-gold/80 font-display text-sm mb-2 border-b border-war-gold/15 pb-2 tracking-wide">
                Geographic Context
              </h3>
              <p className="text-parchment/70 text-sm font-body leading-relaxed mb-2">{event.geographicContext.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {event.geographicContext.keyLocations.map((loc, i) => (
                  <span key={i} className="bg-war-navy/60 border border-parchment-dark/10 rounded px-2 py-0.5 text-parchment/60 text-xs font-body">
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Activity (hidden in explorer mode) */}
          {event.activity && !isExplorer && <ActivitySection activity={event.activity} />}

          {/* Did You Know — Historian mode (at bottom, original position) */}
          {!isExplorer && event.didYouKnow && (
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
