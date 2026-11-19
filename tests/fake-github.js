export const REPO = { owner: 'cnordenb', repo: 'repo-kloc-counter' };
export const LINK = 'https://github.com/cnordenb/repo-kloc-counter';

const PAGE = 100;

export function fakeGitHub(options = {}) {
  const { files = {}, failures = {}, truncated = false, status = 200, headers = {}, repos = [] } = options;
  const calls = [];
  const failuresLeft = { ...failures };
  const paths = [...Object.keys(files), ...Object.keys(failures).filter((path) => !(path in files))];
  const tree = { tree: paths.map((path) => ({ path, type: 'blob', mode: '100644' })), truncated };
  const api = (body) => new Response(JSON.stringify(body), { status, headers });
  const fetch = async (url, init) => {
    calls.push({ url, init });
    if (url.startsWith('https://api.github.com/users/')) {
      const page = Number(new URL(url).searchParams.get('page'));
      return api(repos.slice((page - 1) * PAGE, page * PAGE));
    }
    if (url.startsWith('https://api.github.com/')) return api(tree);
    const path = decodeURIComponent(url.split('/HEAD/')[1]);
    if ((failuresLeft[path] ?? 0) > 0) {
      failuresLeft[path] -= 1;
      return new Response('', { status: 500 });
    }
    return new Response(files[path], { status: 200 });
  };
  return { fetch, calls };
}

export function ownRepos(owner, count) {
  return Array.from({ length: count }, (_, i) => ({ full_name: `${owner}/repo-${i}`, fork: false }));
}
