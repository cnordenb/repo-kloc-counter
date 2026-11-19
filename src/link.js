const HOSTS = new Set(['github.com', 'www.github.com']);
const NAME = /^[\w.-]+$/;

export function parseLink(input) {
  const [host, owner = '', named = ''] = input.trim().replace(/^https?:\/\//i, '').split(/[/?#]/);
  const repo = named.replace(/\.git$/i, '');
  if (!HOSTS.has(host.toLowerCase()) || !NAME.test(owner) || !NAME.test(repo)) return null;
  return { owner, repo };
}
