const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function loadSource(file, dependencies = {}) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true },
  });
  const module = { exports: {} };
  const localRequire = id => Object.hasOwn(dependencies, id) ? dependencies[id] : require(id);
  new Function('require', 'module', 'exports', outputText)(localRequire, module, module.exports);
  return module.exports;
}

// A hook harness lets event handlers run against the real component source,
// preserving state and refs across renders without a browser or paid API calls.
function createReactHarness() {
  let cursor = 0;
  const slots = [];
  const React = {
    Fragment: 'fragment',
    createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [slots[index], value => {
        slots[index] = typeof value === 'function' ? value(slots[index]) : value;
      }];
    },
    useRef(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
    useEffect() { cursor++; },
    useCallback(callback) { cursor++; return callback; },
  };
  return { React, render(Component) { cursor = 0; return Component(); } };
}

function findElement(node, predicate) {
  if (!node || typeof node !== 'object') return null;
  if (!Array.isArray(node) && predicate(node)) return node;
  for (const child of Array.isArray(node) ? node : node.children || []) {
    const found = findElement(child, predicate);
    if (found) return found;
  }
  return null;
}

const icons = new Proxy({}, { get: (_, key) => key });
module.exports = { loadSource, createReactHarness, findElement, icons };
