import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { createSession } from '../src/session.js';
import { progressLine } from '../src/output.js';
import { fakeGitHub, LINK } from './fake-github.js';

const outputAfter = async (inputs, github = fakeGitHub()) => {
  const session = createSession({ fetch: github.fetch });
  for (const input of inputs) await session.submit(input);
  return session.lines.filter((line) => !line.startsWith('> '));
};

const resultOf = async (options) => (await outputAfter([LINK], fakeGitHub(options)))[0];

const pending = () => new Promise(() => {});

test('Test 19: help lists the accepted link and the commands', async () => {
  const help = (await outputAfter(['help'])).join('\n');
  assert.deepEqual(['github.com/{owner}/{repo}', 'help', 'clear'].filter((word) => !help.includes(word)), []);
});

test('Test 20: clear removes all output from the terminal', async () => {
  const session = createSession({ fetch: fakeGitHub().fetch });
  await session.submit('help');
  await session.submit('clear');
  assert.deepEqual(session.lines, []);
});

test('Test 21: the up arrow gives the previous input', async () => {
  const session = createSession({ fetch: fakeGitHub().fetch });
  await session.submit('help');
  await session.submit('clear');
  session.previous();
  assert.equal(session.previous(), 'help');
});

test('Test 22: the down arrow gives the next input', async () => {
  const session = createSession({ fetch: fakeGitHub().fetch });
  await session.submit('help');
  await session.submit('clear');
  session.previous();
  session.previous();
  assert.equal(session.next(), 'clear');
});

test('Test 23: the prompt accepts new input after an error', async () => {
  const session = createSession({ fetch: fakeGitHub({ status: 404 }).fetch });
  await session.submit(LINK);
  assert.equal(session.busy, false);
});

test('Test 24: the progress line shows the turning character, done and total', () => {
  assert.equal(progressLine(0, 3, 12), '/ counting lines... (3/12 files)');
});

test('Test 25: the turning character goes through / - \\ | and round again', () => {
  assert.deepEqual([0, 1, 2, 3, 4].map((frame) => progressLine(frame, 0, 0)[0]), ['/', '-', '\\', '|', '/']);
});

test('Test 26: the turning character changes every 300 ms', () => {
  mock.timers.enable({ apis: ['setInterval'] });
  const session = createSession({ fetch: pending });
  session.submit(LINK);
  mock.timers.tick(299);
  const before = session.lines.at(-1)[0];
  mock.timers.tick(1);
  const after = session.lines.at(-1)[0];
  mock.timers.reset();
  assert.deepEqual([before, after], ['/', '-']);
});

test('Test 27: the result shows the KLOC with one decimal', async () => {
  assert.match(await resultOf({ files: { 'a.js': 'x\n'.repeat(12347) } }), /^12\.3 KLOC · /);
});

test('Test 28: the result shows the number of files counted', async () => {
  assert.match(await resultOf({ files: { 'a.js': 'x\n', 'b.js': 'y\n', 'c.md': 'z\n' } }), / · 2 files · /);
});

test('Test 29: the result shows the exact number of lines of code', async () => {
  assert.match(await resultOf({ files: { 'a.js': 'x\n'.repeat(12347) } }), / · 12347 lines$/);
});

test('Test 30: a repository with no code files gives 0.0 KLOC · 0 files · 0 lines', async () => {
  const output = await outputAfter([LINK], fakeGitHub({ files: { 'README.md': 'x\n' } }));
  assert.deepEqual(output, ['0.0 KLOC · 0 files · 0 lines']);
});

test('Test 31: an empty repository gives 0.0 KLOC · 0 files · 0 lines', async () => {
  assert.deepEqual(await outputAfter([LINK], fakeGitHub({ status: 409 })), ['0.0 KLOC · 0 files · 0 lines']);
});

test('Test 32: a file list cut short gives a warning that the count is partial', async () => {
  const output = await outputAfter([LINK], fakeGitHub({ files: { 'a.js': 'x\n' }, truncated: true }));
  assert.match(output[1], /^warning: the count is partial/);
});

test('Test 33: a file left out gives a warning that the count is partial', async () => {
  const output = await outputAfter([LINK], fakeGitHub({ files: { 'a.js': 'x\n' }, failures: { 'a.js': 2 } }));
  assert.match(output[1], /^warning: the count is partial/);
});

test('Test 34: input that is not a valid link gives the error "not a valid link"', async () => {
  assert.deepEqual(await outputAfter(['https://gitlab.com/cnordenb/repo-kloc-counter']), ['error: not a valid link']);
});

test('Test 35: the hourly rate limit exceeded gives its error', async () => {
  const github = fakeGitHub({ status: 403, headers: { 'x-ratelimit-remaining': '0' } });
  assert.deepEqual(await outputAfter([LINK], github), ["error: GitHub's hourly rate limit exceeded"]);
});

test('Test 36: a repository GitHub does not show gives "not a public repository, or no such repository"', async () => {
  const expected = ['error: not a public repository, or no such repository'];
  assert.deepEqual(await outputAfter([LINK], fakeGitHub({ status: 404 })), expected);
});
