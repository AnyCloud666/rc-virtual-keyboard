import {
  CandidateLearningRecord,
  CandidateLearningSnapshot,
  createCandidateLearningStore,
  RecordCandidateSelectionOptions,
} from './candidateLearning';

const pinyinLearningStore = createCandidateLearningStore({
  databaseName: 'rc-virtual-keyboard-pinyin-learning',
  databaseVersion: 1,
  storeName: 'pinyin_learning_records',
  indexName: 'pinyin',
  maxRecordsPerKey: 50,
  normalizeKey: (pinyin) =>
    pinyin
      .toLowerCase()
      .replace(/[^a-z'\s]+/g, '')
      .replace(/['\s]+/g, '')
      .trim(),
  normalizeCandidate: (candidate) => candidate.trim(),
  compareCandidates: (prev, next) => prev.localeCompare(next, 'zh-Hans-CN'),
});

export type PinyinLearningRecord = CandidateLearningRecord<string>;
export type PinyinLearningSnapshot = CandidateLearningSnapshot<string>;
export type RecordPinyinSelectionOptions = RecordCandidateSelectionOptions;

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
  return pinyinLearningStore.getLearningSnapshot(pinyin);
}

export async function getPinyinLearningPrefixCandidates(pinyin: string) {
  const snapshot = await pinyinLearningStore.getLearningSnapshotByPrefix(pinyin);

  return snapshot.records.map((item) => item.candidate);
}

export async function getPinyinLearningRecords(pinyin: string) {
  const snapshot = await getPinyinLearningSnapshot(pinyin);

  return snapshot.records;
}

export async function getPinyinLearningRecord(
  pinyin: string,
  candidate: string,
) {
  return pinyinLearningStore.getLearningRecord(pinyin, candidate);
}

export async function recordPinyinSelection(
  pinyin: string,
  candidate: string,
  options: RecordPinyinSelectionOptions = {},
) {
  return pinyinLearningStore.recordSelection(pinyin, candidate, options);
}

export async function reorderCandidatesByPinyinLearning(
  pinyin: string,
  candidates: string[],
) {
  return pinyinLearningStore.reorderCandidates(pinyin, candidates);
}

export async function clearPinyinLearning(pinyin?: string) {
  return pinyinLearningStore.clearLearning(pinyin);
}

export async function resetPinyinLearning() {
  return pinyinLearningStore.resetLearning();
}
