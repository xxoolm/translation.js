import md5 from '../adapters/md5/node'
import request from '../adapters/http/node'
import {
  ITranslateOptions, // tslint:disable-line:no-unused-variable
  ILanguageList,
  ITranslateResult,
  TStringOrTranslateOptions
} from '../interfaces'
import { invert, TranslatorError, transformOptions } from '../utils'
import { ERROR_CODE } from '../constant'

interface IResponse {
  errorCode: number
  smartResult?: {
    entries: string[]
    type: number
  }
  translateResult: [
    {
      src: string
      tgt: string
    }[]
    ]
  type: string
}

const link = 'https://fanyi.youdao.com'
const translateAPI = link + '/translate_o?smartresult=dict&smartresult=rule'

const languageList: ILanguageList = {
  en: 'en',
  ru: 'ru',
  pt: 'pt',
  es: 'es',
  'zh-CN': 'zh-CHS',
  ja: 'ja',
  ko: 'ko',
  fr: 'fr'
}

const client = 'fanyideskweb'
const sk = 'rY0D^0\'nM0}g5Mm1z%1G4'

/**
 * 有道翻译接口的签名算法
 * @param {string} text
 * @return {{client: string, salt: number, sign: string}}
 */
function sign (text: string) {
  const salt = Date.now() + parseInt(String(10 * Math.random()), 10)
  return {
    client,
    salt,
    sign: md5(client + text + salt + sk)
  }
}

const languageListInvert = invert(languageList)

function translate (options: TStringOrTranslateOptions) {
  let { text, from, to } = transformOptions(options)

  text = text.slice(0, 5000)

  if (from) {
    from = languageList[from]
  } else {
    from = 'AUTO'
  }

  if (to) {
    to = languageList[to]
  } else {
    to = 'AUTO'
  }

  // 有道网页翻译的接口的语种与目标语种中必须有一个是中文
  if (!((from === 'AUTO' && to === 'AUTO') || (from === 'zh-CHS' || to === 'zh-CHS'))) {
    return Promise.reject(new TranslatorError(ERROR_CODE.UNSUPPORTED_LANG, '有道翻译的源语种与目标语种中必须有一个是中文，或者两个都是 AUTO'))
  }

  return request({
    method: 'post',
    url: translateAPI,
    type: 'form',
    body: Object.assign(sign(text), {
      i: text,
      from,
      to,
      smartresult: 'dict',
      doctype: 'json',
      version: '2.1',
      keyfrom: 'fanyi.web',
      action: 'FY_BY_REALTIME',
      typoResult: 'true'
    }),
    // tslint:disable-next-line:strict-type-predicates
    headers: typeof window === 'undefined'
      ? { Referer: link }
      : undefined
  }).then((body: IResponse) => {
    if (body.errorCode !== 0) {
      throw new TranslatorError(ERROR_CODE.API_SERVER_ERROR, '有道翻译接口出错了')
    }

    let [from, to] = body.type.split('2')
    from = languageListInvert[from]
    to = languageListInvert[to]

    const { smartResult } = body

    const result: ITranslateResult = {
      raw: body,
      text,
      from,
      to,
      link: smartResult
        ? `https://dict.youdao.com/search?q=${encodeURIComponent(text)}&keyfrom=fanyi.smartResult`
        : `http://fanyi.youdao.com/translate?i=${encodeURIComponent(text)}`
    }

    if (smartResult) {
      try {
        result.dict = smartResult.entries.filter(s => s).map(s => s.trim())
      } catch (e) {}
    }

    try {
      result.result = body.translateResult[0].map(o => o.tgt.trim())
    } catch (e) {}

    return result
  })
}

function detect (options: TStringOrTranslateOptions) {
  const { text } = transformOptions(options)
  return translate(text).then(result => {
    const { from } = result
    if (!from) {
      throw new TranslatorError(ERROR_CODE.UNSUPPORTED_LANG, '有道翻译不支持这个语种')
    }
    return from
  })
}

function audio (options: TStringOrTranslateOptions) {
  const { text, from } = transformOptions(options)
  return new Promise((res, rej) => {
    if (from) {
      res(from)
    } else {
      detect(text).then(res, rej)
    }
  }).then((from: string) => {
    return `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=${languageList[from]}`
  })
}

export default {
  id: 'youdao',
  translate,
  detect,
  audio
}
