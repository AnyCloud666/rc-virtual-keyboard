export type SimulateEventData = {
  bubbles?: boolean;
  cancelable?: boolean;
  data?: string;
  inputType?: string;
  key?: string;
  code?: string;
  keyCode?: number;
  which?: number;
  charCode?: number;
};

/**
 * 为事件对象补充只读属性
 *
 * @description
 * 浏览器中的部分事件字段是只读的，例如 keyCode、which。
 * 这里通过 getter 的方式覆盖这些字段，尽量让外部读取到的事件对象
 * 更接近 React / 业务代码原本预期的结构。
 */
function defineEventProperty(
  event: Event,
  key: keyof SimulateEventData,
  value: SimulateEventData[keyof SimulateEventData],
) {
  if (typeof value === 'undefined') return;

  try {
    Object.defineProperty(event, key, {
      configurable: true,
      get: () => value,
    });
  } catch (error) {
    // Ignore readonly property failures across browsers.
  }
}

/**
 * 创建基础事件对象
 *
 * @description
 * 对于 input 事件，优先使用 InputEvent，尽量保留更接近原生输入行为的事件形态；
 * 其余基础事件则退回到普通 Event。
 */
function createBaseEvent(type: string, data: SimulateEventData = {}) {
  if (type === 'input' && typeof InputEvent !== 'undefined') {
    return new InputEvent(type, {
      bubbles: data.bubbles ?? true,
      cancelable: data.cancelable ?? true,
      data: data.data,
      inputType: data.inputType,
    });
  }

  return new Event(type, {
    bubbles: data.bubbles ?? true,
    cancelable: data.cancelable ?? true,
  });
}

/**
 * 创建键盘事件对象
 *
 * @description
 * 除了构造 KeyboardEvent 本身，还会补齐 keyCode / which / charCode，
 * 兼容依赖旧字段的组件逻辑。
 */
function createKeyboardEvent(type: string, data: SimulateEventData = {}) {
  const event = new KeyboardEvent(type, {
    bubbles: data.bubbles ?? true,
    cancelable: data.cancelable ?? true,
    key: data.key,
    code: data.code,
  });

  defineEventProperty(event, 'keyCode', data.keyCode);
  defineEventProperty(event, 'which', data.which ?? data.keyCode);
  defineEventProperty(event, 'charCode', data.charCode);

  return event;
}

/**
 * 派发模拟事件
 *
 * @description
 * 统一收口 input / change / keyboard 事件的创建与派发逻辑，
 * 保证不同类型事件的构造规则一致。
 */
function dispatchEvent(
  target: HTMLInputElement,
  type: string,
  data?: SimulateEventData,
) {
  const event =
    type === 'keydown' || type === 'keyup' || type === 'keypress'
      ? createKeyboardEvent(type, data)
      : createBaseEvent(type, data);

  target.dispatchEvent(event);
}

/**
 * 使用原生 setter 更新 input 的值
 *
 * @description
 * React 对输入框 value 的跟踪依赖原生 setter。
 * 相比直接赋值 target.value，调用原型链上的 setter
 * 更容易让 React 受控组件、antd InputNumber、Form 等场景正确感知值变化。
 */
export function setNativeInputValue(target: HTMLInputElement, value: string) {
  const ownDescriptor = Object.getOwnPropertyDescriptor(target, 'value');
  const prototype = Object.getPrototypeOf(target);
  const prototypeDescriptor = Object.getOwnPropertyDescriptor(
    prototype,
    'value',
  );
  const setter = prototypeDescriptor?.set ?? ownDescriptor?.set;

  if (setter) {
    setter.call(target, value);
    return;
  }

  target.value = value;
}

/**
 * 模拟事件工具
 *
 * @description
 * 用于替代 react-dom/test-utils 中的 Simulate。
 * 当前只实现项目实际用到的 input、change、keypress、keydown、keyup。
 */
export const Simulate = {
  change(target: HTMLInputElement, data?: SimulateEventData) {
    dispatchEvent(target, 'change', data);
  },
  input(target: HTMLInputElement, data?: SimulateEventData) {
    dispatchEvent(target, 'input', data);
  },
  keyPress(target: HTMLInputElement, data?: SimulateEventData) {
    dispatchEvent(target, 'keypress', data);
  },
  keyDown(target: HTMLInputElement, data?: SimulateEventData) {
    dispatchEvent(target, 'keydown', data);
  },
  keyUp(target: HTMLInputElement, data?: SimulateEventData) {
    dispatchEvent(target, 'keyup', data);
  },
};
