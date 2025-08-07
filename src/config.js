// Configuration for API endpoints
const getApiUrl = () => {
  // If environment variable is set, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // If we're in production (not localhost), use the deployed backend
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Replace this with your actual Render backend URL
    return "https://song-application-p2ab.onrender.com";
  }
  
  // Default to localhost for development
  return "http://127.0.0.1:5000";
};

export const API_BASE_URL = getApiUrl(); 