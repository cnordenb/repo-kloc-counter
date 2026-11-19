export const FRAME_MS = 150;

const FRAMES = ['/', '─', '\\', '|'];

export const GREETING = 'Repo KLOC Counter. Paste a link to a public GitHub repository, or type help.';

export const HELP = [
  'https://github.com/{owner}/{repo}  count the lines of code of that public repository',
  '                                   (http://, no scheme and www. work too; the rest of the link is ignored)',
  '{owner}/{repo}                     the same, such as cnordenb/repo-kloc-counter',
  'ls {user}                          list the public repositories of a GitHub user, forks left out',
  'help                               show this help',
  'clear                              clear the terminal',
  'up and down arrows                 go through earlier input',
];

const ERRORS = {
  invalid: 'error: not a valid link',
  rateLimit: "error: GitHub's hourly rate limit exceeded",
  notPublic: 'error: not a public repository, or no such repository',
  noUser: 'error: no such GitHub user',
  lsUsage: 'error: ls takes one GitHub user, such as: ls cnordenb',
  unreachable: 'error: GitHub could not be reached',
};

export function errorLine(kind) {
  return ERRORS[kind] ?? ERRORS.unreachable;
}

export function repoLines(user, names) {
  const noun = names.length === 1 ? 'repository' : 'repositories';
  const listed = names.length > 0 ? names : ['no public repositories'];
  return [`${user} has ${names.length} public source ${noun}.`, '-'.repeat(40), ...listed];
}

function turning(frame) {
  return FRAMES[frame % FRAMES.length];
}

export function progressLine(frame, done, total) {
  return `${turning(frame)} counting lines... (${done}/${total} files)`;
}

export function listingLine(frame) {
  return `${turning(frame)} counting repositories...`;
}

export function resultLines({ files, lines, missed, truncated }) {
  const result = [`${(lines / 1000).toFixed(1)} KLOC · ${files} files · ${lines} lines`];
  if (truncated) result.push('warning: the count is partial: GitHub cut the list of files short');
  if (missed > 0) result.push(`warning: the count is partial: ${missed} files could not be read`);
  return result;
}
