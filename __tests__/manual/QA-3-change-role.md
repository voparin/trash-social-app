# QA-3 Manual Checklist — Change Role action (S2.1)

Covers TC-014 through TC-018.
Tester: _______________  Date: _______________  Device/OS: _______________

**Setup:** Run `npx expo start`, open in Expo Go.
**Source refs:** `screens/ReporterHomeScreen.js:18-26`, `screens/CollectorHomeScreen.js:9-17`, `contexts/RoleContext.js:39-46`

---

## TC-014 — Change Role from ReporterHome clears role and shows RoleSelect

Steps:
1. If not already there, tap "Reporter" on RoleSelect screen.
2. Confirm ReporterHome is visible: header title reads **"Reporter"**, button **"+ New Report"** is present.
3. Tap the **"Change Role"** button.
4. Confirm the screen changes to RoleSelect: title text **"Select Your Role"** is visible, both **"Reporter"** and **"Collector"** buttons are present.

Expected: RoleSelect screen shown after step 3.
Result: [ ] PASS  [ ] FAIL  Notes: _______________________________

---

## TC-015 — Change Role from CollectorHome clears role and shows RoleSelect

Steps:
1. From RoleSelect, tap **"Collector"**.
2. Confirm CollectorHome is visible: header title reads **"Collector"**, subtitle **"View and collect trash reports"** is visible.
3. Tap the **"Change Role"** button.
4. Confirm RoleSelect is shown: **"Select Your Role"** title visible.

Expected: RoleSelect screen shown after step 3.
Result: [ ] PASS  [ ] FAIL  Notes: _______________________________

---

## TC-016 — Navigation stack is reset after Change Role (no back button)

Steps:
1. From RoleSelect, tap **"Reporter"**.
2. On ReporterHome, tap **"Change Role"**.
3. On RoleSelect, inspect the navigation header.
4. Confirm there is **no back arrow / back button** in the header — the stack was reset, not pushed.

Expected: No back button visible on RoleSelect after Change Role.
Result: [ ] PASS  [ ] FAIL  Notes: _______________________________

---

## TC-017 — Role is cleared: restart opens on RoleSelect

Steps:
1. From RoleSelect, tap **"Reporter"** (saves role to AsyncStorage).
2. On ReporterHome, tap **"Change Role"** (clears role from AsyncStorage).
3. Confirm RoleSelect is shown.
4. **Kill the app completely** (swipe it away from the app switcher / recents).
5. Reopen the app.
6. Confirm the app opens directly on RoleSelect (not on ReporterHome) — header title reads **"Trash Social"**, both role buttons are visible.

Expected: App opens on RoleSelect, not ReporterHome.
Result: [ ] PASS  [ ] FAIL  Notes: _______________________________

---

## TC-018 — Role switch round-trip: Reporter → Change Role → Collector

Steps:
1. From RoleSelect, tap **"Reporter"** — confirm ReporterHome opens.
2. Tap **"Change Role"** — confirm RoleSelect opens.
3. Tap **"Collector"** — confirm CollectorHome opens.
4. Verify CollectorHome shows:
   - Header title: **"Collector"**
   - Text: **"Collector Home"**
   - Subtitle: **"View and collect trash reports"**
   - Button: **"Change Role"** (present and tappable)
5. Tap **"Change Role"** on CollectorHome — confirm RoleSelect opens again.

Expected: Full round-trip works; no crashes; Collector home fully rendered at step 4.
Result: [ ] PASS  [ ] FAIL  Notes: _______________________________

---

## Summary

| TC     | Description                                      | Result |
|--------|--------------------------------------------------|--------|
| TC-014 | Reporter → Change Role → RoleSelect shown        |        |
| TC-015 | Collector → Change Role → RoleSelect shown       |        |
| TC-016 | No back button after stack reset                 |        |
| TC-017 | App restart lands on RoleSelect after clearRole  |        |
| TC-018 | Reporter → Change Role → Collector round-trip    |        |

Overall: [ ] ALL PASS  [ ] FAILURES (see notes above)
