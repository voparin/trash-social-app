# QA-8 Manual Checklist — Cross-cutting regression (S1–S3.1)

Covers TC-056 through TC-060.
Tester: _______________  Date: _______________  Device/OS: _______________

**Setup:** Run `npx expo start`, open in Expo Go.
**Source refs:** `App.js:65-73` (provider nesting), `App.js:26-60` (all 5 routes),
`contexts/RoleContext.js`, `contexts/ReportsContext.js`

> These tests exercise the full integrated app. Run them in order — each test
> leaves state that the next may depend on, unless a "Reset" step is noted.

---

## TC-056 — Full fresh-app Reporter flow (end-to-end)

**Reset first:** Clear app data in device Settings → Apps → trash-social-app → Clear Storage,
OR uninstall and reinstall in Expo Go to remove AsyncStorage.

Steps:
1. Open the app. Confirm **RoleSelect** screen shows: title **"Select Your Role"**, both role buttons visible.
2. Tap **"Reporter"**. Confirm **ReporterHome** shows:
   - Header title **"Reporter"**
   - Empty-state text **"No reports yet."** (no list items)
   - Button **"+ New Report"**
3. Tap **"+ New Report"**. Confirm **CreateReport** screen opens — header title **"New Report"**.
4. Type **"Fresh app test"** in the Description field.
5. Tap **"Submit Report"** (no photo, no GPS — both are optional).
6. Confirm **ReportSaved** screen shows:
   - Heading **"Report Saved!"**
   - Description text **"Fresh app test"**
   - **"No photo attached"** placeholder (grey box)
   - **"No location recorded for this report."** placeholder (amber box)
   - Button **"Back to Home"**
7. Tap **"Back to Home"**. Confirm **ReporterHome** shows:
   - The report **"Fresh app test"** in the list
   - Badge **"OPEN"** visible
   - A timestamp visible
   - **"No\nPhoto"** placeholder thumbnail (no photo was attached)

Expected: No crashes; report appears in list after end-to-end flow.
Result: [ ] PASS  [ ] FAIL  Notes: _______________________________

---

## TC-057 — Reports persist after app restart

**Precondition:** At least one report exists in ReporterHome (can continue from TC-056).

Steps:
1. On ReporterHome, note the description of the first report (e.g. **"Fresh app test"**) and its position (top of list).
2. **Kill the app** (swipe away from app switcher / recents).
3. Reopen the app.
4. Confirm the app opens directly on **ReporterHome** (saved role: reporter) — header title **"Reporter"**.
5. Confirm the report **"Fresh app test"** is still in the list in the same position.
6. Confirm the **"OPEN"** badge and timestamp are still present.

Expected: Reports survive app restart; order preserved; no blank list.
Result: [ ] PASS  [ ] FAIL  Notes: _______________________________

---

## TC-058 — Both contexts (RoleContext + ReportsContext) available in all screens

**Precondition:** Logged in as Reporter.

Steps:
1. On **ReporterHome**, confirm the screen renders without a red error overlay.
   _(useRole + useReports both consumed here)_
2. Tap **"+ New Report"**. Confirm **CreateReportScreen** opens without error.
   _(useReports consumed here)_
3. Type any description; tap **"Submit Report"**. Confirm **ReportSaved** opens without error.
   _(no context consumed directly, but route params pass through correctly)_
4. Tap **"Back to Home"**. Confirm **ReporterHome** renders with the new report in list.
5. Tap **"Change Role"**. Confirm navigation resets to **RoleSelect** without error.
   _(useRole.clearRole() consumed here)_
6. Tap **"Reporter"** again. Confirm **ReporterHome** renders with all previous reports still listed.

Expected: No red error screen at any step; all contexts resolve correctly at each screen.
Result: [ ] PASS  [ ] FAIL  Notes: _______________________________

---

## TC-059 — CollectorHomeScreen "Change Role" unaffected by S3 changes (regression)

**Reset navigation:** From any screen, navigate to RoleSelect (use Change Role or fresh app).

Steps:
1. From RoleSelect, tap **"Collector"**.
2. Confirm **CollectorHome** renders fully:
   - Header title: **"Collector"**
   - Body title text: **"Collector Home"**
   - Subtitle: **"View and collect trash reports"**
   - Button: **"Change Role"** (blue outlined button)
   - No red error overlay; no missing elements
3. Tap **"Change Role"**.
4. Confirm navigation goes to **RoleSelect**: title **"Select Your Role"** visible.
5. Confirm there is **no back button** in the RoleSelect header (stack was reset, not pushed).

Expected: CollectorHomeScreen fully functional and unchanged by S3/S3.1 changes.
Result: [ ] PASS  [ ] FAIL  Notes: _______________________________

---

## TC-060 — All 5 registered stack routes are reachable without "route not found" errors

**Reset:** From any screen navigate to RoleSelect.

Steps:
1. On **RoleSelect** — note: route `RoleSelect` ✓
2. Tap **"Reporter"** → **ReporterHome** opens — route `ReporterHome` ✓
3. Tap **"+ New Report"** → **CreateReport** opens — route `CreateReport` ✓
4. Type any description and tap **"Submit Report"** → **ReportSaved** opens — route `ReportSaved` ✓
5. Verify there is **no** "The action 'NAVIGATE' with payload {...} was not handled" warning in the Metro console.
6. Tap **"Back to Home"** → back on **ReporterHome**.
7. Tap **"Change Role"** → back on **RoleSelect**.
8. Tap **"Collector"** → **CollectorHome** opens — route `CollectorHome` ✓
9. Confirm no navigation errors in Metro console for any of the above transitions.

Expected: All 5 routes (RoleSelect, ReporterHome, CollectorHome, CreateReport, ReportSaved) load without errors. Metro console clean.
Result: [ ] PASS  [ ] FAIL  Notes: _______________________________

---

## Summary

| TC     | Description                                                | Result |
|--------|------------------------------------------------------------|--------|
| TC-056 | Fresh app → Reporter → create report → ReportSaved → list |        |
| TC-057 | Reports persist after app kill and reopen                  |        |
| TC-058 | Both contexts available at every screen, no red errors     |        |
| TC-059 | CollectorHome Change Role unaffected by S3 changes         |        |
| TC-060 | All 5 stack routes reachable without navigation errors     |        |

Overall: [ ] ALL PASS  [ ] FAILURES (see notes above)
