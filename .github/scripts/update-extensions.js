import { readFile, writeFile } from 'node:fs/promises';

const SOURCE = 'https://raw.githubusercontent.com/github-linguist/linguist/main/lib/linguist/languages.yml';
const EXCLUDED = new URL('excluded-extensions.json', import.meta.url);
const INCLUDED = new URL('included-extensions.json', import.meta.url);
const TARGET = new URL('../../src/data/extensions.json', import.meta.url);

function programmingExtensions(yaml) {
  const languages = yaml.replaceAll('\r', '').split(/\n(?=[^\s#-])/);
  return languages.filter((language) => /^ {2}type: programming$/m.test(language)).flatMap(extensionsOf);
}

function extensionsOf(language) {
  const list = language.match(/^ {2}extensions:\n((?: {2}- .*(?:\n|$))+)/m);
  if (list === null) return [];
  return list[1].trim().split('\n').map((line) => JSON.parse(line.trim().slice(2)).toLowerCase());
}

async function listIn(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

async function main() {
  const response = await fetch(SOURCE);
  if (!response.ok) throw new Error(`${SOURCE} answered ${response.status}`);
  const excluded = new Set(await listIn(EXCLUDED));
  const included = await listIn(INCLUDED);
  const found = new Set([...programmingExtensions(await response.text()), ...included]);
  const kept = [...found].filter((extension) => !excluded.has(extension)).sort();
  await writeFile(TARGET, `${JSON.stringify(kept).replaceAll('","', '", "')}\n`);
  const counts = `${included.length} included, ${excluded.size} excluded`;
  console.log(`${kept.length} extensions in src/data/extensions.json: ${counts}`);
}

await main();
