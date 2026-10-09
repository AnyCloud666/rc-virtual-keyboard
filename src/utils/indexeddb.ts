type IndexedDBKey = IDBValidKey | IDBKeyRange;

export type IndexedDBStoreIndex = {
  name: string;
  keyPath: string | string[];
  options?: IDBIndexParameters;
};

export type IndexedDBStoreSchema = {
  name: string;
  keyPath?: string | string[];
  autoIncrement?: boolean;
  indexes?: IndexedDBStoreIndex[];
};

export type OpenIndexedDBOptions = {
  name: string;
  version: number;
  stores: IndexedDBStoreSchema[];
};

const databaseCache = new Map<string, Promise<IDBDatabase | null>>();

function hasIndexedDB() {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
}

function requestToPromise<T = undefined>(
  request: IDBRequest<T> | IDBOpenDBRequest,
): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as T);
    request.onerror = () =>
      reject(request.error || new Error('IndexedDB request failed.'));
  });
}

function transactionToPromise(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error || new Error('IndexedDB transaction failed.'));
    transaction.onabort = () =>
      reject(transaction.error || new Error('IndexedDB transaction aborted.'));
  });
}

function isIDBRequest(value: unknown): value is IDBRequest<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'onsuccess' in value &&
    'onerror' in value &&
    'result' in value
  );
}

function ensureStoreSchema(
  database: IDBDatabase,
  transaction: IDBTransaction,
  stores: IndexedDBStoreSchema[],
) {
  stores.forEach((storeSchema) => {
    const hasStore = database.objectStoreNames.contains(storeSchema.name);
    const store = hasStore
      ? transaction.objectStore(storeSchema.name)
      : database.createObjectStore(storeSchema.name, {
          keyPath: storeSchema.keyPath,
          autoIncrement: storeSchema.autoIncrement,
        });

    storeSchema.indexes?.forEach((indexSchema) => {
      if (!store.indexNames.contains(indexSchema.name)) {
        store.createIndex(
          indexSchema.name,
          indexSchema.keyPath,
          indexSchema.options,
        );
      }
    });
  });
}

async function withTransaction<T>(
  database: IDBDatabase | null,
  storeName: string,
  mode: IDBTransactionMode,
  executor: (store: IDBObjectStore) => unknown,
  fallbackValue: T,
) {
  if (!database) {
    return fallbackValue;
  }

  try {
    const transaction = database.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const result = executor(store);

    const value = isIDBRequest(result)
      ? ((await requestToPromise(result)) as T)
      : (result as T);

    await transactionToPromise(transaction);

    return value;
  } catch {
    return fallbackValue;
  }
}

export function isIndexedDBAvailable() {
  return hasIndexedDB();
}

export function openIndexedDBDatabase(
  options: OpenIndexedDBOptions,
): Promise<IDBDatabase | null> {
  if (!hasIndexedDB()) {
    return Promise.resolve(null);
  }

  const cached = databaseCache.get(options.name);
  if (cached) {
    return cached;
  }

  const openPromise = new Promise<IDBDatabase | null>((resolve) => {
    try {
      const request = window.indexedDB.open(options.name, options.version);

      request.onupgradeneeded = () => {
        if (!request.transaction) {
          return;
        }

        ensureStoreSchema(request.result, request.transaction, options.stores);
      };

      request.onsuccess = () => {
        const database = request.result;

        database.onversionchange = () => {
          database.close();
          databaseCache.delete(options.name);
        };

        resolve(database);
      };

      request.onerror = () => {
        databaseCache.delete(options.name);
        resolve(null);
      };

      request.onblocked = () => {
        databaseCache.delete(options.name);
        resolve(null);
      };
    } catch {
      databaseCache.delete(options.name);
      resolve(null);
    }
  });

  databaseCache.set(options.name, openPromise);

  return openPromise;
}

export async function getIndexedDBRecord<T>(
  database: IDBDatabase | null,
  storeName: string,
  key: IndexedDBKey,
) {
  return withTransaction<T | undefined>(
    database,
    storeName,
    'readonly',
    (store) => store.get(key),
    undefined,
  );
}

export async function getIndexedDBRecords<T>(
  database: IDBDatabase | null,
  storeName: string,
  query?: IndexedDBKey | null,
  count?: number,
) {
  return withTransaction<T[]>(
    database,
    storeName,
    'readonly',
    (store) => store.getAll(query ?? null, count),
    [],
  );
}

export async function getIndexedDBRecordsByIndex<T>(
  database: IDBDatabase | null,
  storeName: string,
  indexName: string,
  query?: IndexedDBKey | null,
  count?: number,
) {
  return withTransaction<T[]>(
    database,
    storeName,
    'readonly',
    (store) => store.index(indexName).getAll(query ?? null, count),
    [],
  );
}

export async function putIndexedDBRecord<T>(
  database: IDBDatabase | null,
  storeName: string,
  value: T,
  key?: IDBValidKey,
) {
  return withTransaction<IDBValidKey | null>(
    database,
    storeName,
    'readwrite',
    (store) => (typeof key === 'undefined' ? store.put(value) : store.put(value, key)),
    null,
  );
}

export async function deleteIndexedDBRecord(
  database: IDBDatabase | null,
  storeName: string,
  key: IndexedDBKey,
) {
  return withTransaction<boolean>(
    database,
    storeName,
    'readwrite',
    (store) => {
      store.delete(key);
      return true;
    },
    false,
  );
}

export async function clearIndexedDBStore(
  database: IDBDatabase | null,
  storeName: string,
) {
  return withTransaction<boolean>(
    database,
    storeName,
    'readwrite',
    (store) => {
      store.clear();
      return true;
    },
    false,
  );
}

export function closeIndexedDBDatabase(database: IDBDatabase | null) {
  if (!database) {
    return;
  }

  database.close();
}

export async function deleteIndexedDBDatabase(name: string) {
  const cached = databaseCache.get(name);
  const database = cached ? await cached : null;

  if (database) {
    database.close();
  }

  databaseCache.delete(name);

  if (!hasIndexedDB()) {
    return false;
  }

  try {
    await new Promise<void>((resolve, reject) => {
      const request = window.indexedDB.deleteDatabase(name);

      request.onsuccess = () => resolve();
      request.onerror = () =>
        reject(request.error || new Error('Failed to delete IndexedDB.'));
      request.onblocked = () => reject(new Error('Delete IndexedDB blocked.'));
    });

    return true;
  } catch {
    return false;
  }
}
