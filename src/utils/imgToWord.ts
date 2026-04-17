import {
  createWorker,
  PSM,
  type RecognizeResult,
  type Worker,
} from 'tesseract.js';
import { COMMON_ENGLISH_WORDS } from '../lib/commonEnglishWords';
import commonNames from '../lib/commonNames';
import commonPhrases from '../lib/commonPhrases';
import geographyPhrases from '../lib/geographyPhrases';
import idiomPhrases from '../lib/idiomPhrases';
import nameSet from '../lib/nameSet';
import strokePhrases from '../lib/strokePhrases';

type WorkerMap = {
  eng: Worker;
  chi: Worker;
};

type Candidate = {
  text: string;
  confidence: number;
  language: 'eng' | 'chi';
};

type RankedCandidate = Candidate & {
  score: number;
};

const OCR_TARGET_SIZE = 320;
const OCR_PADDING = 28;
const OCR_BACKGROUND = 255;
const BINARIZE_THRESHOLD = 210;
const MIN_PIXEL_ALPHA = 8;
const MIN_DARK_VALUE = 235;
const MAX_CANDIDATE_COUNT = 12;
const ENGLISH_CORRECTION_MAX_DISTANCE = 2;
const CHINESE_CORRECTION_MAX_DISTANCE = 1;

let englishLexiconCache: string[] | null = null;
let chineseLexiconCache: string[] | null = null;

const resolveRecognitionMode = (options?: VKB.ImageRecognitionOptions) => {
  if (options?.inputMode === 'en') {
    return 'en';
  }

  if (options?.inputMode === 'zh') {
    return 'zh';
  }

  return 'auto';
};

let workersPromise: Promise<WorkerMap> | null = null;

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('手写图片加载失败'));
    image.src = src;
  });

const createCanvas = (width: number, height: number) => {
  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('无法创建 OCR 预处理画布');
  }

  return {
    canvas,
    context,
  };
};

const initWorkers = async (): Promise<WorkerMap> => {
  if (!workersPromise) {
    workersPromise = Promise.all([
      createWorker('eng', 1, {
        corePath: '/tesseract-core-simd-lstm.wasm.js',
        workerPath: '/worker.min.js',
        langPath: '/',
      }),
      createWorker('chi_sim', 1, {
        corePath: '/tesseract-core-simd-lstm.wasm.js',
        workerPath: '/worker.min.js',
        langPath: '/',
      }),
    ]).then(async ([engWorker, chiWorker]) => {
      await engWorker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_WORD,
        tessedit_char_whitelist:
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        user_defined_dpi: '300',
        preserve_interword_spaces: '0',
      });

      await chiWorker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_CHAR,
        user_defined_dpi: '300',
        preserve_interword_spaces: '0',
      });

      return {
        eng: engWorker,
        chi: chiWorker,
      };
    });
  }

  return workersPromise;
};

const getInkBounds = (imageData: ImageData) => {
  const { data, width, height } = imageData;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const alpha = data[offset + 3];
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];
      const gray = (r + g + b) / 3;

      if (alpha > MIN_PIXEL_ALPHA && gray < MIN_DARK_VALUE) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    return null;
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
};

const dilateBinaryImage = (imageData: ImageData) => {
  const { width, height, data } = imageData;
  const source = new Uint8ClampedArray(data);

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      let darkest = OCR_BACKGROUND;

      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          const index = ((y + offsetY) * width + (x + offsetX)) * 4;
          darkest = Math.min(darkest, source[index]);
        }
      }

      const targetIndex = (y * width + x) * 4;
      data[targetIndex] = darkest;
      data[targetIndex + 1] = darkest;
      data[targetIndex + 2] = darkest;
      data[targetIndex + 3] = 255;
    }
  }
};

