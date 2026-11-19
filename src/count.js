import extensions from './data/extensions.json' with { type: 'json' };
import styles from './data/comments.json' with { type: 'json' };
import { listFiles, readFile } from './github.js';

const CODE = new Set(extensions);
const COMMENTS = new Map(styles.flatMap((style) => style.extensions.map((extension) => [extension, pattern(style)])));
const READERS = 8;

function pattern({ line, block }) {
  const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const blocks = block.map(([open, close]) => `${escape(open)}[\\s\\S]*?${escape(close)}`);
  const lines = line.map((marker) => `^[ \\t]*${escape(marker)}.*$`);
  return new RegExp([...blocks, ...lines].join('|'), 'gm');
}

function extensionOf(path) {
  const name = path.slice(path.lastIndexOf('/') + 1).toLowerCase();
  for (let dot = name.indexOf('.'); dot !== -1; dot = name.indexOf('.', dot + 1)) {
    if (CODE.has(name.slice(dot))) return name.slice(dot);
  }
  return null;
}

export function countLines(text, path) {
  const comment = COMMENTS.get(extensionOf(path));
  const kept = comment ? text.replace(comment, (found) => found.replace(/[^\r\n]/g, '')) : text;
  return kept.split(/\r\n|\r|\n/).filter((line) => /\S/.test(line)).length;
}

export async function countRepository(fetch, repo, onProgress) {
  const list = await listFiles(fetch, repo);
  const paths = list.paths.filter((path) => extensionOf(path) !== null);
  const totals = { files: 0, lines: 0, missed: 0, truncated: list.truncated };
  let done = 0;
  onProgress(done, paths.length);
  await inParallel(paths, async (path) => {
    const text = await readFile(fetch, repo, path);
    if (text === null) totals.missed += 1;
    else add(totals, text, path);
    done += 1;
    onProgress(done, paths.length);
  });
  return totals;
}

function add(totals, text, path) {
  totals.files += 1;
  totals.lines += countLines(text, path);
}

async function inParallel(items, work) {
  let next = 0;
  const reader = async () => {
    while (next < items.length) {
      next += 1;
      await work(items[next - 1]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(READERS, items.length) }, reader));
}
