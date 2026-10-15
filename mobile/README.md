# Exotic Racing Mobile

Expo + React Native + TypeScript companion app for the Exotic Racing Team IAET vehicle systems workspace.

## Run on Android

Requirements: Node.js 22.13+ and npm.

```bash
cd mobile
npm install
npx expo start
```

Install Expo Go on an Android device, then scan the QR code from the same trusted local network. Alternatively, use an Android emulator with Android Studio and run `npm run android`.

## Current screens

- Overview — connection readiness and unavailable telemetry.
- Battery — confirmed nameplate details (24 V, 80 Ah LiFePO4) and unavailable live readings.
- System — data source and diagnostics readiness.
- Test log — create and delete notes persisted locally on this device using AsyncStorage.

## Safety and data integrity

This is an early UI foundation, not a live vehicle monitor. No hardware connection, API, account, team sync, push notification, or remote command is implemented. A network connection or an empty value must not be interpreted as a safe vehicle state. No fabricated telemetry is displayed.

The logbook stores notes on this device only. Do not use it as the sole copy of safety-critical test records.

## Next integration steps

1. Test on an actual Android phone and fix layout issues.
2. Add unit tests for the mobile telemetry contract and UI state.
3. Agree on a backend API and authentication requirements.
4. Integrate a hardware adapter only after the BMS/controller models, documented interfaces, units, and safe bench-test process are confirmed.
