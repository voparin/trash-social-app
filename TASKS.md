# TASKS

## Backlog
- [x] A1 Define app scope + MVP acceptance criteria
  **SCOPE**: Local-first trash reporting mobile app (iOS/Android)
  - Two roles: Reporter (creates reports), Collector (collects trash)
  - Reporter: Take photo + GPS, add description, see own reports
  - Collector: View reports (list/map), navigate to location, mark collected with proof photo
  - Local storage only (no backend/sync in MVP)
  **MVP CRITERIA**:
  - [ ] User can select Reporter or Collector role at launch (persisted)
  - [ ] Reporter can create report (photo + GPS + description) and view report list
  - [ ] Collector can view reports in list/map, mark collected with proof photo
  - [ ] All data persists locally after app restart
  - [ ] App runs on both iOS and Android via Expo Go
- [ ] A2 Navigation plan (role-based)
- [ ] A3 Data model (local-first) + folder structure
- [ ] A4 Tech choices (state mgmt, storage, maps)

## Sprint (current)
- [x] S1 Navigation skeleton + RoleSelect
  - Acceptance: User can choose Reporter/Collector and see correct home screen.
  - Verify: `npx expo start` → choose each role → correct screen shows.
  - **What changed:**
    - Created 3 screens: RoleSelectScreen (2 buttons), ReporterHomeScreen, CollectorHomeScreen
    - Set up React Navigation native-stack in App.js
    - RoleSelect screen navigates to ReporterHome or CollectorHome based on button tap
  - **How to test:**
    1. Run `npx expo start`
    2. Scan QR code with Expo Go app
    3. Tap "Reporter" button → should navigate to Reporter Home screen
    4. Go back, tap "Collector" button → should navigate to Collector Home screen
- [x] S2 Persist role (AsyncStorage)
  - Acceptance: Role persists after app restart.
  - Verify: `npx expo start` → select role → reload/restart app → role retained.
  - **What changed:**
    - Created RoleContext with AsyncStorage persistence (load on mount, save on role change)
    - Updated App.js: wrapped in RoleProvider, checks saved role on launch, routes directly to correct home
    - Updated RoleSelectScreen: saves role to AsyncStorage when button pressed
    - Added loading spinner while checking saved role
  - **How to test:**
    1. Run `npx expo start` and open in Expo Go
    2. Select "Reporter" → navigates to Reporter Home
    3. Close app completely (swipe away) and reopen
    4. App should skip role selection and go directly to Reporter Home
    5. Test same flow with "Collector" role
- [x] S2.1 Add "Change role" action (reset navigation + clear storage)
  - Acceptance: From Reporter/Collector home, user can return to RoleSelect.
  - Verify: `npx expo start` → pick role → tap Change role → RoleSelect shows → restart app → stays on RoleSelect.
  - **What changed:**
    - Added "Change Role" button to ReporterHomeScreen and CollectorHomeScreen
    - Button calls clearRole() to remove saved role from AsyncStorage
    - Uses CommonActions.reset() to clear navigation stack and return to RoleSelect
    - After restart, app stays on RoleSelect (no saved role)
  - **How to test:**
    1. Run `npx expo start` and open in Expo Go
    2. Select "Reporter" → navigates to Reporter Home
    3. Tap "Change Role" button → returns to RoleSelect screen
    4. Select "Collector" this time → navigates to Collector Home
    5. Close app completely and reopen → should show RoleSelect (role was cleared)



- [x] S3 Reporter: create report (photo + GPS) stored locally
  - Acceptance: Reporter can create a report with photo + GPS + description and it appears in list.
  - Verify: `npx expo start` → create report → see it in list with photo thumbnail + coords.
  - **What changed:**
    - Created `contexts/ReportsContext.js`: React Context + AsyncStorage persistence (same pattern as RoleContext). Provides `reports` array and `addReport(report)`. Report model: `{id, createdAt, description, photoUri, lat, lon, status: "OPEN"}`.
    - Created `screens/CreateReportScreen.js`: scrollable form with description TextInput, photo picker (expo-image-picker library), GPS fetch (expo-location). **Location decision:** if permission denied, shows inline message "Location permission denied — report will be saved without coordinates" and allows submit without coords (non-blocking).
    - Updated `screens/ReporterHomeScreen.js`: replaced placeholder with FlatList of reports (thumbnail, description 1-line, coords if present, OPEN badge, created time) + "New Report" button.
    - Updated `App.js`: wrapped with `<ReportsProvider>`, registered `CreateReport` screen in Stack.Navigator.
    - Updated `app.json`: added iOS `NSPhotoLibraryUsageDescription` + `NSLocationWhenInUseUsageDescription` and Android `permissions` for photo/location (required for production builds).
  - **How to test:**
    1. Run `npx expo start` and open in Expo Go
    2. Select "Reporter" → Reporter Home screen with empty list and "+ New Report" button
    3. Tap "+ New Report" → CreateReport screen opens
    4. Enter a description (required — tap Submit without one to see alert)
    5. Tap "Pick Photo from Library" → select a photo → thumbnail preview appears
    6. Tap "Get GPS Location" → grant permission → GPS coords shown below button
    7. Tap "Submit Report" → navigates back to Reporter Home
    8. Report appears in list: thumbnail (or "No Photo" placeholder), description (1 line), coords (if granted), OPEN badge, timestamp
    9. Submit another report without photo/coords → appears in list with placeholder + no coords
    10. Restart app (swipe away + reopen) → reports persist via AsyncStorage
- [ ] S4 Collector: list/map reports + mark collected w/ proof photo
  - Acceptance: Collector can mark a report as collected and attach proof photo; status updates.
  - Verify: `npx expo start` → collector marks collected → status updates in list/map/details.

## Done
- [ ] (empty)
