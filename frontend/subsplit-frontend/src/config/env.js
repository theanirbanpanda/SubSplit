export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  MODE: import.meta.env.MODE || 'development',
  IS_DEV: import.meta.env.DEV ?? true,
  IS_PROD: import.meta.env.PROD ?? false,
};

export default ENV;
