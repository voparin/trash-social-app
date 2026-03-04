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


- [x] S3.2 Reporter: take photo with camera (in addition to gallery)
  - Acceptance: CreateReport screen shows "Take Photo" (camera) and "Pick from Gallery" (library) stacked buttons. Camera permission flow works; cancel is a no-op; permission-denied and hardware errors show inline red message; captured photo produces same model shape.
  - Verify: `npx expo start` → Reporter → "+ New Report" → two buttons visible; tap "Take Photo" → permission dialog → grant → camera opens → capture → preview + "Retake Photo" label; deny permission → inline red message; "Pick from Gallery" still works.
  - **What changed:**
    - `screens/CreateReportScreen.js`: Added `photoMsg` state; added `takePhoto()` (calls `requestCameraPermissionsAsync`, then `launchCameraAsync`; catches hardware errors); `pickPhoto()` unchanged but now clears `photoMsg` on entry. Replaced single photo button with two stacked buttons: "Take Photo"/"Retake Photo" (dark-grey `#555`, `cameraButton` style) above "Pick from Gallery"/"Change Photo" (blue `#007AFF`, `photoButton` style). Added `photoMsg` inline text (red `#C00`) between buttons and preview. Added `buttonGap` (8 px `View`) between buttons.
    - `app.json`: iOS `infoPlist.NSCameraUsageDescription` added; Android `permissions` includes `android.permission.CAMERA`.
    - No new npm dependency — `expo-image-picker` already installed.
  - **How to test:**
    1. Run `npx expo start` and open in Expo Go as Reporter
    2. Tap "+ New Report" → CreateReport screen: "Take Photo" button (dark grey) and "Pick from Gallery" button (blue) stacked under "Photo" label
    3. Tap "Take Photo" → system permission dialog → grant → native camera opens → capture photo → preview appears; button labels → "Retake Photo" / "Change Photo"
    4. Tap Cancel in camera instead of capturing → no change to preview or message
    5. Deny camera permission → inline red message "Camera access denied — use Pick from Gallery instead." appears; "Pick from Gallery" button still works normally
    6. Submit report using camera photo → ReportSaved shows the captured image (same as gallery path)

  - Acceptance: `npx jest` runs and exits 0 on an empty test suite. Requires ADR entry (why Jest, alternative considered).
  - Verify: `npx jest --passWithNoTests` exits 0.
  - Blocks: QA-1, QA-2, QA-4, QA-5, QA-6, QA-7 (all automated tasks)
- [ ] QA-1 Implement TC-001 – TC-007 (RoleContext unit tests)
  - Acceptance: All 7 TCs pass as automated tests. Covers loadRole happy/edge paths, saveRole, clearRole, and useRole guard.
  - Verify: `npx jest --testPathPattern=RoleContext` exits 0.
  - Blocked by: QA-0
- [x] QA-2 Implement TC-008 – TC-013 (RoleSelectScreen + AppNavigator initial route)
  - Acceptance: All 6 TCs pass. Covers button rendering, saveRole calls on tap, and initialRouteName logic.
  - Verify: `npx jest --testPathPattern=RoleSelect` exits 0.
  - **What changed:**
    - `__tests__/screens/RoleSelectScreen.test.js`: CREATED — 6 tests covering TC-008 through TC-013. TC-008–010 render RoleSelectScreen directly with a mock navigation prop inside RoleProvider. TC-011–013 render the full App with mocked AsyncStorage returning specific role values and assert on the unique text of each landing screen.
  - **How to test:** `npx jest --testPathPattern=RoleSelectScreen` → 6 passed, exits 0.
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

- [x] QA-0 Testing foundation: add Jest + React Native Testing Library
  - Acceptance: `npm test` runs and executes at least 1 passing test.
  - Verify: `npm test` → shows 1 passing test and exits 0.
  - **What changed:**
    - `package.json`: added `"test": "jest"` script; added `"jest"` config block with `jest-expo` preset and `transformIgnorePatterns` for expo/react-native modules; added devDependencies `jest@^29.7.0`, `jest-expo@~54.0.0`, `@testing-library/react-native@^13.3.3`, `react-test-renderer@^19.1.0`
    - `__tests__/smoke.test.js`: CREATED — one passing sanity test confirming Jest is wired up
    - `ADR.md`: added ADR-004 documenting test stack choice (jest-expo over Vitest/Mocha) and version constraints
  - **How to test:**
    1. Run `npm test`
    2. Should show `PASS __tests__/smoke.test.js` with 1 passing test and exit 0

