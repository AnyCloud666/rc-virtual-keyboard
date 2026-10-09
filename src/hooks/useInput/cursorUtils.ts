type SegmentLike = {
  index?: number;
  segment: string;
};

const isHighSurrogate = (value: string, index: number) => {
  const code = value.charCodeAt(index);
  return code >= 0xd800 && code <= 0xdbff;
};

const isLowSurrogate = (value: string, index: number) => {
  const code = value.charCodeAt(index);
  return code >= 0xdc00 && code <= 0xdfff;
};

const getPreviousCursorIndexFallback = (value: string, index: number) => {
  if (index <= 0) return 0;

  if (
    index >= 2 &&
    isLowSurrogate(value, index - 1) &&
    isHighSurrogate(value, index - 2)
  ) {
    return index - 2;
  }

  return index - 1;
};

const getNextCursorIndexFallback = (value: string, index: number) => {
  if (index >= value.length) return value.length;

  if (
    index + 1 < value.length &&
    isHighSurrogate(value, index) &&
    isLowSurrogate(value, index + 1)
  ) {
    return index + 2;
  }

  return index + 1;
};

const getGraphemeBoundaries = (value: string) => {
  const boundaries = [0];

  if (
    typeof Intl !== 'undefined' &&
    typeof (
      Intl as typeof Intl & {
        Segmenter?: new (
          locales?: string | string[],
          options?: { granularity?: 'grapheme' | 'word' | 'sentence' },
        ) => { segment(input: string): Iterable<SegmentLike> };
      }
    ).Segmenter === 'function'
  ) {
    const segmenter = new (
      Intl as typeof Intl & {
        Segmenter: new (
          locales?: string | string[],
          options?: { granularity?: 'grapheme' | 'word' | 'sentence' },
        ) => { segment(input: string): Iterable<SegmentLike> };
      }
    ).Segmenter(undefined, {
      granularity: 'grapheme',
    });

    for (const item of segmenter.segment(value)) {
      if (typeof item.index === 'number') {
        boundaries.push(item.index + item.segment.length);
      }
    }
  } else {
    let cursor = 0;

    while (cursor < value.length) {
      cursor = getNextCursorIndexFallback(value, cursor);
      boundaries.push(cursor);
    }
  }

  if (boundaries[boundaries.length - 1] !== value.length) {
    boundaries.push(value.length);
  }

  return [...new Set(boundaries)].sort((a, b) => a - b);
};

/**
 * 计算给定光标位置前一个合法的字素边界。
 *
 * @description
 * 这里优先按 grapheme cluster 处理，避免 emoji、代理对字符被截断成半个字符。
 */
export const getPreviousCursorIndex = (value: string, index: number) => {
  const boundaries = getGraphemeBoundaries(value);

  for (let i = boundaries.length - 1; i >= 0; i -= 1) {
    if (boundaries[i] < index) {
      return boundaries[i];
    }
  }

  return 0;
};

/**
 * 计算给定光标位置后一个合法的字素边界。
 *
 * @description
 * 与 `getPreviousCursorIndex` 配套使用，保证左右移动光标时不会破坏复合字符。
 */
export const getNextCursorIndex = (value: string, index: number) => {
  const boundaries = getGraphemeBoundaries(value);

  for (let i = 0; i < boundaries.length; i += 1) {
    if (boundaries[i] > index) {
      return boundaries[i];
    }
  }

  return value.length;
};
