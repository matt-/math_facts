import { useState, useEffect } from 'react';
import { MathProblem } from './MathProblem';

interface PracticePageProps {
  selectedNumber?: number;
  problemsPerPage: number;
  showHeader: boolean;
}

export function PracticePage({ selectedNumber, problemsPerPage, showHeader }: PracticePageProps) {
  const [problems, setProblems] = useState<Array<[number, number]>>([]);

  useEffect(() => {
    generateProblems();
  }, [selectedNumber, problemsPerPage]);

  const generateProblems = () => {
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

  const getSizeClass = () => {
    if (problemsPerPage <= 30) return 'size-30';
    if (problemsPerPage <= 40) return 'size-40';
    return 'size-50';
  };

  return (
    <div className="practice-page">
      <button onClick={generateProblems} className="new-problems-btn no-print">
        New Problems
      </button>
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
          />
        ))}
      </div>
    </div>
  );
} 