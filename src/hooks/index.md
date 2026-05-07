---
order: 2
toc: content
group:
  title: hooks
  order: 3
nav:
  title: useInput
  order: 1
  second:
    title: useInput
    order: 0
---

# useInput

## 参数

| 参数                  | 说明                                                                        | 类型                                                     | 默认值                              |
| --------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------- |
| themeMode             | 主题模式                                                                    | string                                                   | -                                   |
| positionMode          | 位置模式                                                                    | string                                                   | -                                   |
| useKeydownAudio       | 使用按键音效                                                                | 'Y'\|'N'                                                 | 'Y'                                 |
| keydownAudioUrl       | 按键音效 url                                                                | string                                                   | 内置打包音频资源 |
| defaultActiveKeyboard | 默认选中的键盘                                                              | string                                                   | -                                   |
| focusShow             | 输入框获得焦点时是否自动显示键盘，全局关闭后可通过 `data-vkb-show` 单独开启 | boolean                                                  | true                                |
| autoPopup             | 键盘是否自动弹出(控制全局，元素 data-vkb-auto-popup 属性可单独控制)         | boolean                                                  | true                                |
| onEnter               | enter 方法回调                                                              | ()=>void                                                 | -                                   |
| onChange              | 输入回调                                                                    | (e: VKB.KeyboardAttributeType) => void                   | -                                   |
| onChangeShow          | 显示/隐藏                                                                   | (s: boolean) => void                                     | -                                   |
| onThemeModeChange     | 主题改变                                                                    | (mode: string) => void                                   | -                                   |
| onPositionModeChange  | 位置改变                                                                    | (mode: string) => void                                   | -                                   |
| onFunctionKey         | 功能键统一覆写入口，返回 true 阻止默认行为                                  | (context: VKB.FunctionKeyContext) => boolean \| void     | -                                   |
| functionKeyHandlers   | 按单个 `F1-F12` 覆写默认行为                                                | Partial<Record<FunctionKeyCode, FunctionKeyHandler>>     | -                                   |
| functionKeyDefaults   | 功能键默认行为配置                                                          | { helpUrl?: string; focusSelector?: string }             | -                                   |
| onPinyin2Chinese      | 拼音转汉字，自定义实现拼音转汉字，默认内置实现支持全拼、词组联想和首字母简拼 | (value: string) => { pinyin: string; chinese: string[] } | pinyin2ChineseV3                    |
| onImageToWord         | 图片转文字，自定义实现图片转文字，默认采用最简单的单字输入模式              | (image: string) => Promise<string[]>                     | imageToWordV1                       |

## 结果

| 名称              | 说明                                                                                        | 类型                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| inputMode         | 输入模式                                                                                    | string                                                                                           |
| inputValue        | 输入值                                                                                      | string                                                                                           |
| vkbThemeMode      | 主题模式                                                                                    | string                                                                                           |
| vkbPositionMode   | 位置模式                                                                                    | string                                                                                           |
| chinese           | 拼音转中文结果                                                                              | string[]                                                                                         |
| activeKeyboard    | 当前活动的键盘                                                                              | string                                                                                           |
| onClick           | 键盘的点击事件，必须实现                                                                    | (e: VKB.KeyboardAttributeType) => void                                                           |
| onKeyDown         | 键盘按下事件，可直接传给键盘组件补齐按键生命周期                                            | (e: VKB.KeyboardAttributeType) => void                                                           |
| onKeyUp           | 键盘抬起事件，可直接传给键盘组件补齐按键生命周期                                            | (e: VKB.KeyboardAttributeType) => void                                                           |
| onMouseDown       | 整个键盘的鼠标按下事件，整个键盘的触摸事件，用来对虚拟键盘进行移动,防止点击其他区域造成拖动 | ( e:React.MouseEvent\<HTMLDivElement, MouseEvent\>\| React.TouchEvent\<HTMLDivElement\>) => void |
| onSelectChinese   | 选择输入的中文                                                                              | (chinese: string)=>void                                                                          |
| onChangeInputMode | 切换输入模式                                                                                | (mode: VKB.InputMode)=>void                                                                      |
| setActiveKeyboard | 设置当前活动的键盘                                                                          | (active: string) => void                                                                         |

## 功能键覆写

- 默认会为 `F1-F12` 提供浏览器环境下可实现的行为，例如 `F5` 刷新、`F11` 全屏
- 业务可通过 `onFunctionKey` 做统一接管，通过 `functionKeyHandlers` 对单个键位精确接管
- 返回 `true` 表示已处理，阻止默认行为继续执行
- 额外会在 `window` 上派发可取消事件 `vkb:function-key`
