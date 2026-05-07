import {
  clearIndexedDBStore,
  deleteIndexedDBRecord,
  deleteIndexedDBDatabase,
  getIndexedDBRecord,
  getIndexedDBRecordsByIndex,
  openIndexedDBDatabase,
  putIndexedDBRecord,
} from './indexeddb';

export type CandidateLearningRecord<TKey extends string = string> = {
  id: string;
  key: TKey;
  candidate: string;
  count: number;
  createdAt: number;
  updatedAt: number;
  lastSelectedAt: number;
};

export type CandidateLearningSnapshot<TKey extends string = string> = {
  key: TKey | '';
  records: CandidateLearningRecord<TKey>[];
  recordMap: Map<string, CandidateLearningRecord<TKey>>;
};

export type RecordCandidateSelectionOptions = {
  maxRecordsPerKey?: number;
  now?: number;
};

type CreateCandidateLearningStoreOptions<TKey extends string> = {
  databaseName: string;
  databaseVersion?: number;
  storeName: string;
  indexName: string;
  maxRecordsPerKey?: number;
  normalizeKey: (key: string) => TKey | '';
  normalizeCandidate?: (candidate: string) => string;
  compareCandidates?: (prev: string, next: string) => number;
};

export function createCandidateLearningStore<TKey extends string>(
  options: CreateCandidateLearningStoreOptions<TKey>,
) {
  const {
    databaseName,
    databaseVersion = 1,
    storeName,
    indexName,
    maxRecordsPerKey = 50,
    normalizeKey,
    normalizeCandidate = (candidate) => candidate.trim(),
    compareCandidates = (prev, next) => prev.localeCompare(next),
  } = options;
  const memoryLearningStore = new Map<string, CandidateLearningRecord<TKey>>();

  const getRecordId = (key: string, candidate: string) => `${key}::${candidate}`;

  const compareLearningRecord = (
    prev: CandidateLearningRecord<TKey>,
    next: CandidateLearningRecord<TKey>,
  ) => {
    if (prev.count !== next.count) {
      return next.count - prev.count;
    }

    if (prev.lastSelectedAt !== next.lastSelectedAt) {
      return next.lastSelectedAt - prev.lastSelectedAt;
    }

    return compareCandidates(prev.candidate, next.candidate);
  };

  const getMemoryRecordsByKey = (key: TKey) => {
    return [...memoryLearningStore.values()]
      .filter((item) => item.key === key)
      .sort(compareLearningRecord);
  };

  const getLearningDatabase = async () => {
    return openIndexedDBDatabase({
      name: databaseName,
      version: databaseVersion,
      stores: [
        {
          name: storeName,
          keyPath: 'id',
          indexes: [
            {
              name: indexName,
              keyPath: 'key',
            },
          ],
        },
      ],
    });
  };

  const getPersistentRecordsByKey = async (key: TKey) => {
    const database = await getLearningDatabase();

    return getIndexedDBRecordsByIndex<CandidateLearningRecord<TKey>>(
      database,
      storeName,
      indexName,
      key,
    );
  };

  const getPersistentRecordsByKeyPrefix = async (key: TKey) => {
    const database = await getLearningDatabase();

    if (typeof IDBKeyRange === 'undefined') {
      return getPersistentRecordsByKey(key);
    }

    return getIndexedDBRecordsByIndex<CandidateLearningRecord<TKey>>(
      database,
      storeName,
      indexName,
      IDBKeyRange.bound(key, `${key}\uffff`),
    );
  };

  const trimRecordsForKey = async (
    maxCount: number,
    records: CandidateLearningRecord<TKey>[],
  ) => {
    const overflowRecords = records.sort(compareLearningRecord).slice(maxCount);

    if (!overflowRecords.length) {
      return;
    }

    overflowRecords.forEach((item) => {
      memoryLearningStore.delete(item.id);
    });

    const database = await getLearningDatabase();

    await Promise.all(
      overflowRecords.map((item) =>
        deleteIndexedDBRecord(database, storeName, item.id),
      ),
    );
  };

  const getLearningSnapshot = async (
    key: string,
  ): Promise<CandidateLearningSnapshot<TKey>> => {
    const normalizedKey = normalizeKey(key);

    if (!normalizedKey) {
      return {
        key: '',
        records: [],
        recordMap: new Map(),
      };
    }

    const persistentRecords = await getPersistentRecordsByKey(normalizedKey);
    const memoryRecords = getMemoryRecordsByKey(normalizedKey);
    const mergedMap = new Map<string, CandidateLearningRecord<TKey>>();

    [...persistentRecords, ...memoryRecords].forEach((item) => {
      const previous = mergedMap.get(item.candidate);

      if (!previous || compareLearningRecord(previous, item) > 0) {
        mergedMap.set(item.candidate, item);
      }
    });

    const records = [...mergedMap.values()].sort(compareLearningRecord);

    return {
      key: normalizedKey,
      records,
      recordMap: new Map(records.map((item) => [item.candidate, item])),
    };
  };

  const getLearningSnapshotByPrefix = async (
    key: string,
  ): Promise<CandidateLearningSnapshot<TKey>> => {
    const normalizedKey = normalizeKey(key);

    if (!normalizedKey) {
      return {
        key: '',
        records: [],
        recordMap: new Map(),
      };
    }

    const persistentRecords =
      await getPersistentRecordsByKeyPrefix(normalizedKey);
    const memoryRecords = [...memoryLearningStore.values()].filter((item) =>
      item.key.startsWith(normalizedKey),
    );
    const mergedMap = new Map<string, CandidateLearningRecord<TKey>>();

    [...persistentRecords, ...memoryRecords].forEach((item) => {
      const previous = mergedMap.get(item.candidate);

      if (!previous || compareLearningRecord(previous, item) > 0) {
        mergedMap.set(item.candidate, item);
      }
    });

    const records = [...mergedMap.values()].sort(compareLearningRecord);

    return {
      key: normalizedKey,
      records,
      recordMap: new Map(records.map((item) => [item.candidate, item])),
    };
  };

  const getLearningRecord = async (key: string, candidate: string) => {
    const normalizedKey = normalizeKey(key);
    const normalizedCandidate = normalizeCandidate(candidate);

    if (!normalizedKey || !normalizedCandidate) {
      return undefined;
    }

    const recordId = getRecordId(normalizedKey, normalizedCandidate);
    const memoryRecord = memoryLearningStore.get(recordId);

    if (memoryRecord) {
      return memoryRecord;
    }

    const database = await getLearningDatabase();

    return getIndexedDBRecord<CandidateLearningRecord<TKey>>(
      database,
      storeName,
      recordId,
    );
  };

  const recordSelection = async (
    key: string,
    candidate: string,
    recordOptions: RecordCandidateSelectionOptions = {},
  ) => {
    const normalizedKey = normalizeKey(key);
    const normalizedCandidate = normalizeCandidate(candidate);

    if (!normalizedKey || !normalizedCandidate) {
      return undefined;
    }

    const now = recordOptions.now ?? Date.now();
    const recordId = getRecordId(normalizedKey, normalizedCandidate);
    const previousRecord =
      (await getLearningRecord(normalizedKey, normalizedCandidate)) ?? undefined;
    const nextRecord: CandidateLearningRecord<TKey> = previousRecord
      ? {
          ...previousRecord,
          count: previousRecord.count + 1,
          updatedAt: now,
          lastSelectedAt: now,
        }
      : {
          id: recordId,
          key: normalizedKey,
          candidate: normalizedCandidate,
          count: 1,
          createdAt: now,
          updatedAt: now,
          lastSelectedAt: now,
        };

    memoryLearningStore.set(recordId, nextRecord);

    const database = await getLearningDatabase();
    await putIndexedDBRecord(database, storeName, nextRecord);

    const records = getMemoryRecordsByKey(normalizedKey);
    await trimRecordsForKey(
      recordOptions.maxRecordsPerKey ?? maxRecordsPerKey,
      records,
    );

    return nextRecord;
  };

  const reorderCandidates = async (key: string, candidates: string[]) => {
    if (!candidates.length) {
      return [];
    }

    const normalizedCandidates = candidates
      .filter(Boolean)
      .map((item) => normalizeCandidate(item))
      .filter(Boolean);

    if (!normalizedCandidates.length) {
      return [];
    }

    const snapshot = await getLearningSnapshot(key);

    if (!snapshot.records.length) {
      return [...normalizedCandidates];
    }

    return [...normalizedCandidates].sort((prev, next) => {
      const prevRecord = snapshot.recordMap.get(prev);
      const nextRecord = snapshot.recordMap.get(next);

      if (prevRecord && nextRecord) {
        return compareLearningRecord(prevRecord, nextRecord);
      }

      if (prevRecord) {
        return -1;
      }

      if (nextRecord) {
        return 1;
      }

      return 0;
    });
  };

  const clearLearning = async (key?: string) => {
    const normalizedKey = key ? normalizeKey(key) : '';

    if (!normalizedKey) {
      memoryLearningStore.clear();
      const database = await getLearningDatabase();

      if (!database) {
        return true;
      }

      return clearIndexedDBStore(database, storeName);
    }

    const snapshot = await getLearningSnapshot(normalizedKey);

    snapshot.records.forEach((item) => {
      memoryLearningStore.delete(item.id);
    });

    const database = await getLearningDatabase();

    await Promise.all(
      snapshot.records.map((item) =>
        deleteIndexedDBRecord(database, storeName, item.id),
      ),
    );

    return true;
  };

  const resetLearning = async () => {
    memoryLearningStore.clear();

    return deleteIndexedDBDatabase(databaseName);
  };

  return {
    compareLearningRecord,
    getLearningSnapshot,
    getLearningSnapshotByPrefix,
    getLearningRecord,
    recordSelection,
    reorderCandidates,
    clearLearning,
    resetLearning,
  };
}
