import React, { useState } from 'react';

export default function KnowledgeCheck({ question, onAnswer, questionNumber }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answered, setAnswered] = useState(false);

  if (!question) return null;

  const isCorrect = selectedIndex === question.correctIndex;

  const handleSelect = (index) => {
    if (answered) return;
    setSelectedIndex(index);
    setAnswered(true);
  };

  const handleContinue = () => {
    onAnswer(isCorrect, selectedIndex);
    setSelectedIndex(null);
    setAnswered(false);
  };

  return (
    <div className="fixed inset-0 flex justify-end pointer-events-none" style={{ zIndex: 1000 }}>
      {/* Full backdrop */}
      <div className="absolute inset-0 pointer-events-auto" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,0.9) 0%, rgba(10,10,8,0.95) 100%)' }} />

      {/* Side panel */}
      <div className="relative w-full max-w-md h-full overflow-y-auto pointer-events-auto
                      bg-war-navy border-l border-war-gold/20 shadow-modal kc-modal-animate">
        {/* Header */}
        <div className="px-6 py-4 border-b border-war-gold/20 sticky top-0 z-10" style={{
          background: 'linear-gradient(135deg, rgba(45,90,39,0.4) 0%, rgba(20,30,48,0.95) 100%)',
        }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
                <p className="text-war-gold/80 text-xs tracking-[0.2em] uppercase font-body font-bold">Knowledge Check</p>
              </div>
              {questionNumber > 0 && (
                <span className="text-parchment-dark/40 text-xs font-body">Question #{questionNumber}</span>
              )}
            </div>
          </div>
          <p className="text-parchment-dark/50 text-sm font-body mt-1">Answer correctly for a bonus!</p>
        </div>

        {/* Question */}
        <div className="px-6 py-6">
          <h2 className="text-xl font-display text-parchment/90 mb-5 leading-relaxed tracking-wide">
            {question.question}
          </h2>

          {/* Choices */}
          <div className="space-y-2.5">
            {question.choices.map((choice, i) => {
              let style = 'border-parchment-dark/15 hover:border-war-gold/40 hover:bg-war-gold/5';
              if (answered) {
                if (i === question.correctIndex) {
                  style = 'border-green-500/40 bg-green-900/20';
                } else if (i === selectedIndex && !isCorrect) {
                  style = 'border-red-500/40 bg-red-900/15';
                } else {
                  style = 'border-parchment-dark/10 opacity-40';
                }
              } else if (i === selectedIndex) {
                style = 'border-war-gold/40 bg-war-gold/5';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                  className={`w-full text-left px-5 py-3 rounded border transition-all
                    text-parchment/80 text-sm font-body ${style}
                    ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <span className="text-war-gold/70 font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                  {choice}
                </button>
              );
            })}
          </div>

          {/* Result */}
          {answered && (
            <div className={`mt-5 p-4 rounded border-l-2 ${
              isCorrect
                ? 'bg-green-900/15 border-green-500/50'
                : 'bg-red-900/10 border-red-500/40'
            }`}>
              <p className={`text-lg font-bold mb-2 font-display ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? 'Correct!' : 'Not quite.'}
              </p>
              <p className="text-parchment/70 text-sm leading-relaxed font-body">
                {question.explanation}
              </p>
              {isCorrect && question.reward && (
                <p className="text-war-gold text-sm font-bold mt-3 font-body">
                  Bonus: {question.reward.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Continue button */}
        {answered && (
          <div className="px-6 pb-5 sticky bottom-0 bg-war-navy pt-3">
            <button
              onClick={handleContinue}
              className="w-full py-3 bg-war-gold text-war-ink font-display rounded
                         hover:bg-war-brass transition-colors cursor-pointer text-sm font-bold tracking-wider shadow-copper"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
