import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logoutUser, clearAuthError } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const login = (credentials) => dispatch(loginUser(credentials));
  const register = (userData) => dispatch(registerUser(userData));
  const logout = () => dispatch(logoutUser());
  const clearError = () => dispatch(clearAuthError());

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };
};

export default useAuth;
