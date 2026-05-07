import {
  clearIndexedDBStore,
  deleteIndexedDBRecord,
  deleteIndexedDBDatabase,
  getIndexedDBRecord,
  getIndexedDBRecordsByIndex,
  openIndexedDBDatabase,
  putIndexedDBRecord,
} from './indexeddb';

const PINYIN_LEARNING_DATABASE_NAME = 'rc-virtual-keyboard-pinyin-learning';
const PINYIN_LEARNING_DATABASE_VERSION = 1;
const PINYIN_LEARNING_STORE_NAME = 'pinyin_learning_records';
const PINYIN_INDEX_NAME = 'pinyin';
const MAX_RECORDS_PER_PINYIN = 50;

export type PinyinLearningRecord = {
  id: string;
  pinyin: string;
  candidate: string;
  count: number;
  createdAt: number;
  updatedAt: number;
  lastSelectedAt: number;
};

export type PinyinLearningSnapshot = {
  pinyin: string;
  records: PinyinLearningRecord[];
  recordMap: Map<string, PinyinLearningRecord>;
};

export type RecordPinyinSelectionOptions = {
  maxRecordsPerPinyin?: number;
  now?: number;
};

const memoryLearningStore = new Map<string, PinyinLearningRecord>();

function getRecordId(pinyin: string, candidate: string) {
  return `${pinyin}::${candidate}`;
}

function compareLearningRecord(
  prev: PinyinLearningRecord,
  next: PinyinLearningRecord,
) {
  if (prev.count !== next.count) {
    return next.count - prev.count;
  }

  if (prev.lastSelectedAt !== next.lastSelectedAt) {
    return next.lastSelectedAt - prev.lastSelectedAt;
  }

  return prev.candidate.localeCompare(next.candidate, 'zh-Hans-CN');
}

function normalizeCandidate(candidate: string) {
  return candidate.trim();
}

function getMemoryRecordsByPinyin(pinyin: string) {
  return [...memoryLearningStore.values()]
    .filter((item) => item.pinyin === pinyin)
    .sort(compareLearningRecord);
}

async function getLearningDatabase() {
  return openIndexedDBDatabase({
    name: PINYIN_LEARNING_DATABASE_NAME,
    version: PINYIN_LEARNING_DATABASE_VERSION,
    stores: [
      {
        name: PINYIN_LEARNING_STORE_NAME,
        keyPath: 'id',
        indexes: [
          {
            name: PINYIN_INDEX_NAME,
            keyPath: 'pinyin',
          },
        ],
      },
    ],
  });
}

async function getPersistentRecordsByPinyin(pinyin: string) {
  const database = await getLearningDatabase();

  return getIndexedDBRecordsByIndex<PinyinLearningRecord>(
    database,
    PINYIN_LEARNING_STORE_NAME,
    PINYIN_INDEX_NAME,
    pinyin,
  );
}

async function trimRecordsForPinyin(
  maxRecordsPerPinyin: number,
  records: PinyinLearningRecord[],
) {
  const overflowRecords = records
    .sort(compareLearningRecord)
    .slice(maxRecordsPerPinyin);

  if (!overflowRecords.length) {
    return;
  }

  overflowRecords.forEach((item) => {
    memoryLearningStore.delete(item.id);
  });

  const database = await getLearningDatabase();

  await Promise.all(
    overflowRecords.map((item) =>
      deleteIndexedDBRecord(database, PINYIN_LEARNING_STORE_NAME, item.id),
    ),
  );
}

