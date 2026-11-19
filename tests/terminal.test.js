import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { createSession } from '../src/session.js';
import { progressLine } from '../src/output.js';
import { fakeGitHub, LINK, ownRepos } from './fake-github.js';

const outputAfter = async (inputs, github = fakeGitHub()) => {
  const session = createSession({ fetch: github.fetch });
  for (const input of inputs) await session.submit(input);
  return session.lines.filter((line) => !line.startsWith('> '));
};

const resultOf = async (options) => (await outputAfter([LINK], fakeGitHub(options)))[0];

const pending = () => new Promise(() => {});

test('Test 29: help lists the accepted link and the commands', async () => {
  const help = (await outputAfter(['help'])).join('\n');
  assert.deepEqual(['github.com/{owner}/{repo}', 'help', 'clear'].filter((word) => !help.includes(word)), []);
});

test('Test 30: clear removes all output from the terminal', async () => {
  const session = createSession({ fetch: fakeGitHub().fetch });
  await session.submit('help');
  await session.submit('clear');
  assert.deepEqual(session.lines, []);
});

test('Test 31: the up arrow gives the previous input', async () => {
  const session = createSession({ fetch: fakeGitHub().fetch });
  await session.submit('help');
  await session.submit('clear');
  session.previous();
  assert.equal(session.previous(), 'help');
});

test('Test 32: the down arrow gives the next input', async () => {
  const session = createSession({ fetch: fakeGitHub().fetch });
  await session.submit('help');
  await session.submit('clear');
  session.previous();
  session.previous();
  assert.equal(session.next(), 'clear');
});

test('Test 33: the prompt accepts new input after an error', async () => {
  const session = createSession({ fetch: fakeGitHub({ status: 404 }).fetch });
  await session.submit(LINK);
  assert.equal(session.busy, false);
});

test('Test 34: the progress line shows the turning character, done and total', () => {
  assert.equal(progressLine(0, 3, 12), '/ counting lines... (3/12 files)');
});

test('Test 35: the turning character goes through / ─ \\ | and round again', () => {
  assert.deepEqual([0, 1, 2, 3, 4].map((frame) => progressLine(frame, 0, 0)[0]), ['/', '─', '\\', '|', '/']);
});

test('Test 36: the turning character changes every 150 ms', () => {
  mock.timers.enable({ apis: ['setInterval'] });
  const session = createSession({ fetch: pending });
  session.submit(LINK);
  mock.timers.tick(149);
  const before = session.lines.at(-1)[0];
  mock.timers.tick(1);
  const after = session.lines.at(-1)[0];
  mock.timers.reset();
  assert.deepEqual([before, after], ['/', '─']);
});

test('Test 37: the result shows the KLOC with one decimal', async () => {
  assert.match(await resultOf({ files: { 'a.js': 'x\n'.repeat(12347) } }), /^12\.3 KLOC · /);
});

test('Test 38: the result shows the number of files counted', async () => {
  assert.match(await resultOf({ files: { 'a.js': 'x\n', 'b.js': 'y\n', 'c.md': 'z\n' } }), / · 2 files · /);
});

test('Test 39: the result shows the exact number of lines of code', async () => {
  assert.match(await resultOf({ files: { 'a.js': 'x\n'.repeat(12347) } }), / · 12347 lines$/);
});

test('Test 40: a repository with no code files gives 0.0 KLOC · 0 files · 0 lines', async () => {
  const output = await outputAfter([LINK], fakeGitHub({ files: { 'README.md': 'x\n' } }));
  assert.deepEqual(output, ['0.0 KLOC · 0 files · 0 lines']);
});

test('Test 41: an empty repository gives 0.0 KLOC · 0 files · 0 lines', async () => {
  assert.deepEqual(await outputAfter([LINK], fakeGitHub({ status: 409 })), ['0.0 KLOC · 0 files · 0 lines']);
});

