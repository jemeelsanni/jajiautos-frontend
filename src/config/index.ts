// src/config/index.ts
interface AppConfig {
  apiUrl: string;
  environment: string;
  appName: string;
  appDescription: string;
}

const getConfig = (): AppConfig => {
  // Try different ways to get environment variables
  let apiUrl = 'https://autostore-backend-led1.onrender.com/api'; // Default API URL
  let environment = 'production';

  // For Create React App
  if (typeof process !== 'undefined' && process.env) {
    apiUrl = process.env.REACT_APP_API_URL || apiUrl;
    environment = process.env.REACT_APP_ENV || process.env.NODE_ENV || environment;
  }

  // For Vite
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    apiUrl = import.meta.env.VITE_API_URL || apiUrl;
    environment = import.meta.env.VITE_ENV || import.meta.env.MODE || environment;
  }

  return {
    apiUrl,
    environment,
    appName: 'JajiAutos',
    appDescription: 'Premium Vehicle Sales in Nigeria'
  };
};

export const config = getConfig();

// Log configuration on load (only in development)
if (config.environment === 'development') {
  console.log('📱 App Configuration:', config);
}

export default config;