export function normalizeLearningPinyin(pinyin: string) {
  return pinyin
    .toLowerCase()
    .replace(/[^a-z'\s]+/g, '')
    .replace(/['\s]+/g, '')
    .trim();
}

export async function getPinyinLearningSnapshot(
  pinyin: string,
): Promise<PinyinLearningSnapshot> {
  const normalizedPinyin = normalizeLearningPinyin(pinyin);

  if (!normalizedPinyin) {
    return {
      pinyin: '',
      records: [],
      recordMap: new Map(),
    };
  }

  const persistentRecords = await getPersistentRecordsByPinyin(normalizedPinyin);
  const memoryRecords = getMemoryRecordsByPinyin(normalizedPinyin);
  const mergedMap = new Map<string, PinyinLearningRecord>();

  [...persistentRecords, ...memoryRecords].forEach((item) => {
    const previous = mergedMap.get(item.candidate);

    if (!previous || compareLearningRecord(previous, item) > 0) {
      mergedMap.set(item.candidate, item);
    }
  });

  const records = [...mergedMap.values()].sort(compareLearningRecord);

  return {
    pinyin: normalizedPinyin,
    records,
    recordMap: new Map(records.map((item) => [item.candidate, item])),
  };
}

export async function getPinyinLearningRecords(pinyin: string) {
  const snapshot = await getPinyinLearningSnapshot(pinyin);

  return snapshot.records;
}

export async function getPinyinLearningRecord(
  pinyin: string,
  candidate: string,
) {
  const normalizedPinyin = normalizeLearningPinyin(pinyin);
  const normalizedCandidate = normalizeCandidate(candidate);

  if (!normalizedPinyin || !normalizedCandidate) {
    return undefined;
  }

  const recordId = getRecordId(normalizedPinyin, normalizedCandidate);
  const memoryRecord = memoryLearningStore.get(recordId);

  if (memoryRecord) {
    return memoryRecord;
  }

  const database = await getLearningDatabase();

  return getIndexedDBRecord<PinyinLearningRecord>(
    database,
    PINYIN_LEARNING_STORE_NAME,
    recordId,
  );
}

export async function recordPinyinSelection(
  pinyin: string,
  candidate: string,
  options: RecordPinyinSelectionOptions = {},
) {
  const normalizedPinyin = normalizeLearningPinyin(pinyin);
  const normalizedCandidate = normalizeCandidate(candidate);

  if (!normalizedPinyin || !normalizedCandidate) {
    return undefined;
  }

  const now = options.now ?? Date.now();
  const recordId = getRecordId(normalizedPinyin, normalizedCandidate);
  const previousRecord =
    (await getPinyinLearningRecord(normalizedPinyin, normalizedCandidate)) ??
    undefined;
  const nextRecord: PinyinLearningRecord = previousRecord
    ? {
        ...previousRecord,
        count: previousRecord.count + 1,
        updatedAt: now,
        lastSelectedAt: now,
      }
    : {
        id: recordId,
        pinyin: normalizedPinyin,
        candidate: normalizedCandidate,
        count: 1,
        createdAt: now,
        updatedAt: now,
        lastSelectedAt: now,
      };

  memoryLearningStore.set(recordId, nextRecord);

  const database = await getLearningDatabase();
  await putIndexedDBRecord(database, PINYIN_LEARNING_STORE_NAME, nextRecord);

  const records = getMemoryRecordsByPinyin(normalizedPinyin);
  await trimRecordsForPinyin(
    options.maxRecordsPerPinyin ?? MAX_RECORDS_PER_PINYIN,
    records,
  );

  return nextRecord;
}

export async function reorderCandidatesByPinyinLearning(
  pinyin: string,
  candidates: string[],
) {
  if (!candidates.length) {
    return [];
  }

  const normalizedCandidates = candidates.filter(Boolean);

  if (!normalizedCandidates.length) {
    return [];
  }

  const snapshot = await getPinyinLearningSnapshot(pinyin);

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
}

export async function clearPinyinLearning(pinyin?: string) {
  const normalizedPinyin = pinyin ? normalizeLearningPinyin(pinyin) : '';

  if (!normalizedPinyin) {
    memoryLearningStore.clear();
    const database = await getLearningDatabase();

    if (!database) {
      return true;
    }

    return clearIndexedDBStore(database, PINYIN_LEARNING_STORE_NAME);
  }

  const records = await getPinyinLearningRecords(normalizedPinyin);

  records.forEach((item) => {
    memoryLearningStore.delete(item.id);
  });

  const database = await getLearningDatabase();

  await Promise.all(
    records.map((item) =>
      deleteIndexedDBRecord(database, PINYIN_LEARNING_STORE_NAME, item.id),
    ),
  );

  return true;
}

export async function resetPinyinLearning() {
  memoryLearningStore.clear();

  return deleteIndexedDBDatabase(PINYIN_LEARNING_DATABASE_NAME);
}
