const HOSTS = new Set(['github.com', 'www.github.com']);
const NAME = /^[\w.-]+$/;
const SCHEME = /^https?:\/\//i;
const USER = /^[a-z\d-]+$/i;

export function parseUser(name) {
  return USER.test(name) ? name : null;
}

export function parseLink(input) {
  const text = input.trim();
  const link = SCHEME.test(text) ? text.replace(SCHEME, '') : text.replace(/^(?=[^/.]+\/)/, 'github.com/');
  const [host, owner = '', named = ''] = link.split(/[/?#]/);
  const repo = named.replace(/\.git$/i, '');
  if (!HOSTS.has(host.toLowerCase()) || !NAME.test(owner) || !NAME.test(repo)) return null;
  return { owner, repo };
}
