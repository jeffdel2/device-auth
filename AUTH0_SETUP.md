# Auth0 Device Flow Setup Guide

This guide will help you set up Auth0 for the Device Authorization Flow in the StreamIt Smart TV application.

## Overview

The Device Authorization Flow is perfect for smart TVs and other input-constrained devices. It allows users to authenticate by:
1. Getting a user code from the device
2. Visiting a URL on their phone/computer
3. Entering the code and logging in
4. The device automatically receives the authentication tokens

## Prerequisites

- Auth0 account (free tier available)
- Basic understanding of OAuth 2.0 flows

## Step 1: Create an Auth0 Application

1. **Log in to Auth0 Dashboard**
   - Go to [auth0.com](https://auth0.com) and sign in
   - Navigate to your dashboard

2. **Create a New Application**
   - Click "Applications" in the left sidebar
   - Click "Create Application"
   - Name: `StreamIt Smart TV`
   - Type: **Native** (this is important for device flow)
   - Click "Create"

3. **Configure Application Settings**
   - Go to the "Settings" tab of your new application
   - **Application Type**: Native
   - **Token Endpoint Authentication Method**: None
   - **Allowed Callback URLs**: `http://localhost:3000` (for development)
   - **Allowed Web Origins**: `http://localhost:3000` (for development)
   - **Allowed Logout URLs**: `http://localhost:3000` (for development)

4. **Enable Device Code Grant**
   - Scroll down to "Advanced Settings"
   - Click "Grant Types" tab
   - Enable "Device Code" grant type
   - Click "Save Changes"

## Step 2: Create an API (Optional but Recommended)

1. **Create API**
   - Go to "APIs" in the left sidebar
   - Click "Create API"
   - Name: `StreamIt API`
   - Identifier: `https://api.streamit.com` (or your preferred identifier)
   - Signing Algorithm: RS256
   - Click "Create"

2. **Configure API Settings**
   - Go to "Settings" tab
   - **Allow Offline Access**: Enabled (for refresh tokens)
   - Click "Save Changes"

## Step 3: Configure Environment Variables

1. **Copy Environment File**
   ```bash
   cp env.example .env
   ```

2. **Update .env with your Auth0 values**
   ```env
   # Auth0 Configuration
   REACT_APP_AUTH0_DOMAIN=your-domain.auth0.com
   REACT_APP_AUTH0_CLIENT_ID=your-client-id
   REACT_APP_AUTH0_AUDIENCE=your-api-identifier
   ```

3. **Get your Auth0 values from the Dashboard**
   - **REACT_APP_AUTH0_DOMAIN**: Found in your application settings (e.g., `dev-abc123.us.auth0.com`)
   - **REACT_APP_AUTH0_CLIENT_ID**: Found in your application settings
   - **REACT_APP_AUTH0_AUDIENCE**: The identifier of your API (e.g., `https://api.streamit.com`)

## Step 4: Test the Setup

1. **Start the development server**
   ```bash
   npm start
   ```

2. **Test the device flow**
   - Open the StreamIt app
   - Click "Launch StreamIt"
   - You should see a QR code and user code
   - **Option 1**: Scan the QR code with your phone's camera
   - **Option 2**: Visit the verification URL and enter the user code manually
   - The app should authenticate successfully

## Troubleshooting

### Common Issues

1. **"Device Code grant type not enabled"**
   - Make sure you enabled "Device Code" in the Grant Types section
   - Application type must be "Native"

2. **"Invalid client"**
   - Check that your CLIENT_ID is correct
   - Ensure the application type is "Native"

3. **"Invalid audience"**
   - Make sure your API identifier matches the audience in your request
   - Check that the API exists in your Auth0 dashboard

4. **CORS errors**
   - Add your domain to "Allowed Web Origins" in application settings
   - For development, use `http://localhost:3000`

### Debug Mode

The application includes comprehensive logging. Check the browser console for detailed information about:
- Auth0 configuration
- Device flow requests and responses
- Token polling status
- Error details

## Security Considerations

1. **Client Secret**: Not needed for Native applications with device flow
2. **HTTPS**: Use HTTPS in production
3. **Token Storage**: Consider using secure storage for tokens
4. **Audience**: Always specify an audience for your API

## Next Steps

- Set up a production domain
- Configure proper CORS settings
- Implement token refresh
- Add user management features
- Set up monitoring and logging

## Resources

- [Auth0 Device Authorization Flow Documentation](https://auth0.com/docs/get-started/authentication-and-authorization-flow/device-authorization-flow/call-your-api-using-the-device-authorization-flow)
- [OAuth 2.0 Device Authorization Grant](https://tools.ietf.org/html/rfc8628)
- [Auth0 Dashboard](https://manage.auth0.com/)