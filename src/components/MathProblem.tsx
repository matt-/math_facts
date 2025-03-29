import { useState, useEffect } from 'react';
import { Operation } from '../App';
import { DivisionProblem } from './DivisionProblem';

interface MathProblemProps {
  multiplicand: number;
  multiplier: number;
  operation: Operation;
  resetTrigger: number;
  onFirstType: () => void;
  showAnswer: boolean;
}

export const MathProblem: React.FC<MathProblemProps> = ({ 
  multiplicand, 
  multiplier, 
  operation,
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

  const getOperationSymbol = () => {
    switch (operation) {
      case 'addition':
        return '+';
      case 'subtraction':
        return '−';
      case 'division':
        return '÷';
      case 'multiplication':
      default:
        return '×';
    }
  };

  const getAnswer = () => {
    switch (operation) {
      case 'addition':
        return multiplicand + multiplier;
      case 'subtraction':
        return multiplicand - multiplier;
      case 'division':
        return multiplicand / multiplier;
      case 'multiplication':
      default:
        return multiplicand * multiplier;
    }
  };

  const renderStandardProblem = () => (
    <div className="problem-container">
      <div className="number">{multiplicand}</div>
      <div className="operation-row">
        <span className="operation-sign">{getOperationSymbol()}</span>
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
      {showAnswer && <div className="print-answer print-only">{getAnswer()}</div>}
    </div>
  );

  return (
    <div className="math-problem">
      {operation === 'division' ? (
        <DivisionProblem
          dividend={multiplicand}
          divisor={multiplier}
          resetTrigger={resetTrigger}
          onFirstType={onFirstType}
          showAnswer={showAnswer}
        />
      ) : (
        renderStandardProblem()
      )}
    </div>
  );
}; 