export const REPO = { owner: 'cnordenb', repo: 'repo-kloc-counter' };
export const LINK = 'https://github.com/cnordenb/repo-kloc-counter';

export function fakeGitHub({ files = {}, failures = {}, truncated = false, status = 200, headers = {} } = {}) {
  const calls = [];
  const failuresLeft = { ...failures };
  const paths = [...Object.keys(files), ...Object.keys(failures).filter((path) => !(path in files))];
  const tree = { tree: paths.map((path) => ({ path, type: 'blob', mode: '100644' })), truncated };
  const fetch = async (url, init) => {
    calls.push({ url, init });
    if (url.startsWith('https://api.github.com/')) return new Response(JSON.stringify(tree), { status, headers });
    const path = decodeURIComponent(url.split('/HEAD/')[1]);
    if ((failuresLeft[path] ?? 0) > 0) {
      failuresLeft[path] -= 1;
      return new Response('', { status: 500 });
    }
    return new Response(files[path], { status: 200 });
  };
  return { fetch, calls };
}
