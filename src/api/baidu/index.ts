import {
  // @ts-ignore
  ITranslateOptions,
  ITranslateResult,
  ILanguageList,
  TStringOrTranslateOptions
} from '../../interfaces'
import { ERROR_CODE } from '../../constant'
import {
  invert,
  TranslatorError,
  getValue,
  transformOptions
} from '../../utils'
import request from '../../adapters/http/node'
import sign from './sign'

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
  dict_result: {
    // 针对英语单词会提供词典数据。若当前翻译没有词典数据，则这个属性是一个空数组
    simple_means?: {
      symbols: [IResponseSymbol] // 虽然这是一个数组，但是它一直都只有一个元素

      exchange: {
        // 单词的其他变形
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

const link = 'https://fanyi.baidu.com'

function detect(options: TStringOrTranslateOptions) {
  const { text } = transformOptions(options)

  return request({
    method: 'post',
    url: link + '/langdetect',
    body: {
      query: text.slice(0, 73)
    },
    type: 'form'
  }).then((body: IDetectResult) => {
    if (body.error === 0) {
      const iso689lang = languageListInvert[body.lan]
      if (iso689lang) return iso689lang
    }
    throw new TranslatorError(
      ERROR_CODE.UNSUPPORTED_LANG,
      '百度翻译不支持这个语种'
    )
  })
}

function getAudioURI(text: string, lang: string) {
  return (
    link +
    `/gettts?lan=${lang}&text=${encodeURIComponent(text)}&spd=3&source=web`
  )
}

/**
 * 获取指定文本的网络语音地址
 * @param {string} options
 * @return {string|void}
 */
function audio(options: TStringOrTranslateOptions) {
  const { text, from } = transformOptions(options)

  return new Promise<string>((res, rej) => {
    if (from) {
      res(from)
    } else {
      detect(text).then(res, rej)
    }
  }).then(from => {
    let lang
    if (from === 'en-GB') {
      lang = 'uk'
    } else {
      lang = languageList[from]
    }
    return getAudioURI(text, lang)
  })
}

function translate(options: TStringOrTranslateOptions) {
  let { from, to, text } = transformOptions(options)

  return new Promise<string>((res, rej) => {
    if (from) {
      res(from)
    } else {
      detect(text).then(res, rej)
    }
  }).then(from => {
    return sign(text)
      .then(tokenAndSign => {
        return request({
          url: link + '/v2transapi',
          type: 'form',
          method: 'post',
          body: Object.assign(
            {
              from: 'en' || (from && languageList[from]) || 'auto',
              to: 'zh' || (to && languageList[to]) || 'zh', // 非标准接口一定要提供目标语种
              query: text,
              transtype: 'translang',
              simple_means_flag: 3
            },
            tokenAndSign
          ),
          headers: {
            // 请求接口时需要带上这两个请求头
            'X-Requested-With': 'XMLHttpRequest',
            Cookie: 'BAIDUID=0F8E1A72A51EE47B7CA0A81711749C00:FG=1;'
          }
        })
      })
      .then((body: IResponse) => {
        const transResult = body.trans_result
        const baiduFrom = getValue(transResult, 'from', 'auto')
        const baiduTo = getValue(transResult, 'to', 'auto')

        const result: ITranslateResult = {
          text,
          raw: body,
          link: link + `/#${baiduFrom}/${baiduTo}/${encodeURIComponent(text)}`,
          from: languageListInvert[baiduFrom],
          to: languageListInvert[baiduTo]
        }

        const symbols: IResponseSymbol = getValue(body, [
          'dict_result',
          'simple_means',
          'symbols',
          '0'
        ])

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
  })
}

export default {
  id: 'baidu',
  translate,
  detect,
  audio
}
