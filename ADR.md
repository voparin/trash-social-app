# ADR (Architecture Decision Record)

Format:
- ADR-XXX: Title
  - Status: Accepted | Proposed | Superseded
  - Context:
  - Decision:
  - Consequences:

---

- ADR-001: Use Expo + React Navigation (native-stack)
  - Status: Accepted
  - Context: Need fast iteration, cross-platform support (iOS/Android), and standard navigation patterns for role-based flows.
  - Decision: Use Expo ~54 with React Navigation 7 (native-stack). No ejection required for MVP. Simplifies photo/GPS permissions and deployment via Expo Go.
  - Consequences:
    + Fast development, hot reload, easy testing on device
    + Standard navigation patterns (stack, tabs if needed)
    - Expo limitations on native modules (acceptable for MVP)
    - ~200MB framework overhead (acceptable for mobile app)

- ADR-002: State management and persistence (local-first)
  - Status: Accepted
  - Context: MVP is local-first (no backend/sync). Need simple state management and persistent storage for reports, role selection, photos.
  - Decision:
    - State: React Context + hooks (no Redux/MobX for MVP)
    - Persistence: AsyncStorage for role/settings, file system for photos, JSON file or SQLite for report metadata (decide in A4)
  - Consequences:
    + Simple, minimal dependencies, easy to reason about
    + Reports stored locally, no auth/backend needed
    - No cross-device sync (acceptable for MVP)
    - May need migration path if moving to backend later

- ADR-003: Maps library
  - Status: Accepted
  - Context: Collectors need map view of trash reports with pins showing location. Must work in Expo environment.
  - Decision: Use react-native-maps 1.20.1 (already installed). Integrates with Expo, supports both Google Maps (Android) and Apple Maps (iOS).
  - Consequences:
    + Native map performance, familiar UX
    + Works with expo-location for GPS coordinates
    - Requires API keys for production (not needed in Expo Go)
    - Map library is ~5-10MB additional size
