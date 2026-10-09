# ILAMA Kids privacy hardening — 2026-10-09

## Behavior

The browser already suppressed analytics on direct child and guardian pages, but the ingestion API still accepted those paths. It now discards children, guardian, account, auth and API events before opening database storage, including encoded paths and legacy hash navigation. Both browser and server use the same route classifier. Only bounded page-view events and safe anonymous identifiers are accepted. Public counts discard all query strings and fragments instead of persisting arbitrary URL text. Validation failures return bounded errors without logging request data or database errors.

The public consent banner now disappears when the application navigates into Kids without a document reload. Browser Back restores the undecided public-page choice. Listener cleanup prevents duplicate subscriptions.

Legacy child-profile and progress writes now use streamed 24 KB body limits and same-origin validation. Legacy profile deletion also checks the origin; nickname control characters are rejected. Authentication and owner-filtered parameterized SQL are retained. No schema migration, child-record modification or image change is part of this update.

## Executed verification

- npm ci completed: 270 packages; existing peer/deprecation warnings remain.
- TypeScript, optimized production build and 69 Node tests passed.
- Actual local HTTP/privacy QA passed: private paths including encoded/hash variants return before storage, no-store, cross-site denial, oversized bodies, unauthorized legacy writes, browser suppression with prior consent, real public-to-Kids navigation and Browser Back.
- Ten English/Arabic viewport combinations (320/375/390/768/1440 px) passed browser interaction and automated accessibility checks.
- Activity QA passed both languages, including mission destinations, six fish, keyboard focus and bounded kitchen saves.
- Guardian journey, connected play, camera and camera-resilience suites passed. Account/sibling scenarios use controlled API fixtures; repository persistence tests use PGlite.
- Real MediaPipe JS, SIMD/non-SIMD WASM and model URLs returned 200. Actual model inference on a synthetic blank video passed without SDK/model mocks and pause cleaned up the camera.
- Approved character hashes remain release-gated and unchanged.

## Verification boundaries

Automated accessibility tests are not human screen-reader certification. Camera input is synthetic; physical mobile camera accuracy still needs actual-device review. Authenticated live household persistence and editorial review are not established by these tests. Browser automation uses the environment HTTPS proxy and its certificate workaround only in the external test runner, with no product TLS changes. Private-event suppression protects the supplied sensitive route; it does not identify a caller who deliberately spoofs a public route.

The logged results are in kids-privacy-hardening-20261009-qa.txt. Publication status and final commit are reported after deployment completes.
