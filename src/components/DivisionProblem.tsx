import { useState, useEffect } from 'react';

interface DivisionProblemProps {
  dividend: number;
  divisor: number;
  resetTrigger: number;
  onFirstType: () => void;
  showAnswer: boolean;
}

export const DivisionProblem: React.FC<DivisionProblemProps> = ({
  dividend,
  divisor,
  resetTrigger,
  onFirstType,
  showAnswer
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [hasTyped, setHasTyped] = useState(false);

  useEffect(() => {
    setUserAnswer('');
    setHasTyped(false);
  }, [resetTrigger]);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!hasTyped) {
      setHasTyped(true);
      onFirstType();
    }
    setUserAnswer(value);
  };

  return (
    <div className="problem-container division">
      <div className="division-answer">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={userAnswer}
          onChange={handleAnswerChange}
          data-problem={`${dividend},${divisor}`}
          className="answer-input no-print"
        />
        {showAnswer && <div className="print-answer print-only">{dividend / divisor}</div>}
      </div>
      <div className="long-division">
        <div className="division-content">
          <span className="number divisor">{divisor}</span>
          <div className="division-symbol"></div>
          <span className="number dividend">{dividend}</span>
        </div>
      </div>
    </div>
  );
}; 