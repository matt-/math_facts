import { useState } from 'react'
import { PracticePage } from './components/PracticePage'

function App() {
  const [selectedNumber, setSelectedNumber] = useState<number | undefined>(undefined);
  const [problemsPerPage, setProblemsPerPage] = useState(40);
  const [showHeader, setShowHeader] = useState(false);

  return (
    <div className="container">
      <div className="controls no-print">
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
        <div className="control-group">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showHeader}
              onChange={(e) => setShowHeader(e.target.checked)}
            />
            Show name/date
          </label>
        </div>
      </div>
      <PracticePage
        selectedNumber={selectedNumber}
        problemsPerPage={problemsPerPage}
        showHeader={showHeader}
      />
    </div>
  )
}

export default App
