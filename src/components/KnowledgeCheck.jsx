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
      {/* Full backdrop to hide map - this is a reading/learning moment */}
      <div className="absolute inset-0 bg-black bg-opacity-80 pointer-events-auto" />

      {/* Side panel */}
      <div
        className="relative w-full max-w-md h-full overflow-y-auto pointer-events-auto
                    bg-war-navy border-l-2 border-war-gold shadow-2xl kc-modal-animate"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-war-green to-green-900 px-6 py-4 border-b border-war-gold border-opacity-30 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <p className="text-war-gold text-sm tracking-widest uppercase font-bold">Knowledge Check</p>
            {questionNumber > 0 && (
              <span className="text-parchment-dark text-sm">Question #{questionNumber}</span>
            )}
          </div>
          <p className="text-parchment-dark text-base">Answer correctly for a bonus!</p>
        </div>

        {/* Question */}
        <div className="px-6 py-6">
          <h2 className="text-xl font-serif text-parchment mb-5 leading-relaxed">
            {question.question}
          </h2>

          {/* Choices */}
          <div className="space-y-3">
            {question.choices.map((choice, i) => {
              let style = 'border-parchment-dark border-opacity-30 hover:border-war-gold hover:bg-black hover:bg-opacity-20';
              if (answered) {
                if (i === question.correctIndex) {
                  style = 'border-green-500 bg-green-900 bg-opacity-30';
                } else if (i === selectedIndex && !isCorrect) {
                  style = 'border-red-500 bg-red-900 bg-opacity-30';
                } else {
                  style = 'border-parchment-dark border-opacity-20 opacity-50';
                }
              } else if (i === selectedIndex) {
                style = 'border-war-gold bg-black bg-opacity-30';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                  className={`w-full text-left px-5 py-3.5 rounded-lg border-2 transition-all
                    text-parchment text-base font-serif ${style}
                    ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <span className="text-war-gold font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                  {choice}
                </button>
              );
            })}
          </div>

          {/* Result */}
          {answered && (
            <div className={`mt-5 p-5 rounded-lg border-l-4 ${
              isCorrect
                ? 'bg-green-900 bg-opacity-30 border-green-500'
                : 'bg-red-900 bg-opacity-20 border-red-500'
            }`}>
              <p className={`text-lg font-bold mb-2 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                {isCorrect ? 'Correct!' : 'Not quite.'}
              </p>
              <p className="text-parchment text-base leading-relaxed">
                {question.explanation}
              </p>
              {isCorrect && question.reward && (
                <p className="text-war-gold text-base font-bold mt-3">
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
              className="w-full py-3 bg-war-gold text-war-navy font-serif rounded-lg
                         hover:bg-yellow-500 transition-colors cursor-pointer text-base font-bold tracking-wider"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
