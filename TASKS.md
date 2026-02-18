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
- [ ] S1 Navigation skeleton + RoleSelect
  - Acceptance: User can choose Reporter/Collector and see correct home screen.
  - Verify: `npx expo start` → choose each role → correct screen shows.
- [ ] S2 Persist role (AsyncStorage)
  - Acceptance: Role persists after app restart.
  - Verify: `npx expo start` → select role → reload/restart app → role retained.
- [ ] S3 Reporter: create report (photo + GPS) stored locally
  - Acceptance: Reporter can create a report with photo + GPS + description and it appears in list.
  - Verify: `npx expo start` → create report → see it in list with photo thumbnail + coords.
- [ ] S4 Collector: list/map reports + mark collected w/ proof photo
  - Acceptance: Collector can mark a report as collected and attach proof photo; status updates.
  - Verify: `npx expo start` → collector marks collected → status updates in list/map/details.

## Done
- [ ] (empty)
