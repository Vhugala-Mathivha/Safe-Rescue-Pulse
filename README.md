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
- `src/screens/` – screens (Home, Map, Alerts, More, Log Emergency, Active Incidents and Warnings are built; Call is a placeholder)
- `src/i18n/` – language support; add translations in `translations.ts` (missing ones fall back to English)
- `src/notifications/` – the notifications the system sends, and the unread counter
- `src/components/` – header, alert level cards, incidents map preview, tab bar
