import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          color: '#ffffff',
          textAlign: 'center',
          padding: '40px'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Something went wrong</h1>
          <p style={{ marginBottom: '20px', color: '#888' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
