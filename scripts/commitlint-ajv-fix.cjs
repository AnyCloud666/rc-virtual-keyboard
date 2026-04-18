const Module = require('node:module');
const path = require('node:path');

const originalLoad = Module._load;
const commitlintValidatorSegment = path.join(
  '@commitlint',
  'config-validator',
  'lib',
);
const ajv8Entry = require.resolve('ajv/dist/ajv.js');

Module._load = function patchedLoad(request, parent, isMain) {
  if (
    request === 'ajv' &&
    typeof parent?.filename === 'string' &&
    parent.filename.includes(commitlintValidatorSegment)
  ) {
    return originalLoad.call(this, ajv8Entry, parent, isMain);
  }

  return originalLoad.call(this, request, parent, isMain);
};
