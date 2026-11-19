export const FRAME_MS = 300;

const FRAMES = ['/', '-', '\\', '|'];

export const GREETING = 'Repo KLOC Counter. Paste a link to a public GitHub repository, or type help.';

export const HELP = [
  'https://github.com/{owner}/{repo}  count the lines of code of that public repository',
  '                                   (http://, no scheme and www. work too; the rest of the link is ignored)',
  'help                               show this help',
  'clear                              clear the terminal',
  'up and down arrows                 go through earlier input',
];

const ERRORS = {
  invalid: 'error: not a valid link',
  rateLimit: "error: GitHub's hourly rate limit exceeded",
  notPublic: 'error: not a public repository, or no such repository',
  unreachable: 'error: GitHub could not be reached',
};

export function errorLine(kind) {
  return ERRORS[kind] ?? ERRORS.unreachable;
}

export function progressLine(frame, done, total) {
  return `${FRAMES[frame % FRAMES.length]} counting lines... (${done}/${total} files)`;
}

export function resultLines({ files, lines, missed, truncated }) {
  const result = [`${(lines / 1000).toFixed(1)} KLOC · ${files} files · ${lines} lines`];
  if (truncated) result.push('warning: the count is partial: GitHub cut the list of files short');
  if (missed > 0) result.push(`warning: the count is partial: ${missed} files could not be read`);
  return result;
}
