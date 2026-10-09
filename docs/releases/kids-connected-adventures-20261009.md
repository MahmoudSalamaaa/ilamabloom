# Connected adventures release — 2026-10-09

Branch: `integrate/latest-all-footer-20261007`.
Reviewed base: `95fc617bf6a80f17f1efb2b76fd1e60eca3aacda`.
Recovered commit `736772bea0f75de9fc33251691e7d860094d84f5` exists and is an ancestor of the integration. Its completed work remains present. All five approved character WebP files are unchanged. No images were generated or replaced.

## Completed

- Four bilingual adventure trails connect Farm World, Egypt Adventures, Aqua World, Food Discovery, Weather Lab, Kitchen Studio, Quests and Movement Adventures through twelve milestones earned by real play. Discoveries remain recorded after ingredients are used; all activities stay available without compulsory order or punitive rewards.
- Guardian progress export, explicit two-step fresh-start confirmation, profile editing and deletion, isolated account/child caches, and generation-protected cloud resets. A stale tab cannot restore progress cleared by a guardian. PostgreSQL row locking and generation checks protect concurrent requests; ambiguous save acknowledgements do not create false inventory conflicts.
- A keyboard and touch accessible toy plant experiment has four observable outcomes, clearly distinguished from real plant care. Movement games have approved character guides, three round lengths, comfortable movement prompts, responsive scenes and reduced-motion support.
- Camera consent remains optional. Pending requests can be canceled; late streams are stopped. Device loss, hidden tabs, navigation, completion and unmount release resources. MediaPipe failures and its real fifteen-second timeout offer retry and dispose late detectors. Manual movement play remains available.
- Existing aquatic discovery and nutrition, Egyptian stories, recipes and inclusive encouraging language are retained. Clean CSS modules replace inline movement/weather styling.

## Actually executed on the final source

| Check | Result |
| --- | --- |
| `npm ci --no-audit --no-fund` | Passed |
| `npx tsc --noEmit` | Passed |
| `npm run check:kids` | Passed: 63 Node tests and 59 engine/static gates |
| `npm run build` | Passed; a corrupt existing Turbopack cache was moved aside before a clean build |
| `scripts/kids-journey-qa.cjs` | Passed EN/AR: sibling/owner isolation, cloud saving, conflicts, offline retry, permissions, editing, export, cross-tab reset, deletion, accessibility |
| `scripts/kids-camera-qa.cjs` | Passed: eight manual games, synthetic stationary/moving poses, lifecycle cases, five unauthorized API checks, blocked storage and no child analytics |
| `scripts/kids-connected-play-qa.cjs` | Passed EN/AR at 320px: farm-to-meal milestones, four keyboard plant observations, all movement round lengths, focus, persistence, reduced motion and axe |
| `scripts/kids-camera-resilience-qa.cjs` | Passed: model/device failures, retries, delayed detector disposal, hidden-tab cleanup, actual 15-second timeout, completion cleanup and axe |
| `scripts/kids-browser-qa.cjs` | Passed all 10 language/viewport combinations: EN/AR × 320/375/390/768/1440px; no recorded console errors or axe violations |
| `git diff --check` | Passed |

Browser tests ran against the production build with Chromium. Camera inputs and signed-in cloud transport were controlled browser fixtures; database reset/authorization/concurrency logic also ran in PostgreSQL-compatible PGlite. The Arabic mobile full-page screenshot was visually reviewed. Machine-readable viewport results and execution output are adjacent to this report.

## Remaining release verification

Physical cameras and supported iOS/Android devices, the live MediaPipe CDN/model on real hardware, real deployment credentials/database and human assistive-technology review remain environment-dependent checks. Browser mocks are not evidence of those live systems. A human editorial review of child-facing nutrition remains advisable. Local browser caches and downloaded exports are not encrypted; guardians should use appropriate shared-device precautions.

No production deployment was performed. The integration branch has preview deployment disabled. Production deployment still requires explicit approval.
