import dictionaries from "../lib/dictionaries";

/** 获取单个汉字 */
export function getSingleChinese(pinyin: string) {
  return (dictionaries as Record<string, string>)[pinyin];
}

/** 拼音转汉字 */
export function pinyin2ChineseV1(pinyin: string) {
  let chinese = getSingleChinese(pinyin);

  if (chinese) {
    return {
      pinyin,
      chinese: chinese.split(""),
    };
  }

  let temp = "";

  for (let i = 0, len = pinyin.length; i < len; i++) {
    temp += pinyin[i];

    chinese = getSingleChinese(temp);

    if (!chinese) continue;

    // flag表示如果当前能匹配到结果、并且往后5个字母不能匹配结果，因为最长可能是5个字母，如 zhuang

    let flag = false;

    if (i + 1 < pinyin.length) {
      for (let j = 1, len = pinyin.length; j <= 5 && i + j < len; j++) {
        if (getSingleChinese(pinyin.substr(0, i + j + 1))) {
          flag = true;
          break;
        }
      }
    }

    if (!flag) {
      return {
        pinyin: pinyin.substr(0, i + 1) + "'" + pinyin.substr(i + 1),
        chinese: chinese.split(""),
      };
    }
  }

  // 理论上一般不会出现这种情况
  return {
    pinyin: "",
    chinese: [],
  };
}
