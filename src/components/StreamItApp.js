import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button
} from '@mui/material';
import { 
  Movie, 
  Person, 
  Logout, 
  PlayArrow,
  Close
} from '@mui/icons-material';
import authService from '../services/authService';
import StreamItAuth from './StreamItAuth';
import Profile from './Profile';
import { debugLog, checkAuth0Config } from '../utils/debug';

const StreamItApp = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    debugLog('StreamIt App initialized');
    checkAuth0Config();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = authService.getAccessToken();
    if (token && authService.isLoggedIn()) {
      setIsAuthenticated(true);
      setUser(authService.getUser());
    }
    setIsLoading(false);
  };


  const handleAuthSuccess = (authResult) => {
    setIsAuthenticated(true);
    setUser(authResult.user);
    setShowAuth(false);
  };

  const handleAuthCancel = () => {
    setShowAuth(false);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleLaunch = () => {
    if (isAuthenticated) {
      // User is already authenticated, show the app
      return;
    } else {
      // Check if Auth0 is configured
      const config = checkAuth0Config();
      debugLog('Launching StreamIt authentication', { isConfigured: config.isConfigured });
      
      if (!config.isConfigured) {
        // Auth0 not configured, show setup instructions
        alert('Auth0 Authentication Required!\n\nTo access StreamIt:\n1. Set up Auth0 (see AUTH0_SETUP.md)\n2. Create a .env file with your credentials\n3. Restart the application\n\nAuthentication is required to showcase the device flow use case.');
        return;
      }
      
      // Show authentication flow
      setShowAuth(true);
    }
  };

  if (isLoading) {
    return (
      <div className="streamit-app">
        <div className="loading-screen">
          <div className="streamit-logo">
            <div className="streamit-icon">🎬</div>
            <h1 className="streamit-title">StreamIt</h1>
          </div>
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (showAuth) {
    return (
      <StreamItAuth
        onAuthSuccess={handleAuthSuccess}
        onAuthCancel={handleAuthCancel}
      />
    );
  }

  if (showProfile) {
    return (
      <Profile
        onBack={() => setShowProfile(false)}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ 
        height: '100%', 
        width: '100%', 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)', 
        color: 'white', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ marginBottom: '40px' }}>
          <Movie sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
          <Typography variant="h4" component="h1" style={{ fontWeight: 300, color: 'white' }}>
            StreamIt
          </Typography>
        </div>
        <Typography variant="h6" style={{ marginBottom: '30px', opacity: 0.7, color: 'white' }}>
          Premium Streaming Experience
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          onClick={handleLaunch}
          startIcon={<PlayArrow />}
          style={{ marginBottom: '20px', padding: '12px 24px' }}
        >
          Sign In to StreamIt
        </Button>
        <Typography variant="body2" style={{ marginBottom: '20px', opacity: 0.6, color: 'white' }}>
          Authentication required. Set up Auth0 to access the device flow demonstration.
        </Typography>
        <Button 
          variant="outlined" 
          onClick={onClose}
          startIcon={<Close />}
          size="small"
          style={{ padding: '8px 16px' }}
        >
          Back to TV
        </Button>
      </div>
    );
  }

  return (
    <div style={{ 
      height: '100%', 
      width: '100%', 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)', 
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: 'rgba(26, 26, 26, 0.95)', 
        padding: '16px 24px', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Movie sx={{ fontSize: 24, color: '#1976d2', mr: 1 }} />
          <Typography variant="h6" component="h1" style={{ fontWeight: 300, color: 'white' }}>
            StreamIt
          </Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Typography variant="body2" style={{ opacity: 0.8, fontSize: '0.8rem', color: 'white' }}>
            Welcome, {user?.name || user?.email}
          </Typography>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => setShowProfile(true)}
            startIcon={<Person />}
            style={{ minWidth: 'auto', padding: '4px 8px' }}
          >
            Profile
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            onClick={handleLogout}
            startIcon={<Logout />}
            style={{ minWidth: 'auto', padding: '4px 8px' }}
          >
            Sign Out
          </Button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <Typography variant="h5" component="h2" style={{ marginBottom: '16px', fontWeight: 400, color: 'white' }}>
            Featured Content
          </Typography>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px', 
            marginBottom: '24px' 
          }}>
            <div style={{ 
              background: 'rgba(25, 118, 210, 0.1)', 
              border: '1px solid #1976d2', 
              borderRadius: '12px', 
              padding: '20px', 
              textAlign: 'center', 
              transition: 'all 0.3s ease', 
              cursor: 'pointer' 
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎬</div>
              <Typography variant="subtitle1" component="h3" style={{ fontWeight: 600, marginBottom: '8px', color: 'white' }}>
                Premium Movies
              </Typography>
              <Typography variant="body2" style={{ opacity: 0.7, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                Exclusive content
              </Typography>
            </div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              borderRadius: '12px', 
              padding: '20px', 
              textAlign: 'center', 
              transition: 'all 0.3s ease', 
              cursor: 'pointer' 
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📺</div>
              <Typography variant="subtitle1" component="h3" style={{ fontWeight: 600, marginBottom: '8px', color: 'white' }}>
                Original Series
              </Typography>
              <Typography variant="body2" style={{ opacity: 0.7, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                StreamIt Originals
              </Typography>
            </div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              borderRadius: '12px', 
              padding: '20px', 
              textAlign: 'center', 
              transition: 'all 0.3s ease', 
              cursor: 'pointer' 
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎭</div>
              <Typography variant="subtitle1" component="h3" style={{ fontWeight: 600, marginBottom: '8px', color: 'white' }}>
                Live Events
              </Typography>
              <Typography variant="body2" style={{ opacity: 0.7, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                Live streaming
              </Typography>
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: '32px' }}>
          <Typography variant="h5" component="h2" style={{ marginBottom: '16px', fontWeight: 400, color: 'white' }}>
            Browse Categories
          </Typography>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
            gap: '8px' 
          }}>
            {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Documentary', 'Kids'].map((category) => (
              <Chip 
                key={category}
                label={category} 
                variant="outlined" 
                size="small"
                style={{ width: '100%', height: '36px', fontSize: '0.8rem' }}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ 
        padding: '16px 24px', 
        textAlign: 'center', 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
        background: 'rgba(26, 26, 26, 0.95)' 
      }}>
        <Button 
          variant="outlined" 
          onClick={onClose}
          startIcon={<Close />}
          size="small"
          style={{ padding: '8px 16px' }}
        >
          Back to TV
        </Button>
      </div>
    </div>
  );
};

export default StreamItApp;
