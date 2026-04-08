import { Link, useLocation, Navigate } from 'react-router-dom';
import { STORAGE_KEYS, StorageService } from '../data/siteData';

function ResultPage() {
  const location = useLocation();
  const result = location.state || StorageService.read(STORAGE_KEYS.quizResult, null);

  if (!result) {
    return <Navigate to="/quiz" replace />;
  }

  return (
    <div className="page-shell">
      <header className="site-header">
        <Link to="/home" className="nav-btn">
          Home
        </Link>
        <h1>Quiz Result</h1>
        <Link to="/feedback" className="nav-btn">
          Feedback
        </Link>
      </header>

      <main className="content-page">
        <div className="result-card">
          <h2>Your Quiz Score</h2>

          <div className="score-circle">
            <span>
              {result.score} / {result.total}
            </span>
          </div>

          <p className="score-message">
            {result.percentage >= 70
              ? 'Good Job! You have a strong understanding of South Asia.'
              : 'Nice effort! Review the countries again and try for a higher score.'}
          </p>

          <div className="summary-card">
            <p>
              <strong>Total Questions:</strong> {result.total}
            </p>
            <p>
              <strong>Correct Answers:</strong> {result.score}
            </p>
            <p>
              <strong>Wrong Answers:</strong> {result.total - result.score}
            </p>
            <p>
              <strong>Percentage:</strong> {result.percentage}%
            </p>
          </div>

          <div className="review-list">
            {result.review.map((item, index) => (
              <div className="review-item" key={item.id}>
                <p>
                  {index + 1}. {item.q}
                </p>
                <span className={item.isCorrect ? 'correct-text' : 'incorrect-text'}>
                  {item.isCorrect
                    ? 'Correct'
                    : `Incorrect — your answer: ${item.userAnswer || 'none'}, correct answer: ${item.correct}`}
                </span>
              </div>
            ))}
          </div>

          <div className="action-row centered-actions">
            <Link to="/quiz" className="nav-btn">
              Retry Quiz
            </Link>
            <Link to="/home" className="nav-btn">
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <footer className="site-footer">© 2026 All About South Asian Countries</footer>
    </div>
  );
}

export default ResultPage;