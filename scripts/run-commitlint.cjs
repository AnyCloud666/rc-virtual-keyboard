#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const path = require('node:path');

const patchPath = path.resolve(__dirname, 'commitlint-ajv-fix.cjs');
const cliPath = require.resolve('@commitlint/cli/lib/cli.js');

const result = spawnSync(
  process.execPath,
  ['-r', patchPath, cliPath, ...process.argv.slice(2)],
  {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: process.env,
  },
);

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
