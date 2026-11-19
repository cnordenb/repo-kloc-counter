import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseLink } from '../src/link.js';
import { REPO } from './fake-github.js';

test('Test 19: a link to the root of a repository is accepted', () => {
  assert.deepEqual(parseLink('https://github.com/cnordenb/repo-kloc-counter'), REPO);
});

test('Test 20: a link with http:// is accepted', () => {
  assert.deepEqual(parseLink('http://github.com/cnordenb/repo-kloc-counter'), REPO);
});

test('Test 21: a link without a scheme is accepted', () => {
  assert.deepEqual(parseLink('github.com/cnordenb/repo-kloc-counter'), REPO);
});

test('Test 22: a link with www.github.com is accepted', () => {
  assert.deepEqual(parseLink('https://www.github.com/cnordenb/repo-kloc-counter'), REPO);
});

test('Test 23: everything after the repository is stripped', () => {
  assert.deepEqual(parseLink('https://github.com/cnordenb/repo-kloc-counter/tree/master/src?x=1#top'), REPO);
});

test('Test 24: a trailing .git is stripped', () => {
  assert.deepEqual(parseLink('https://github.com/cnordenb/repo-kloc-counter.git'), REPO);
});

test('Test 25: a link with another host is not a valid link', () => {
  assert.equal(parseLink('https://gitlab.com/cnordenb/repo-kloc-counter'), null);
});

test('Test 26: a link without both owner and repository is not a valid link', () => {
  assert.equal(parseLink('https://github.com/cnordenb'), null);
});

test('Test 27: owner/repository alone is accepted', () => {
  assert.deepEqual(parseLink('cnordenb/aoe2vils.net'), { owner: 'cnordenb', repo: 'aoe2vils.net' });
});

test('Test 28: another host without a scheme is not a valid link', () => {
  assert.equal(parseLink('gitlab.com/cnordenb/repo-kloc-counter'), null);
});
