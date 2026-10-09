# ILAMA Kids integration and QA — 9 October 2026

Target branch: `integrate/latest-all-footer-20261007`.
Recovered source: `736772bea0f75de9fc33251691e7d860094d84f5`.
Previous target: `5967f0d`.

## Recovery and features

Fetched the detached commit explicitly and inspected its commit graph and diff.
Fast-forwarded its complete development history into the target locally; no
conflicts or rewritten history. Older Kids feature refs were inspected: their
age journeys, food passport and Egypt content remain in KidsEditorial or are
superseded by the current 27-governorate experience. No unrelated branch-wide
styling rollback was merged.

The integration retains the living canvas farm, planting/watering/harvesting
and harvested ingredients; Egyptian governorate discovery; Nile and sea fish;
food origins and river-to-table learning; plant/weather experiments; three
nine-scene story trails; twelve-ingredient kitchen studio; fifteen discovery
challenges; and eight accessible movement activities.

This session adds destination links across the full experience, an account-scoped
local discovery passport for the five main destinations, account-scoped Discovery
Lab saves, account-boundary component resets, fewer answer choices for younger
children, varied answer order and explanations in hints. All destinations remain
open, achievements cannot accrue repeatedly, and manual/seated alternatives stay
available. No clinic promotions, penalties or body comparisons were introduced.

## Camera, privacy and security

Camera requires guardian acknowledgement and browser permission. Rejected
permission can be retried. Mode exit, adventure exit, page hiding and late
permission resolution stop tracks. Video srcObject and pose detector are released.
Invalid/non-finite samples are rejected; tracking exceptions stop the detection
loop rather than retrying indefinitely. Static poses cannot earn movement.

Video is not recorded or uploaded by these components. Optional MediaPipe loads
third-party code, WASM and model files; the UI discloses these network requests.
Camera consent is an acknowledgement, not verified guardian identity.

Progress API and child-profile input types are validated. Session identity,
not a caller-supplied user ID, scopes their database queries. Consent time updates
when a child profile is saved again. Production no longer uses the fixed
 development authentication secret: missing BETTER_AUTH_SECRET denies auth
endpoints with 503 and protected requests with 401. Local account caches are
browser storage, not encrypted multi-child accounts or cloud synchronization.

## Executed validation

- Initial npm ci failed because the repository had no lockfile. Generated
  package-lock.json, then npm ci succeeded (269 packages; peer/deprecation warnings).
- npx tsc --noEmit: passed after fixing the browser timer type and pose narrowing.
- npm run check:kids: 35 release checks, 59 engine checks, 37 Node tests passed.
  Most Node checks validate source structure/parseability; they are not 37
  independent end-to-end gameplay tests.
- npm run build: passed, 44 pages generated.
- Playwright/Chromium 153 and axe: ten English/Arabic viewport combinations
  (320,375,390,768,1440 by 900): zero page exceptions, horizontal overflow or
  detected WCAG 2 A/AA and WCAG 2.1 AA violations in the initial rendered view.
- Browser gameplay: five original games, reward deduplication, reload persistence,
  farm harvest, food origins, weather experiments, Egypt stamp, story trail and
  safe kitchen idea saving passed in both languages at 390px.
- Synthetic camera/pose tests: guardian consent gate, permission rejection/retry,
  stationary/moving pose distinction, detector cleanup, mode/unmount/late-permission
  track cleanup; eight camera-free movement completions; aquatic passport reload
  persistence; unauthenticated progress/child-profile/family requests denied.
- Desktop/mobile screenshots reviewed. Adjusted original CSS color tokens to fix
  two axe contrast failures. No CSS override layers or new images were added.
- Five approved WebP hashes/lengths verified by release gate; artwork unchanged.
- git diff --check: passed.

Browser test repairs wait for language hydration and use the correct disabled
button selector; failures were investigated rather than treated as product passes.

## Remaining release blockers and limits

- No authenticated test accounts or database credentials in this workspace:
  real two-account cloud isolation, sign-in/provider flows and live consent/profile
  deletion require verification against a configured staging environment.
- BETTER_AUTH_SECRET and database configuration must exist at deployment. Local
  missing configuration does not establish whether production has these values.
- Pose tests use synthetic landmarks and camera streams. Real MediaPipe CDN/model
  loading, physical movement accuracy and Android/iOS camera hardware are not
  verified. Hand/march thresholds need real-device calibration; manual play is
  the fully tested fallback.
- Automated axe coverage does not replace screen-reader evaluation or cover every
  transient game state. No child user study or age-specific usability study ran.
- Farm/Egypt/discovery/kitchen/story progress remains local per account; only
  existing world reward records use the authenticated progress API. Separate
  profiles for multiple children sharing one guardian account are not implemented.
- No production deployment was performed. Production requires explicit approval
  after these blockers are reviewed.

## Reproduce

npm ci
npx tsc --noEmit
npm run check:kids
npm run build
npm run start -- --port 3001 --hostname 127.0.0.1

With Playwright, Chromium and axe-core available, run scripts/kids-browser-qa.cjs
and scripts/kids-camera-qa.cjs. They accept PLAYWRIGHT_MODULE,
QA_CHROMIUM_PATH and BASE_URL; the first also accepts AXE_PATH.
