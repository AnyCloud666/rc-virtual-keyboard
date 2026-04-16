import commonNames from '../lib/commonNames';
import commonPhrases from '../lib/commonPhrases';
import dictionaries from '../lib/dictionaries';
import geographyPhrases from '../lib/geographyPhrases';
import idiomPhrases from '../lib/idiomPhrases';
import idiomSet from '../lib/idiomSet';
import nameSet from '../lib/nameSet';

/** 获取单个汉字 */
export function getSingleChinese(pinyin: string) {
  return (dictionaries as Record<string, string>)[pinyin];
}

/** 拼音词典 */
const PINYIN_DICTIONARY = dictionaries as Record<string, string>;
/** 高频词组词典 */
const COMMON_PHRASES_DICTIONARY = commonPhrases as Record<string, string[]>;
/** 常用中文名字词典 */
const COMMON_NAMES_DICTIONARY = commonNames as Record<string, string[]>;
/** 四字成语词典 */
const IDIOM_PHRASES_DICTIONARY = idiomPhrases as Record<string, string[]>;
/** 四字成语集合 */
const IDIOM_SET = new Set(idiomSet);
/** 常用中文姓名集合 */
const NAME_SET = new Set(nameSet);
/** 地理位置词典 */
const GEOGRAPHY_PHRASES_DICTIONARY = geographyPhrases as Record<
  string,
  string[]
>;
/** 统一高优先级词组词典 */
const PRIORITY_PHRASES_DICTIONARY = {
  ...COMMON_PHRASES_DICTIONARY,
  ...COMMON_NAMES_DICTIONARY,
  ...IDIOM_PHRASES_DICTIONARY,
  ...GEOGRAPHY_PHRASES_DICTIONARY,
};

/** 词典中的最长拼音长度，例如 zhuang */
const MAX_PINYIN_LENGTH = Object.keys(PINYIN_DICTIONARY).reduce(
  (max, item) => Math.max(max, item.length),
  0,
);

/** 组合拼写时每个音节最多参与组合的候选汉字数量，避免结果爆炸 */
const MAX_CHARS_PER_SYLLABLE = 6;

/** 最多返回的候选结果数量 */
const MAX_RESULT_COUNT = 30;

