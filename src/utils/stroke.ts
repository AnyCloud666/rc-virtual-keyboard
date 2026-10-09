import strokeData from '../lib/strokeData';
import strokeRank from '../lib/strokeRank';

/**
 * Five-stroke codes from han-ideographs-stroke-order (CC0 1.0).
 * https://github.com/takushun-wu/han-ideographs-stroke-order
 * Candidate frequency order from Conway Stroke Data (public domain).
 * https://github.com/stroke-input/stroke-input-data
 */
const entries = Object.entries(strokeData);
const ranks = new Map([...strokeRank].map((char, index) => [char, index]));

export const getStrokeCandidates = (prefix: string, limit = 80): string[] => {
  if (!prefix || !/^[1-5]+$/.test(prefix) || limit <= 0) return [];

  type Candidate = { character: string; strokeCount: number; matchKind: number };
  const candidates = new Map<string, Candidate>();
  const sortedPrefix = [...prefix].sort().join('');

  const addCandidates = (code: string, characters: string, matchKind: number) => {
    for (const character of characters) {
      const candidate = { character, strokeCount: code.length, matchKind };
      const previous = candidates.get(character);
      if (
        !previous ||
        candidate.strokeCount < previous.strokeCount ||
        (candidate.strokeCount === previous.strokeCount && matchKind < previous.matchKind)
      ) {
        candidates.set(character, candidate);
      }
    }
  };

  entries.forEach(([code, characters]) => {
    if (code.startsWith(prefix)) {
      addCandidates(code, characters, 0);
      return;
    }

    if (prefix.length < 2 || code.length < prefix.length) {
      return;
    }

    const samePrefixStrokes =
      [...code.slice(0, prefix.length)].sort().join('') === sortedPrefix;
    if (!samePrefixStrokes) {
      // A different stroke order can bring a later stroke forward. Keep this
      // broader match close to completion so early input stays useful.
      if (code.length - prefix.length > 2) return;
      const remaining = [...code];
      const hasAllEnteredStrokes = [...prefix].every((stroke) => {
        const index = remaining.indexOf(stroke);
        if (index < 0) return false;
        remaining.splice(index, 1);
        return true;
      });
      if (!hasAllEnteredStrokes) return;
    }

    addCandidates(code, characters, samePrefixStrokes ? 1 : 2);
  });

  const byFrequency = (a: string, b: string) =>
    (ranks.get(a) ?? Number.MAX_SAFE_INTEGER) -
      (ranks.get(b) ?? Number.MAX_SAFE_INTEGER) ||
    a.localeCompare(b, 'zh');

  return [...candidates.values()]
    .sort(
      (a, b) =>
        a.strokeCount - b.strokeCount ||
        a.matchKind - b.matchKind ||
        byFrequency(a.character, b.character),
    )
    .slice(0, limit)
    .map(({ character }) => character);
};
