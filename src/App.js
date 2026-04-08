import { useEffect, useMemo, useState } from 'react';
import {
  HashRouter,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';
import './App.css';
import {
  CookieService,
  LoginInfo,
  QuizEngine,
  quizQuestions,
  STORAGE_KEYS,
  StorageService
} from './data/siteData';

// Components
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import CountryPage from './pages/CountryPage';
import TouristPage from './pages/TouristPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import FeedbackPage from './pages/FeedbackPage';

function App() {
  return (
    <HashRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <ScrollToTop />
      <SouthAsiaApp />
    </HashRouter>
  );
}

function SouthAsiaApp() {
  const [activeUser, setActiveUser] = useState(() => {
    const storedActiveUser = CookieService.read(
      STORAGE_KEYS.activeUser,
      StorageService.read(STORAGE_KEYS.activeUser, null)
    );

    return storedActiveUser ? LoginInfo.from(storedActiveUser) : null;
  });
  const [favorites, setFavorites] = useState(() =>
    StorageService.read(STORAGE_KEYS.favorites, [])
  );
  const quizEngine = useMemo(() => new QuizEngine(quizQuestions), []);

  useEffect(() => {
    if (activeUser) {
      const activeUserData = activeUser.toJSON ? activeUser.toJSON() : activeUser;
      StorageService.write(STORAGE_KEYS.activeUser, activeUserData);
      CookieService.write(STORAGE_KEYS.activeUser, activeUserData);
    } else {
      StorageService.remove(STORAGE_KEYS.activeUser);
      CookieService.remove(STORAGE_KEYS.activeUser);
    }
  }, [activeUser]);

  useEffect(() => {
    StorageService.write(STORAGE_KEYS.favorites, favorites);
  }, [favorites]);

  const toggleFavorite = (slug) => {
    setFavorites((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug]
    );
  };

  const handleLogout = () => {
    setActiveUser(null);
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage activeUser={activeUser} />} />
      <Route
        path="/login"
        element={
          activeUser ? (
            <Navigate to="/home" replace />
          ) : (
            <LoginPage onLogin={setActiveUser} />
          )
        }
      />
      <Route
        path="/signup"
        element={
          activeUser ? <Navigate to="/home" replace /> : <SignupPage />
        }
      />
      <Route
        path="/feedback"
        element={<FeedbackPage activeUser={activeUser} />}
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute activeUser={activeUser}>
            <HomePage
              activeUser={activeUser}
              favorites={favorites}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/countries/:slug"
        element={
          <ProtectedRoute activeUser={activeUser}>
            <CountryPage
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/countries/:slug/tourist-spots"
        element={
          <ProtectedRoute activeUser={activeUser}>
            <TouristPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz"
        element={
          <ProtectedRoute activeUser={activeUser}>
            <QuizPage quizEngine={quizEngine} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/result"
        element={
          <ProtectedRoute activeUser={activeUser}>
            <ResultPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
