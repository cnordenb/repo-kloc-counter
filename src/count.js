import extensions from './extensions.json' with { type: 'json' };
import { listFiles, readFile } from './github.js';

const CODE = new Set(extensions);
const READERS = 8;

export function isCodeFile(path) {
  const name = path.slice(path.lastIndexOf('/') + 1).toLowerCase();
  for (let dot = name.indexOf('.'); dot !== -1; dot = name.indexOf('.', dot + 1)) {
    if (CODE.has(name.slice(dot))) return true;
  }
  return false;
}

export function countLines(text) {
  return text.split(/\r\n|\r|\n/).filter((line) => /\S/.test(line)).length;
}

export async function countRepository(fetch, repo, onProgress) {
  const list = await listFiles(fetch, repo);
  const paths = list.paths.filter(isCodeFile);
  const totals = { files: 0, lines: 0, missed: 0, truncated: list.truncated };
  let done = 0;
  onProgress(done, paths.length);
  await inParallel(paths, async (path) => {
    const text = await readFile(fetch, repo, path);
    if (text === null) totals.missed += 1;
    else add(totals, text);
    done += 1;
    onProgress(done, paths.length);
  });
  return totals;
}

function add(totals, text) {
  totals.files += 1;
  totals.lines += countLines(text);
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
