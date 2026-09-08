import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const outputRoot = new URL("../dist/client/Patrick-/", import.meta.url);
const works = JSON.parse(
  await readFile(new URL("../content/works.json", import.meta.url), "utf8"),
);

const requiredPages = [
  "index.html",
  "404.html",
  "about/index.html",
  "guestbook/index.html",
  "privacy/index.html",
  "resources/legal-glossary/index.html",
  "works/index.html",
  ...works.map((work) => `works/${work.slug}/index.html`),
];

for (const path of requiredPages) {
  await access(new URL(path, outputRoot));
}

const representativePages = [
  "index.html",
  "about/index.html",
  "works/index.html",
  "works/q4/index.html",
  "works/s12/index.html",
];

for (const path of representativePages) {
  const html = await readFile(new URL(path, outputRoot), "utf8");
  assert.match(html, /\/Patrick-\//, `${path} should use the repository base path`);
  assert.doesNotMatch(
    html,
    /(?:href|src)="\/(?:_next|about|mindmaps|works|guestbook|privacy|resources)(?:\/|\")/,
    `${path} contains a root-relative URL that would break on GitHub Pages`,
  );
}

const home = await readFile(new URL("index.html", outputRoot), "utf8");
assert.match(home, /Patrick的实务学习手册/);
assert.match(home, /\/Patrick-\/_next\/static\//);

const question = await readFile(new URL("works/q4/index.html", outputRoot), "utf8");
assert.match(question, /\/Patrick-\/mindmaps\/q4-01\.jpeg/);

console.log(`Verified ${requiredPages.length} GitHub Pages routes and base-path assets.`);
