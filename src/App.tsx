import { useState } from 'react'
import { PracticePage } from './components/PracticePage'

export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

function App() {
  const [selectedNumber, setSelectedNumber] = useState<number | undefined>(undefined);
  const [maxDigits, setMaxDigits] = useState(3);
  const [problemsPerPage, setProblemsPerPage] = useState(40);
  const [showHeader, setShowHeader] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<Operation>('multiplication');

  const operationSymbols: Record<Operation, string> = {
    addition: '+',
    subtraction: '−',
    multiplication: '×',
    division: '÷'
  };

  const showDigitsSelector = selectedOperation === 'addition' || selectedOperation === 'subtraction';
  const showNumberSelector = selectedOperation === 'multiplication' || selectedOperation === 'division';

  return (
    <div className="container">
      <div className="controls no-print">
        <div className="operation-tabs">
          {Object.entries(operationSymbols).map(([op, symbol]) => (
            <button
              key={op}
              className={`operation-tab ${selectedOperation === op ? 'selected' : ''}`}
              onClick={() => setSelectedOperation(op as Operation)}
            >
              {symbol}
            </button>
          ))}
        </div>
        {showNumberSelector && (
          <div className="control-group">
            <label>Practice:</label>
            <select
              value={selectedNumber || 'mixed'}
              onChange={(e) => setSelectedNumber(e.target.value === 'mixed' ? undefined : Number(e.target.value))}
            >
              <option value="mixed">Mixed</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}'s
                </option>
              ))}
            </select>
          </div>
        )}
        {showDigitsSelector && (
          <div className="control-group">
            <label>Max Digits:</label>
            <select
              value={maxDigits}
              onChange={(e) => setMaxDigits(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} digit{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="control-group">
          <label>Number of Problems:</label>
          <select
            value={problemsPerPage}
            onChange={(e) => setProblemsPerPage(Number(e.target.value))}
          >
            {[30, 40, 50, 60, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>
      <PracticePage
        selectedNumber={selectedNumber}
        maxDigits={maxDigits}
        problemsPerPage={problemsPerPage}
        showHeader={showHeader}
        operation={selectedOperation}
        onShowHeaderChange={(checked) => setShowHeader(checked)}
        showAnswers={showAnswers}
        onShowAnswersChange={(checked) => setShowAnswers(checked)}
      />
    </div>
  )
}

export default App
