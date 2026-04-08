import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { STORAGE_KEYS, StorageService } from '../data/siteData';

function QuizPage({ quizEngine }) {
  const navigate = useNavigate();
  const [questionSet, setQuestionSet] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');

  const resetQuiz = useCallback(() => {
    setQuestionSet(quizEngine.createQuestionSet());
    setAnswers({});
    setError('');
  }, [quizEngine]);

  useEffect(() => {
    resetQuiz();
  }, [resetQuiz]);

  const handleAnswerChange = (questionId, choice) => {
    setAnswers((current) => ({ ...current, [questionId]: choice }));
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // if (Object.keys(answers).length !== questionSet.length) {
    //   setError('Please answer every question before submitting the quiz.');
    //   return;
    // }

    const result = quizEngine.grade(questionSet, answers);
    StorageService.write(STORAGE_KEYS.quizResult, result);
    navigate('/result', { state: result });
  };

  return (
    <div className="page-shell">
      <header className="site-header">
        <Link to="/home" className="nav-btn">
          Home
        </Link>
        <h1>South Asia Quiz</h1>
        <Link to="/feedback" className="nav-btn">
          Feedback
        </Link>
      </header>

      <main className="content-page">
        <div className="quiz-box">
          <h2>Test Your Knowledge</h2>
          <p className="subtitle">Answer the following questions</p>

          <form onSubmit={handleSubmit}>
            <div className="questions-container">
              {questionSet.map((question, index) => (
                <div className="question-card" key={question.id}>
                  <p>
                    {index + 1}. {question.q}
                  </p>
                  {question.choices.map((choice) => (
                    <label key={choice} className="choice-row">
                      <input
                        type="radio"
                        name={question.id}
                        value={choice}
                        checked={answers[question.id] === choice}
                        onChange={() => handleAnswerChange(question.id, choice)}
                      />
                      {choice}
                    </label>
                  ))}
                </div>
              ))}
            </div>

            {error && <small className="error-text">{error}</small>}

            <div className="action-row">
              <button type="submit" className="btn">
                Submit Quiz
              </button>
              <button type="button" className="btn" onClick={resetQuiz}>
                Retake Quiz
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="site-footer">© 2026 All About South Asian Countries</footer>
    </div>
  );
}

export default QuizPage;