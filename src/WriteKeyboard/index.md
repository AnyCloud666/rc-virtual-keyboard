---
order: 4
toc: content
group:
  title: 基础
  order: 0
nav:
  title: 组件
  order: 1
  second:
    title: 手写键
    order: 1
---

# 手写键

手写识别，采用了 `tesseract.js` 进行 `OCR` 识别

或

将书写的图片进行导出，采用第三方进行识别...，你需要实现 `onImg2Word:(imgUrl: string) => Promise<string[]>` 方法

```jsx
import { WriteKeyboard, useInput, keys } from 'react-virtual-keyboard';

export default () => {
  const { words, onDraw, onClick, onSelectWord } = useInput({
    defaultActiveKeyboard: keys.writeType,
  });
  return (
    <>
      <input style={{ marginBottom: 50 }} />
      <div style={{ width: 500, height: 320, margin: '0 auto' }}>
        <WriteKeyboard
          words={words}
          onDraw={onDraw}
          onSelectWord={onSelectWord}
          onClick={onClick}
        />
      </div>
    </>
  );
};
```

## 属性

| 属性                          | 说明                           | 类型                                                                                                                                                                                                                                                                                                                                                                                                          | 默认值 |
| ----------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| style                         | 外部传入的样式，作用于整个容器 | CSSProperties                                                                                                                                                                                                                                                                                                                                                                                                 | -      |
| styles                        | 外部传入的样式，作用于单个容器 | {writeContent?: CSSProperties; writeContentCanvas?: CSSProperties; writeContentTips?: CSSProperties; writeControl?: CSSProperties; writeControlBackspace?: CSSProperties; writeControlEnter?: CSSProperties; writeKeyboardTemp?: CSSProperties; writeKeyboardTempLeft?: CSSProperties; writeKeyboardTempList?: CSSProperties; writeKeyboardTempChar?: CSSProperties; writeKeyboardTempRight?: CSSProperties;} | -      |
| styles.writeContent           | 书写区域                       | CSSProperties                                                                                                                                                                                                                                                                                                                                                                                                 | -      |
| styles.writeContentCanvas     | 书写区域内部 canvas            | CSSProperties                                                                                                                                                                                                                                                                                                                                                                                                 | -      |
| styles.writeContentTips       | 内容提示                       | CSSProperties                                                                                                                                                                                                                                                                                                                                                                                                 | -      |
| styles.writeControl           | 书写控制区                     | CSSProperties                                                                                                                                                                                                                                                                                                                                                                                                 | -      |
| styles.writeControlBackspace  | 删除键                         | CSSProperties                                                                                                                                                                                                                                                                                                                                                                                                 | -      |
| styles.writeControlEnter      | 回车键                         | CSSProperties                                                                                                                                                                                                                                                                                                                                                                                                 | -      |
| styles.writeKeyboardTemp      | 手写识别到的临时区域           | CSSProperties                                                                                                                                                                                                                                                                                                                                                                                                 | -      |
| styles.writeKeyboardTempLeft  | 左侧翻页                       | CSSProperties                                                                                                                                                                                                                                                                                                                                                                                                 | -      |
| styles.writeKeyboardTempRight | writeKeyboardTempRight         | CSSProperties                                                                                                                                                                                                                                                                                                                                                                                                 | -      |
| styles.writeKeyboardTempList  | 识别到的字符列表               | CSSProperties                                                                                                                                                                                                                                                                                                                                                                                                 | -      |
| styles.writeKeyboardTempChar  | 识别到的字符                   | CSSProperties                                                                                                                                                                                                                                                                                                                                                                                                 | -      |

## 方法

| 方法    | 说明     | 类型                                   | 默认值 |
| ------- | -------- | -------------------------------------- | ------ |
| onClick | 点击事件 | (e: VKB.KeyboardAttributeType) => void | -      |
| onDraw  | 绘制图像 | (img: string) => void                  | -      |

## 支持的样式 token

| token                         | 说明             | 类型   | 默认值  |
| ----------------------------- | ---------------- | ------ | ------- |
| --vkb-key-gap                 | 间隔             | string | 6px     |
| --vkb-key-border-width        | 按键边框线宽度   | string | 1px     |
| --vkb-keyboard-svg-size       | 内部 svg 大小    | string | 26px    |
| --vkb-key-shadow-width        | 按键 shadow 宽度 | string | 4px     |
| --vkb-key-borer-radius        | 按键圆角         | string | 4px     |
| --vkb-key-background          | 按键背景色       | string | #ffffff |
| --vkb-key-border-color        | 按键边框颜色     | string | #f0f0f0 |
| --vkb-key-shadow-color        | 按键 shadow 颜色 | string | #f0f0f0 |
| --vkb-key-active-font-color   | 按键活动字体颜色 | string | #1677ff |
| --vkb-key-active-background   | 按键背活动景色   | string | #dce1e7 |
| --vkb-key-active-shadow-color | 按键活动 shadow  | string | #dce1e7 |
| --vkb-key-active-border-color | 按键活动边框颜色 | string | #dce1e7 |

## `tesseract` OCR 识别

你应该新启一个服务器作为 OCR 识别

原因加载这些文件实在耗时太久了,而且如果不是自己的 CDN，它会加载更久...

| 文件名                           | 作用        | 大小    |
| -------------------------------- | ----------- | ------- |
| worker.min.js                    | worker 加载 | 121kb   |
| tesseract-core-simd-lstm.wasm.js | 核心包      | 3847kb  |
| eng.traineddata.gz               | 英文识别    | 10668kb |
| chi_sim.traineddata.gz           | 中文识别    | 19688kb |

### `imgToWordV1` 是这样调用`OCR`的

你需要转移到 `node` 中，作为接口进行调用，防止每次加载不必要的文件

```js
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
```
