const API = 'https://api.github.com/repos';
const RAW = 'https://raw.githubusercontent.com';
const TRIES = 2;

export class GitHubError extends Error {
  constructor(kind) {
    super(kind);
    this.kind = kind;
  }
}

export async function listFiles(fetch, { owner, repo }) {
  const response = await fetch(`${API}/${owner}/${repo}/git/trees/HEAD?recursive=1`);
  if (response.status === 409) return { paths: [], truncated: false };
  if (!response.ok) throw new GitHubError(failure(response));
  const { tree, truncated } = await response.json();
  return { paths: tree.filter((entry) => entry.type === 'blob').map((entry) => entry.path), truncated };
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

function failure(response) {
  if (response.headers.get('x-ratelimit-remaining') === '0') return 'rateLimit';
  return response.status === 404 ? 'notPublic' : 'unreachable';
}
