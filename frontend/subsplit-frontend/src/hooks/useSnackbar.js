import { useState, useCallback } from 'react';

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success' | 'error' | 'warning' | 'info'
  });

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const showSuccess = useCallback((message) => showSnackbar(message, 'success'), [showSnackbar]);
  const showError = useCallback((message) => showSnackbar(message, 'error'), [showSnackbar]);
  const showWarning = useCallback((message) => showSnackbar(message, 'warning'), [showSnackbar]);
  const showInfo = useCallback((message) => showSnackbar(message, 'info'), [showSnackbar]);

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default useSnackbar;
