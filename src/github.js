const API = 'https://api.github.com';
const RAW = 'https://raw.githubusercontent.com';
const TRIES = 2;
const PAGE = 100;

export class GitHubError extends Error {
  constructor(kind) {
    super(kind);
    this.kind = kind;
  }
}

export async function listFiles(fetch, { owner, repo }) {
  const response = await fetch(`${API}/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`);
  if (response.status === 409) return { paths: [], truncated: false };
  const { tree, truncated } = await parsed(response);
  return { paths: tree.filter((entry) => entry.type === 'blob').map((entry) => entry.path), truncated };
}

export async function listRepos(fetch, user) {
  const names = [];
  for (let page = 1; ; page += 1) {
    const url = `${API}/users/${user}/repos?type=owner&sort=full_name&per_page=${PAGE}&page=${page}`;
    const repos = await parsed(await fetch(url), 'noUser');
    names.push(...repos.filter((repo) => !repo.fork).map((repo) => repo.full_name));
    if (repos.length < PAGE) return names;
  }
}

async function parsed(response, missing = 'notPublic') {
  if (!response.ok) throw new GitHubError(failure(response, missing));
  return response.json();
}

export async function readFile(fetch, { owner, repo }, path) {
  const url = `${RAW}/${owner}/${repo}/HEAD/${path.split('/').map(encodeURIComponent).join('/')}`;
  for (let attempt = 0; attempt < TRIES; attempt += 1) {
    const text = await tryRead(fetch, url);
    if (text !== null) return text;
  }
  return null;
}

async function tryRead(fetch, url) {
  try {
    const response = await fetch(url);
    return response.ok ? await response.text() : null;
  } catch {
    return null;
  }
}

function failure(response, missing) {
  if (response.headers.get('x-ratelimit-remaining') === '0') return 'rateLimit';
  return response.status === 404 ? missing : 'unreachable';
}
