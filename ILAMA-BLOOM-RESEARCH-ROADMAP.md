# Ilama Bloom: research-led product roadmap

Last updated: 2026-10-06

Current implementation note: the redesign batch keeps these safety and privacy constraints in scope. Family/child accounts, clinician-facing exports and any new learning game remain roadmap work; they are not represented as shipped functionality.

## What the global scan suggests

The strongest pattern in pediatric diabetes education is learning-by-doing: children build meals, identify carbohydrate clues, solve short scenarios, and receive immediate explanations. A 2025 scoping review found gamified interventions promising but still unevenly evaluated, while participatory co-design work such as MyDiabetic centered the experience on carbohydrate counting and practical diabetes skills.

Ilama Bloom should therefore reward curiosity and completion of a learning moment, not weight, calorie restriction, food morality, streak pressure, or public competition. This is especially important because nutrition apps can be helpful for chronic-care planning but can also reinforce shame or disordered eating when goals become punitive.

## Priority additions

### 1. Family account, not child surveillance

- Parent/caregiver account with optional child profile.
- Child mode stores nickname, age band and learning progress only.
- No public profiles, leaderboards, location, calorie targets or weight goals.
- Parent view can export a clinician-friendly visit summary.
- Consent and deletion flows must be explicit before launching child accounts.

### 2. Game ideas worth prototyping

1. **Market Mission** — choose a familiar Egyptian food package, find “Total Carbohydrate”, compare serving size and build a safe explanation.
2. **Koshari Constructor** — add rice, pasta, lentils, chickpeas and sauce; the child learns that mixed dishes can contain several sources.
3. **Lunchbox Remix** — pack four items, tap an item to remove it, and get neutral clues such as “source of carbohydrate” or “another food”.
4. **Food Detective** — inspect a meal photo or illustrated plate and circle where carbohydrate may come from; allow “not sure” as a valid answer.
5. **Build-a-Story** — a short comic where a child prepares for school, sport and a clinic visit; the player chooses what question or label to bring.
6. **Kitchen Lab** — change portion size or recipe ingredients and observe how the estimate changes, without turning the result into a treatment recommendation.
7. **Accessibility mode** — audio prompts, large tap targets, reduced motion, dyslexia-friendly spacing, and a non-reading mode for younger children.

### 3. Product improvements

- Searchable Egyptian food database with source, portion, uncertainty and last-reviewed fields.
- Clinician review flag for health content and a visible “learning only” boundary around treatment decisions.
- Saved lessons and “continue where you stopped” progress.
- Offline-first draft logging with a clear sync status.
- Account data export and delete-my-data controls.
- Event analytics limited to product quality: lesson started/completed, game retry, language, device class. Never collect raw health values for analytics.

## Recommended implementation order

1. Supabase Auth + Postgres + RLS for private journal entries.
2. Account-aware sync and conflict-safe entry IDs.
3. Parent/child consent model and deletion/export.
4. Food data schema and clinician review workflow.
5. One tested game: Market Mission.
6. Co-design test with children, parents and a pediatric diabetes educator.

## Sources reviewed

- [PubMed: gamified interventions in children with type 1 diabetes](https://pubmed.ncbi.nlm.nih.gov/42323588/)
- [PMC: MyDiabetic participatory serious-game study](https://pmc.ncbi.nlm.nih.gov/articles/PMC11109855/)
- [PMC: games and health education systematic review](https://pmc.ncbi.nlm.nih.gov/articles/PMC7712293/)
- [UC Davis pediatric diabetes resources](https://health.ucdavis.edu/children/patient-education/pediatric-diabetes/additional-resources)
- [Supabase Auth guide](https://supabase.com/docs/guides/auth)
- [Supabase SSR guide](https://supabase.com/docs/guides/auth/server-side)
- [Vercel Storage and Marketplace](https://vercel.com/docs/storage)
- [FTC COPPA rule review](https://www.ftc.gov/system/files/ftc_gov/pdf/p195404_coppa_reg_review.pdf)

