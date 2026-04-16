import { COMMON_ENGLISH_WORDS } from '../lib/commonEnglishWords';

/**
 * 英文前缀转候选单词
 *
 * @param {string} value 当前已输入的字母串
 * @return {string[]} 候选英文单词列表
 *
 * @description
 * 参照拼音候选的交互方式，英文模式下按前缀匹配单词。
 * 结果中不会重复包含当前输入值本身，调用方可自行决定是否将原始输入放到首位。
 */
export const english2WordsV1 = (value: string): string[] => {
  const keyword = value.trim().toLowerCase();

  if (!keyword) return [];

  const exactMatches: string[] = [];
  const prefixMatches: string[] = [];
  const includeMatches: string[] = [];

  for (const word of COMMON_ENGLISH_WORDS) {
    if (word === keyword) {
      exactMatches.push(word);
      continue;
    }

    if (word.startsWith(keyword)) {
      prefixMatches.push(word);
      continue;
    }

    if (word.includes(keyword)) {
      includeMatches.push(word);
    }
  }

  return [...exactMatches, ...prefixMatches, ...includeMatches].slice(0, 30);
};
