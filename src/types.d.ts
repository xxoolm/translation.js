/**
 * 当前是否是 Node.js 运行环境。
 * 打包时会替换成正确的值。
 */
declare const IS_NODE: boolean

/** 键和值都是字符串的对象 */
interface StringObject {
  [prop: string]: string
}

/** 单个音标的数据结构 */
interface Phonetic {
  name: string // 语种的中文名称
  ttsURI: string // 此音标对应的语音地址
  value: string // 此语种对应的音标值
}

/** 统一的查询结果的数据结构 */
interface TranslateResult {
  text: string // 此次查询的文本
  raw: any // 翻译接口提供的原始的、未经转换的查询结果
  link: string // 此翻译接口的在线查询地址
  from: string // 由翻译接口提供的源语种，可能会与查询对象的 from 不同
  to: string // 由翻译接口提供的目标语种，注意可能会与查询对象的 to 不同
  phonetic?: string | Phonetic[] // 若有多个音标（例如美音和英音），则使用数组描述
  dict?: string[] // 如果查询的是英文单词，有的翻译接口（例如有道翻译）会返回这个单词的详细释义
  result?: string[] // 翻译结果，可以有多条（一个段落对应一个翻译结果）；如果已经有 dict 了则不会有
}

/** 统一的查询参数结构 */
interface TranslateOptions {
  text: string
  // 待翻译文本的源语种
  from?: string
  // 想将文本翻译成哪个语种
  to?: string
}

/** 查询参数，既可以是字符串，也可以是对象 */
type StringOrTranslateOptions = string | TranslateOptions

interface StringArrayObject {
  [key: string]: string | string[]
}

interface RequestOptions {
  url: string
  query?: StringArrayObject
  method?: 'get' | 'post'
  body?: object
  type?: 'form' | 'json'
  headers?: StringObject
}
