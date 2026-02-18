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
- [x] S3.1 Report saved confirmation screen
  - Acceptance: After submitting a report, user sees a confirmation screen with (a) map preview of saved location (or fallback text if no location) and (b) photo thumbnail, plus a button to return to Reporter home.
  - Verify: `npx expo start` → create report → after submit confirmation shows map+photo → tap "Back to home" → ReporterHome shows the new report in list.
  - **What changed:**
    - Created `screens/ReportSavedScreen.js`: shows "Report Saved!" heading, description, photo thumbnail (or "No photo attached" placeholder), MapView+Marker centered on report coords (or "No location recorded" fallback in amber box if coords are null), and "Back to Home" button.
    - "Back to Home" uses `CommonActions.reset` to `[ReporterHome]` — prevents stacking screens on repeated report creation.
    - `headerBackVisible: false` on ReportSaved screen hides the system back button so the only exit is via "Back to Home".
    - Updated `screens/CreateReportScreen.js`: replaced `navigation.goBack()` with `navigation.navigate('ReportSaved', { report })` after `addReport()`.
    - Updated `App.js`: imported `ReportSavedScreen` and registered `ReportSaved` stack screen.
    - No new dependencies — uses `react-native-maps` already in package.json.
  - **How to test:**
    1. Run `npx expo start` and open in Expo Go as Reporter
    2. Tap "+ New Report" → fill description → optionally pick photo and/or get GPS → tap "Submit Report"
    3. **ReportSaved screen** appears: heading "Report Saved!", description text, photo preview (or placeholder), map with pin (or amber fallback if no location)
    4. No back arrow in header (system back hidden)
    5. Tap "Back to Home" → lands on ReporterHome with the new report in list
    6. Repeat steps 2–5 twice → navigation stack stays flat (never accumulates ReportSaved screens)
    7. Submit a report with no photo and no location → placeholder boxes shown for both


- [ ] QA-0 Set up Jest + @testing-library/react-native (test stack prerequisite)
  - Acceptance: `npx jest` runs and exits 0 on an empty test suite. Requires ADR entry (why Jest, alternative considered).
  - Verify: `npx jest --passWithNoTests` exits 0.
  - Blocks: QA-1, QA-2, QA-4, QA-5, QA-6, QA-7 (all automated tasks)
- [ ] QA-1 Implement TC-001 – TC-007 (RoleContext unit tests)
  - Acceptance: All 7 TCs pass as automated tests. Covers loadRole happy/edge paths, saveRole, clearRole, and useRole guard.
  - Verify: `npx jest --testPathPattern=RoleContext` exits 0.
  - Blocked by: QA-0
- [ ] QA-2 Implement TC-008 – TC-013 (RoleSelectScreen + AppNavigator initial route)
  - Acceptance: All 6 TCs pass. Covers button rendering, saveRole calls on tap, and initialRouteName logic.
  - Verify: `npx jest --testPathPattern=RoleSelect` exits 0.
  - Blocked by: QA-0
- [x] QA-3 Implement TC-014 – TC-018 (Change Role — manual checklist)
  - Acceptance: Manual checklist written at `__tests__/manual/QA-3-change-role.md`; all 5 TCs documented with steps + expected result.
  - Verify: File exists and is complete; no QA-0 prerequisite needed.
  - **What changed:** Created `__tests__/manual/QA-3-change-role.md` with 5 test cases (TC-014–018). Each has numbered steps derived from actual source code, explicit expected outcome, and PASS/FAIL checkbox. Steps reference exact UI text from the screens.
  - **How to test:** Open `__tests__/manual/QA-3-change-role.md`, run `npx expo start`, and execute each checklist in order on a real device or Expo Go.
- [ ] QA-4 Implement TC-019 – TC-025 (ReportsContext unit tests)
  - Acceptance: All 7 TCs pass. Covers load, addReport prepend+persist, empty/error paths, useReports guard, and model shape.
  - Verify: `npx jest --testPathPattern=ReportsContext` exits 0.
  - Blocked by: QA-0
- [ ] QA-5 Implement TC-026 – TC-037 (CreateReportScreen tests)
  - Acceptance: All 12 TCs pass. Covers happy submit, validation alert, photo picker cancel, location denied/error, double-submit guard, and report model fields.
  - Verify: `npx jest --testPathPattern=CreateReportScreen` exits 0.
  - Blocked by: QA-0
- [ ] QA-6 Implement TC-038 – TC-045 (ReporterHomeScreen list tests)
  - Acceptance: All 8 TCs pass (TC-045 is manual). Covers empty state, list rendering, coords format, status badge, New Report navigation, placeholder, and null coords.
  - Verify: `npx jest --testPathPattern=ReporterHomeScreen` exits 0; TC-045 in manual checklist.
  - Blocked by: QA-0
- [ ] QA-7 Implement TC-046 – TC-055 (ReportSavedScreen tests)
  - Acceptance: All 10 TCs pass (TC-054, TC-055 are manual). Covers MapView/Image render, fallbacks, Back to Home dispatch, and no-stack-growth.
  - Verify: `npx jest --testPathPattern=ReportSavedScreen` exits 0; TC-054 and TC-055 in manual checklist.
  - Blocked by: QA-0
- [x] QA-8 Implement TC-056 – TC-060 (cross-cutting regression — manual checklist)
  - Acceptance: Manual checklist written at `__tests__/manual/QA-8-regression.md`; all 5 TCs documented.
  - Verify: File exists and is complete; no QA-0 prerequisite needed.
  - **What changed:** Created `__tests__/manual/QA-8-regression.md` with 5 regression test cases (TC-056–060). Includes full fresh-app E2E flow (TC-056), persistence after restart (TC-057), context availability check (TC-058), Collector regression (TC-059), and all-5-routes reachability (TC-060). Each has a Reset/Precondition clause, numbered steps with exact UI labels, and PASS/FAIL checkbox.
  - **How to test:** Open `__tests__/manual/QA-8-regression.md`, run `npx expo start`, and execute each checklist in order on a real device or Expo Go.

- [ ] QA-0 Testing foundation: add Jest + React Native Testing Library
  - Acceptance: `npm test` runs and executes at least 1 passing test.
  - Verify: `npm test` → shows 1 passing test and exits 0.

- [ ] S4 Collector: list/map reports + mark collected w/ proof photo
  - Acceptance: Collector can mark a report as collected and attach proof photo; status updates.
  - Verify: `npx expo start` → collector marks collected → status updates in list/map/details.

## Done
- [ ] (empty)