- [x] S4 (partial) Collector: list reports + detail view
  - Acceptance: Collector sees all reports in a list; tapping opens detail with photo, description, coords, status.
  - Verify: `npx expo start` → Collector role → list shown → tap item → detail screen opens.
  - **What changed:**
    - Updated `screens/CollectorHomeScreen.js`: replaced placeholder with FlatList consuming `useReports`. Each row shows description (1 line), timestamp, and a colour-coded status badge (OPEN = orange, COLLECTED = green). Tapping a row navigates to `ReportDetail` with the report as params. Empty state shown when no reports exist. Change Role button retained at bottom.
    - Created `screens/ReportDetailScreen.js`: ScrollView showing status badge, photo (or "No photo attached" placeholder), description, coords formatted to 5 decimal places (or "No location recorded"), and created-at timestamp.
    - Updated `App.js`: imported `ReportDetailScreen`, registered `ReportDetail` stack screen.
  - **How to test:**
    1. Run `npx expo start` and open in Expo Go
    2. First create 1–2 reports as Reporter (or use existing ones)
    3. Tap "Change Role" → select "Collector"
    4. CollectorHome shows the report list: description, timestamp, OPEN badge
    5. Tap any row → ReportDetail opens with photo, description, coords, status, timestamp
    6. Use native back arrow to return to list
    7. With no reports: empty state "No reports yet. Reporters will create them." shown
  - **Not yet implemented:** Mark Collected action, proof photo, map on detail
- [x] S4.1 Collector: mark collected with proof photo
  - Acceptance: Tapping "Mark Collected" on an OPEN report picks a proof photo, updates status to COLLECTED in store, and updates immediately in list and detail.
  - Verify: `npx expo start` → Collector → tap OPEN report → tap "Mark Collected" → pick photo → status badge turns green in detail; back in list status shows COLLECTED.
  - **What changed:**
    - `contexts/ReportsContext.js`: added `updateReport(updatedReport)` — map-replaces report by id, persists full array to AsyncStorage, updates state.
    - `screens/ReportDetailScreen.js`: rewritten to read the live report from context by id (`reports.find(r => r.id === reportId)`) instead of stale route.params — ensures status badge and proof photo update in-place without navigation. Added "Mark Collected" green button (visible only when `status === 'OPEN'`): launches image library picker; on photo selected calls `updateReport({...report, status:'COLLECTED', proofPhotoUri})`. Cancelling picker does nothing. Button shows `ActivityIndicator` while processing. Proof Photo section renders below timestamp when `proofPhotoUri` is set.
  - **How to test:**
    1. Run `npx expo start`, open as Collector
    2. Tap an OPEN report — detail shows orange OPEN badge and green "Mark Collected" button at bottom
    3. Tap "Mark Collected" → image picker opens → select a photo
    4. Detail screen immediately shows: green COLLECTED badge, "Mark Collected" button gone, "Proof Photo" section with selected image
    5. Press back → list shows the same report with green COLLECTED badge
    6. Restart app → COLLECTED status and proof photo persist (AsyncStorage)
    7. Already-COLLECTED report: open detail → no "Mark Collected" button shown
