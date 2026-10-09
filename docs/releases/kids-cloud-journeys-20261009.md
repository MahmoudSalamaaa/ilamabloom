# ILAMA Kids: private journeys and connected adventures

Branch: `integrate/latest-all-footer-20261007`.
Base: `092b234d742f2cdede75a9707c075b10fd112f8c`.
Recovered commit `736772bea0f75de9fc33251691e7d860094d84f5` exists as a commit and remains an ancestor. The five approved character WebP files are unchanged; no image was generated or replaced.

## Delivered behavior

- A guardian can create up to five learning profiles, change a nickname/age band with renewed consent, choose a child's journey, and explicitly confirm profile/progress deletion. The parent page shows discoveries without scores or child comparisons.
- Child profiles have separate farm inventories, Egypt stamps, aquatic discoveries, food lessons, recipes, quests, weather discoveries, movement achievements, and the adventure passport. Existing account/guest device progress stays in its default journey; new children start fresh. Legacy child profiles import once without resurrecting deleted records.
- Learning progress has a scoped device cache and authenticated PostgreSQL snapshots. Edits made while cloud synchronization is unavailable survive reload when device storage is available. Retry resumes synchronization. Revisions reject stale writes. Discovery sets merge without losing achievements; farm inventory and recipe conflicts require a visible choice.
- Switching profiles remounts transient games and camera components. Scope/epoch guards reject stale responses and setters and prevent writing the old child's cache under the new child's key.
- Four optional trails connect seed-to-plate, Nile/sea, Egypt/food, and movement/nature experiences. They carry no streaks, penalties, rankings, compulsory activity or escalating rewards. Quests can be replayed without erasing their recorded completion.
- Aqua World includes Nile tilapia, catfish, Nile perch, sardines, mullet and mackerel, with habitat/nutrient questions and inclusive family/allergy-aware language. Farm actions use the latest state and cannot double-harvest or spend missing stock. Kitchen saving requires the activity's preparation/safety steps.
- Movement offers gentle, regular and extended rounds, with gentle defaults for younger profiles. Motion detection compares successive landmark positions, supports seated arm movement, and does not count a stationary pose. Model loading times out with a manual fallback. Pause, finish, mode changes, unmount and late permission results release camera resources; late detectors close safely.
- Children's and parent spaces suppress visit analytics even with prior public-site consent. Blocked browser storage does not crash the application or service-worker update listener; the journey displays its storage limitation. Camera frames and body measurements are not part of the snapshot schema.

## Engineering boundaries

The new `lib/kids` modules separate bounded learning-state validation, game/motion rules, PostgreSQL ownership/revision operations and authenticated transactions. New APIs are `/api/kids/profiles` and `/api/kids/snapshots`. Every repository operation derives ownership from the authenticated user, uses parameterized SQL, and checks the child's owner. Writes reject cross-site origins and oversized streamed JSON. Responses are uncached and do not expose database errors.

New tables use the `ilama_kids_` prefix and do not change the legacy schema. Profile deletion cascades to its snapshots and removes its matching legacy profile. The server uses the site's database environment aliases, a bounded pool, connection and statement timeouts. It initializes its schema lazily; the deployment database role must be able to create these tables/indexes, or an operator must apply the `schema` SQL exported by `lib/kids/repository.ts` before release.

## Validation

| Executed check | Result |
| --- | --- |
| `npm ci --no-audit --no-fund` | Passed, exit 0 |
| `npx tsc --noEmit` | Passed, exit 0 |
| `npm run check:kids` | Passed: structural/artwork checks, 59 engine checks, 48 Node tests (0 failures) |
| `npm run build` | Passed, exit 0; includes both new API routes and parent page |
| `qa:kids:journey` | Passed EN/AR at 390px: child/owner isolation, cloud queue, delayed responses, revision conflict choice, cloud outage/reload/retry, guardian consent, deletion, parent summary, axe and overflow checks |
| `qa:kids:camera` | Passed: synthetic stationary/moving detection, detector cleanup, permission consent/rejection/retry, pause/mode/unmount/late-permission cleanup, eight manual games, six fish and passport persistence, five unauthenticated API rejection checks, blocked browser storage and no child analytics with prior consent |
| `qa:kids:browser` | Passed all 10 EN/AR × 320/375/390/768/1440px combinations: no page errors, no horizontal overflow, no axe violations; game/farm/food/weather/Egypt/quest/kitchen interactions and approved image decoding |

The 11 new functional Node tests exercise real PostgreSQL behavior via PGlite, bounded input/origin validation, revision conflict protection, migration/deletion, inventory reducers and temporal movement. The remaining Node tests cover existing integration/motion/stability boundaries. Browser tests execute against the optimized local production build, not a deployed production service. Cloud-outage browser tests intercept API failures while document delivery remains available; they do not establish fresh installation/navigation support without a network connection.

Automated accessibility checks use axe-core WCAG 2 A/AA and WCAG 2.1 AA tags. Artwork checks compare the five approved WebP hashes with their approved baseline. Repeated test runs were performed after substantive fixes.

## Release boundaries

No production deployment is authorized or performed. Git deployment remains disabled for this integration branch. One reviewed integration update is intended.

Live authentication, production database permissions/connectivity, and cross-device operation against the deployed service remain deployment-environment checks. Database ownership and revision behavior are tested against embedded PostgreSQL (PGlite); signed-in browser scenarios use intercepted sessions and APIs. Camera tests use a synthetic stream and pose module. A physical camera, real MediaPipe model/CDN loading, and human screen-reader/device testing remain manual checks; automated axe findings are not a full accessibility certification.

Deleting a profile removes server progress and the current device's cache. Other devices may retain their device cache until reloading; a deleted profile cannot authorize reads/writes on the server. No account-wide deletion claim is made.

## Reproducing browser QA

Install QA tooling separately if it is not present: Playwright `1.64.0`, axe-core `4.14.0` and Chromium `153`. Run a freshly built local app, then the package scripts `qa:kids:journey`, `qa:kids:camera` and `qa:kids:browser`. Set `PLAYWRIGHT_MODULE`, `AXE_PATH`, `QA_CHROMIUM_PATH` and `BASE_URL` when tooling/browser binaries are external. `QA_SCREENSHOTS=1` captures English/Arabic mobile and desktop pages. Do not expose or commit real session credentials.