test('Test 42: a file list cut short gives a warning that the count is partial', async () => {
  const output = await outputAfter([LINK], fakeGitHub({ files: { 'a.js': 'x\n' }, truncated: true }));
  assert.match(output[1], /^warning: the count is partial/);
});

test('Test 43: a file left out gives a warning that the count is partial', async () => {
  const output = await outputAfter([LINK], fakeGitHub({ files: { 'a.js': 'x\n' }, failures: { 'a.js': 2 } }));
  assert.match(output[1], /^warning: the count is partial/);
});

test('Test 44: input that is not a valid link gives the error "not a valid link"', async () => {
  assert.deepEqual(await outputAfter(['https://gitlab.com/cnordenb/repo-kloc-counter']), ['error: not a valid link']);
});

test('Test 45: the hourly rate limit exceeded gives its error', async () => {
  const github = fakeGitHub({ status: 403, headers: { 'x-ratelimit-remaining': '0' } });
  assert.deepEqual(await outputAfter([LINK], github), ["error: GitHub's hourly rate limit exceeded"]);
});

test('Test 46: a repository GitHub does not show gives "not a public repository, or no such repository"', async () => {
  const expected = ['error: not a public repository, or no such repository'];
  assert.deepEqual(await outputAfter([LINK], fakeGitHub({ status: 404 })), expected);
});

test('Test 47: ls lists the public repositories of a user, one owner/name a line', async () => {
  const repos = [{ full_name: 'cnordenb/aoe2vils.net', fork: false }, { full_name: 'cnordenb/onkos', fork: false }];
  const expected = ['cnordenb/aoe2vils.net', 'cnordenb/onkos'];
  assert.deepEqual(await outputAfter(['ls cnordenb'], fakeGitHub({ repos })), expected);
});

test('Test 48: ls leaves forks out', async () => {
  const repos = [{ full_name: 'cnordenb/onkos', fork: false }, { full_name: 'cnordenb/linguist', fork: true }];
  assert.deepEqual(await outputAfter(['ls cnordenb'], fakeGitHub({ repos })), ['cnordenb/onkos']);
});

test('Test 49: ls lists every page of repositories', async () => {
  const output = await outputAfter(['ls cnordenb'], fakeGitHub({ repos: ownRepos('cnordenb', 101) }));
  assert.equal(output.length, 101);
});

test('Test 50: ls of a user without public repositories says so', async () => {
  assert.deepEqual(await outputAfter(['ls cnordenb']), ['no public repositories']);
});

test('Test 51: ls of a user GitHub does not know gives "no such GitHub user"', async () => {
  assert.deepEqual(await outputAfter(['ls nobody'], fakeGitHub({ status: 404 })), ['error: no such GitHub user']);
});

test('Test 52: ls without one user shows how to use it', async () => {
  assert.deepEqual(await outputAfter(['ls']), ['error: ls takes one GitHub user, such as: ls cnordenb']);
});

test('Test 53: the page is told the terminal is busy as soon as ls starts', () => {
  const seen = [];
  mock.timers.enable({ apis: ['setInterval'] });
  const session = createSession({ fetch: pending, onChange: () => seen.push(session.busy) });
  session.submit('ls cnordenb');
  mock.timers.reset();
  assert.equal(seen.at(-1), true);
});

test('Test 54: while ls waits, the progress line shows / counting repositories...', () => {
  mock.timers.enable({ apis: ['setInterval'] });
  const session = createSession({ fetch: pending });
  session.submit('ls cnordenb');
  mock.timers.reset();
  assert.equal(session.lines.at(-1), '/ counting repositories...');
});

test('Test 55: while ls waits, the turning character changes every 150 ms', () => {
  mock.timers.enable({ apis: ['setInterval'] });
  const session = createSession({ fetch: pending });
  session.submit('ls cnordenb');
  mock.timers.tick(149);
  const before = session.lines.at(-1)[0];
  mock.timers.tick(1);
  const after = session.lines.at(-1)[0];
  mock.timers.reset();
  assert.deepEqual([before, after], ['/', '─']);
});
