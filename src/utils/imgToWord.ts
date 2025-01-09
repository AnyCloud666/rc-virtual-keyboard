import Tesseract from 'tesseract.js';

/**
 * 简易的图片转文字方法
 *
 * @export
 * @param {string} img
 * @return {*}  {Promise<string[]>}
 */
export function imgToWordV1(img: string): Promise<string[]> {
  return new Promise((resolve) => {
    const str: string[] = [];
    Promise.allSettled([
      Tesseract.recognize(img, 'chi_sim').then((result) => {
        console.log('result: ', result);
        result.data.words.forEach((item) => {
          str.push(item.text);
        });
      }),
      Tesseract.recognize(img).then((result) => {
        console.log('result: ', result);
        result.data.words.forEach((item) => {
          str.push(item.text);
        });
      }),
    ]).then(() => {
      resolve(str);
    });
  });
}

/**
 * TODO: 图片转文字方法
 *
 * @export
 * @param {string} img
 * @return {*}  {Promise<string[]>}
 */
export function imgToWordV2(img: string): Promise<string[]> {
  return Promise.resolve([]);
}
