import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const useLogoClick = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  return () => {
    const isAuth = isAuthenticated || !!token || !!localStorage.getItem('token');
    if (isAuth) {
      navigate('/app/marketplace');
    } else {
      navigate('/');
    }
  };
};

export default useLogoClick;
