import {
  CandidateLearningRecord,
  CandidateLearningSnapshot,
  createCandidateLearningStore,
  RecordCandidateSelectionOptions,
} from './candidateLearning';

const englishLearningStore = createCandidateLearningStore({
  databaseName: 'rc-virtual-keyboard-english-learning',
  databaseVersion: 1,
  storeName: 'english_learning_records',
  indexName: 'keyword',
  maxRecordsPerKey: 50,
  normalizeKey: (keyword) => keyword.toLowerCase().replace(/[^a-z\s]+/g, '').trim(),
  normalizeCandidate: (candidate) => candidate.trim().toLowerCase(),
  compareCandidates: (prev, next) => prev.localeCompare(next, 'en'),
});

export type EnglishLearningRecord = CandidateLearningRecord<string>;
export type EnglishLearningSnapshot = CandidateLearningSnapshot<string>;
export type RecordEnglishSelectionOptions = RecordCandidateSelectionOptions;

export async function getEnglishLearningSnapshot(
  keyword: string,
): Promise<EnglishLearningSnapshot> {
  return englishLearningStore.getLearningSnapshot(keyword);
}

export async function getEnglishLearningPrefixCandidates(keyword: string) {
  const snapshot = await englishLearningStore.getLearningSnapshotByPrefix(keyword);

  return snapshot.records.map((item) => item.candidate);
}

export async function getEnglishLearningRecord(
  keyword: string,
  candidate: string,
) {
  return englishLearningStore.getLearningRecord(keyword, candidate);
}

export async function recordEnglishSelection(
  keyword: string,
  candidate: string,
  options: RecordEnglishSelectionOptions = {},
) {
  return englishLearningStore.recordSelection(keyword, candidate, options);
}

export async function reorderCandidatesByEnglishLearning(
  keyword: string,
  candidates: string[],
) {
  return englishLearningStore.reorderCandidates(keyword, candidates);
}

export async function clearEnglishLearning(keyword?: string) {
  return englishLearningStore.clearLearning(keyword);
}

export async function resetEnglishLearning() {
  return englishLearningStore.resetLearning();
}
