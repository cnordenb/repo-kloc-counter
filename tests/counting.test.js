import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countRepository } from '../src/count.js';
import { fakeGitHub, REPO } from './fake-github.js';

const count = (github, onProgress = () => {}) => countRepository(github.fetch, REPO, onProgress);

test('Test 1: GitHub is called without a token', async () => {
  const github = fakeGitHub({ files: { 'a.js': 'x\n' } });
  await count(github);
  assert.deepEqual(github.calls.filter((call) => call.init?.headers), []);
});

test('Test 2: the default branch is counted', async () => {
  const github = fakeGitHub({ files: { 'a.js': 'x\n' } });
  await count(github);
  assert.match(github.calls[0].url, /\/repos\/cnordenb\/repo-kloc-counter\/git\/trees\/HEAD\?recursive=1$/);
});

test('Test 3: a file with a programming extension is counted', async () => {
  const totals = await count(fakeGitHub({ files: { 'src/main.js': 'x\n' } }));
  assert.equal(totals.files, 1);
});

test('Test 4: a file with an excluded extension is not counted', async () => {
  const totals = await count(fakeGitHub({ files: { 'README.md': 'x\n' } }));
  assert.equal(totals.files, 0);
});

test('Test 5: only lines that are not blank are counted', async () => {
  const totals = await count(fakeGitHub({ files: { 'a.py': 'a = 1\n\n   \n\t\n# note\r\nb = 2' } }));
  assert.equal(totals.lines, 3);
});

test('Test 6: a file that fails once is read on the retry', async () => {
  const totals = await count(fakeGitHub({ files: { 'a.c': 'x\n' }, failures: { 'a.c': 1 } }));
  assert.equal(totals.files, 1);
});

test('Test 7: a file that fails twice is left out', async () => {
  const totals = await count(fakeGitHub({ files: { 'a.c': 'x\n' }, failures: { 'a.c': 2 } }));
  assert.equal(totals.missed, 1);
});

test('Test 8: the files listed are counted when GitHub cuts the list short', async () => {
  const totals = await count(fakeGitHub({ files: { 'a.go': 'x\n', 'b.go': 'y\n' }, truncated: true }));
  assert.equal(totals.files, 2);
});

test('Test 9: done is the number of files read', async () => {
  const seen = [];
  await count(fakeGitHub({ files: { 'a.rs': 'x\n', 'b.rs': 'y\n' } }), (done) => seen.push(done));
  assert.deepEqual(seen, [0, 1, 2]);
});

test('Test 10: total is the number of files to read', async () => {
  const seen = new Set();
  const files = { 'a.rs': 'x\n', 'b.rs': 'y\n', 'notes.txt': 'z\n' };
  await count(fakeGitHub({ files }), (done, total) => seen.add(total));
  assert.deepEqual([...seen], [2]);
});
