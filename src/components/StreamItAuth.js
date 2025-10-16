import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  LinearProgress,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { 
  Movie, 
  QrCode, 
  CheckCircle, 
  Error, 
  Close,
  Refresh
} from '@mui/icons-material';
import QRCode from 'qrcode';
import authService from '../services/authService';
import './StreamItAuth.css';

const StreamItAuth = ({ onAuthSuccess, onAuthCancel }) => {
  const [authState, setAuthState] = useState('initializing'); // initializing, device-code, polling, success, error
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const qrCanvasRef = useRef(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const generateQRCode = async (verificationUriComplete) => {
    try {
      if (qrCanvasRef.current) {
        // Generate QR code to canvas
        await QRCode.toCanvas(qrCanvasRef.current, verificationUriComplete, {
          width: 200,
          margin: 2,
          color: {
            dark: '#FF6B35',
            light: '#FFFFFF'
          }
        });
        
        // Also generate as data URL for fallback
        const qrDataUrl = await QRCode.toDataURL(verificationUriComplete, {
          width: 200,
          margin: 2,
          color: {
            dark: '#FF6B35',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(qrDataUrl);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const initializeAuth = async () => {
    try {
      setAuthState('device-code');
      const info = await authService.startDeviceFlow();
      setDeviceInfo(info);
      setCountdown(info.expiresIn);
      
      // Generate QR code
      if (info.verificationUriComplete) {
        await generateQRCode(info.verificationUriComplete);
      }
      
      // Start countdown
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setAuthState('error');
            setError('Authentication code expired. Please try again.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Start polling for tokens
      setAuthState('polling');
      const result = await authService.pollForTokens();
      clearInterval(countdownInterval);
      setAuthState('success');
      onAuthSuccess(result);
    } catch (err) {
      setAuthState('error');
      let errorMessage = err.message || 'Authentication failed. Please try again.';
      
      // Provide more helpful error messages
      if (errorMessage.includes('Auth0 not configured')) {
        errorMessage = 'Auth0 is not configured yet. Please set up Auth0 credentials first.';
      } else if (errorMessage.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your internet connection and Auth0 configuration.';
      }
      
      setError(errorMessage);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleRetry = () => {
    setError(null);
    setAuthState('initializing');
    initializeAuth();
  };

  const handleCancel = () => {
    authService.stopPolling();
    onAuthCancel();
  };

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
            StreamIt Authentication
          </Typography>
        </div>
        <Button 
          variant="outlined" 
          size="small"
          onClick={handleCancel}
          startIcon={<Close />}
          style={{ minWidth: 'auto', padding: '4px 8px' }}
        >
          Cancel
        </Button>
      </div>

      {/* Content */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          padding: '32px', 
          maxWidth: '500px', 
          width: '100%',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
            <Box className="auth-header" sx={{ textAlign: 'center', mb: 3 }}>
              <Box className="streamit-logo" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <Movie sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                <Typography variant="h4" component="h1" className="streamit-title" sx={{ fontWeight: 300 }}>
                  StreamIt
                </Typography>
              </Box>
              <Typography variant="h6" className="auth-subtitle" sx={{ opacity: 0.7 }}>
                Premium Streaming Experience
              </Typography>
            </Box>

            <Box className="auth-content">
              {authState === 'initializing' && (
                <Box className="auth-step" sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress size={60} sx={{ mb: 3 }} />
                  <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                    Initializing Authentication
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.7 }}>
                    Setting up your secure login...
                  </Typography>
                </Box>
              )}

              {authState === 'device-code' && (
                <Box className="auth-step">
                  <Box className="device-code-display" sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
                      Scan QR Code with Your Phone
                    </Typography>
                    <Box style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      marginBottom: '32px',
                      padding: '24px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <canvas 
                        ref={qrCanvasRef} 
                        style={{ 
                          maxWidth: '200px', 
                          height: 'auto',
                          borderRadius: '8px',
                          display: qrCodeUrl ? 'none' : 'block'
                        }}
                      ></canvas>
                      {qrCodeUrl && (
                        <img 
                          src={qrCodeUrl} 
                          alt="QR Code" 
                          style={{ 
                            maxWidth: '200px', 
                            height: 'auto',
                            borderRadius: '8px',
                            display: 'block'
                          }} 
                        />
                      )}
                    </Box>
                    <Divider sx={{ my: 3 }} />
                    <Box className="alternative-method">
                      <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                        Or enter this code manually:
                      </Typography>
                      <Box className="user-code" sx={{ 
                        background: 'rgba(25, 118, 210, 0.1)', 
                        border: '1px solid #1976d2', 
                        borderRadius: 2, 
                        p: 2, 
                        mb: 2,
                        fontFamily: 'monospace',
                        fontSize: '1.5rem',
                        fontWeight: 600
                      }}>
                        {deviceInfo?.userCode}
                      </Box>
                      <Typography variant="body2" className="code-instructions" sx={{ opacity: 0.7 }}>
                        Visit <strong>{deviceInfo?.verificationUri}</strong> and enter the code above
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              {authState === 'polling' && (
                <Box className="auth-step">
                  <Box className="polling-status" sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} sx={{ mb: 3 }} />
                    <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                      Waiting for authentication...
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, opacity: 0.7 }}>
                      Please complete the login on your device
                    </Typography>
                    
                    {/* Show QR code during polling */}
                    <Box style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      marginBottom: '24px', 
                      opacity: 0.8,
                      padding: '20px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <canvas 
                        ref={qrCanvasRef} 
                        style={{ 
                          maxWidth: '150px', 
                          height: 'auto',
                          borderRadius: '8px',
                          display: qrCodeUrl ? 'none' : 'block'
                        }}
                      ></canvas>
                      {qrCodeUrl && (
                        <img 
                          src={qrCodeUrl} 
                          alt="QR Code" 
                          style={{ 
                            maxWidth: '150px', 
                            height: 'auto',
                            borderRadius: '8px',
                            display: 'block'
                          }} 
                        />
                      )}
                    </Box>
                    
                    <Box className="countdown" sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        Code expires in: <strong>{formatTime(countdown)}</strong>
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={((deviceInfo?.expiresIn - countdown) / deviceInfo?.expiresIn) * 100}
                      sx={{ mb: 3 }}
                    />
                  </Box>
                </Box>
              )}

              {authState === 'success' && (
                <Box className="auth-step success" sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircle sx={{ fontSize: 80, color: '#4caf50', mb: 3 }} />
                  <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                    Welcome to StreamIt!
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.7 }}>
                    Authentication successful. Loading your content...
                  </Typography>
                </Box>
              )}

              {authState === 'error' && (
                <Box className="auth-step error" sx={{ textAlign: 'center', py: 4 }}>
                  <Error sx={{ fontSize: 80, color: '#f44336', mb: 3 }} />
                  <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                    Authentication Failed
                  </Typography>
                  <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                    {error}
                  </Alert>
                  <Box className="error-actions" sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button 
                      variant="contained" 
                      className="retry-btn" 
                      onClick={handleRetry}
                      startIcon={<Refresh />}
                    >
                      Try Again
                    </Button>
                    <Button 
                      variant="outlined" 
                      className="cancel-btn" 
                      onClick={handleCancel}
                      startIcon={<Close />}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>

            <div style={{ 
              textAlign: 'center', 
              marginTop: '24px', 
              paddingTop: '16px', 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)' 
            }}>
              <Button 
                variant="outlined" 
                onClick={handleCancel}
                startIcon={<Close />}
                size="small"
                style={{ padding: '8px 16px' }}
              >
                Back to TV
              </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StreamItAuth;
