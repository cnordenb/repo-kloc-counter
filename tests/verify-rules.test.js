import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const MAX_FUNCTION_LOC = 60;
const STRING = new RegExp(String.raw`'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|${'`'}(?:\\.|[^${'`'}\\])*${'`'}`, 'g');
const COMMENTS = { js: [String.raw`\/\/`, String.raw`\/\*`], html: ['<!--', String.raw`\/\*`], other: ['(^|\\s)#'] };
const OPENS_FUNCTION = /(\)|=>)\s*\{$/;

const rulesScript = readFileSync('.github/scripts/check-rules.sh', 'utf8');
const codePattern = new RegExp(rulesScript.match(/^code_pattern='(.*)'$/m)[1]);
const codeFiles = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' })
  .split('\n')
  .filter((file) => codePattern.test(file) && existsSync(file));

const withoutStrings = (file) => readFileSync(file, 'utf8').replaceAll('\\/', '').replace(STRING, '""').split(/\r?\n/);

const comment = (file) => {
  const kind = file.endsWith('.js') ? 'js' : file.endsWith('.html') ? 'html' : 'other';
  return new RegExp(COMMENTS[kind].join('|'));
};

const longFunctions = (file) => {
  const lines = withoutStrings(file);
  return lines.flatMap((line, start) => {
    if (!OPENS_FUNCTION.test(line.trimEnd())) return [];
    let depth = 0;
    for (let end = start; end < lines.length; end += 1) {
      depth += (lines[end].match(/\{/g) ?? []).length - (lines[end].match(/\}/g) ?? []).length;
      if (depth > 0) continue;
      const loc = lines.slice(start, end + 1).filter((text) => text.trim() !== '').length;
      return loc > MAX_FUNCTION_LOC ? [`${file}:${start + 1}: ${loc} lines`] : [];
    }
    return [];
  });
};

test('Test 59: no code holds a comment', () => {
  const commented = codeFiles.flatMap((file) =>
    withoutStrings(file).flatMap((line, i) => (comment(file).test(line) ? [`${file}:${i + 1}`] : [])));
  assert.deepEqual(commented, []);
});

test('Test 60: no function is longer than 60 lines of code', () => {
  assert.deepEqual(codeFiles.flatMap(longFunctions), []);
});
