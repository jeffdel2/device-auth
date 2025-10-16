import React, { memo } from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import { PlayArrow, Movie } from '@mui/icons-material';
import './AppTile.css';

const AppTile = ({ app, isSelected, onClick }) => {
  const isStreamIt = app.id === 'streamit';
  
  return (
    <Card 
      className={`app-tile ${isSelected ? 'selected' : ''} ${isStreamIt ? 'streamit-tile' : ''}`}
      onClick={onClick}
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
        border: isSelected ? '2px solid #1976d2' : '1px solid rgba(255, 255, 255, 0.1)',
        background: isStreamIt 
          ? 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
          : 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box className="app-icon" sx={{ textAlign: 'center', mb: 2 }}>
          {isStreamIt ? (
            <Box className="streamit-logo">
              <Movie sx={{ fontSize: 48, color: '#ffffff' }} />
            </Box>
          ) : (
            <Typography variant="h2" sx={{ fontSize: 48 }}>
              {app.icon}
            </Typography>
          )}
        </Box>
        
        <Box className="app-info" sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Typography variant="h6" component="h3" className="app-name" sx={{ mb: 1, fontWeight: 600 }}>
            {app.name}
          </Typography>
          <Typography variant="body2" className="app-description" sx={{ opacity: 0.7, mb: 2 }}>
            {app.description}
          </Typography>
        </Box>
        
        {isStreamIt && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Chip 
              label="PREMIUM" 
              size="small" 
              sx={{ 
                background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.75rem'
              }} 
            />
          </Box>
        )}
        
        {isSelected && (
          <Box className="selection-indicator" sx={{ position: 'absolute', top: 8, right: 8 }}>
            <IconButton size="small" sx={{ color: '#1976d2' }}>
              <PlayArrow />
            </IconButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(AppTile);
