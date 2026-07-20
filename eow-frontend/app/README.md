# EoD UI - React Native + Expo

A full-featured React Native application built with Expo, featuring delivery and travel booking functionality with modern UI components, animations, and cross-platform support (iOS, Android, and Web).

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Expo CLI** - Install globally with: `npm install -g expo-cli`
- **Expo Go App** - Download on [iOS App Store](https://apps.apple.com/app/apple-store/id982107779) or [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd eod-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

---

## 🌐 Web Testing

### Run on Web Browser
After starting the dev server, press **`w`** in the terminal to open the web version.

The app will automatically open at `http://localhost:8081`

### What's Supported on Web
- ✅ All screens (Home, Explore, Bookings, Profile)
- ✅ Animations and modals
- ✅ Safe area handling
- ⚠️ Map view (shows location list instead of interactive map)

---

## 📱 Mobile Testing with Expo Go

### Option 1: LAN Mode (Recommended for Same WiFi)

1. **Ensure your PC and phone are on the same WiFi network**

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Open Expo Go on your phone and scan the QR code** displayed in the terminal

4. **Wait for the app to load** (first load takes 1-2 minutes)

### Option 2: Tunnel Mode (Works on Any Network)

1. **Start the server with tunnel:**
   ```bash
   npm start -- --tunnel
   ```

2. **Scan the QR code with Expo Go on your phone**

3. **Wait for the bundle to download** (may take 2-3 minutes on first load)

### Option 3: Direct URL Connection

1. **Get your local IP address:**
   - On Windows: Run `ipconfig` and note your IPv4 address (e.g., `192.168.x.x`)

2. **Start the server:**
   ```bash
   npm start
   ```

3. **In Expo Go, tap "Scan QR code" or enter manually:**
   ```
   exp://YOUR_IP:8081
   ```

### Troubleshooting Connection Issues

**Problem: "java.io.IOException: Failed to download remote update"**

- ✅ Check WiFi connection on both PC and phone
- ✅ Ensure phone can reach the development server (same network)
- ✅ Try restarting Expo Go app
- ✅ Switch to tunnel mode: `npm start -- --tunnel`
- ✅ Check Windows Firewall - allow Node.js through firewall

**Problem: "Metro bundler failed"**
- ✅ Clear cache: `npm start -- --clear`
- ✅ Restart the dev server
- ✅ Delete `node_modules` and reinstall: `npm install`

**Problem: Module not found errors**
- ✅ Ensure all dependencies are installed: `npm install`
- ✅ Restart the dev server with `npm start`

---

## 📁 Project Structure

```
airbnb-ui/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── animations/      # Fade-in animations
│   │   ├── buttons/         # Custom buttons
│   │   ├── cards/           # Card components
│   │   ├── headers/         # App header
│   │   └── ui/              # Basic UI elements
│   ├── screens/             # Screen components
│   │   ├── Auth/            # Login, Register, Splash
│   │   ├── Home/            # Home screen
│   │   ├── Explore/         # Explore with map view
│   │   ├── Bookings/        # Bookings screen
│   │   ├── Profile/         # User profile
│   │   ├── Details/         # Booking details
│   │   ├── MapScreen/       # Map display
│   │   └── Onboarding/      # Welcome slides
│   ├── constants/           # Colors, spacing, typography
│   ├── mock/                # Mock data
│   ├── navigation/          # Navigation configuration
│   └── utils/               # Helper functions
├── App.tsx                  # Root component with SafeAreaProvider
├── app.json                 # Expo configuration
├── tailwind.config.js       # Tailwind CSS config
└── package.json             # Dependencies
```

---

## 🎨 Key Features

- ✨ **Modern UI** with Tailwind CSS styling
- 🎬 **Smooth Animations** (fade-in effects, confetti on claim)
- 🗺️ **Interactive Maps** (native on mobile, list view on web)
- 📱 **Responsive Design** - Works on all screen sizes
- 🛡️ **Safe Area Handling** - Properly handles status bars and navigation docks
- 🎯 **Tab Navigation** - Bottom tab bar with custom styling
- 🎉 **Modals & Dialogs** - For bookings and confirmations
- 🔐 **Auth Screens** - Login, register, forgot password

---

## 🛠️ Development Commands

```bash
# Start development server
npm start

# Start with tunnel mode
npm start -- --tunnel

# Start with clear cache
npm start -- --clear

# Open specific platform
npm start -- --web         # Open web
npm start -- --android     # Open Android emulator

# Build for production
npm run build
```

---

## 📝 Safe Area & Layout

The app uses `react-native-safe-area-context` to properly handle:
- ✅ Status bar at the top (iOS & Android)
- ✅ Navigation dock at the bottom (Android)
- ✅ Dynamic screen padding based on device

All screens automatically adjust content to prevent overlap with system UI elements.

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| App won't load in Expo Go | Check WiFi connection, try tunnel mode, restart Expo Go |
| "Metro bundler failed" | Clear cache: `npm start -- --clear` |
| Maps not showing | Maps only work on native (iOS/Android), web shows location list |
| Animations not smooth | Update @shopify/flash-list: `npm install @shopify/flash-list@latest` |
| SafeAreaView warnings | Already using `react-native-safe-area-context` - warnings are normal legacy messages |

---

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Phosphor Icons](https://phosphoricons.com/)

---

## 📄 License

This project is for educational purposes.

---

## 🎓 Getting Started Tips for Beginners

1. **First Time?** Start with `npm start` and scan QR code with Expo Go
2. **Hot Reload:** Changes auto-reload - just save your file!
3. **Debug:** Shake your phone to open Expo Go menu with debugging tools
4. **Learn More:** Check `src/screens/` to see how screens are built
5. **Customize:** Modify colors in `src/constants/colors.ts`

Happy coding! 🚀
