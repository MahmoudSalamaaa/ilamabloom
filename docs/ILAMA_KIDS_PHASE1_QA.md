# ILAMA Kids — Phase 1 release gate

This is a **staged** code branch, not a production release. Git objects alone are not evidence of a successful build.

## Required execution

From a clean checkout of the staged commit, with Node.js matching the repository engine requirements:

```bash
npm ci
npx tsc --noEmit
node --test scripts/test-kids-stability.mjs
node --test scripts/test-kids-integration.mjs
node --test scripts/test-kids-motion.mjs
npm run check:kids
npm run build
```

If `npm ci` fails because the lockfile is stale, fix the lockfile in a controlled change before retesting. Do not run a production deployment just to discover compile errors.

## Browser and device gate

- Android Chrome: 360px, 390px, 412px widths; landscape and portrait.
- English LTR and Arabic RTL; no clipped buttons or overlapping navigation.
- Tab/keyboard focus, accessible labels, large tap targets, reduced-motion preferences.
- All five destinations: navigate, reload, and confirm the correct selected destination.
- Farm: plant, water, harvest, reload; verify account switching does not overwrite the previous account's data.
- Discovery Lab: correct/incorrect choices, feedback, reload.
- Movement: eight games, start/pause/finish, camera-free mode and seated alternatives.
- Camera: reject permission, revoke permission, grant permission, switch games, close world, and verify tracks stop.
- Pose tracking: validate on real Android hardware; current model thresholds are not calibrated for all ages or seated users.
- Confirm no video/image upload or storage in network panel. External MediaPipe script, WASM and model downloads must be disclosed and reviewed for privacy, CSP and availability.
- Confirm no animal-health/veterinary content, food/body shame, punitive streaks, child-targeted clinic marketing, or unapproved images.

## Known limitations and open defects

1. The movement tracker is a prototype. It may overcount static poses and undercount actual steps.
2. MediaPipe loads from external CDN; production should self-host pinned, reviewed assets or use an audited dependency with CSP.
3. Game completion currently persists on the device, not securely to an authenticated child profile.
4. Discovery Lab age-group selection does not yet adapt challenge difficulty.
5. Egyptian governorates are listed but no verified polygon geography is present.
6. Existing scripts are added but have not been run by GitHub staging.

**Release rule:** Never update the production branch or deploy without actual build/browser QA and explicit user approval.
