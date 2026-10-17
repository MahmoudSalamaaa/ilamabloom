import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const page=readFileSync(new URL("../app/MentalHealthNutrition.tsx",import.meta.url),"utf8");

test("mood and food observation uses a real submit control",()=>{
  assert.match(page,/<form[^>]*onSubmit=/);
  assert.match(page,/<button type="submit" disabled=\{saving\|\|!consent/);
  assert.match(page,/await fetch\("\/api\/care"/);
});

test("failed care writes preserve input and show an accessible error",()=>{
  assert.match(page,/else\{setSaveError\(true\);if\(r.status===401\)setAuthRequired\(true\)\}/);
  assert.match(page,/catch\{setSaveError\(true\)\}/);
  assert.match(page,/role="alert"/);
  assert.match(page,/finally\{setSaving\(false\)\}/);
});

test("mental-health guidance avoids diagnosis and treatment substitution",()=>{
  assert.match(page,/does not diagnose or replace mental-health treatment/);
  assert.match(page,/association|Association|Association ≠ cause|pattern is not proof/);
  assert.match(page,/professional assessment/);
});

test("sensitive wellbeing observations require explicit consent",()=>{
  assert.match(page,/checked={consent}/);
  assert.match(page,/!consent\|\|!Object.values\(obs\)/);
  assert.match(page,/if\(!consent\|\|!Object.values\(obs\)/);
  assert.match(page,/setConsent\(false\)/);
});

test("unauthenticated writes show sign-in guidance and preserve observations",()=>{
  assert.match(page,/r.status===401/);
  assert.match(page,/Sign in to save this observation/);
  assert.match(page,/href="\/account"/);
});
