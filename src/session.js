import { EVERY, parseLink, parseUser } from './link.js';
import { countRepository } from './count.js';
import { listRepos } from './github.js';
import { FRAME_MS, HELP, NO_REPOS, errorLine, listingLine, progressLine, repoLines, resultLines } from './output.js';

export function createSession({ fetch, onChange = () => {} }) {
  const session = { state: { lines: [], busy: false, history: [], cursor: 0 }, onChange };
  const { state } = session;
  const commands = {
    help: () => HELP.forEach((line) => show(session, line)),
    clear: () => {
      state.lines = [];
      onChange();
    },
  };

  async function submit(input) {
    if (state.busy) return;
    const text = input.trim();
    show(session, `> ${input}`, 'input');
    if (text === '') return;
    remember(state, text);
    if (Object.hasOwn(commands, text)) return commands[text]();
    state.busy = true;
    await run(session, fetch, text).catch((error) => fail(session, error.kind));
    state.busy = false;
    onChange();
  }

  return {
    submit,
    previous: () => step(state, -1),
    next: () => step(state, 1),
    get lines() {
      return state.lines.map((line) => line.text);
    },
    get kinds() {
      return state.lines.map((line) => line.kind);
    },
    get busy() {
      return state.busy;
    },
  };
}

async function run(session, fetch, text) {
  const [word, ...words] = text.split(/\s+/);
  if (word === 'ls') return list(session, fetch, words.join(' '));
  const repo = parseLink(text);
  if (repo === null) return fail(session, 'invalid');
  if (repo.repo === EVERY) return countEvery(session, fetch, repo.owner);
  await count(session, fetch, repo);
}

async function count(session, fetch, repo) {
  const describe = ({ frame, done, total }) => progressLine(frame, done, total);
  const totals = await withProgress(session, describe, (update) => countRepository(fetch, repo, update));
  showAll(session, resultLines(totals));
}

async function countEvery(session, fetch, owner) {
  const names = await reposOf(session, fetch, owner);
  if (names.length === 0) show(session, NO_REPOS);
  for (const name of names) {
    show(session, name);
    await count(session, fetch, parseLink(name));
  }
}

async function list(session, fetch, name) {
  const user = parseUser(name);
  if (user === null) return fail(session, 'lsUsage');
  showAll(session, repoLines(user, await reposOf(session, fetch, user)));
}

function reposOf(session, fetch, user) {
  return withProgress(session, ({ frame }) => listingLine(frame), () => listRepos(fetch, user));
}

async function withProgress(session, describe, work) {
  const progress = startProgress(session, describe);
  try {
    return await work(progress.update);
  } finally {
    progress.stop();
  }
}

function fail(session, kind) {
  show(session, errorLine(kind), 'error');
}

function showAll(session, lines) {
  lines.forEach((line) => show(session, line));
}

function startProgress(session, describe) {
  const line = { text: '', kind: 'progress' };
  const shown = { frame: 0, done: 0, total: 0 };
  const draw = () => {
    line.text = describe(shown);
    session.onChange();
  };
  session.state.lines.push(line);
  draw();
  const timer = setInterval(() => {
    shown.frame += 1;
    draw();
  }, FRAME_MS);
  return {
    update: (done, total) => {
      Object.assign(shown, { done, total });
      draw();
    },
    stop: () => {
      clearInterval(timer);
      session.state.lines = session.state.lines.filter((other) => other !== line);
    },
  };
}

function show(session, text, kind = 'output') {
  session.state.lines.push({ text, kind });
  session.onChange();
}

function remember(state, text) {
  state.history.push(text);
  state.cursor = state.history.length;
}

function step(state, by) {
  state.cursor = Math.min(state.history.length, Math.max(0, state.cursor + by));
  return state.history[state.cursor] ?? '';
}
