const fs = require('fs');
const path = require('path');

const PATCH_TARGET = 'require.resolve("./features/esmi/esmi"),';
const PATCH_REPLACEMENT =
  'process.env.RC_VKB_ENABLE_ESMI === "true" && require.resolve("./features/esmi/esmi"),';

function findPresetUmiEntries() {
  const directPath = path.join(
    process.cwd(),
    'node_modules',
    '@umijs',
    'preset-umi',
    'dist',
    'index.js',
  );
  const entries = [];

  if (fs.existsSync(directPath)) {
    entries.push(directPath);
  }

  const pnpmRoot = path.join(process.cwd(), 'node_modules', '.pnpm');

  if (!fs.existsSync(pnpmRoot)) {
    return entries;
  }

  for (const name of fs.readdirSync(pnpmRoot)) {
    if (!name.startsWith('@umijs+preset-umi@')) continue;

    const candidate = path.join(
      pnpmRoot,
      name,
      'node_modules',
      '@umijs',
      'preset-umi',
      'dist',
      'index.js',
    );

    if (fs.existsSync(candidate)) {
      entries.push(candidate);
    }
  }

  return [...new Set(entries)];
}

function patchPresetUmi() {
  const presetUmiEntries = findPresetUmiEntries();

  if (!presetUmiEntries.length) {
    console.warn('[patch-umi-esmi] @umijs/preset-umi not found, skip patch');
    return;
  }

  let patchedCount = 0;

  for (const presetUmiEntry of presetUmiEntries) {
    const source = fs.readFileSync(presetUmiEntry, 'utf8');

    if (source.includes(PATCH_REPLACEMENT)) {
      patchedCount += 1;
      continue;
    }

    if (!source.includes(PATCH_TARGET)) {
      console.warn(
        `[patch-umi-esmi] patch target not found, skip patch: ${presetUmiEntry}`,
      );
      continue;
    }

    fs.writeFileSync(
      presetUmiEntry,
      source.replace(PATCH_TARGET, PATCH_REPLACEMENT),
      'utf8',
    );

    patchedCount += 1;
    console.log(
      `[patch-umi-esmi] preset-umi patched for Node 24 compatibility: ${presetUmiEntry}`,
    );
  }

  if (!patchedCount) {
    console.warn('[patch-umi-esmi] no preset-umi files were patched');
  }
}

patchPresetUmi();
