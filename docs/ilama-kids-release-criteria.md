# ILAMA Kids: product, ethics and release gates

## Scope

ILAMA Kids is a bilingual food-literacy, nature, science, agriculture and Egypt-discovery world. Children learn through play, gentle feedback and optional family activities. Animals appear as part of the ecosystem and food stories, never as a veterinary-care simulator.

## Implemented experience

- The original five games and five approved character WebPs remain. Artwork hashes are release-gated; do not generate or replace artwork without an explicit request.
- Farm World has an animated procedural canvas, keyboard/pointer/touch navigation, zoom, pan, pause, reduced motion, offscreen suspension, live growing plots and harvest-to-kitchen inventory. Atomic current-state actions prevent double harvest/spending.
- Egypt Adventures includes all 27 governorates, six region groups, illustrative crop facts, food challenges and discovery stamps. This is a region selector, not a GIS boundary map.
- Aqua World includes six Nile/sea fish, habitat matching and nutrient clues, and safe preparation/allergy-aware family language. Nutrient amounts vary by species; there is no pressure to taste fish.
- Food Discovery includes six food-source examples, three optional difficulty bands and tilapia’s river-to-table sequence. The Discovery Lab adds 15 food/science/Egypt/nature/family activities, hints and nonpunitive feedback.
- Weather Lab includes three plant-science challenges and a keyboard/touch-controlled toy plant with water, light and drainage observations. It is explicitly a simple illustration, not a prescription for caring for a real plant.
- Three replayable story quests have explanations before progression and move keyboard focus to the next scene. Mission links open their exact story or food activity. Kitchen Studio has 12 ingredients, preparation/safety checkpoints, named accessible recipe cards, unique IDs for up to eight saved meal ideas, and explicit confirmation before clearing them. Food, story, aquatic and kitchen layouts use dedicated CSS modules.
- Eight movement games have character scenes, alternating gentle prompts, seated/manual alternatives, three round lengths and optional on-device experimental pose tracking. Camera acquisition, model loading, cancellation, device loss, pause, hidden/offscreen view and completion have explicit cleanup paths. No media is recorded or uploaded.
- Four optional journeys record 12 milestones from real learning activity. Every destination stays open; there is no required order, daily obligation, ranking, penalty or financial reward. Consuming harvest or replaying an activity does not erase learning evidence.
- Guardians can create up to five minimal learning profiles, switch/edit/delete them, export the current device’s bounded learning state and explicitly start a fresh journey. Parent summaries show discoveries and journey steps without comparisons.

## Data and privacy boundaries

The new learning APIs authorize every child operation by the server-authenticated account. PostgreSQL stores scoped snapshots with revisions and a profile-level progress generation. A guardian reset deletes snapshots and advances that generation; older requests cannot recreate cleared progress, even at revision zero. Same-generation learning evidence can merge, while inventory and recipe conflicts require a visible choice. Device caches include the generation and are invalidated when the server reports a reset. Deleted profiles cannot authorize reads/writes.

Device caches are not encrypted and may remain on other devices until they reconnect. Exports explicitly identify current-device progress and pending edits. Do not describe device storage as protection from other people using the device. No camera frames, body measurements, health notes or public child profiles are in the learning schema. Children’s/parent spaces suppress site analytics even with prior public-site consent. A blocked storage API must not crash play.

## Required verification before release

1. Run `npm ci`, `npx tsc --noEmit`, `npm run check:kids` and `npm run build` on the reviewed source.
2. Execute `qa:kids:browser`, `qa:kids:journey`, `qa:kids:camera`, `qa:kids:play` `qa:kids:camera-resilience` and `qa:kids:activities` against the optimized local build. Record actual results; structural assertions alone are not browser QA.
3. Check English LTR/Arabic RTL, 320/375/390/768/1440px layouts, keyboard focus, native range controls, touch targets, contrast, reduced motion, approved image decoding, games, mission persistence, account/sibling isolation, download contents, reset/delete boundaries and stale/late responses.
4. Verify PostgreSQL ownership, input bounds, streamed-body/origin checks, migrations, revision conflicts and reset generations. No account sync claim without authenticated storage/deletion implementation.
5. Physical-camera, real model/CDN loading, live authentication/database permissions, human screen-reader and pediatric/clinical-editor reviews remain environment/editorial checks. Synthetic camera/API tests must be labeled as such. Automated axe checks are not accessibility certification.
6. Cloud-outage tests do not establish fresh offline navigation/install support. The app may continue playing in an already loaded page; document delivery still requires a network or an appropriate offline shell.
7. Consolidate ordinary development into reviewable integration updates. Keep automatic deployment disabled for this integration branch. Production deployment requires explicit approval and applicable release checks; avoid unnecessary preview/production deployments.

## Disabled and future scope

No public child-to-stranger chat, personalized advertising, purchases, clinic discounts, monetary points, vouchers or redemption are implemented. Any future clinic reward requires guardian-facing terms, clinic-owner server authorization, atomic ledger/redemption, rate caps, audit logs, consumer/privacy/editorial review and dedicated security tests before enabling it. No child-facing financial pressure or punishment is permitted.

The canvas remains a lightweight procedural game scene. Accurate governorate polygons need a suitable licensed dataset and attribution. Camera thresholds need testing with actual devices, lighting, body positions and mobility differences. See the dated release reports in `docs/releases` for executed validation and remaining limits.
