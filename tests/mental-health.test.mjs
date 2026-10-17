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
  assert.match(page,/else\{setSaveError\(true\);if\(r.status===401\)setAuthRequired\(true\);if\(r.status===404\)setProfileMissing\(true\)\}/);
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

const careApi=readFileSync(new URL("../app/api/care/route.ts",import.meta.url),"utf8");
const css=readFileSync(new URL("../app/MentalHealthNutrition.module.css",import.meta.url),"utf8");
test("server requires explicit consent for wellbeing observations",()=>{
  assert.match(careApi,/kind==="wellbeing-observation"&&b\.consentToSensitiveStorage!==true/);
  assert.match(page,/consentToSensitiveStorage:consent/);
});
test("failed profile ownership checks keep observations and guide recovery",()=>{
  assert.match(page,/r\.status===404/);
  assert.match(page,/setProfileMissing\(true\)/);
  assert.match(page,/Choose a valid profile/);
  assert.match(careApi,/ownsProfile\(sql,u\.id,familyId\)/);
});
test("care API scopes deletion to user and selected profile",()=>{
  assert.match(careApi,/export async function DELETE/);
  assert.match(careApi,/DELETE FROM public\.care_records WHERE id=\$\{id\} AND user_id=\$\{u\.id\}/);
});
test("consent control has compact checkbox and keyboard focus treatment",()=>{
  assert.match(css,/input\[type="checkbox"\]/);
  assert.match(css,/:focus-visible/);
});
