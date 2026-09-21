# Safe-Rescue-Pulse
Emergency Service App - TVH 

Mobile app (Expo / React Native + TypeScript) for intelligent public safety and emergency response.

## Running the app

```bash
npm install
npm start        # then scan the QR code with Expo Go, or press a (Android) / w (web)
```

## Structure

- `App.tsx` – app shell and bottom tab navigation
- `src/theme.ts` – colours, app name, default location
- `src/screens/` – screens (Home is built; Map is interactive; Call, Alerts, More are placeholders)
- `src/components/` – header, alert level cards, incidents map preview, tab bar
