import { parseLink, parseUser } from './link.js';
import { countRepository } from './count.js';
import { listRepos } from './github.js';
import { FRAME_MS, HELP, errorLine, progressLine, repoLines, resultLines } from './output.js';

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
    const [word, ...words] = text.split(/\s+/);
    if (word === 'ls') return list(session, fetch, words.join(' '));
    const repo = parseLink(text);
    if (repo === null) return show(session, errorLine('invalid'), 'error');
    await count(session, fetch, repo);
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

function count(session, fetch, repo) {
  return whileBusy(session, async () => {
    const progress = startProgress(session);
    const outcome = await countRepository(fetch, repo, progress.update).then(resultLines, failed);
    progress.stop();
    return outcome;
  });
}

function list(session, fetch, name) {
  const user = parseUser(name);
  if (user === null) return show(session, errorLine('lsUsage'), 'error');
  return whileBusy(session, () => listRepos(fetch, user).then(repoLines, failed));
}

async function whileBusy(session, work) {
  session.state.busy = true;
  session.onChange();
  const outcome = await work();
  session.state.busy = false;
  outcome.forEach((line) => show(session, line, line.startsWith('error') ? 'error' : 'output'));
}

function failed(error) {
  return [errorLine(error.kind)];
}

function startProgress(session) {
  const line = { text: '', kind: 'progress' };
  const shown = { frame: 0, done: 0, total: 0 };
  const draw = () => {
    line.text = progressLine(shown.frame, shown.done, shown.total);
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