const createPreprocessedVariants = async (imgUrl: string) => {
  const image = await loadImage(imgUrl);
  const sourceCanvas = createCanvas(image.width, image.height);

  sourceCanvas.context.fillStyle = '#fff';
  sourceCanvas.context.fillRect(0, 0, image.width, image.height);
  sourceCanvas.context.drawImage(image, 0, 0);

  const sourceImageData = sourceCanvas.context.getImageData(
    0,
    0,
    image.width,
    image.height,
  );
  const bounds = getInkBounds(sourceImageData);

  const crop = bounds ?? {
    minX: 0,
    minY: 0,
    width: image.width,
    height: image.height,
  };

  const innerSize = OCR_TARGET_SIZE - OCR_PADDING * 2;
  const scale = Math.min(innerSize / crop.width, innerSize / crop.height);
  const drawWidth = Math.max(1, Math.round(crop.width * scale));
  const drawHeight = Math.max(1, Math.round(crop.height * scale));
  const offsetX = Math.round((OCR_TARGET_SIZE - drawWidth) / 2);
  const offsetY = Math.round((OCR_TARGET_SIZE - drawHeight) / 2);

  const normalized = createCanvas(OCR_TARGET_SIZE, OCR_TARGET_SIZE);
  normalized.context.fillStyle = '#fff';
  normalized.context.fillRect(0, 0, OCR_TARGET_SIZE, OCR_TARGET_SIZE);
  normalized.context.imageSmoothingEnabled = true;
  normalized.context.imageSmoothingQuality = 'high';
  normalized.context.drawImage(
    sourceCanvas.canvas,
    crop.minX,
    crop.minY,
    crop.width,
    crop.height,
    offsetX,
    offsetY,
    drawWidth,
    drawHeight,
  );

  const grayscale = normalized.context.getImageData(
    0,
    0,
    OCR_TARGET_SIZE,
    OCR_TARGET_SIZE,
  );

  for (let index = 0; index < grayscale.data.length; index += 4) {
    const gray = Math.round(
      grayscale.data[index] * 0.299 +
        grayscale.data[index + 1] * 0.587 +
        grayscale.data[index + 2] * 0.114,
    );

    grayscale.data[index] = gray;
    grayscale.data[index + 1] = gray;
    grayscale.data[index + 2] = gray;
    grayscale.data[index + 3] = 255;
  }
  normalized.context.putImageData(grayscale, 0, 0);

  const binaryCanvas = createCanvas(OCR_TARGET_SIZE, OCR_TARGET_SIZE);
  const binaryImageData = normalized.context.getImageData(
    0,
    0,
    OCR_TARGET_SIZE,
    OCR_TARGET_SIZE,
  );

  for (let index = 0; index < binaryImageData.data.length; index += 4) {
    const value = binaryImageData.data[index] < BINARIZE_THRESHOLD ? 0 : 255;
    binaryImageData.data[index] = value;
    binaryImageData.data[index + 1] = value;
    binaryImageData.data[index + 2] = value;
    binaryImageData.data[index + 3] = 255;
  }

  dilateBinaryImage(binaryImageData);
  binaryCanvas.context.putImageData(binaryImageData, 0, 0);

  return [
    normalized.canvas.toDataURL('image/png'),
    binaryCanvas.canvas.toDataURL('image/png'),
  ];
};

const normalizeText = (text: string) => {
  return text
    .replace(/\s+/g, '')
    .replace(/[|]/g, 'I')
    .replace(/[，、；：]/g, '')
    .trim();
};

const flattenDictionaryRecord = (dictionary: Record<string, string[]>) => {
  return Object.values(dictionary).flat();
};

const getEnglishLexicon = () => {
  if (!englishLexiconCache) {
    englishLexiconCache = Array.from(
      new Set(
        COMMON_ENGLISH_WORDS.map((word) => word.trim().toLowerCase()).filter(
          Boolean,
        ),
      ),
    );
  }

  return englishLexiconCache;
};

