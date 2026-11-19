import { readFile, writeFile } from 'node:fs/promises';

const SOURCE = 'https://raw.githubusercontent.com/github-linguist/linguist/main/lib/linguist/languages.yml';
const EXCLUDED = new URL('excluded-extensions.json', import.meta.url);
const TARGET = new URL('../../src/extensions.json', import.meta.url);

function programmingExtensions(yaml) {
  const languages = yaml.replaceAll('\r', '').split(/\n(?=[^\s#-])/);
  return languages.filter((language) => /^ {2}type: programming$/m.test(language)).flatMap(extensionsOf);
}

function extensionsOf(language) {
  const list = language.match(/^ {2}extensions:\n((?: {2}- .*(?:\n|$))+)/m);
  if (list === null) return [];
  return list[1].trim().split('\n').map((line) => JSON.parse(line.trim().slice(2)).toLowerCase());
}

async function main() {
  const response = await fetch(SOURCE);
  if (!response.ok) throw new Error(`${SOURCE} answered ${response.status}`);
  const excluded = new Set(JSON.parse(await readFile(EXCLUDED, 'utf8')));
  const found = new Set(programmingExtensions(await response.text()));
  const kept = [...found].filter((extension) => !excluded.has(extension)).sort();
  await writeFile(TARGET, `${JSON.stringify(kept).replaceAll('","', '", "')}\n`);
  console.log(`${kept.length} extensions written to src/extensions.json, ${excluded.size} excluded`);
}

await main();
