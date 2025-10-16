# Smart TV Interface with Auth0 Device Flow

A React-based smart TV interface that demonstrates Auth0 device flow authentication for TV applications with limited input capabilities.

## Features

- **Smart TV Interface**: Modern, sleek design that mimics real smart TV interfaces
- **Auth0 Device Flow**: Secure authentication designed for TV interfaces with limited input
- **StreamIt App**: Premium streaming service requiring authentication to access
- **Keyboard Navigation**: Use arrow keys to navigate between apps and Enter to launch
- **Responsive Design**: Adapts to different screen sizes
- **Visual Effects**: Animated elements and hover effects for enhanced user experience

## StreamIt Branding

StreamIt is designed as a premium streaming service with:
- **Colors**: Orange to gold gradient (#FF6B35 → #F7931E → #FFD700)
- **Logo**: Movie camera emoji (🎬) with custom styling
- **Effects**: Glowing border, sparkle animations, and premium badge
- **Typography**: Bold, modern font with letter spacing

## Available Apps

1. **StreamIt** - Premium streaming service (fictional)
2. **Netflix** - Popular streaming platform
3. **YouTube** - Video streaming and live content
4. **Spotify** - Music streaming service
5. **Games** - Gaming and entertainment
6. **Settings** - System preferences

## Getting Started

**Authentication is required to access StreamIt and demonstrate the device flow use case.**

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up Auth0 (see `AUTH0_SETUP.md` for detailed instructions):
   - Create an Auth0 application
   - Enable device flow
   - Create a `.env` file with your credentials

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

5. Click the StreamIt tile and authenticate using the device flow

## Authentication Flow

The StreamIt app demonstrates Auth0 device flow authentication:

1. **Launch StreamIt**: Click the StreamIt tile from the TV interface
2. **QR Code Display**: A QR code and user code are displayed on the TV
3. **Mobile Authentication**: User scans QR code with their phone or enters code manually
4. **Real-time Polling**: TV automatically detects when authentication completes
5. **Access Granted**: User can now access StreamIt content

## Navigation

- **Arrow Keys**: Navigate between app tiles
- **Enter**: Launch the selected app
- **Mouse**: Click on any app tile to launch it

## Project Structure

```
src/
├── components/
│   ├── TVInterface.js      # Main TV interface component
│   ├── TVInterface.css     # TV interface styles
│   ├── AppTile.js          # Individual app tile component
│   └── AppTile.css         # App tile styles
├── App.js                  # Main app component
├── App.css                 # App styles
├── index.js                # Entry point
└── index.css               # Global styles
```

## Customization

You can easily customize the interface by:
- Adding new apps in the `apps` array in `TVInterface.js`
- Modifying colors and gradients in the CSS files
- Adjusting the grid layout in `TVInterface.css`
- Adding new visual effects in `AppTile.css`

## Technologies Used

- React 18
- CSS3 with modern features (gradients, animations, transforms)
- Responsive design principles
- Keyboard event handling
