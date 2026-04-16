/**
 * 笔画拼音词典。
 *
 * 用于在 `pinyin2ChineseV2` 中支持“笔画名称拼音 -> 笔画符号”的候选。
 * 例如：
 * - heng -> 一
 * - shu -> 丨
 * - pie -> 丿
 * - dian -> 丶
 * - zhe -> 乛
 */
const strokePhrases: Record<string, string[]> = {
  heng: ['一', '㇐'],
  shu: ['丨', '㇑'],
  pie: ['丿', '㇒'],
  dian: ['丶', '㇔'],
  na: ['㇏'],
  zhe: ['乛', '乙', '𠃍', '㇕'],

  henggou: ['乛'],
  hengzhe: ['𠃍', '㇕'],
  hengzhezhe: ['㇋'],
  hengzhezhegou: ['㇅'],
  hengxiegou: ['㇂'],
  hengzhewan: ['㇈'],
  hengzheti: ['㇊'],

  shugou: ['亅', '㇚'],
  shuzhe: ['㇗'],
  shuzheti: ['㇄'],
  shuzhepie: ['㇉'],
  shuwangou: ['㇟'],

  piezhe: ['㇜'],
  piedian: ['乂'],
  piegou: ['㇓'],

  wangou: ['㇁'],
  xiegou: ['㇂'],
  wogou: ['㇃'],
  dingweigou: ['㇆'],
};

export default strokePhrases;
