import { useState, useEffect } from 'react';

interface MathProblemProps {
  multiplicand: number;
  multiplier: number;
  resetTrigger: number;
}

export const MathProblem: React.FC<MathProblemProps> = ({ multiplicand, multiplier, resetTrigger }) => {
  const [userAnswer, setUserAnswer] = useState('');

  useEffect(() => {
    setUserAnswer('');
  }, [resetTrigger]);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserAnswer(value);
  };

  return (
    <div className="math-problem">
      <div className="problem-container">
        <div className="number">{multiplicand}</div>
        <div className="operation-row">
          <span className="multiplication-sign">×</span>
          <span className="number">{multiplier}</span>
        </div>
        <div className="answer-line"></div>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={userAnswer}
          onChange={handleAnswerChange}
          data-problem={`${multiplicand},${multiplier}`}
          className="answer-input no-print"
        />
      </div>
    </div>
  );
}; 