/** 规范化输入，只保留字母和分隔符 */
function normalizePinyinInput(pinyin: string) {
  return pinyin
    .toLowerCase()
    .replace(/[^a-z'\s]+/g, '')
    .trim();
}

/** 拿到某个拼音对应的候选汉字列表 */
function getChineseCandidates(pinyin: string) {
  const value = getSingleChinese(pinyin);

  return value ? value.split('') : [];
}

/** 拿到高优先级词组候选 */
function getCommonPhraseCandidates(pinyin: string) {
  return PRIORITY_PHRASES_DICTIONARY[pinyin] || [];
}

/** 拿到高优先级词组前缀候选 */
function getCommonPhrasePrefixCandidates(pinyin: string) {
  return Object.keys(PRIORITY_PHRASES_DICTIONARY)
    .filter((item) => item.startsWith(pinyin))
    .slice(0, MAX_RESULT_COUNT)
    .flatMap((item) => PRIORITY_PHRASES_DICTIONARY[item].slice(0, 2));
}

/** 获取拼音切分后的简拼，例如 nihao => nh */
function getSimplePinyin(pinyin: string) {
  const normalized = normalizePinyinInput(pinyin).replace(/['\s]+/g, '');

  if (!normalized) return '';

  const segmentGroups = findPinyinSegments(normalized);
  const bestSegments = sortSegmentGroups(segmentGroups)[0];

  if (bestSegments?.length) {
    return bestSegments.map((item) => item[0]).join('');
  }

  return normalized;
}

/** 拿到高优先级词组的简拼候选 */
function getCommonPhraseSimpleCandidates(pinyin: string) {
  const normalized = normalizePinyinInput(pinyin).replace(/['\s]+/g, '');

  if (!normalized) return [];

  const exactMatches: string[] = [];
  const prefixMatches: string[] = [];
  const resultSet = new Set<string>();

  Object.keys(PRIORITY_PHRASES_DICTIONARY).forEach((item) => {
    const simplePinyin = getSimplePinyin(item);

    if (!simplePinyin || simplePinyin === item) return;

    const targetList =
      simplePinyin === normalized
        ? exactMatches
        : simplePinyin.startsWith(normalized)
        ? prefixMatches
        : null;

    if (!targetList) return;

    PRIORITY_PHRASES_DICTIONARY[item].forEach((candidate) => {
      if (
        !resultSet.has(candidate) &&
        exactMatches.length + prefixMatches.length < MAX_RESULT_COUNT
      ) {
        resultSet.add(candidate);
        targetList.push(candidate);
      }
    });
  });

  return [...exactMatches, ...prefixMatches].slice(0, MAX_RESULT_COUNT);
}

/** 按显式分隔符拆分，例如 ni'hao / ni hao */
function splitExplicitPinyin(pinyin: string) {
  return pinyin.split(/['\s]+/).filter(Boolean);
}

/**
 * 查找所有可行的拼音切分结果。
 *
 * 支持：
 * 1. 单个完整拼音，如 ni
 * 2. 连续拼写，如 nihao => ni + hao
 * 3. 组合拼写，如 ni'hao / ni hao
 */
function findPinyinSegments(pinyin: string) {
  const normalized = normalizePinyinInput(pinyin);

  if (!normalized) return [];

  if (normalized.includes("'") || /\s/.test(normalized)) {
    const segments = splitExplicitPinyin(normalized);

    return segments.every((item) => getSingleChinese(item)) ? [segments] : [];
  }

  const result: string[][] = [];
  const cache = new Map<number, string[][]>();

  const dfs = (start: number): string[][] => {
    if (cache.has(start)) {
      return cache.get(start)!;
    }

    if (start >= normalized.length) {
      return [[]];
    }

    const currentResult: string[][] = [];
    const end = Math.min(normalized.length, start + MAX_PINYIN_LENGTH);

    for (let i = start + 1; i <= end; i++) {
      const segment = normalized.slice(start, i);

      if (!getSingleChinese(segment)) continue;

      const rest = dfs(i);
      rest.forEach((item) => currentResult.push([segment, ...item]));
    }

    cache.set(start, currentResult);

    return currentResult;
  };

  result.push(...dfs(0));

  return result;
}

/** 生成组合拼写候选，例如 ni + hao => 你好 / 拟好 */
function composeChineseCandidates(segments: string[]) {
  if (!segments.length) return [];

  const phraseSet = new Set<string>();

  const dfs = (index: number, currentValue: string) => {
    if (phraseSet.size >= MAX_RESULT_COUNT) return;

    if (index >= segments.length) {
      phraseSet.add(currentValue);
      return;
    }

    const chars = getChineseCandidates(segments[index]).slice(
      0,
      MAX_CHARS_PER_SYLLABLE,
    );

    chars.forEach((char) => {
      dfs(index + 1, currentValue + char);
    });
  };

  dfs(0, '');

  return [...phraseSet];
}

/** 对切分结果排序，优先使用音节更少、单个音节更长的切分方案 */
function sortSegmentGroups(segmentGroups: string[][]) {
  return [...segmentGroups].sort((prev, next) => {
    if (prev.length !== next.length) {
      return prev.length - next.length;
    }

    for (let i = 0; i < prev.length; i++) {
      if ((prev[i]?.length ?? 0) !== (next[i]?.length ?? 0)) {
        return (next[i]?.length ?? 0) - (prev[i]?.length ?? 0);
      }
    }

    return 0;
  });
}

/**
 * 按“单字 -> 双字 -> 三字”的顺序生成候选。
 *
 * 例如 nihao：
 * 1. 先返回 ni 的候选单字
 * 2. 再返回 ni + hao 的双字组合
 */
function composeLayeredChineseCandidates(segmentGroups: string[][]) {
  const result: string[] = [];
  const resultSet = new Set<string>();
  const sortedSegmentGroups = sortSegmentGroups(segmentGroups);
  const hasComposedPhrase = sortedSegmentGroups.some(
    (segments) => segments.length > 1,
  );

  sortedSegmentGroups.forEach((segments) => {
    const startLength = hasComposedPhrase && segments.length > 1 ? 2 : 1;

    for (let i = startLength; i <= segments.length; i++) {
      const candidates = composeChineseCandidates(segments.slice(0, i));

      candidates.forEach((item) => {
        if (resultSet.size >= MAX_RESULT_COUNT || resultSet.has(item)) return;

        resultSet.add(item);
        result.push(item);
      });

      if (resultSet.size >= MAX_RESULT_COUNT) {
        return;
      }
    }
  });

  return result;
}

/** 合并高优先级词组与普通组合候选，保证高优词组排在前面 */
function mergePrioritizedCandidates(prioritized: string[], fallback: string[]) {
  const result: string[] = [];
  const resultSet = new Set<string>();
  const idiomCandidates: string[] = [];
  const normalCandidates: string[] = [];

  const nameCandidates: string[] = [];

  fallback.forEach((item) => {
    if (IDIOM_SET.has(item)) {
      idiomCandidates.push(item);
    } else if (NAME_SET.has(item)) {
      nameCandidates.push(item);
    } else {
      normalCandidates.push(item);
    }
  });

  [
    ...prioritized,
    ...idiomCandidates,
    ...nameCandidates,
    ...normalCandidates,
  ].forEach((item) => {
    if (!item || resultSet.has(item) || result.length >= MAX_RESULT_COUNT) {
      return;
    }

    resultSet.add(item);
    result.push(item);
  });

  return result;
}

/**
 * 在输入尚未形成完整拼写时，尽量返回“当前能确认”的候选。
 *
 * 例如：
 * - nih => 先返回 ni 对应的候选
 * - zho => 返回 zho 作为前缀可能命中的音节候选
 */
function getPartialChineseCandidates(pinyin: string) {
  const normalized = normalizePinyinInput(pinyin);

  if (!normalized) {
    return {
      pinyin: '',
      chinese: [],
    };
  }

  for (let i = normalized.length; i > 0; i--) {
    const prefix = normalized.slice(0, i);
    const suffix = normalized.slice(i);
    const exactCandidates = getChineseCandidates(prefix);

    if (exactCandidates.length) {
      return {
        pinyin: suffix ? `${prefix}'${suffix}` : prefix,
        chinese: exactCandidates,
      };
    }
  }

  const prefixChinese = Object.keys(PINYIN_DICTIONARY)
    .filter((item) => item.startsWith(normalized))
    .slice(0, MAX_RESULT_COUNT)
    .flatMap((item) => getChineseCandidates(item).slice(0, 2));

  return {
    pinyin: normalized,
    chinese: [...new Set(prefixChinese)],
  };
}

/** 拼音转汉字 */
export function pinyin2ChineseV1(pinyin: string) {
  let chinese = getSingleChinese(pinyin);

  if (chinese) {
    return {
      pinyin,
      chinese: chinese.split(''),
    };
  }

  let temp = '';

  for (let i = 0, len = pinyin.length; i < len; i++) {
    temp += pinyin[i];

    chinese = getSingleChinese(temp);

    if (!chinese) continue;

    // flag表示如果当前能匹配到结果、并且往后5个字母不能匹配结果，因为最长可能是5个字母，如 zhuang

    let flag = false;

    if (i + 1 < pinyin.length) {
      for (let j = 1, len = pinyin.length; j <= 5 && i + j < len; j++) {
        if (getSingleChinese(pinyin.substr(0, i + j + 1))) {
          flag = true;
          break;
        }
      }
    }

    if (!flag) {
      return {
        pinyin: pinyin.substr(0, i + 1) + "'" + pinyin.substr(i + 1),
        chinese: chinese.split(''),
      };
    }
  }

  // 理论上一般不会出现这种情况
  return {
    pinyin: '',
    chinese: [],
  };
}

/**
 * 拼音转汉字 V2
 *
 * 相比 V1，额外支持：
 * 1. 单字母或未完成拼写时的候选兜底
 * 2. 连续拼写，如 nihao => 你好
 * 3. 组合拼写，如 ni'hao / ni hao
 */
export function pinyin2ChineseV2(pinyin: string) {
  const normalized = normalizePinyinInput(pinyin);

  if (!normalized) {
    return {
      pinyin: '',
      chinese: [],
    };
  }

  const commonPhraseCandidates = getCommonPhraseCandidates(
    normalized.replace(/['\s]+/g, ''),
  );
  const commonPhraseSimpleCandidates =
    getCommonPhraseSimpleCandidates(normalized);

  const chinese = getChineseCandidates(normalized);

  if (chinese.length) {
    return {
      pinyin: normalized,
      chinese: mergePrioritizedCandidates(
        [...commonPhraseCandidates, ...commonPhraseSimpleCandidates],
        chinese,
      ),
    };
  }

  const segmentGroups = findPinyinSegments(normalized);

  if (segmentGroups.length) {
    const phrases = composeLayeredChineseCandidates(segmentGroups);

    return {
      pinyin: sortSegmentGroups(segmentGroups)[0]?.join("'") || normalized,
      chinese: mergePrioritizedCandidates(
        [...commonPhraseCandidates, ...commonPhraseSimpleCandidates],
        phrases,
      ),
    };
  }

  const partialResult = getPartialChineseCandidates(normalized);
  const phrasePrefixCandidates = getCommonPhrasePrefixCandidates(
    normalized.replace(/['\s]+/g, ''),
  );

  return {
    pinyin: partialResult.pinyin,
    chinese: mergePrioritizedCandidates(
      [...commonPhraseSimpleCandidates, ...phrasePrefixCandidates],
      partialResult.chinese,
    ),
  };
}
