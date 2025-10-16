import React, { useState, useEffect, memo, useCallback } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import AppTile from './AppTile';
import StreamItApp from './StreamItApp';
import './TVInterface.css';

const TVInterface = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showStreamIt, setShowStreamIt] = useState(false);
  const [apps] = useState([
    {
      id: 'streamit',
      name: 'StreamIt',
      icon: '🎬',
      color: '#FF6B35',
      gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
      description: 'Stream unlimited movies and shows'
    },
    {
      id: 'flixnet',
      name: 'FlixNet',
      icon: '📺',
      color: '#E50914',
      gradient: 'linear-gradient(135deg, #E50914 0%, #B81D13 100%)',
      description: 'Watch TV shows and movies'
    },
    {
      id: 'viewtube',
      name: 'ViewTube',
      icon: '📹',
      color: '#FF0000',
      gradient: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
      description: 'Watch videos and live streams'
    },
    {
      id: 'tunify',
      name: 'Tunify',
      icon: '🎵',
      color: '#1DB954',
      gradient: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
      description: 'Music streaming service'
    },
    {
      id: 'playzone',
      name: 'PlayZone',
      icon: '🎮',
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
      description: 'Play games and entertainment'
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: '⚙️',
      color: '#6B7280',
      gradient: 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)',
      description: 'System settings and preferences'
    }
  ]);

  const handleKeyPress = (event) => {
    const cols = 3; // 3 columns
    const rows = Math.ceil(apps.length / cols);
    
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev - cols;
          return newIndex >= 0 ? newIndex : prev;
        });
        break;
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev + cols;
          return newIndex < apps.length ? newIndex : prev;
        });
        break;
      case 'ArrowLeft':
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'ArrowRight':
        event.preventDefault();
        setSelectedIndex(prev => prev < apps.length - 1 ? prev + 1 : prev);
        break;
      case 'Enter':
        event.preventDefault();
        handleAppLaunch(apps[selectedIndex]);
        break;
      default:
        break;
    }
  };

  const handleAppLaunch = useCallback((app) => {
    console.log(`Launching ${app.name}...`);
    
    if (app.id === 'streamit') {
      setShowStreamIt(true);
    } else {
      // Here you would typically navigate to other apps or show a modal
      alert(`Launching ${app.name}!\n${app.description}`);
    }
  }, []);

  const handleCloseStreamIt = useCallback(() => {
    setShowStreamIt(false);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedIndex]);

  return (
    <Box className="tv-set">
      <Box className="tv-bezel">
        <Box className="tv-screen">
          {showStreamIt ? (
            <StreamItApp onClose={handleCloseStreamIt} />
          ) : (
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <Box className="tv-interface">
                <Box className="tv-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography variant="h1" component="h1" className="tv-title">
                    Smart TV
                  </Typography>
                  <Typography variant="h5" component="div" className="tv-time" sx={{ opacity: 0.7 }}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
                
                <Grid 
                  container 
                  spacing={3} 
                  className="apps-grid"
                  justifyContent="center"
                  alignItems="center"
                >
                  {apps.map((app, index) => (
                    <Grid 
                      item 
                      xs={12} 
                      sm={6} 
                      md={4} 
                      lg={3} 
                      key={app.id}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'center',
                        maxWidth: { xs: '100%', sm: '50%', md: '33.333%', lg: '25%' }
                      }}
                    >
                      <AppTile
                        app={app}
                        isSelected={index === selectedIndex}
                        onClick={() => handleAppLaunch(app)}
                      />
                    </Grid>
                  ))}
                </Grid>
                
                <Box className="tv-footer" sx={{ textAlign: 'center', mt: 4 }}>
                  <Typography variant="body2" className="navigation-hint" sx={{ opacity: 0.6 }}>
                    Use arrow keys to navigate • Press Enter to launch
                  </Typography>
                </Box>
              </Box>
            </Container>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default memo(TVInterface);
