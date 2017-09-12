import {
  ITranslateResult,
  ILanguageList,
  ISuperAgentResponseError,
  TStringOrTranslateOptions
} from '../Interfaces'
import { ERROR_CODE } from '../constant'
import { invert, transformSuperAgentError, TranslatorError, get, transformOptions } from '../utils'
import { post } from 'superagent'

// 百度语种检测接口返回的结构
interface IDetectResult {
  error: number
  message: string
  lan: string
}

interface IResponseSymbol {
  parts: {
    part: string // 单词属性，例如 'n.'、'vi.' 等
    means: string[] // 此单词属性下单词的释义
  }[]
  ph_am: string // 美国音标
  ph_en: string // 英国音标
}

// 将百度翻译接口的部分有用的数据标注出来
interface IResponse {
  dict_result: { // 针对英语单词会提供词典数据。若当前翻译没有词典数据，则这个属性是一个空数组
    simple_means?: {
      symbols: [IResponseSymbol] // 虽然这是一个数组，但是它一直都只有一个元素

      exchange: { // 单词的其他变形
        word_done: '' | string[] // 过去分词
        word_er: '' | string[]
        word_est: '' | string[]
        word_ing: '' | string[] // 现在分词
        word_past: '' | string[] // 过去式
        word_pl: '' | string[] // 复数
        word_proto?: string[] // 词根，偶尔没有
        word_third: '' | string[] // 第三人称单数
      }
    }
  }

  // 针对英语单词会提供牛津词典数据，暂时不用
  // liju_result: {
  //   double: string
  //   single: string
  //   tag: string[]
  // }

  trans_result: {
    data: {
      src: string
      dst: string
    }[]
    from: string
    to: string
  }
}

// http://api.fanyi.baidu.com/api/trans/product/apidoc#languageList
// 共 27 个，除去了百度特有的文言文（wyw）无法归类进去
const languageList: ILanguageList = {
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

const languageListInvert = invert(languageList)

const link = 'https://fanyi.baidu.com/'

function detect (options: TStringOrTranslateOptions) {
  const { text } = transformOptions(options)

  return post(link + 'langdetect')
    .send('query=' + text.slice(0, 73))
    .then(res => {
      const body = (res.body as IDetectResult)
      if (body.error === 0) {
        const iso689lang = languageListInvert[body.lan]
        if (iso689lang) return iso689lang
      }
      throw new TranslatorError(ERROR_CODE.UNSUPPORTED_LANG)
    }, (error: ISuperAgentResponseError) => {
      throw transformSuperAgentError(error)
    })
}

function getAudioURI (text: string, lang: string) {
  return link + `gettts?lan=${lang}&text=${encodeURIComponent(text)}&spd=3&source=web`
}

/**
 * 获取指定文本的网络语音地址
 * @param {string} options
 * @return {string|void}
 */
function audio (options: TStringOrTranslateOptions) {
  const { text, from } = transformOptions(options)

  return new Promise((res, rej) => {
    if (from) {
      res(from)
    } else {
      detect(text).then(res, rej)
    }
  }).then((from: string) => {
    if (from === 'en-GB') {
      return 'uk'
    } else {
      return languageList[from]
    }
  }).then((lang: string) => {
    if (lang) {
      return getAudioURI(text, lang)
    }
    throw new TranslatorError(ERROR_CODE.UNSUPPORTED_LANG)
  })
}

function translate (options: TStringOrTranslateOptions) {
  let { from, to, text } = transformOptions(options)

  return new Promise((res, rej) => {
    if (from) {
      res(from)
    } else {
      detect(text).then(res, rej)
    }
  }).then((from: string) => {
    return post(link + 'v2transapi')
      .type('form')
      .send({
        from: from && languageList[from] || 'auto',
        to: to && languageList[to] || 'zh', // 非标准接口一定要提供目标语种
        query: text,
        transtype: 'hash',
        simple_means_flag: 3
      })
  }).then(res => {
    const body = (res.body as IResponse)

    const transResult = body.trans_result
    const baiduFrom = get(transResult, 'from', 'auto')
    const baiduTo = get(transResult, 'to', 'auto')

    const result: ITranslateResult = {
      text,
      raw: body,
      link: link + `#${baiduFrom}/${baiduTo}/${encodeURIComponent(text)}`,
      from: languageListInvert[baiduFrom],
      to: languageListInvert[baiduTo]
    }

    const symbols: IResponseSymbol = get(body, ['dict_result', 'simple_means', 'symbols', '0'])

    if (symbols) {
      // region 解析音标
      const phonetic = []
      const { ph_am, ph_en } = symbols
      if (ph_am) {
        phonetic.push({
          name: '美',
          ttsURI: getAudioURI(text, 'en'),
          value: ph_am
        })
      }
      if (ph_en) {
        phonetic.push({
          name: '英',
          ttsURI: getAudioURI(text, 'en-GB'),
          value: ph_en
        })
      }
      if (phonetic.length) {
        result.phonetic = phonetic
      }
      // endregion

      // 解析词典数据
      try {
        result.dict = symbols.parts.map(part => {
          return part.part + ' ' + part.means.join('；')
        })
      } catch (e) {}
    }

    // 解析普通的翻译结果
    try {
      result.result = transResult.data.map(d => d.dst)
    } catch (e) {}

    return result
  })
}

export default {
  id: 'baidu',
  translate,
  detect,
  audio
}
