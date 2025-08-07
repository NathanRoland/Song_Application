// Configuration for API endpoints
const getApiUrl = () => {
  // If environment variable is set, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // For development, always use localhost backend
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return "http://127.0.0.1:5001";
  }
  
  // For production, use the deployed backend
  return "https://dub-finder-backend.onrender.com";
};

export const API_BASE_URL = getApiUrl(); 