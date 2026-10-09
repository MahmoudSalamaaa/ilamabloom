# ILAMA Kids — production rollout and MediaPipe correction

Date: 2026-10-09 (Africa/Cairo).
User explicitly authorized production publication in this session.

The first production deployment (`dpl_82qqxCfRah79RArVsB5byzfU4ze3`) published commit `0b2fbfb554830df935c5ca082e41dcd5998e10cf` and reached READY. The custom domain was verified against that deployment. HTTP checks passed for home, both kids languages, parent and sign-in pages. Unauthenticated child API requests returned 401; all five live WebPs matched repository SHA-256 hashes. Real live activity and connected-play tests passed in both languages; the ten-viewport browser/axe matrix also passed.

A subsequent real-network camera resource check found that the existing `@mediapipe/tasks-vision@0.10.22` bundle and WASM URLs returned 404. Previous camera tests had substituted the SDK and did not establish real CDN availability. This was a missed predeployment check. Manual movement play remained available, but optional automatic tracking could not initialize.

The correction pins an actually published release, `0.10.21`, in a shared asset manifest. The bundle, SIMD and non-SIMD JavaScript/WASM files and the official pose model all returned HTTP 200. New release commands check real resource availability and then execute the real model with a synthetic blank video, without replacing the SDK, WASM or model. This detects an unavailable release before publication.

Actual local correction checks: TypeScript passed; 66 Node tests and 59 engine gates passed; optimized build passed; real model initialization and inference passed; blank frames did not earn movement credit; pause stopped the camera and destroyed the graph/WebGL context. Existing synthetic camera and resilience tests were rerun. This still does not establish recognition accuracy on physical cameras, lighting, mobility or supported mobile hardware.

One corrective production deployment is necessary to deliver this fix. No previews were created. The integration branch keeps automatic deployment disabled. Historical reports describe their own preproduction checkpoints, not the current publication state.

Live log inspection found PostgreSQL connection-string compatibility warnings on cold function startup, rather than application request failures. No external Vercel drains were configured at inspection time. Browser transport used the execution environment proxy; curl/urllib and Vercel independently verified the public HTTPS/domain behavior. Browser certificate bypass was limited to this test runner to accommodate the proxy certificate and is not a product setting.