const getChineseLexicon = () => {
  if (!chineseLexiconCache) {
    chineseLexiconCache = Array.from(
      new Set(
        [
          ...flattenDictionaryRecord(commonNames),
          ...flattenDictionaryRecord(commonPhrases),
          ...flattenDictionaryRecord(idiomPhrases),
          ...flattenDictionaryRecord(geographyPhrases),
          ...flattenDictionaryRecord(strokePhrases),
          ...nameSet,
        ]
          .map((word) => normalizeText(word))
          .filter((word) => Boolean(word) && word.length <= 6),
      ),
    );
  }

  return chineseLexiconCache;
};

/**
 * 计算编辑距离，用于将 OCR 结果与词库做近似匹配。
 */
const calculateEditDistance = (source: string, target: string) => {
  if (source === target) {
    return 0;
  }

  const rows = source.length + 1;
  const columns = target.length + 1;
  const matrix = Array.from({ length: rows }, () =>
    new Array<number>(columns).fill(0),
  );

  for (let row = 0; row < rows; row += 1) {
    matrix[row][0] = row;
  }

  for (let column = 0; column < columns; column += 1) {
    matrix[0][column] = column;
  }

  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      const substitutionCost = source[row - 1] === target[column - 1] ? 0 : 1;

      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + substitutionCost,
      );
    }
  }

  return matrix[rows - 1][columns - 1];
};

const createRankedCandidateMap = () => {
  return new Map<string, RankedCandidate>();
};

const pushRankedCandidate = (
  candidateMap: Map<string, RankedCandidate>,
  text: string,
  confidence: number,
  score: number,
) => {
  const normalized = normalizeText(text);

  if (!normalized) {
    return;
  }

  const current = candidateMap.get(normalized);

  if (!current || current.score < score) {
    candidateMap.set(normalized, {
      text: normalized,
      confidence,
      score,
    });
  }
};

const boostChineseCandidateScore = (text: string, confidence: number) => {
  const lexicon = getChineseLexicon();
  let score = confidence;

  if (lexicon.includes(text)) {
    score += text.length >= 2 ? 28 : 10;
  }

  if (nameSet.includes(text)) {
    score += 18;
  }

  if (/^[一-龥]+$/.test(text) && text.length >= 2) {
    score += 6;
  }

  return score;
};

const getClosestLexiconWord = (
  sourceText: string,
  lexicon: string[],
  maxDistance: number,
  shouldMatch: (candidate: string) => boolean,
) => {
  let bestMatch: { word: string; distance: number } | null = null;

  lexicon.forEach((word) => {
    if (!shouldMatch(word)) {
      return;
    }

    const distance = calculateEditDistance(sourceText, word);

    if (distance > maxDistance) {
      return;
    }

    if (
      !bestMatch ||
      distance < bestMatch.distance ||
      (distance === bestMatch.distance && word.length < bestMatch.word.length)
    ) {
      bestMatch = {
        word,
        distance,
      };
    }
  });

  return bestMatch;
};

const applyEnglishCorrections = (
  candidate: Candidate,
  candidateMap: Map<string, RankedCandidate>,
) => {
  const normalizedText = candidate.text.toLowerCase();
  const lexicon = getEnglishLexicon();
  const baseScore = candidate.confidence;

  pushRankedCandidate(
    candidateMap,
    normalizedText,
    candidate.confidence,
    baseScore,
  );

  if (lexicon.includes(normalizedText)) {
    pushRankedCandidate(
      candidateMap,
      normalizedText,
      candidate.confidence,
      baseScore + 24,
    );
    return;
  }

  const closestWord = getClosestLexiconWord(
    normalizedText,
    lexicon,
    normalizedText.length <= 4 ? 1 : ENGLISH_CORRECTION_MAX_DISTANCE,
    (word) => Math.abs(word.length - normalizedText.length) <= 2,
  );

  if (closestWord) {
    const correctionScore =
      baseScore +
      18 -
      closestWord.distance * 6 +
      (closestWord.word.length === normalizedText.length ? 4 : 0);

    pushRankedCandidate(
      candidateMap,
      closestWord.word,
      candidate.confidence,
      correctionScore,
    );
  }
};

