import React, { useState, useCallback } from 'react';
import quizGateQuestions from '../data/quizGateQuestions';

export default function QuizGate({ onComplete, gameMode }) {
  const isExplorer = gameMode === 'explorer';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completed, setCompleted] = useState(false);

  const question = quizGateQuestions[currentIndex];
  const totalQuestions = quizGateQuestions.length;
  const progress = ((currentIndex + (completed ? 1 : 0)) / totalQuestions) * 100;

  const questionText = isExplorer && question.simpleQuestion
    ? question.simpleQuestion
    : question.question;
  const explanationText = isExplorer && question.simpleExplanation
    ? question.simpleExplanation
    : question.explanation;

  const handleAnswer = useCallback((answerIndex) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === question.correctIndex;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      // Auto-advance after a brief delay
      setTimeout(() => {
        if (currentIndex < totalQuestions - 1) {
          setCurrentIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setShowResult(false);
          setIsCorrect(false);
        } else {
          setCompleted(true);
        }
      }, 1500);
    }
  }, [showResult, question.correctIndex, currentIndex, totalQuestions]);

  const handleRetry = useCallback(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  }, []);

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
        <div className="max-w-2xl w-full text-center animate-fadein">
          <div className="bg-war-navy border border-war-gold/30 rounded-lg p-8 md:p-12 shadow-modal">
            <div className="w-16 h-16 rounded-full bg-war-gold/20 border-2 border-war-gold/50 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">&#10003;</span>
            </div>
            <h2 className={`font-display text-war-gold tracking-wide mb-4 ${isExplorer ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}`}>
              Ready for Battle!
            </h2>
            <p className={`text-parchment/70 font-body mb-8 ${isExplorer ? 'text-lg leading-loose' : 'text-base leading-relaxed'}`}>
              {isExplorer
                ? 'Great job! You learned about the War of 1812. Now it is time to pick your side and play!'
                : 'You\'ve demonstrated your knowledge of the War of 1812. Now choose your faction and make history.'}
            </p>
            <button
              onClick={onComplete}
              className="px-8 py-4 bg-war-gold text-war-ink font-display text-lg rounded-lg
                         hover:bg-war-brass transition-colors cursor-pointer font-bold tracking-wider shadow-copper"
            >
              Choose Your Faction
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
      <div className={isExplorer ? 'max-w-3xl w-full' : 'max-w-2xl w-full'}>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-war-gold/60" />
            <p className="text-war-copper text-xs tracking-[0.2em] uppercase font-body font-bold">Comprehension Check</p>
            <div className="w-1.5 h-1.5 rounded-full bg-war-gold/60" />
          </div>
          <h1 className={`font-display text-war-gold tracking-wide mb-2 ${isExplorer ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}`}>
            Test Your Knowledge
          </h1>
          <p className={`text-parchment-dark/50 font-body ${isExplorer ? 'text-base' : 'text-sm'}`}>
            Answer each question correctly to unlock the game.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-parchment-dark/40 mb-1.5 font-body">
            <span>Question {currentIndex + 1} of {totalQuestions}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-war-ink rounded-full h-2 border border-parchment-dark/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: 'linear-gradient(to right, #854d0e, #c9a227)' }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className={`bg-war-navy border border-war-gold/20 rounded-lg shadow-modal animate-fadein ${isExplorer ? 'p-8 md:p-10' : 'p-6 md:p-8'}`}>
          <h2 className={`font-display text-parchment/90 tracking-wide mb-6 ${isExplorer ? 'text-2xl md:text-3xl leading-relaxed' : 'text-xl md:text-2xl'}`}>
            {questionText}
          </h2>

          {/* Answer Choices */}
          <div className="space-y-3 mb-6">
            {question.answers.map((answer, i) => {
              let classes = 'w-full text-left px-5 py-4 rounded-lg border transition-all cursor-pointer font-body';
              if (showResult && i === question.correctIndex) {
                classes += ' border-green-500/50 bg-green-900/20 text-parchment/90';
              } else if (showResult && i === selectedAnswer && !isCorrect) {
                classes += ' border-red-500/50 bg-red-900/20 text-parchment/70';
              } else if (!showResult) {
                classes += ' border-parchment-dark/15 bg-war-navy/50 text-parchment/70 hover:border-war-gold/40 hover:text-parchment/90';
              } else {
                classes += ' border-parchment-dark/10 bg-war-navy/30 text-parchment/50';
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={showResult}
                  className={classes}
                  style={showResult ? { cursor: 'default' } : undefined}
                >
                  <span className={`font-display font-bold mr-3 ${isExplorer ? 'text-lg' : 'text-base'}`}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <span className={isExplorer ? 'text-lg leading-relaxed' : 'text-base leading-relaxed'}>
                    {answer}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showResult && (
            <div className={`rounded-lg p-4 animate-fadein ${isCorrect ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'}`}>
              <p className={`font-display font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'} ${isExplorer ? 'text-lg' : 'text-base'}`}>
                {isCorrect ? 'Correct!' : 'Not quite — try again!'}
              </p>
              {!isCorrect && (
                <>
                  <p className={`text-parchment/70 font-body mb-4 ${isExplorer ? 'text-base leading-loose' : 'text-sm leading-relaxed'}`}>
                    {explanationText}
                  </p>
                  <button
                    onClick={handleRetry}
                    className="px-6 py-3 bg-war-gold text-war-ink font-display text-sm rounded
                               hover:bg-war-brass transition-colors cursor-pointer font-bold tracking-wide shadow-copper"
                  >
                    Try Again
                  </button>
                </>
              )}
              {isCorrect && (
                <p className={`text-parchment/60 font-body ${isExplorer ? 'text-base' : 'text-sm'}`}>
                  {currentIndex < totalQuestions - 1 ? 'Moving to next question...' : 'All questions complete!'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
