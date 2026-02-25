import React, { useState, useEffect, useMemo } from 'react';

function shuffleChoices(choices, correctIndex) {
  const indices = choices.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    choices: indices.map((i) => choices[i]),
    correctIndex: indices.indexOf(correctIndex),
    indices,
  };
}

export default function EventCard({ event, onDismiss, gameMode }) {
  const [countdown, setCountdown] = useState(4);
  const [phase, setPhase] = useState('reading');
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const shuffledQuiz = useMemo(() => {
    if (!event?.quiz) return null;
    return shuffleChoices(event.quiz.choices, event.quiz.correctIndex);
  }, [event]);

  useEffect(() => {
    setCountdown(4);
    setPhase('reading');
    setSelectedAnswer(null);
    if (!event) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [event]);

  useEffect(() => {
    if (countdown === 0 && phase === 'reading') {
      setPhase(event?.quiz && shuffledQuiz ? 'quiz' : 'result');
    }
  }, [countdown, phase, event, shuffledQuiz]);

  if (!event) return null;

  const isExplorer = gameMode === 'explorer';
  const isCorrect = selectedAnswer !== null && shuffledQuiz && selectedAnswer === shuffledQuiz.correctIndex;

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
    setPhase('result');
  };

  const handleDismiss = () => {
    const quizResult = selectedAnswer !== null && shuffledQuiz
      ? { answered: true, correct: selectedAnswer === shuffledQuiz.correctIndex }
      : { answered: false };
    onDismiss(quizResult);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 1000, background: 'radial-gradient(ellipse at center, rgba(20,30,48,0.95) 0%, rgba(10,10,8,0.98) 100%)' }} role="presentation">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-war-navy border border-war-gold/30 shadow-modal rounded-lg animate-fadein" role="dialog" aria-modal="true" aria-label={`Historical event: ${event.title}`}>

        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 border-b border-war-gold/20" style={{
          background: 'linear-gradient(135deg, rgba(139,26,26,0.4) 0%, rgba(20,30,48,0.95) 100%)',
        }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-war-gold/60" />
                <p className="text-war-copper text-sm tracking-[0.2em] uppercase font-body font-bold">Historical Event</p>
              </div>
              <p className="text-parchment-dark/50 text-sm font-body">{event.year}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <h2 className="text-2xl font-display text-parchment mb-4 tracking-wide">{event.title}</h2>

          <p className="text-parchment/80 text-base leading-relaxed mb-5 font-body italic border-l-2 border-war-gold/20 pl-4">
            &ldquo;{isExplorer && event.simpleDescription ? event.simpleDescription : event.description}&rdquo;
          </p>

          {event.primarySource && !isExplorer && (
            <div className="bg-war-ink/40 rounded px-5 py-4 mb-5 border border-parchment-dark/10 relative">
              <span className="absolute -top-2 left-4 text-war-gold/30 text-3xl font-serif leading-none" aria-hidden="true">&ldquo;</span>
              <p className="text-parchment/90 text-base leading-relaxed font-serif italic pl-3">
                {event.primarySource.quote}
              </p>
              <p className="text-war-copper/70 text-sm font-body mt-2 pl-3">
                &mdash; {event.primarySource.attribution}
              </p>
            </div>
          )}

          {event.didYouKnow && (
            <div className="bg-war-gold/5 rounded px-5 py-4 mb-5 border border-war-gold/15">
              <p className="text-sm text-war-gold/80 uppercase tracking-wider mb-1 font-body font-bold">Did You Know?</p>
              <p className="text-parchment/80 text-base leading-relaxed font-body">{isExplorer && event.simpleDidYouKnow ? event.simpleDidYouKnow : event.didYouKnow}</p>
            </div>
          )}

          <div className="bg-black/20 rounded px-5 py-4 border-l-2 border-war-copper/50">
            <p className="text-sm text-war-copper/80 uppercase tracking-wider mb-1 font-body font-bold">Effect</p>
            <p className="text-parchment/90 text-base font-body">{isExplorer && event.simpleEffect ? event.simpleEffect : event.effect}</p>
          </div>
        </div>

        {/* Quiz */}
        {phase === 'quiz' && shuffledQuiz && (
          <div className="px-6 pb-5">
            <div className="border-t border-war-gold/15 pt-5">
              <p className="text-war-gold/80 text-sm tracking-[0.15em] uppercase font-body font-bold mb-3">Knowledge Check</p>
              <p className="text-parchment/90 text-base leading-relaxed mb-5 font-body">{isExplorer && event.quiz.simpleQuestion ? event.quiz.simpleQuestion : event.quiz.question}</p>
              <div className="space-y-2.5">
                {shuffledQuiz.choices.map((choice, i) => {
                  const origIdx = shuffledQuiz.indices[i];
                  const displayChoice = isExplorer && event.quiz.simpleChoices ? (event.quiz.simpleChoices[origIdx] || choice) : choice;
                  return (
                  <button
                    key={i}
                    onClick={() => handleAnswerSelect(i)}
                    className="w-full text-left px-4 py-3 rounded border border-parchment-dark/15
                               hover:border-war-gold/40 hover:bg-war-gold/5 transition-all
                               text-parchment/85 text-base font-body cursor-pointer group"
                  >
                    <span className="text-war-gold/70 font-bold mr-2 group-hover:text-war-gold">{String.fromCharCode(65 + i)}.</span>
                    {displayChoice}
                  </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Result feedback */}
        {phase === 'result' && selectedAnswer !== null && shuffledQuiz && (
          <div className="px-6 pb-2">
            <div className="border-t border-war-gold/15 pt-5">
              <div className={`p-4 rounded border-l-2 mb-4 ${
                isCorrect ? 'bg-green-900/20 border-green-500/60' : 'bg-red-900/15 border-red-500/50'
              }`}>
                <p className={`text-lg font-bold mb-2 font-display ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect ? 'Correct!' : 'Not quite.'}
                </p>
                <p className="text-parchment/80 text-sm leading-relaxed font-body mb-1">
                  <span className="text-war-gold/80 font-bold">Answer: </span>
                  {isExplorer && event.quiz.simpleChoices ? (event.quiz.simpleChoices[event.quiz.correctIndex] || event.quiz.choices[event.quiz.correctIndex]) : event.quiz.choices[event.quiz.correctIndex]}
                </p>
                <p className="text-parchment/70 text-sm leading-relaxed font-body">{isExplorer && event.quiz.simpleExplanation ? event.quiz.simpleExplanation : event.quiz.explanation}</p>
                {isCorrect && event.quiz.reward && (
                  <p className="text-war-gold text-sm font-bold mt-3 font-body">
                    Bonus: {event.quiz.reward.troops ? `+${event.quiz.reward.troops} troops` : ''}
                    {event.quiz.reward.nationalism ? ` +${event.quiz.reward.nationalism} nationalism` : ''}
                  </p>
                )}
                {!isCorrect && event.quiz.penalty && (
                  <p className="text-red-400/80 text-sm font-bold mt-3 font-body">
                    Penalty: {event.quiz.penalty.nationalism ? `${event.quiz.penalty.nationalism} nationalism` : ''}
                    {event.quiz.penalty.troops ? ` ${event.quiz.penalty.troops} troops` : ''}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-6 pb-5 sticky bottom-0 bg-war-navy pt-3">
          {phase === 'reading' && (
            <div className="w-full py-3 text-center">
              <span className="text-parchment-dark/40 text-sm font-body">Reading... ({countdown}s)</span>
              <div className="mt-2 w-full h-0.5 bg-parchment-dark/10 rounded overflow-hidden">
                <div className="h-full bg-war-gold/40 transition-all duration-1000" style={{ width: `${((4 - countdown) / 4) * 100}%` }} />
              </div>
            </div>
          )}
          {phase === 'quiz' && (
            <p className="text-center text-parchment-dark/40 text-sm italic py-3 font-body">
              Select your answer above
            </p>
          )}
          {phase === 'result' && (
            <button onClick={handleDismiss} className="w-full py-3 font-display rounded text-base font-bold tracking-wider bg-war-gold text-war-ink hover:bg-war-brass cursor-pointer transition-colors shadow-copper">
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
