/**
 * 浏览器原生就不适合接管的 input 类型。
 *
 * 这类输入框通常具备独立的原生交互模型，例如日期选择器、
 * 文件选择器、单选框等，虚拟键盘不应直接修改它们的值。
 */
export const INVALID_INPUT_TYPES = [
  'week',
  'month',
  'time',
  'datetime-local',
  'date',
  'datetime',
  'submit',
  'reset',
  'range',
  'radio',
  'image',
  'hidden',
  'file',
  'color',
  'checkbox',
  'button',
];

/**
 * 可以直接使用虚拟键盘接管输入的常规文本类型。
 *
 * 这些类型通常支持 selectionStart / selectionEnd，
 * 也更适合通过插入字符的方式模拟真实输入。
 */
export const EFFECTIVE_INPUT_TYPES = [
  'text',
  'search',
  'tel',
  'password',
  'url',
];

/**
 * 需要额外兼容处理的输入类型。
 *
 * 例如 `number`、`email` 在不同浏览器或组件库中，
 * 对光标、选区和输入事件的支持不完全一致，因此这里单独标记，
 * 方便在 `useInput` 中走定制逻辑。
 */
export const NEED_HANDLE_INPUT_TYPES = ['number', 'email'];
