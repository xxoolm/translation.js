import { post } from 'superagent'
import {
  ILanguageList,
  ITranslateResult,
  TStringOrTranslateOptions,
  ITranslateOptions,
  ISuperAgentResponseError
} from '../interfaces'
import { invert, transformSuperAgentError, TranslatorError, transformOptions } from '../utils'
import { ERROR_CODE } from '../constant'

interface IResponse {
  errorCode: number
  smartResult?: {
    entries: string[]
    type: number
  }
  translateResult: {
    src: string
    tgt: string
  }[]
  type: string
}

// NodeJS 只需要一行代码：
// require('crypto').createHash('md5').update('text to hash').digest('hex')
const md5 = require('blueimp-md5')

const link = 'https://fanyi.youdao.com'
const translateAPI = link + '/translate_o?smartresult=dict&smartresult=rule&sessionFrom=null'

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
    return Promise.reject(new TranslatorError(ERROR_CODE.UNSUPPORTED_LANG))
  }

  const request = post(translateAPI)
    .type('form')
    .send(sign(text))
    .send({
      i: text,
      from,
      to,
      smartresult: 'dict',
      doctype: 'json',
      version: '2.1',
      keyfrom: 'fanyi.web',
      action: 'FY_BY_CLICKBUTTION',
      typoResult: 'true'
    })

  // 在 NodeJS 端才设置请求头，避免浏览器控制台输出错误信息
  if (typeof window === 'undefined') {
    // 必须要设置 Referer 才能查询到数据，
    // 由于浏览器不允许设置这个请求头，所以在扩展程序中需要用到 onBeforeSendHeaders 事件修改：
    // https://developer.chrome.com/extensions/webRequest#event-onBeforeSendHeaders
    request.set('Referer', link)
  }

  return request.then(res => {
    const body = res.body as IResponse

    let [from, to] = body.type.split('2')
    from = languageListInvert[from]
    to = languageListInvert[to]

    const result: ITranslateResult = {
      raw: body,
      text,
      from,
      to
    }

    const s = body.smartResult

    if (s) {
      result.link = `https://dict.youdao.com/search?q=${encodeURIComponent(text)}&keyfrom=fanyi.smartResult`
      try {
        result.dict = s.entries.filter(s => s).map(s => s.trim())
      } catch (e) {}
    } else {
      result.link = `http://fanyi.youdao.com/translate?i=${encodeURIComponent(text)}`
    }

    try {
      result.result = body.translateResult.map(o => o.tgt.trim())
    } catch (e) {}

    return result
  }, (error: ISuperAgentResponseError) => {
    throw transformSuperAgentError(error)
  })
}

function detect (options: TStringOrTranslateOptions) {
  const { text } = transformOptions(options)
  return translate(text).then(result => result.from)
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
    const lang = languageList[from]
    if (!lang) {
      throw new TranslatorError(ERROR_CODE.UNSUPPORTED_LANG)
    }
    return `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=${lang}`
  })
}

export default {
  id: 'youdao',
  translate,
  detect,
  audio
}
