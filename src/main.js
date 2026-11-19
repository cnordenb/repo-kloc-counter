import { createSession } from './session.js';
import { GREETING } from './output.js';

const output = document.getElementById('output');
const input = document.getElementById('input');
const session = createSession({ fetch: (url) => globalThis.fetch(url), onChange: render });

function render() {
  const kinds = session.kinds;
  output.replaceChildren(GREETING, ...session.lines.map((text, i) => line(text, kinds[i])));
  input.disabled = session.busy;
  if (!session.busy) input.focus();
  input.scrollIntoView({ block: 'end' });
}

function line(text, kind) {
  const element = document.createElement('div');
  element.className = kind;
  element.textContent = text;
  return element;
}

const keys = {
  Enter: () => {
    const text = input.value;
    input.value = '';
    session.submit(text);
  },
  ArrowUp: () => {
    input.value = session.previous();
  },
  ArrowDown: () => {
    input.value = session.next();
  },
};

input.addEventListener('keydown', (event) => {
  if (!Object.hasOwn(keys, event.key)) return;
  event.preventDefault();
  keys[event.key]();
});

document.addEventListener('click', () => {
  if (window.getSelection().isCollapsed) input.focus();
});

render();
