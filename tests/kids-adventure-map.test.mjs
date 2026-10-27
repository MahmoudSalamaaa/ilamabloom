import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const map = readFileSync(new URL("../app/KidsAdventureMap.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/KidsAdventureMap.module.css", import.meta.url), "utf8");
const page = readFileSync(new URL("../app/KidsEditorial.tsx", import.meta.url), "utf8");

test("Kids adventure map preserves the five canonical bilingual worlds", () => {
  for (const [english, arabic] of [
    ["Food Garden", "حديقة الطعام"],
    ["Move Mountain", "جبل الحركة"],
    ["Body Bay", "خليج الجسد"],
    ["Sleepy Moon", "قمر الراحة"],
    ["Kitchen Lab", "معمل المطبخ"],
  ]) {
    assert.ok(map.includes(english), `missing English world: ${english}`);
    assert.ok(map.includes(arabic), `missing Arabic world: ${arabic}`);
  }
  assert.equal((map.match(/name: "/g) || []).length, 5, "exactly five world entries are expected");
  assert.match(page, /<KidsAdventureMap ar=\{ar\}\/>/, "the map must be used by the Kids page");
});

test("Kids adventure map is semantic, responsive and reduced-motion aware", () => {
  assert.match(map, /<ol[\s\S]*?<li[\s\S]*?<\/li>[\s\S]*?<\/ol>/);
  assert.match(map, /aria-labelledby="kids-adventure-map-title"/);
  assert.match(map, /aria-hidden="true"/);
  assert.match(css, /grid-template-columns:repeat\(5,minmax\(0,1fr\)\)/);
  assert.match(css, /@media\(max-width:560px\)/);
  assert.match(css, /prefers-reduced-motion:reduce/);
});
