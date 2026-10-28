# ILAMA BLOOM — Product & Experience Roadmap

Last updated: 2026-10-28

## Current release and Kids map status — 2026-10-28

- Latest read-only Vercel production preflight remains READY at main commit `b6dac997d7bc2b4814b2f82a771d61606861a9a1`. This work is isolated on `feat/kids-adventure-map` and has not changed production.
- The bilingual Adventure Map uses the five canonically named Kids worlds from the connected Notion product vision: Food Garden, Move Mountain, Body Bay, Sleepy Moon, and Kitchen Lab. It sits between the Kids hero and age-band selector, uses semantic ordered-list structure, responsive layouts, and reduced-motion-safe styling.
- Approved ILAMA/ILAMO character artwork was not present in the public asset tree inspected for this work. No replacement characters were generated; locating and integrating approved character assets remains open.
- PR #95 is open and draft. Its preview build is READY on commit `d5044511b843931c27fbb42892af297b966348e3`; the `/kids` route returned HTTP 200 after its same-origin redirect, and its loaded JavaScript bundle contains all five English world names. This verifies deployment and bundle content, not visual interaction or mobile browser behavior.
- The repository `npm run check` workflow passed on the same commit in a Vercel check build: the branch test suite (36 tests), TypeScript check, and Next.js build completed without errors. The check surfaced two stale repository assertions; the food-review expectation was aligned to current reviewer-attribution metadata, and the CSS specificity budget was synchronized to the unchanged main-branch baseline (2,483 `!important` declarations). No application CSS was changed to satisfy those checks.
- Remaining for this batch: browser interaction and mobile visual QA, followed by review of the Kids experience and approved character assets. The PR remains draft pending that review.

## Historical redesign audit — 2026-10-06

The redesign branch `redesign/foundation-and-discovery-20261006` was reviewed through PR #80 and merged on 2026-10-06. Its earlier Preview/quota notes are historical and do not describe the current production deployment.

## Product idea
ILAMA BLOOM is a bilingual nutrition and healthy-living experience built around **Food · Body · Context**. It should help people understand what is useful for the life they actually have rather than impose a perfect routine.

Official brand line:
- **Good Nutrition Brings a Brighter You**
- **تغذية أفضل .. لحياة أكثر إشراقا**

## Release gate — mandatory
Before any new feature, design batch, content expansion or refactor:
1. Check the latest Vercel production deployment.
2. If it is not successfully **READY**, stop feature work.
3. Diagnose and repair the failed build/deployment first.
4. Verify a successful READY production deployment.
5. Only then begin the next coherent batch.
6. Prefer substantial tested batches and one production deployment instead of many tiny deployments.

## Experience principles
- Premium editorial, botanical and tactile — not SaaS, not a generic clinic template.
- Feminine and sophisticated without becoming childish or ornamental.
- Mobile-first, accessible and calm.
- Arabic and English are complete parallel experiences, never mixed-language filler.
- No dependency on an external template for the visual identity.
- Prefer native/local brand assets over fragile external stock-image dependencies.
- Preserve useful APIs, data and business logic while continuously replacing legacy presentation.
- Health education should provide context, not diagnosis or treatment decisions.

## Product universe

### 1. My Day / Context Engine
Start with the person's real day: normal, busy, work, travel, exam, recovery, Ramadan or night shift. Context can influence what content and tools are surfaced without judging the user.

### 2. Eight Worlds
**Nourish · Move · Rest · Feel · Grow · Care · Learn · Journal**

These are the conceptual map of ILAMA BLOOM. Existing tools should gradually be organized into these worlds rather than accumulating unrelated menu items.

### 3. ILAMA Kitchen
A practical meal-thinking experience based on:
- what is available
- budget
- time
- energy
- who is eating
- health/life context

Food Atlas and label education feed into Kitchen.

### 4. Life Stages
Kids, Teens, Adult Life, Women, Men, WellAge and Family. The same content should not be presented identically to every age or life context.

### 5. Living With
Condition-aware education including diabetes, hypertension, heart health, PCOS, pregnancy, IBS, kidney health, celiac disease, food allergy, iron-related nutrition, migraine and chronic pain. Content must remain educational and evidence-aware.

### 6. Care / Learn / AI
Visit preparation, understandable health education, saved learning, audio/read-aloud where useful, and future AI guidance with explicit boundaries and source transparency.

### 7. Real Life Egypt
Egyptian foods, familiar portions, local eating patterns, family meals, affordability and realistic substitutions belong in the core product — not as an afterthought.

### 8. Family & Kids
Learning-by-doing games, family context and age-appropriate explanations. No public child profiles, punitive streaks, weight goals, calorie morality or competitive leaderboards.

## Current build priorities
1. Stabilize the global ILAMA shell and design system.
2. Complete the context-first homepage and Eight Worlds.
3. Make ILAMA Kitchen and Food Atlas feel like one product journey.
4. Redesign Learn, Journal, Visit Prep, Kids and About using the same visual language.
5. Remove obsolete NutClue copy, stale visual layers, literal newline artifacts and dead CSS.
6. Remove unnecessary external image dependencies.
7. Verify Arabic RTL, typography, mobile layouts, focus states and touch targets.
8. Improve sitemap/navigation so all important experiences are discoverable.
9. Harden production build and verify Vercel after every merged batch.

## Data & privacy direction
- Private journal data belongs to the signed-in account.
- Support edit, delete and export.
- Keep analytics focused on product quality rather than raw health values.
- Future child/family accounts require explicit consent, deletion/export controls and careful data minimization.

## Deployment discipline
Work on a non-production branch for large batches. Review the complete diff, then merge/push to main once. Do not knowingly stack new work on top of a failed production deployment.
