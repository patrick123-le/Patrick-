import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const outputRoot = new URL("../dist/client/", import.meta.url);
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
  assert.doesNotMatch(
    html,
    /\/Patrick-\//,
    `${path} should not contain the GitHub Pages base path`,
  );
  assert.match(
    html,
    /(?:href|src)="\//,
    `${path} should use root-relative assets on Cloudflare Pages`,
  );
}

const home = await readFile(new URL("index.html", outputRoot), "utf8");
assert.match(home, /Patrick的实务学习手册/);
assert.match(home, /\/_next\/static\//);

const question = await readFile(new URL("works/q4/index.html", outputRoot), "utf8");
assert.match(question, /\/mindmaps\/q4-01\.jpeg/);

console.log(
  `Verified ${requiredPages.length} Cloudflare Pages routes and root-path assets.`,
);
