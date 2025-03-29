import { useState, useEffect } from 'react';
import { MathProblem } from './MathProblem';
import { Operation } from '../App';

interface PracticePageProps {
  selectedNumber?: number;
  maxDigits: number;
  problemsPerPage: number;
  showHeader: boolean;
  showAnswers: boolean;
  operation: Operation;
  onShowHeaderChange: (checked: boolean) => void;
  onShowAnswersChange: (checked: boolean) => void;
}
const startTime = 90;
export function PracticePage({ selectedNumber, maxDigits, problemsPerPage, showHeader, showAnswers, operation, onShowHeaderChange, onShowAnswersChange }: PracticePageProps) {
  const [problems, setProblems] = useState<Array<[number, number]>>([]);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [timeLeft, setTimeLeft] = useState(startTime);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  // Generate problems on mount and when selectedNumber, problemsPerPage, or operation changes
  useEffect(() => {
    generateProblems();
  }, [selectedNumber, problemsPerPage, operation, maxDigits]);

  useEffect(() => {
    let timer: number;
    if (isTimerRunning && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsTimeUp(true);
            checkAllAnswers();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => window.clearInterval(timer);
  }, [isTimerRunning]);

  const startTimer = () => {
    setTimeLeft(startTime);
    setIsTimerRunning(true);
    setIsTimeUp(false);
    setShowScore(false);
  };

  const handleFirstType = () => {
    if (!hasStartedTyping && !isTimerRunning && !isTimeUp) {
      setHasStartedTyping(true);
      startTimer();
    }
  };

  const generateProblems = () => {
    setShowScore(false);
    setIsTimerRunning(false);
    setIsTimeUp(false);
    setTimeLeft(90);
    setResetTrigger(prev => prev + 1);
    setHasStartedTyping(false);
    
    // Clear any existing color classes
    const inputs = document.querySelectorAll('.answer-input') as NodeListOf<HTMLInputElement>;
    inputs.forEach(input => {
      input.classList.remove('correct', 'incorrect');
      const mathProblem = input.closest('.math-problem');
      if (mathProblem) {
        mathProblem.classList.remove('correct', 'incorrect');
      }
    });

    const newProblems: Array<[number, number]> = [];
    
    if (selectedNumber) {
      // First, ensure we have one of each number 1-12
      const numbers = Array.from({length: 12}, (_, i) => i + 1);
      // Shuffle the array of 1-12
      for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
      }
      
      // Add first 12 problems (or fewer if problemsPerPage < 12)
      const initialProblems = Math.min(12, problemsPerPage);
      for (let i = 0; i < initialProblems; i++) {
        let num1: number, num2: number;
        
        switch (operation) {
          case 'addition':
            // For addition, generate numbers up to maxDigits
            const maxNum = Math.pow(10, maxDigits) - 1;
            if (Math.random() < 0.5) {
              num1 = selectedNumber;
              num2 = Math.floor(Math.random() * maxNum) + 1;
            } else {
              num1 = Math.floor(Math.random() * maxNum) + 1;
              num2 = selectedNumber;
            }
            // Ensure both numbers respect maxDigits
            if (num1 > maxNum) num1 = maxNum;
            if (num2 > maxNum) num2 = maxNum;
            break;

          case 'subtraction':
            // For subtraction, ensure result is positive and numbers are within maxDigits
            const maxSubNum = Math.pow(10, maxDigits) - 1;
            num2 = selectedNumber;
            // Ensure first number doesn't exceed maxDigits
            const maxPossible = Math.min(maxSubNum, selectedNumber + maxSubNum);
            num1 = selectedNumber + Math.floor(Math.random() * (maxPossible - selectedNumber + 1));
            // Double check both numbers respect maxDigits
            if (num1 > maxSubNum) num1 = maxSubNum;
            if (num2 > maxSubNum) num2 = maxSubNum;
            break;
            
          case 'division':
            // For division, create problems with whole number answers
            const multiplier = numbers[i];
            num1 = selectedNumber * multiplier; // dividend
            num2 = selectedNumber; // divisor
            break;
            
          case 'multiplication':
          default:
            // Keep existing multiplication logic (1-12 range)
            if (Math.random() < 0.5) {
              num1 = selectedNumber;
              num2 = numbers[i];
            } else {
              num1 = numbers[i];
              num2 = selectedNumber;
            }
        }
        
        newProblems.push([num1, num2]);
      }
      
      // Fill remaining slots with random numbers if problemsPerPage > 12
      for (let i = 12; i < problemsPerPage; i++) {
        let num1: number, num2: number;
        
        switch (operation) {
          case 'addition':
            // Generate addition problems with numbers up to maxDigits
            const maxNum = Math.pow(10, maxDigits) - 1;
            if (Math.random() < 0.5) {
              num1 = selectedNumber;
              num2 = Math.floor(Math.random() * maxNum) + 1;
            } else {
              num1 = Math.floor(Math.random() * maxNum) + 1;
              num2 = selectedNumber;
            }
            // Ensure both numbers respect maxDigits
            if (num1 > maxNum) num1 = maxNum;
            if (num2 > maxNum) num2 = maxNum;
            break;
            
          case 'subtraction':
            // Generate subtraction problems with numbers up to maxDigits
            const maxSubNum = Math.pow(10, maxDigits) - 1;
            num2 = selectedNumber;
            // Ensure first number doesn't exceed maxDigits
            const maxPossible = Math.min(maxSubNum, selectedNumber + maxSubNum);
            num1 = selectedNumber + Math.floor(Math.random() * (maxPossible - selectedNumber + 1));
            // Double check both numbers respect maxDigits
            if (num1 > maxSubNum) num1 = maxSubNum;
            if (num2 > maxSubNum) num2 = maxSubNum;
            break;
            
          case 'division':
            // Generate division problems with selectedNumber as divisor
            const multiplier = Math.floor(Math.random() * 12) + 1;
            num1 = selectedNumber * multiplier;
            num2 = selectedNumber;
            break;
            
          case 'multiplication':
          default:
            // Keep existing multiplication logic
            const randomNum = Math.floor(Math.random() * 12) + 1;
            if (Math.random() < 0.5) {
              num1 = selectedNumber;
              num2 = randomNum;
            } else {
              num1 = randomNum;
              num2 = selectedNumber;
            }
        }
        
        newProblems.push([num1, num2]);
      }
    } else {
      // For mixed practice, generate appropriate random problems
      for (let i = 0; i < problemsPerPage; i++) {
        let num1: number, num2: number;
        
        switch (operation) {
          case 'addition':
            // Generate random addition problems with numbers up to maxDigits
            const maxNum = Math.pow(10, maxDigits) - 1;
            num1 = Math.floor(Math.random() * maxNum) + 1;
            // Ensure second number won't make sum exceed maxDigits
            const maxSecond = Math.min(maxNum, maxNum - num1);
            num2 = Math.floor(Math.random() * (maxSecond + 1)) + 1;
            break;
            
          case 'subtraction':
            // Generate random subtraction problems with numbers up to maxDigits
            const maxSubNum = Math.pow(10, maxDigits) - 1;
            num2 = Math.floor(Math.random() * maxSubNum) + 1;
            // Ensure first number doesn't exceed maxDigits
            const maxFirst = Math.min(maxSubNum, num2 + maxSubNum);
            num1 = num2 + Math.floor(Math.random() * (maxFirst - num2 + 1));
            // Double check both numbers respect maxDigits
            if (num1 > maxSubNum) num1 = maxSubNum;
            if (num2 > maxSubNum) num2 = maxSubNum;
            break;
            
          case 'division':
            // Generate random division problems with whole number results
            num2 = Math.floor(Math.random() * 12) + 1; // divisor 1-12
            const multiplier = Math.floor(Math.random() * 12) + 1;
            num1 = num2 * multiplier; // dividend ensures whole number result
            break;
            
          case 'multiplication':
          default:
            // Keep existing multiplication logic (1-12 range)
            num1 = Math.floor(Math.random() * 12) + 1;
            num2 = Math.floor(Math.random() * 12) + 1;
        }
        
        newProblems.push([num1, num2]);
      }
    }
    
    setProblems(newProblems);
  };

  const handlePrint = () => {
    window.print();
  };

  const checkAllAnswers = () => {
    const inputs = document.querySelectorAll('.answer-input') as NodeListOf<HTMLInputElement>;
    let correct = 0;
    const total = inputs.length;

    inputs.forEach((input) => {
      const mathProblem = input.closest('.math-problem');
      const [num1, num2] = input.dataset.problem?.split(',').map(Number) || [0, 0];
      let expectedAnswer: number;
      
      switch (operation) {
        case 'addition':
          expectedAnswer = num1 + num2;
          break;
        case 'subtraction':
          expectedAnswer = num1 - num2;
          break;
        case 'division':
          expectedAnswer = num1 / num2;
          break;
        case 'multiplication':
        default:
          expectedAnswer = num1 * num2;
      }
      
      const userAnswer = input.value !== '' ? parseInt(input.value, 10) : null;
      
      if (userAnswer === expectedAnswer) {
        correct++;
        mathProblem?.classList.add('correct');
        mathProblem?.classList.remove('incorrect');
      } else {
        mathProblem?.classList.add('incorrect');
        mathProblem?.classList.remove('correct');
      }
    });

    setScore({ correct, total });
    setShowScore(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSizeClass = () => {
    if (problemsPerPage <= 30) return 'size-30';
    if (problemsPerPage <= 40) return 'size-40';
    return 'size-50';
  };

  const getOperationTitle = () => {
    if (!selectedNumber) return 'Mixed Practice';
    switch (operation) {
      case 'addition':
        return `Adding ${selectedNumber}'s`;
      case 'subtraction':
        return `Subtracting ${selectedNumber}'s`;
      case 'division':
        return `Dividing by ${selectedNumber}'s`;
      case 'multiplication':
      default:
        return `${selectedNumber}'s Times Tables`;
    }
  };

  return (
    <div className="practice-page">
      <div className="fixed-timer no-print">
        <button 
          onClick={startTimer} 
          className="timer-btn"
          disabled={isTimerRunning || hasStartedTyping}
        >
          Start Timer
        </button>
        <div className={`timer ${isTimerRunning ? 'running' : ''} ${isTimeUp ? 'time-up' : ''}`}>
          {formatTime(timeLeft)}
        </div>
      </div>
      <div className="practice-controls no-print">
        <div className="control-group">
          <button onClick={generateProblems} className="new-problems-btn">
            New Problems
          </button>
          <button onClick={checkAllAnswers} className="check-btn">
            Check All
          </button>
        </div>
        <div className="control-group">
          <span className="control-label">Print Options:</span>
          <label>
            <input
              type="checkbox"
              checked={showHeader}
              onChange={(e) => onShowHeaderChange(e.target.checked)}
            />
            Show name/date
          </label>
          <label>
            <input
              type="checkbox"
              checked={showAnswers}
              onChange={(e) => onShowAnswersChange(e.target.checked)}
            />
            Show answers
          </label>
          <button onClick={handlePrint} className="print-btn">
            Print
          </button>
        </div>
      </div>
      {showScore && (
        <div className={`score-display no-print ${(score.correct / score.total) < 0.6 ? 'low' : ''}`}>
          Score: {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)
        </div>
      )}
      <div className="header-section">
        <h1>{getOperationTitle()}</h1>
        {showHeader && (
          <div className="name-date">
            <span>Name: _______________________</span>
            <span>Date: _______________________</span>
          </div>
        )}
      </div>
      <div className={`problems-grid ${getSizeClass()}`}>
        {problems.map(([num1, num2], index) => (
          <MathProblem
            key={index}
            multiplicand={num1}
            multiplier={num2}
            operation={operation}
            resetTrigger={resetTrigger}
            onFirstType={handleFirstType}
            showAnswer={showAnswers}
          />
        ))}
      </div>
    </div>
  );
} 