import React, { useState, useEffect, useMemo } from 'react';

// Fisher-Yates shuffle for answer choices
function shuffleChoices(choices, correctIndex) {
  const indices = choices.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    choices: indices.map((i) => choices[i]),
    correctIndex: indices.indexOf(correctIndex),
  };
}

export default function EventCard({ event, onDismiss }) {
  const [countdown, setCountdown] = useState(4);
  const [phase, setPhase] = useState('reading'); // 'reading' | 'quiz' | 'result'
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Shuffle quiz choices once per event
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

  // When countdown hits 0, transition to quiz or result
  useEffect(() => {
    if (countdown === 0 && phase === 'reading') {
      if (event?.quiz && shuffledQuiz) {
        setPhase('quiz');
      } else {
        setPhase('result');
      }
    }
  }, [countdown, phase, event, shuffledQuiz]);

  if (!event) return null;

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
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      {/* Full backdrop to cover map and prevent interaction */}
      <div className="absolute inset-0 bg-black bg-opacity-70 pointer-events-auto" />

      {/* Side panel */}
      <div
        className="relative w-full max-w-md h-full overflow-y-auto pointer-events-auto
                    bg-war-navy border-l-2 border-war-gold shadow-2xl"
      >
        {/* Header ribbon */}
        <div className="bg-gradient-to-r from-war-red to-war-navy px-6 py-4 border-b border-war-gold border-opacity-30 sticky top-0 z-10">
          <p className="text-war-gold text-sm tracking-widest uppercase font-bold">Historical Event</p>
          <p className="text-parchment-dark text-sm">{event.year}</p>
        </div>

        {/* Card body */}
        <div className="px-6 py-6">
          <h2 className="text-2xl font-serif text-parchment mb-4">{event.title}</h2>

          <p className="text-parchment text-base leading-relaxed mb-5 italic">
            &ldquo;{event.description}&rdquo;
          </p>

          {event.didYouKnow && (
            <div className="bg-war-navy bg-opacity-50 rounded-lg px-5 py-4 mb-5 border-l-4 border-war-gold">
              <p className="text-sm text-war-gold uppercase tracking-wide mb-1 font-bold">Did You Know?</p>
              <p className="text-parchment text-base leading-relaxed">{event.didYouKnow}</p>
            </div>
          )}

          <div className="bg-black bg-opacity-30 rounded-lg px-5 py-4 mb-4 border-l-4 border-war-gold">
            <p className="text-sm text-parchment-dark uppercase tracking-wide mb-1 font-bold">Effect</p>
            <p className="text-parchment text-base">{event.effect}</p>
          </div>
        </div>

        {/* Quiz phase */}
        {phase === 'quiz' && shuffledQuiz && (
          <div className="px-6 pb-6">
            <div className="border-t border-war-gold border-opacity-30 pt-5">
              <p className="text-war-gold text-sm tracking-widest uppercase font-bold mb-3">Quick Quiz</p>
              <p className="text-parchment text-base leading-relaxed mb-5">{event.quiz.question}</p>
              <div className="space-y-3">
                {shuffledQuiz.choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswerSelect(i)}
                    className="w-full text-left px-5 py-3.5 rounded-lg border-2 border-parchment-dark border-opacity-30
                               hover:border-war-gold hover:bg-black hover:bg-opacity-20 transition-all
                               text-parchment text-base font-serif cursor-pointer"
                  >
                    <span className="text-war-gold font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Result phase - quiz feedback */}
        {phase === 'result' && selectedAnswer !== null && shuffledQuiz && (
          <div className="px-6 pb-2">
            <div className="border-t border-war-gold border-opacity-30 pt-5">
              <div className={`p-5 rounded-lg border-l-4 mb-4 ${
                isCorrect
                  ? 'bg-green-900 bg-opacity-30 border-green-500'
                  : 'bg-red-900 bg-opacity-20 border-red-500'
              }`}>
                <p className={`text-lg font-bold mb-2 font-serif ${
                  isCorrect ? 'text-green-300' : 'text-red-300'
                }`}>
                  {isCorrect ? 'Correct!' : 'Not quite.'}
                </p>
                <p className="text-parchment text-sm leading-relaxed mb-1">
                  <span className="text-war-gold font-bold">Answer: </span>
                  {event.quiz.choices[event.quiz.correctIndex]}
                </p>
                <p className="text-parchment text-sm leading-relaxed">{event.quiz.explanation}</p>
                {isCorrect && event.quiz.reward && (
                  <p className="text-war-gold text-sm font-bold mt-3">
                    Bonus: {event.quiz.reward.troops ? `+${event.quiz.reward.troops} reinforcement troops` : ''}
                    {event.quiz.reward.nationalism ? `+${event.quiz.reward.nationalism} nationalism` : ''}
                  </p>
                )}
                {!isCorrect && event.quiz.penalty && (
                  <p className="text-red-400 text-sm font-bold mt-3">
                    Penalty: {event.quiz.penalty.nationalism ? `${event.quiz.penalty.nationalism} nationalism` : ''}
                    {event.quiz.penalty.troops ? `${event.quiz.penalty.troops} troops` : ''}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action */}
        <div className="px-6 pb-5 sticky bottom-0 bg-war-navy pt-3">
          {phase === 'reading' && (
            <button
              disabled
              className="w-full py-3 font-serif rounded-lg text-base font-bold tracking-wider bg-gray-600 text-gray-400 cursor-not-allowed"
            >
              {countdown > 0 ? `Reading... (${countdown}s)` : 'Loading quiz...'}
            </button>
          )}
          {phase === 'quiz' && (
            <p className="text-center text-parchment-dark text-sm italic py-3">
              Answer the question above to continue
            </p>
          )}
          {phase === 'result' && (
            <button
              onClick={handleDismiss}
              className="w-full py-3 font-serif rounded-lg text-base font-bold tracking-wider
                         bg-war-gold text-war-navy hover:bg-yellow-500 cursor-pointer transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
