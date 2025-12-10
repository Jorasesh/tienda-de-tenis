import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function ProtectedRoute({ children, requiredType = 'admin' }) {
  const authUser = localStorage.getItem('authUser');
  
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(authUser);
  if (requiredType && user.type !== requiredType) {
    return <Navigate to="/" replace />;
  }
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredType: PropTypes.string
};

export default ProtectedRoute;