- [x] S4.3 Collector: take proof photo with camera (in addition to gallery)
  - **Context:** S4.1 added "Mark Collected" using gallery-only picker. Collectors in the field need to photograph the collected trash in-the-moment; gallery is a fallback, not the primary flow. Mirrors the S3.2 camera-option added for Reporter.
  - **Acceptance criteria:**
    1. Tapping "Mark Collected" on an OPEN report offers two buttons: "Take Proof Photo" (camera) and "Pick from Gallery" (library) — stacked vertically, same visual language as CreateReportScreen.
    2. Camera permission requested on first "Take Proof Photo" tap; if denied, inline red message appears and "Pick from Gallery" still works.
    3. Cancel from camera or gallery is a no-op (status remains OPEN, no photo set).
    4. Capturing a photo sets `proofPhotoUri` and updates `status → COLLECTED` (same `updateReport` call as before).
    5. Hardware-unavailable error (e.g., simulator with no camera) shows inline red message instead of crashing.
    6. Already-COLLECTED reports: neither button visible (unchanged from S4.1).
  - **Data model delta:** none — `proofPhotoUri` already on report model (S4.1).
  - **Screen flow:**
    1. Collector opens ReportDetail of OPEN report → sees orange OPEN badge + two stacked buttons at bottom: "Take Proof Photo" (dark-grey) and "Pick from Gallery" (blue).
    2. "Take Proof Photo" → permission check → native camera → capture → `updateReport({status:'COLLECTED', proofPhotoUri})` → detail reacts in-place (green badge, Proof Photo section, buttons gone).
    3. "Pick from Gallery" → image library picker → select → same update path as (2).
    4. Cancel from either picker → no change, buttons remain.
  - **Edge cases:**
    - Camera permission permanently denied: message "Camera access denied — use Pick from Gallery instead." (red); gallery button still functional.
    - No camera hardware: catch error, show "Camera unavailable on this device."; gallery still functional.
    - User cancels camera without capturing: result `cancelled === true` → no-op.
    - User cancels gallery picker: `cancelled === true` → no-op.
    - Both buttons missing for COLLECTED report (regression guard).
  - **Dependencies / app.json:** `NSCameraUsageDescription` (iOS) and `android.permission.CAMERA` already added in S3.2 — no new entries needed. No new npm dependency.
  - **Verify:** `npx expo start` → Collector → tap OPEN report → two buttons visible → tap "Take Proof Photo" → permission dialog → grant → camera opens → capture → badge turns green, Proof Photo section appears, buttons gone → press back → list shows COLLECTED badge → restart app → state persists.
  - **What changed:**
    - `screens/ReportDetailScreen.js`: replaced single "Mark Collected" button with two stacked buttons ("Take Proof Photo" dark-grey `#555` + "Pick from Gallery" blue `#007AFF`). Added `proofPhotoMsg` state for inline red error text. Added `handleTakeProofPhoto` (requestCameraPermissionsAsync → launchCameraAsync; permission denied = inline message; hardware error = inline message; cancel = no-op). Renamed gallery handler to `handlePickProofPhoto`. Extracted `applyProofPhoto(uri)` shared helper. Added `buttonGap`, `cameraProofButton`, `galleryProofButton`, `proofPhotoMsg` styles. No new npm dependency; `NSCameraUsageDescription` + `android.permission.CAMERA` already in app.json from S3.2.
  - **How to test:**
    1. `npx expo start` → open as Collector
    2. Tap an OPEN report → detail shows "Take Proof Photo" (grey) and "Pick from Gallery" (blue) stacked at bottom
    3. Tap "Take Proof Photo" → permission dialog → grant → camera opens → capture → detail immediately shows green COLLECTED badge, Proof Photo section, both buttons gone
    4. Press back → list row shows green COLLECTED badge
    5. Restart app → COLLECTED status + proof photo persist
    6. Tap "Pick from Gallery" on another OPEN report → gallery picker → select → same result as step 3
    7. Deny camera permission → inline red "Camera access denied — use Pick from Gallery instead." shown; gallery button still works
    8. Cancel from camera or gallery → no state change, both buttons remain
    9. Open a COLLECTED report → no buttons shown (regression guard)

