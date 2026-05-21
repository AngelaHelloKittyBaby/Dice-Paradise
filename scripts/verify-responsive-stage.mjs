import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const source = await readFile(new URL('../src/utils/responsiveStage.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
});

const module = { exports: {} };
vm.runInNewContext(compiled.outputText, {
  exports: module.exports,
  module,
  require,
});

const { getResponsiveStageMetrics } = module.exports;

assert.equal(typeof getResponsiveStageMetrics, 'function');

function normalize(value) {
  return JSON.parse(JSON.stringify(value));
}

assert.deepEqual(
  normalize(getResponsiveStageMetrics({
    viewportWidth: 1672,
    viewportHeight: 941,
    designWidth: 1672,
    designHeight: 941,
  })),
  {
    scale: 1,
    scaledWidth: 1672,
    scaledHeight: 941,
  }
);

assert.deepEqual(
  normalize(getResponsiveStageMetrics({
    viewportWidth: 1280,
    viewportHeight: 720,
    designWidth: 1672,
    designHeight: 941,
  })),
  {
    scale: 0.76514,
    scaledWidth: 1279.31,
    scaledHeight: 720,
  }
);

assert.deepEqual(
  normalize(getResponsiveStageMetrics({
    viewportWidth: 1920,
    viewportHeight: 1080,
    designWidth: 1536,
    designHeight: 1024,
  })),
  {
    scale: 1.05469,
    scaledWidth: 1620,
    scaledHeight: 1080,
  }
);

assert.deepEqual(
  normalize(getResponsiveStageMetrics({
    viewportWidth: 0,
    viewportHeight: 720,
    designWidth: 1672,
    designHeight: 941,
  })),
  {
    scale: 1,
    scaledWidth: 1672,
    scaledHeight: 941,
  }
);
