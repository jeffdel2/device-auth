import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Avatar,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Movie, 
  ArrowBack, 
  ExpandMore, 
  OpenInNew,
  Person
} from '@mui/icons-material';
import authService from '../services/authService';

const Profile = ({ onBack }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [showTokens, setShowTokens] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get user info
      const userInfo = authService.getUser();
      setUser(userInfo);
      
      // Get tokens
      const accessToken = authService.getAccessToken();
      const idToken = localStorage.getItem('streamit_id_token');
      
      if (accessToken || idToken) {
        setTokens({
          accessToken: accessToken,
          idToken: idToken
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      setLoading(false);
    }
  };


  const formatToken = (token) => {
    if (!token) return 'Not available';
    
    // Show first 20 and last 20 characters for security
    if (token.length > 40) {
      return `${token.substring(0, 20)}...${token.substring(token.length - 20)}`;
    }
    return token;
  };

  const openJWTIO = (token) => {
    if (token) {
      const jwtIOUrl = `https://jwt.io/#debugger-io?token=${encodeURIComponent(token)}`;
      window.open(jwtIOUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        height: '100%', 
        width: '100%',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6" style={{ color: 'white' }}>Loading profile...</Typography>
        </div>
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
      {/* Header */}
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
            StreamIt Profile
          </Typography>
        </div>
        <Button 
          variant="outlined" 
          size="small"
          onClick={onBack}
          startIcon={<ArrowBack />}
          style={{ minWidth: 'auto', padding: '4px 8px' }}
        >
          Back to App
        </Button>
      </div>

      {/* Content */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '24px'
      }}>

        <Box className="profile-content" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card className="profile-card" sx={{ p: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Avatar 
                  src={user?.picture} 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    fontSize: '3rem',
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                
                <Box className="profile-info" sx={{ flex: 1 }}>
                  <Typography variant="h4" component="h2" className="profile-name" sx={{ mb: 1, fontWeight: 400 }}>
                    {user?.name || 'User'}
                  </Typography>
                  <Typography variant="h6" className="profile-email" sx={{ mb: 1, opacity: 0.8 }}>
                    {user?.email || 'No email available'}
                  </Typography>
                  <Typography variant="body2" className="profile-id" sx={{ opacity: 0.6, fontFamily: 'monospace' }}>
                    ID: {user?.sub || 'No ID available'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Box className="profile-actions" sx={{ textAlign: 'center' }}>
          </Box>

          <Card className="tokens-section">
            <Accordion expanded={showTokens} onChange={() => setShowTokens(!showTokens)}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person />
                  Authentication Tokens
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box className="tokens-content" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box className="token-item">
                    <Typography variant="h6" component="h4" sx={{ mb: 2 }}>
                      Access Token
                    </Typography>
                    <Box className="token-display" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box 
                        className="token-value" 
                        sx={{ 
                          flex: 1, 
                          background: 'rgba(0, 0, 0, 0.3)', 
                          border: '1px solid rgba(255, 255, 255, 0.2)', 
                          borderRadius: 1, 
                          p: 2, 
                          fontFamily: 'monospace',
                          fontSize: '0.9rem',
                          wordBreak: 'break-all'
                        }}
                      >
                        {formatToken(tokens?.accessToken)}
                      </Box>
                      {tokens?.accessToken && (
                        <IconButton 
                          className="jwt-btn"
                          onClick={() => openJWTIO(tokens.accessToken)}
                          title="Open in JWT.io"
                          size="small"
                          sx={{ color: '#1976d2' }}
                        >
                          <OpenInNew />
                        </IconButton>
                      )}
                    </Box>
                    <Typography variant="body2" className="token-description" sx={{ opacity: 0.7, fontStyle: 'italic' }}>
                      Used to authenticate API requests
                    </Typography>
                  </Box>

                  <Divider />

                  <Box className="token-item">
                    <Typography variant="h6" component="h4" sx={{ mb: 2 }}>
                      ID Token
                    </Typography>
                    <Box className="token-display" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box 
                        className="token-value" 
                        sx={{ 
                          flex: 1, 
                          background: 'rgba(0, 0, 0, 0.3)', 
                          border: '1px solid rgba(255, 255, 255, 0.2)', 
                          borderRadius: 1, 
                          p: 2, 
                          fontFamily: 'monospace',
                          fontSize: '0.9rem',
                          wordBreak: 'break-all'
                        }}
                      >
                        {formatToken(tokens?.idToken)}
                      </Box>
                      {tokens?.idToken && (
                        <IconButton 
                          className="jwt-btn"
                          onClick={() => openJWTIO(tokens.idToken)}
                          title="Open in JWT.io"
                          size="small"
                          sx={{ color: '#1976d2' }}
                        >
                          <OpenInNew />
                        </IconButton>
                      )}
                    </Box>
                    <Typography variant="body2" className="token-description" sx={{ opacity: 0.7, fontStyle: 'italic' }}>
                      Contains user identity information
                    </Typography>
                  </Box>

                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Tokens are sensitive information. Only share them with trusted applications.
                  </Alert>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Card>
        </Box>
      </div>
    </div>
  );
};

export default Profile;
