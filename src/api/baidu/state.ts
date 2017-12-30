import invert from '../../utils/invert'
export const root = 'https://fanyi.baidu.com'
// TODO: 暂时先写死一个 Cookie，后面有时间了改为在百度接口返回 997 错误码的时候自动获取。
// 在浏览器端，如果用户的浏览器中没有这个 Cookie，则第一次请求接口时会报错，但第二次开始会正常，
// 因为目前每次请求接口前都会先访问 fanyi.baidu.com，第一次请求接口时访问 fanyi.baidu.com 时就有 Cookie 了，
// 第二次请求接口时访问 fanyi.baidu.com 就会给正确的 token
export const Cookie = 'BAIDUID=0F8E1A72A51EE47B7CA0A81711749C00:FG=1;'

/** 百度支持的语种到百度自定义的语种名的映射 */
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
  // zh: 'zh',
  'zh-CN': 'zh',
  'zh-TW': 'cht',
  'zh-HK': 'yue',
  ja: 'jp',
  ko: 'kor',
  es: 'spa',
  fr: 'fra',
  ar: 'ara'
}

/** 百度自定义的语种名到标准语种名的映射 */
export const custom2standard = invert(standard2custom)
