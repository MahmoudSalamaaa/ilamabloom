import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const family = read("app/api/family/route.ts");
const care = read("app/api/care/route.ts");
const privacy = read("app/privacy/page.tsx");

test("family bootstrap creates care_records before deletion can run", () => {
  assert.match(family, /CREATE TABLE IF NOT EXISTS public\.care_records/);
  assert.match(family, /ALTER TABLE public\.care_records ADD COLUMN IF NOT EXISTS metadata/);
  assert.match(family, /WITH target AS MATERIALIZED/);
});

test("family deletion and family-scoped writes share an advisory lock", () => {
  assert.match(family, /pg_advisory_xact_lock\(hashtext\(t\.id\)\)/);
  assert.match(care, /pg_advisory_xact_lock\(hashtext\(o\.id\)\)/);
  assert.match(care, /FROM locked RETURNING/);
  assert.doesNotMatch(care, /await ownsProfile\(sql,u\.id,familyId\).*INSERT/);
});

test("sensitive wellbeing data requires explicit consent and is not cached", () => {
  assert.match(care, /consentToSensitiveStorage!==true/);
  assert.match(care, /Cache-Control/);
  assert.match(privacy, /Sensitive wellbeing observations/);
  assert.match(privacy, /ملاحظات الصحة النفسية الحساسة/);
  assert.match(privacy, /backup retention/);
  assert.match(privacy, /النسخ الاحتياطية/);
});
