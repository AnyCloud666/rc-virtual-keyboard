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

| 参数                  | 说明                                                                | 类型                                                     | 默认值                              |
| --------------------- | ------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------- |
| themeMode             | 主题模式                                                            | string                                                   | -                                   |
| positionMode          | 位置模式                                                            | string                                                   | -                                   |
| useKeydownAudio       | 使用按键音效                                                        | 'Y'\|'N'                                                 | 'Y'                                 |
| keydownAudioUrl       | 按键音效 url                                                        | string                                                   | \/audio\/typing-sound-02-229861.mp3 |
| defaultActiveKeyboard | 默认选中的键盘                                                      | string                                                   | -                                   |
| autoPopup             | 键盘是否自动弹出(控制全局，元素 data-vkb-auto-popup 属性可单独控制) | boolean                                                  | true                                |
| onEnter               | enter 方法回调                                                      | ()=>void                                                 | -                                   |
| onChange              | 输入回调                                                            | (e: VKB.KeyboardAttributeType) => void                   | -                                   |
| onChangeShow          | 显示/隐藏                                                           | (s: boolean) => void                                     | -                                   |
| onThemeModeChange     | 主题改变                                                            | (mode: string) => void                                   | -                                   |
| onPositionModeChange  | 位置改变                                                            | (mode: string) => void                                   | -                                   |
| onPinyin2Chinese      | 拼音转汉字，自定义实现拼音转汉字，默认采用最简单的单字输入模式      | (value: string) => { pinyin: string; chinese: string[] } | pinyin2ChineseV1                    |
| onImageToWord         | 图片转文字，自定义实现图片转文字，默认采用最简单的单字输入模式      | (image: string) => Promise<string[]>                     | imageToWordV1                       |

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
| onMouseDown       | 整个键盘的鼠标按下事件，整个键盘的触摸事件，用来对虚拟键盘进行移动,防止点击其他区域造成拖动 | ( e:React.MouseEvent\<HTMLDivElement, MouseEvent\>\| React.TouchEvent\<HTMLDivElement\>) => void |
| onSelectChinese   | 选择输入的中文                                                                              | (chinese: string)=>void                                                                          |
| onChangeInputMode | 切换输入模式                                                                                | (mode: VKB.InputMode)=>void                                                                      |
| setActiveKeyboard | 设置当前活动的键盘                                                                          | (active: string) => void                                                                         |
