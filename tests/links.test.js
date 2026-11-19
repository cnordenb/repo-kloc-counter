import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseLink } from '../src/link.js';
import { REPO } from './fake-github.js';

test('Test 11: a link to the root of a repository is accepted', () => {
  assert.deepEqual(parseLink('https://github.com/cnordenb/repo-kloc-counter'), REPO);
});

test('Test 12: a link with http:// is accepted', () => {
  assert.deepEqual(parseLink('http://github.com/cnordenb/repo-kloc-counter'), REPO);
});

test('Test 13: a link without a scheme is accepted', () => {
  assert.deepEqual(parseLink('github.com/cnordenb/repo-kloc-counter'), REPO);
});

test('Test 14: a link with www.github.com is accepted', () => {
  assert.deepEqual(parseLink('https://www.github.com/cnordenb/repo-kloc-counter'), REPO);
});

test('Test 15: everything after the repository is stripped', () => {
  assert.deepEqual(parseLink('https://github.com/cnordenb/repo-kloc-counter/tree/master/src?x=1#top'), REPO);
});

test('Test 16: a trailing .git is stripped', () => {
  assert.deepEqual(parseLink('https://github.com/cnordenb/repo-kloc-counter.git'), REPO);
});

test('Test 17: a link with another host is not a valid link', () => {
  assert.equal(parseLink('https://gitlab.com/cnordenb/repo-kloc-counter'), null);
});

test('Test 18: a link without both owner and repository is not a valid link', () => {
  assert.equal(parseLink('https://github.com/cnordenb'), null);
});
