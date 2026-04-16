const originalBinding = process.binding;

class DummyHTTPParser {
  static methods = [];
}

DummyHTTPParser.kOnHeaders = 0;
DummyHTTPParser.kOnHeadersComplete = 1;
DummyHTTPParser.kOnBody = 2;
DummyHTTPParser.kOnMessageComplete = 3;

process.binding = function patchedBinding(name) {
  if (name === 'http_parser') {
    return {
      HTTPParser: DummyHTTPParser,
      methods: DummyHTTPParser.methods,
    };
  }

  return originalBinding.call(process, name);
};
