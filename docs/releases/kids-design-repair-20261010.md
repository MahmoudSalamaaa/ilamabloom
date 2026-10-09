# ILAMA Kids design repair — 2026-10-10 (Cairo)

## Reviewed problems and changes

Visual inspection covered the live Arabic mobile and desktop hero and farm before implementation, then final optimized local screenshots in both languages. The desktop Arabic headline wrapped into three oversized lines; the farm canvas filled almost the desktop viewport; its small browser-default pan/zoom controls were inconsistent with destination controls. Learning sections lacked shared gutters, nested typography crossed component boundaries, and mobile navigation concealed destinations in a horizontal scroll row.

- Bound the learning area to 1280px with responsive shared gutters; align guardian, mission, adventure and activity sections.
- Refactor the adventure hub, farm activity and canvas controls from inline presentation into three owned CSS modules. Destination cards, supplemental links, passport cards and selected states share deliberate spacing and mobile grids.
- Bound the farm scene to 900px, preserve its 16:9 coordinate mapping and display the existing approved character images unchanged. Arrange controls in reachable 44px+ touch targets with wrapping mobile grids and visible keyboard focus.
- Reduce desktop hero headline and image size, adjust Arabic line height and add separation between mobile hero actions and illustration.
- Show all six distinct Kids navigation destinations in two rows on mobile. The logo already links home, so the duplicate Home item is removed.
- Scope world heading rules to the intended top-level sections. Exclude modular Kids descendants from the public editorial typography overrides without changing typography outside Kids.
- Remove the redundant outer game landmark; inner named game sections remain. The camera QA now targets the unique Fish discovery region instead of the removed outer label.
- Add a layout gate checking every adventure destination in English/Arabic at 320/390/768/1440px, six visible navigation targets, interactive bounding boxes and the farm scene bound.

No image was generated, replaced or modified. Five approved image hashes passed release checks.

## Actual verification

npm ci (270 packages), TypeScript, 69 Node tests and optimized build passed. Layout QA passed eight language/viewport combinations across all five destinations. Existing browser QA passed ten combinations at 320/375/390/768/1440px including interactive games and automated accessibility checks. Activity, connected play and guardian journey suites passed both languages. Synthetic camera QA passed permission, cancellation, stationary/moving samples, disposal and manual alternatives.

The first camera run failed because its locator still expected the removed redundant outer Aqua World landmark. After targeting the actual Fish discovery landmark, the affected camera suite passed. No runtime logic was changed to accommodate the test.

Account/sibling/cloud scenarios use controlled API fixtures and database unit tests, not a logged-in production household. Camera input and detector responses in this batch are synthetic. Real model loading was verified in prior releases and its resources are unchanged here. Automated axe checks are not a human screen-reader certification. Screenshot Chromium lacks emoji glyphs; text and original bitmap character assets were inspected. Test-only HTTPS proxy/certificate settings are unchanged and are not product settings.

The optimized-source results and viewport evidence accompany this report. Production readiness and live verification are reported after publication; this document is the prepublication checkpoint.
