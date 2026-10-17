import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const admin = read("app/api/admin/foods/route.ts");
const foods = read("app/api/foods/route.ts");
const atlas = read("app/FoodAtlasLive.tsx");
const adminUi = read("app/admin/page.tsx");

test("food edits do not auto-approve content", () => {
  assert.match(admin, /VALUES \(\$\{id\}.*NULL,NULL\)/s);
  assert.match(admin, /reviewed_at=NULL,reviewed_by=NULL/);
  assert.doesNotMatch(admin, /reviewed_at=now\(\)/);
});
test("admin routes require an authorized signed-in account", () => {
  assert.match(admin, /await currentUser\(\)/);
  assert.match(admin, /ADMIN_EMAILS/);
  assert.match(admin, /if\(!u\)return json\(\{error:"Forbidden"\},403\)/);
});
test("fallback source is explicit and not cached", () => {
  assert.match(foods, /source:dbBacked\?"database":"fallback"/);
  assert.match(foods, /"no-store"/);
  assert.match(atlas, /data\.source==="database"\?"database":"fallback"/);
  assert.match(atlas, /dataSource==="fallback"/);
});
test("unreviewed items are labeled in both languages", () => {
  assert.match(atlas, /غير معتمد علميًا/);
  assert.match(atlas, /not independently reviewed/);
  assert.match(adminUi, /يلزم اعتماد مستقل/);
});

test("admin validates food identifiers and confidence values", () => {
  assert.match(admin, /\^\[a-z0-9\]/);
  assert.match(admin, /\["estimated","variable","label"\]\.includes\(confidence\)/);
  assert.match(admin, /Invalid confidence level/);
});