- [x] S4.4 Collector: filter reports by status (All / Open / Collected)
  - **Context:** CollectorHome list and map currently show all reports regardless of status. In the field a collector wants to focus only on OPEN work or review what was COLLECTED; showing everything at once becomes noisy as the report count grows.
  - **Acceptance criteria:**
    1. A filter control (three-segment or tab row) is visible at the top of CollectorHome, above the list/map toggle. Segments: "All", "Open", "Collected".
    2. Default selection is "All" (no behaviour change on first launch; existing reports remain visible).
    3. Selecting "Open" hides COLLECTED reports in both list and map views.
    4. Selecting "Collected" hides OPEN reports in both list and map views.
    5. Filter selection is ephemeral (not persisted across app restarts — reset to "All" on relaunch).
    6. Empty-state message is filter-aware:
       - "All" + no reports → "No reports yet. Reporters will create them."
       - "Open" + no open reports → "No open reports."
       - "Collected" + no collected reports → "No collected reports yet."
    7. Map view respects the filter (pins shown only for matching-status reports with coords).
    8. Tapping a pin or list row navigates to ReportDetail as before.
  - **Data model delta:** none — `status` field (`"OPEN"` | `"COLLECTED"`) already on the report model (S3 / S4.1).
  - **Screen flow:**
    1. CollectorHome loads → filter = "All", list/map toggle = "List" (default).
    2. User taps "Open" segment → list/map re-renders showing only OPEN reports; "No open reports." if none.
    3. User taps "Collected" segment → list/map re-renders showing only COLLECTED reports.
    4. User taps "All" → all reports shown again.
    5. User switches to Map tab → current filter still applied (only matching pins shown).
    6. User marks a report Collected in ReportDetail → back in CollectorHome the list reflects the new status; if filter was "Open" the freshly-collected report disappears from the list.
  - **Edge cases:**
    - Filter "Open" with 0 open reports: empty-state "No open reports." (no crash, no blank screen).
    - Filter "Collected" with 0 collected reports: empty-state "No collected reports yet."
    - Map tab + "Open" filter + no open reports with coords: "No reports with location data yet." (existing empty-map text is sufficient).
    - Filter state survives tab switch (List → Map → List keeps the same filter active).
    - App restart: filter resets to "All" (no persistence required).
  - **Verify:** `npx expo start` → Collector role → three segments visible at top → tap "Open" → only OPEN rows shown in list and only OPEN pins on map → tap "Collected" → only COLLECTED rows/pins → tap "All" → full list restored → mark a report Collected while "Open" filter is active → detail shows COLLECTED badge → press back → report is gone from the filtered list.
  - **What changed:**
    - `screens/CollectorHomeScreen.js`: added `filterStatus` state (default `'ALL'`); added `filteredReports` useMemo (identity when ALL, filters by status otherwise); changed `mappableReports` to derive from `filteredReports` instead of `reports`; added `emptyText()` helper returning filter-aware strings; added 3-segment filter control (All / Open / Collected) above the List/Map toggle, using grey (`#8E8E93`) filled-segment style; FlatList and list empty-state now use `filteredReports`; added `filter`, `filterSegment`, `filterSegmentActive`, `filterText`, `filterTextActive` styles.
  - **How to test:**
    1. `npx expo start` → open as Collector
    2. CollectorHome shows "All | Open | Collected" segment bar at top (All highlighted grey)
    3. Create 2+ reports as Reporter; mark one Collected
    4. Back as Collector → All tab: both reports visible
    5. Tap "Open" → only OPEN report shown; badge orange
    6. Tap "Collected" → only COLLECTED report shown; badge green
    7. Tap "All" → both reports visible again
    8. Tap "Open" → switch to Map tab → only OPEN pins on map
    9. Mark remaining OPEN report Collected (tap → ReportDetail → Take/Pick proof photo) → press back → list shows "No open reports." empty state (filter still "Open")
    10. Tap "All" → both COLLECTED reports visible; filter resets to "All" on app restart

- [x] S4.2 Collector: map view on CollectorHome
  - Acceptance: Collector can switch between List and Map tabs; map shows pins for reports with coordinates; tapping a pin opens ReportDetail.
  - Verify: `npx expo start` → Collector → tap Map tab → pins visible → tap pin → ReportDetail opens.
  - **What changed:**
    - `screens/CollectorHomeScreen.js`: added List/Map tab toggle (segmented control style). Map tab renders `MapView` (react-native-maps) guarded by `Platform.OS !== 'web'` — conditional `require` so the module is never imported on web. Filters reports to those with `lat != null && lon != null`. Region auto-fits all markers using min/max lat/lon with 1.5× padding and a minimum delta of 0.02. Each `Marker` has `title=description`, `description=status`, `pinColor` orange (OPEN) or green (COLLECTED), and `onPress` navigates to `ReportDetail`. Reports with no coords are silently excluded. Empty map state: "No reports with location data yet." Web fallback: "Map view is not available on web." List view and Change Role button unchanged.
  - **How to test:**
    1. Run `npx expo start`, open as Collector
    2. **List tab** (default): report list shows as before
    3. Tap **Map tab**: map renders with orange/green pins for all reports that have GPS coords
    4. Reports without coords (no GPS when submitted) do not appear on map
    5. Tap a pin → callout shows description + status → tap again to open ReportDetail
    6. ReportDetail works normally; press back → returns to CollectorHome map tab
    7. No reports with location: map tab shows "No reports with location data yet."

## Done
- [ ] (empty)
