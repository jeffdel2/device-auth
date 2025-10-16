class AuthService {
  constructor() {
    this.domain = process.env.REACT_APP_AUTH0_DOMAIN;
    this.clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
    this.audience = process.env.REACT_APP_AUTH0_AUDIENCE;
    
    const config = {
      domain: this.domain || 'NOT SET',
      clientId: this.clientId || 'NOT SET',
      audience: this.audience || 'NOT SET',
      isConfigured: !!(this.domain && this.clientId && this.domain !== 'your-domain.auth0.com' && this.clientId !== 'your-client-id')
    };
    
    // Log Auth0 service configuration
    console.log('🔐 Auth0 Service Initialized:', config);
    
    if (!config.isConfigured) {
      console.warn('⚠️ Auth0 not configured. Please set REACT_APP_AUTH0_DOMAIN and REACT_APP_AUTH0_CLIENT_ID');
    }
    
    this.deviceCode = null;
    this.userCode = null;
    this.verificationUri = null;
    this.verificationUriComplete = null;
    this.interval = null;
    this.expiresIn = null;
    this.isAuthenticated = false;
    this.user = null;
  }

  async startDeviceFlow() {
    try {
      // Check if Auth0 is configured
      if (!this.domain || !this.clientId || this.domain === 'your-domain.auth0.com' || this.clientId === 'your-client-id') {
        throw new Error('Auth0 not configured. Please set up Auth0 credentials.');
      }

      console.log('🚀 Starting Auth0 Device Flow');
      console.log('📡 Device Code Endpoint:', `https://${this.domain}/oauth/device/code`);
      
      // Create form data as per Auth0 documentation
      const formData = new URLSearchParams();
      formData.append('client_id', this.clientId);
      formData.append('scope', 'openid profile email');
      if (this.audience) {
        formData.append('audience', this.audience);
      }

      console.log('📤 Device Flow Request (form data):', {
        client_id: this.clientId,
        scope: 'openid profile email',
        audience: this.audience || 'Not set'
      });

      const response = await fetch(`https://${this.domain}/oauth/device/code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Auth0 Device Flow Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Auth0 Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Device Flow Response:', {
        userCode: data.user_code,
        verificationUri: data.verification_uri,
        expiresIn: data.expires_in
      });

      this.deviceCode = data.device_code;
      this.userCode = data.user_code;
      this.verificationUri = data.verification_uri;
      this.verificationUriComplete = data.verification_uri_complete;
      this.expiresIn = data.expires_in;

      const result = {
        userCode: this.userCode,
        verificationUri: this.verificationUri,
        verificationUriComplete: this.verificationUriComplete,
        expiresIn: this.expiresIn,
      };
      
      console.log('📋 Device Flow Info for User:', result);
      return result;
    } catch (error) {
      console.error('💥 Device Flow Start Error:', error);
      throw error;
    }
  }

  async pollForTokens() {
    console.log('🔄 Starting token polling...');
    return new Promise((resolve, reject) => {
      this.interval = setInterval(async () => {
        try {
          console.log('🔍 Polling for tokens...', { deviceCode: this.deviceCode?.substring(0, 10) + '...' });

          // Create form data as per Auth0 documentation
          const formData = new URLSearchParams();
          formData.append('grant_type', 'urn:ietf:params:oauth:grant-type:device_code');
          formData.append('device_code', this.deviceCode);
          formData.append('client_id', this.clientId);

          const response = await fetch(`https://${this.domain}/oauth/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
          });

          const data = await response.json();

          if (data.error) {
            console.log('⏳ Polling response:', data.error);
            if (data.error === 'authorization_pending') {
              // Still waiting for user authorization
              return;
            } else if (data.error === 'slow_down') {
              // Rate limited, continue polling
              return;
            } else if (data.error === 'expired_token') {
              // Device code expired
              console.log('⏰ Device code expired');
              clearInterval(this.interval);
              reject(new Error('Device code expired. Please try again.'));
            } else if (data.error === 'access_denied') {
              // User denied the request
              console.log('🚫 Access denied by user');
              clearInterval(this.interval);
              reject(new Error('Access denied by user.'));
            } else {
              // Other error
              console.error('❌ Polling error:', data);
              clearInterval(this.interval);
              reject(new Error(data.error_description || data.error));
            }
            return;
          }

          // Success! Clear the interval and resolve with tokens
          console.log('🎉 Authentication successful!', { 
            hasAccessToken: !!data.access_token,
            hasIdToken: !!data.id_token 
          });
          clearInterval(this.interval);
          this.isAuthenticated = true;
          
          // Get user info
          const userInfo = await this.getUserInfo(data.access_token);
          this.user = userInfo;
          console.log('👤 User info retrieved:', userInfo);
          
          // Store tokens (in a real app, you'd want to store these securely)
          localStorage.setItem('streamit_access_token', data.access_token);
          localStorage.setItem('streamit_id_token', data.id_token);
          
          const result = {
            accessToken: data.access_token,
            idToken: data.id_token,
            user: userInfo,
          };
          
          console.log('✅ Authentication complete:', result);
          resolve(result);
        } catch (error) {
          clearInterval(this.interval);
          reject(error);
        }
      }, 2000); // Poll every 2 seconds
    });
  }

  async getUserInfo(accessToken) {
    try {
      const response = await fetch(`https://${this.domain}/userinfo`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting user info:', error);
      // Return a fallback user object
      return {
        sub: 'demo-user',
        name: 'Demo User',
        email: 'demo@streamit.com',
        picture: null,
      };
    }
  }

  stopPolling() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  logout() {
    this.isAuthenticated = false;
    this.user = null;
    this.deviceCode = null;
    this.userCode = null;
    localStorage.removeItem('streamit_access_token');
    localStorage.removeItem('streamit_id_token');
    this.stopPolling();
  }

  isLoggedIn() {
    return this.isAuthenticated && this.user !== null;
  }

  getUser() {
    return this.user;
  }

  getAccessToken() {
    return localStorage.getItem('streamit_access_token');
  }
}

export default new AuthService();
