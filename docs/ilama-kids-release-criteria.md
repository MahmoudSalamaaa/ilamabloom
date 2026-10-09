# ILAMA Kids — product, ethics and release gates

## Scope and product promise
ILAMA Kids is a bilingual, child-first food-literacy, nature, science, agriculture and Egypt-discovery world. Animals are part of the living farm and ecosystem; **not** a veterinary-care simulator. Children learn through agency, play, gentle feedback and offline family activities.

## Current implementation (staged; NOT production)
- Existing five React games remain.
- FarmCanvas: procedural animated 2D canvas world, Ilama movement by pointer and keyboard, four existing approved character WebPs, pond with moving fish, selectable destinations, zoom, pan buttons, pause and reduced-motion behavior. The garden now reflects actual plot growth, and offscreen/hidden rendering is suspended to reduce battery use.
- FarmWorld: garden planting/watering/harvesting, device-local inventory, kitchen vegetable-side activity, freshwater-vs-sea fish exploration with variable-nutrient caution.
- EgyptAdventures: all 27 governorates grouped into six discoverable regions, food/crop facts, short quiz, device-local noncompetitive discovery stamps.
- KidsDiscoveryLab: food-source classification (six foods, selectable 3–5 / 6–8 / 9–12 activity levels) and Nile tilapia river-to-table sequencing, with noncompetitive local discovery stamps.\n- KidsWeatherLab: three plant-science puzzles on water, light and drainage, with an optional adult-supervised offline experiment.\n- Static TSX syntax and safety checks in `npm run check:kids` (requires local dependencies). The Playwright QA script now includes farm harvest-to-kitchen, both discovery games, weather puzzles and Egypt stamps, but HAS NOT BEEN EXECUTED on these detached commits.

## Mandatory release gates
1. **Build:** `npm ci && npm run check:kids && npm run build` must pass on the exact commit to publish. Existing check:kids checks must remain passing.
2. **Browser:** Real Chrome/Android viewport and desktop QA: Arabic RTL, English LTR, pointer and keyboard, zoom, pan, pause, reduced motion, images, farm -> kitchen harvest, fish challenge, Egypt 27 locations, passport persistence, discovery lab age bands and quiz, weather science, guest/sign-in switching, no horizontal overflow or runtime errors. Run `scripts/kids-browser-qa.cjs` with Playwright and axe-core on the exact staged commit after a successful Next build.
3. **Accessibility:** Keyboard focus visible; meaningful button labels; status announcements; touch targets; sufficient contrast; reduced motion; readable zoom; no forced timers.
4. **Scientific/editorial review:** Nutrition statements verified by pediatric/clinical-nutrition editor; no food morality, body shaming, diagnoses or medical advice. Governorate crop associations are examples, never claims of exclusivity; no veterinary medicine.
5. **Child safeguarding:** No child-to-stranger chat, public profile, personalized ads, purchases, dark patterns, streak punishment, shame, coercive characters, fear, endless loops or unnecessary care incentives. Clear stopping points and guardian controls.
6. **Data:** Only minimal learning state; device-local progress is not server-backed or protected from other users of the device. Do not market it as private cloud storage. Signed-in account-scoped progress requires authenticated, authorized server storage and deletion before claiming account sync.
7. **Rewards:** No child-facing clinic discounts. Bloom Points must be tied to verified, meaningful learning events with rate caps and no punitive deductions. Guardian wallet, clinic service campaigns, single-use vouchers, atomic ledger/redemption, audit logs, expiry and clinic verification must all be implemented and security-tested before financial rewards are enabled. Admin authority is controlled by the clinic owners and enforced server-side, not a client flag.
8. **Legal and consent:** Parent/guardian consent where applicable, age-appropriate privacy notices, data deletion and retention, local medical-advertising and consumer rules reviewed before any real clinic promotion.
9. **Deployment:** No branch ref changes or Preview/Production deployment until explicit user approval and all applicable checks pass. Prefer one cohesive release over many tiny deploys.

## Known limitations / next engineering milestones
- Canvas scene is a playable **prototype**, not a complete game engine with collisions, NPC pathfinding, quests, inventory synchronization or sound.
- Egypt uses a **region selector**, not yet accurate GIS governorate boundary polygons; obtain openly licensed ADM1 polygons (e.g. geoBoundaries gbOpen EGY ADM1, CC BY 4.0) and provide attribution before describing it as an accurate map.
- Fish challenge has four species and simplified habitat classification; clinical-nutrition and ecology review pending.
- Browser/Next.js QA has not yet been executed on these detached staged commits. Source-only structural assertions have passed; they are NOT substitutes for TSX compilation, browser rendering or accessibility audits.
- The earlier production five-game QA does **not** establish QA for these new components.
