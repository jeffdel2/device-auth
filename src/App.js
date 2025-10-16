import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import TVInterface from './components/TVInterface';
import ErrorBoundary from './components/ErrorBoundary';
import theme from './theme/theme';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <ErrorBoundary>
          <TVInterface />
        </ErrorBoundary>
      </div>
    </ThemeProvider>
  );
}

export default App;
