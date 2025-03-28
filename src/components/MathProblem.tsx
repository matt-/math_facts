interface MathProblemProps {
  multiplicand: number;
  multiplier: number;
}

export const MathProblem: React.FC<MathProblemProps> = ({ multiplicand, multiplier }) => {
  return (
    <div className="math-problem">
      <div className="problem-container">
        <div className="number">{multiplicand}</div>
        <div className="operation-row">
          <span className="multiplication-sign">×</span>
          <span className="number">{multiplier}</span>
        </div>
        <div className="answer-line"></div>
      </div>
    </div>
  );
}; 