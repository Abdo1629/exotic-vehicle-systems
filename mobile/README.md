# Exotic Racing Mobile

Expo + React Native + TypeScript companion app for the EVS vehicle systems workspace.

## Run on Android

Requirements: Node.js 22.13+ and npm.

```bash
cd mobile
npm install
npx expo start
```

Install Expo Go on an Android device and scan the QR code on a trusted local network, or use an Android emulator.

## Mobile experience

- Phone-safe app header with brand, connection status and language switch.
- Arabic/English UI with right-to-left layout for core screens.
- Bottom navigation: Overview, Battery, System diagnostics, Test log and Pit Mode checklist.
- Overview polls `/api/telemetry/latest` every 10 seconds when `EXPO_PUBLIC_EVS_API_URL` is configured.
- No fabricated readings: measurements remain unavailable until the API returns a verified hardware snapshot.
- Test notes and Pit Mode checklist use AsyncStorage on this device only; they are not synced or backed up.

## Downloadable Android APK

The website's `/download` page links to the latest published team-test APK. GitHub Actions builds the native Android app after changes to `mobile/**` reach `main`, then replaces the asset at the stable `mobile-latest` prerelease.

- Download page: `/download`
- APK asset: `https://github.com/Abdo1629/exotic-vehicle-systems/releases/download/mobile-latest/exotic-racing.apk`
- Build: Expo prebuild + Gradle `assembleDebug`; the APK is installable on Android but is debug-signed for internal team testing, not a production/Play Store release.
- The workflow caches the Android debug keystore so team-test builds can be updated using the same signature. Do not use this debug key for a production release.
- The first download becomes available only after the first successful Android APK workflow run on `main`. Check the repository's Actions tab if the download is not available yet.

Android may ask you to allow your browser to install APK files. Install only builds published from the official team repository. Vehicle telemetry still requires the backend and compatible hardware gateway to be configured.

## API configuration

Set `EXPO_PUBLIC_EVS_API_URL` to the EVS server base URL in the mobile app's local Expo environment. This is a public URL, not a secret. Never put the database service-role key or gateway ingestion token in an `EXPO_PUBLIC_*` variable.

**Do not point a production build at an endpoint with public vehicle reads.** The current latest-read API is an integration foundation; sign-in and team/vehicle-level read authorization must be implemented and verified before a public pilot. See [cellular telemetry architecture](../docs/cellular-telemetry-architecture.md).

## Real vehicle data

The app does not communicate directly with the BMS, motor controller, SIM or gateway. The intended path is:

1. Verified BMS/controller interfaces feed a vehicle gateway.
2. The gateway sends validated snapshots over cellular data using a SIM and HTTPS/TLS.
3. The authenticated server ingestion endpoint validates and stores snapshots in PostgreSQL.
4. The mobile app reads authorized latest snapshots from the server.

No gateway, hardware protocol, cellular modem or SIM plan has been selected yet. Verify exact controller/BMS models and interface documentation before choosing hardware.

## Safety and data integrity

A network connection or missing value must not be interpreted as a safe vehicle state. The app is not a safety controller and sends no vehicle commands. Do not use local mobile notes as the only copy of safety-critical records.

## Quality checks

Run `npm run typecheck` from `mobile/`, then test on a real Android device and a small-screen emulator. Verify Arabic and English, keyboard/input behavior, status bar and safe areas, poor connectivity, and server timeouts before release.
