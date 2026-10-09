import assert from 'node:assert/strict';
import {loadTypeScript} from './load-kids-test.mjs';
const {VISION_VERSION,VISION_BUNDLE,VISION_WASM,POSE_MODEL}=loadTypeScript('lib/kids/vision-assets.ts');
// Real network preflight. Run before releasing optional tracking; do not substitute CDN fixtures.
const urls=[VISION_BUNDLE,VISION_WASM+'/vision_wasm_internal.js',VISION_WASM+'/vision_wasm_internal.wasm',VISION_WASM+'/vision_wasm_nosimd_internal.js',VISION_WASM+'/vision_wasm_nosimd_internal.wasm',POSE_MODEL];
const results=await Promise.allSettled(urls.map(async url=>{
 const response=await fetch(url,{method:'HEAD',signal:AbortSignal.timeout(30000)});
 assert.equal(response.status,200,url+' must be available');return {url,status:response.status};
}));
for(const result of results){if(result.status==='rejected')throw result.reason;console.log('PASS '+result.value.url+' '+result.value.status)}
console.log('PASS real MediaPipe '+VISION_VERSION+' bundle, SIMD/non-SIMD WASM and pose model availability');
