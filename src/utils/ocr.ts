import Tesseract, { createWorker } from 'tesseract.js';

let workerEng: Tesseract.Worker;
let workerCh: Tesseract.Worker;
async function init() {
  workerEng = await createWorker('eng', 1, {
    corePath: '/tesseract-core-simd-lstm.wasm.js',
    workerPath: '/worker.min.js',
    langPath: '/',
  });
  workerCh = await createWorker('chi_sim', 1, {
    corePath: '/tesseract-core-simd-lstm.wasm.js',
    workerPath: '/worker.min.js',
    langPath: '/',
  });
}
init();

/**
 * 图片转字符
 *
 * @param {string} imgUrl
 * @return {*}
 */
async function imgToWordV1(imgUrl: string) {
  const tempResult = await Promise.allSettled([
    workerEng.recognize(imgUrl),
    workerCh.recognize(imgUrl),
  ]);
  const result: string[] = [];

  tempResult.forEach((item) => {
    if (item.status === 'fulfilled') {
      item?.value?.data?.words?.forEach((word) => {
        result.push(word?.text);
      });
    }
  });

  return result;
}

export default imgToWordV1;
