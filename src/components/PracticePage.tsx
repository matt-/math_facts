import { useState, useEffect } from 'react';
import { MathProblem } from './MathProblem';

interface PracticePageProps {
  selectedNumber?: number;
  problemsPerPage: number;
  showHeader: boolean;
}

export function PracticePage({ selectedNumber, problemsPerPage, showHeader }: PracticePageProps) {
  const [problems, setProblems] = useState<Array<[number, number]>>([]);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  // Generate problems on mount and when selectedNumber or problemsPerPage changes
  useEffect(() => {
    generateProblems();
  }, [selectedNumber, problemsPerPage]);

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
    setTimeLeft(60);
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
        const shouldBeTop = Math.random() < 0.5;
        newProblems.push(shouldBeTop ? 
          [selectedNumber, numbers[i]] : 
          [numbers[i], selectedNumber]
        );
      }
      
      // Fill remaining slots with random numbers if problemsPerPage > 12
      for (let i = 12; i < problemsPerPage; i++) {
        const randomNum = Math.floor(Math.random() * 12) + 1;
        const shouldBeTop = Math.random() < 0.5;
        newProblems.push(shouldBeTop ? 
          [selectedNumber, randomNum] : 
          [randomNum, selectedNumber]
        );
      }
    } else {
      // For mixed practice, keep it completely random
      for (let i = 0; i < problemsPerPage; i++) {
        const num1 = Math.floor(Math.random() * 12) + 1;
        const num2 = Math.floor(Math.random() * 12) + 1;
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
      const [multiplicand, multiplier] = input.dataset.problem?.split(',').map(Number) || [0, 0];
      const expectedAnswer = multiplicand * multiplier;
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
      <div className="button-group no-print">
        <button onClick={generateProblems} className="new-problems-btn">
          New Problems
        </button>
        <button onClick={handlePrint} className="print-btn">
          Print
        </button>
        <button onClick={checkAllAnswers} className="check-btn">
          Check All
        </button>
        {showScore && (
          <div className={`score ${(score.correct / score.total) < 0.6 ? 'low' : ''}`}>
            Score: {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)
          </div>
        )}
      </div>
      <div className="header-section">
        <h1>{selectedNumber ? `${selectedNumber}'s Times Tables` : 'Mixed Practice'}</h1>
        {showHeader && (
          <div className="name-date">
            <span>Name: _______________________</span>
            <span>Date: _______________________</span>
          </div>
        )}
      </div>
      <div className={`problems-grid ${getSizeClass()}`}>
        {problems.map(([multiplicand, multiplier], index) => (
          <MathProblem
            key={index}
            multiplicand={multiplicand}
            multiplier={multiplier}
            resetTrigger={resetTrigger}
            onFirstType={handleFirstType}
          />
        ))}
      </div>
    </div>
  );
} 