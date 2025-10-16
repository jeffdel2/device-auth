// Debug utility for troubleshooting
export const debugLog = (message, data = null) => {
  console.log(`[StreamIt Debug] ${message}`, data || '');
};

export const checkAuth0Config = () => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  
  const config = {
    serverUrl: serverUrl || 'http://localhost:3001',
    deviceCodeEndpoint: `${serverUrl || 'http://localhost:3001'}/api/auth/device-code`,
    tokenEndpoint: `${serverUrl || 'http://localhost:3001'}/api/auth/token`,
    isConfigured: !!(serverUrl || true) // Default to localhost for development
  };
  
  // Always log to console for debugging
  console.log('🔧 Auth0 Server Proxy Configuration:', config);
  console.log('📋 Environment Variables:', {
    'REACT_APP_SERVER_URL': process.env.REACT_APP_SERVER_URL || 'http://localhost:3001 (default)'
  });
  
  debugLog('Auth0 Server Proxy Configuration Check:', config);
  
  return {
    isConfigured: config.isConfigured,
    serverUrl: config.serverUrl,
    deviceCodeEndpoint: config.deviceCodeEndpoint,
    tokenEndpoint: config.tokenEndpoint
  };
};
