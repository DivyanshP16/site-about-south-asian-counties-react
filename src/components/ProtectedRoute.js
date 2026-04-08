import { Navigate } from 'react-router-dom';

function ProtectedRoute({ activeUser, children }) {
  if (!activeUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;