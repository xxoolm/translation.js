import { StringObject } from '../../types'
import invert from '../../utils/invert'
export const root = 'https://fanyi.baidu.com'
// 写死一个 Cookie 供 Node.js 端使用；浏览器端自带这个 Cookie 所以无需处理
export const Cookie = 'BAIDUID=0F8E1A72A51EE47B7CA0A81711749C00:FG=1;'

/**
 * 百度支持的语种到百度自定义的语种名的映射，去掉了文言文。
 * @see http://api.fanyi.baidu.com/api/trans/product/apidoc#languageList
 */
export const standard2custom: StringObject = {
  en: 'en',
  th: 'th',
  ru: 'ru',
  pt: 'pt',
  el: 'el',
  nl: 'nl',
  pl: 'pl',
  bg: 'bul',
  et: 'est',
  da: 'dan',
  fi: 'fin',
  cs: 'cs',
  ro: 'rom',
  sl: 'slo',
  sv: 'swe',
  hu: 'hu',
  de: 'de',
  it: 'it',
  'zh-CN': 'zh',
  'zh-TW': 'cht',
  // 'zh-HK': 'yue',
  ja: 'jp',
  ko: 'kor',
  es: 'spa',
  fr: 'fra',
  ar: 'ara'
}

/** 百度自定义的语种名到标准语种名的映射 */
export const custom2standard = invert(standard2custom)