const applyChineseCorrections = (
  candidate: Candidate,
  candidateMap: Map<string, RankedCandidate>,
) => {
  const normalizedText = candidate.text;
  const baseScore = boostChineseCandidateScore(
    normalizedText,
    candidate.confidence,
  );
  const lexicon = getChineseLexicon();

  pushRankedCandidate(
    candidateMap,
    normalizedText,
    candidate.confidence,
    baseScore,
  );

  const closestWord = getClosestLexiconWord(
    normalizedText,
    lexicon,
    normalizedText.length >= 3 ? CHINESE_CORRECTION_MAX_DISTANCE : 0,
    (word) => Math.abs(word.length - normalizedText.length) <= 1,
  );

  if (closestWord) {
    const correctionScore =
      boostChineseCandidateScore(closestWord.word, candidate.confidence) +
      14 -
      closestWord.distance * 8;

    pushRankedCandidate(
      candidateMap,
      closestWord.word,
      candidate.confidence,
      correctionScore,
    );
  }
};

const collectCandidates = (
  result: RecognizeResult,
  language: 'eng' | 'chi',
) => {
  const candidates: Candidate[] = [];
  const pushCandidate = (text: string, confidence: number) => {
    const normalized = normalizeText(text);

    if (!normalized) return;
    if (language === 'eng' && !/^[A-Za-z0-9]+$/.test(normalized)) return;
    if (language === 'chi' && normalized.length > 4) return;

    candidates.push({
      text: normalized,
      confidence,
      language,
    });
  };

  pushCandidate(result.data.text ?? '', result.data.confidence ?? 0);

  result.data.words?.forEach((word) => {
    pushCandidate(word.text ?? '', word.confidence ?? 0);
  });

  result.data.symbols?.forEach((symbol) => {
    pushCandidate(symbol.text ?? '', symbol.confidence ?? 0);
  });

  return candidates;
};

const rankCandidates = (
  candidates: Candidate[],
  recognitionMode: 'en' | 'zh' | 'auto',
) => {
  const candidateMap = createRankedCandidateMap();

  candidates.forEach((candidate) => {
    if (recognitionMode === 'en' || candidate.language === 'eng') {
      applyEnglishCorrections(candidate, candidateMap);
      return;
    }

    applyChineseCorrections(candidate, candidateMap);
  });

  return Array.from(candidateMap.values())
    .sort((prev, next) => {
      if (next.score !== prev.score) {
        return next.score - prev.score;
      }

      if (next.confidence !== prev.confidence) {
        return next.confidence - prev.confidence;
      }

      return prev.text.length - next.text.length;
    })
    .map((item) => item.text);
};

/**
 * 增强版图片转文字方法。
 * 通过图像预处理、单语言 worker、页面分段模式和结果排序，
 * 提升虚拟手写键盘场景下的识别率。
 */
export async function imgToWordV1(
  img: string,
  options?: VKB.ImageRecognitionOptions,
): Promise<string[]> {
  const workers = await initWorkers();
  const variants = await createPreprocessedVariants(img);
  const recognitionMode = resolveRecognitionMode(options);

  const engResultsPromise =
    recognitionMode === 'zh'
      ? Promise.resolve([] as Candidate[][])
      : Promise.all(
          variants.map(async (variant) => {
            const result = await workers.eng.recognize(variant);
            return collectCandidates(result, 'eng');
          }),
        );

  const chiResultsPromise =
    recognitionMode === 'en'
      ? Promise.resolve([] as Candidate[][])
      : Promise.all(
          variants.map(async (variant) => {
            const result = await workers.chi.recognize(variant);
            return collectCandidates(result, 'chi');
          }),
        );

  const [engResults, chiResults] = await Promise.all([
    engResultsPromise,
    chiResultsPromise,
  ]);

  return rankCandidates(
    [...chiResults.flat(), ...engResults.flat()],
    recognitionMode,
  ).slice(0, MAX_CANDIDATE_COUNT);
}

export function imgToWordV2(
  img: string,
  options?: VKB.ImageRecognitionOptions,
): Promise<string[]> {
  return imgToWordV1(img, options);
}
