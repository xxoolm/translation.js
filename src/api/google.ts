import request from '../adapters/http/node'
import {
  ITranslateOptions, // tslint:disable-line:no-unused-variable
  ITranslateResult,
  TStringOrTranslateOptions
} from '../interfaces'
import { transformOptions } from '../utils'
import getGoogleToken from '../google-token'

function translate (options: TStringOrTranslateOptions) {
  const { text, from = 'auto', to = 'zh-CN', com } = transformOptions(options)

  return getGoogleToken(text, com)
    .then(tk => {
      return request({
        url: 'https://translate.google.' + (com ? 'com' : 'cn') + '/translate_a/single',
        query: {
          q: text,
          sl: from,
          tl: to,
          tk,
          client: 't',
          hl: 'zh-CN',
          dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
          ie: 'UTF-8',
          oe: 'UTF-8',
          otf: '2',
          ssel: '0',
          tsel: '0',
          kc: '1'
        }
      })
    })
    .then((body: any[]) => {
      const googleFrom = body[2]

      const result: ITranslateResult = {
        text,
        raw: body,
        from: googleFrom,
        to,
        link: `https://translate.google.${com ? 'com' : 'cn'}/#${googleFrom}/${to}/${encodeURIComponent(text)}`
      }

      try {
        result.dict = body[1].map((arr: any[]) => {
          return arr[0] + '：' + arr[1].join('，')
        })
      } catch (e) {}

      try {
        result.result = body[0]
          .map((arr: string[]) => arr[0])
          .filter((x: string) => x)
          .map((x: string) => x.trim())
      } catch (e) {}

      return result
    })
}

function detect (options: TStringOrTranslateOptions) {
  const { text } = transformOptions(options)
  return translate(text).then(result => result.from)
}

function audio (options: TStringOrTranslateOptions) {
  let { text, from, com } = transformOptions(options)
  return Promise.all([
    new Promise((resolve, reject) => {
      if (from) {
        resolve(from)
      } else {
        detect(text).then(resolve, reject)
      }
    }),
    getGoogleToken(text, com)
  ]).then(([lang, tk]) => {
    return `https://translate.google.${com
      ? 'com'
      : 'cn'}/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&total=1&idx=0&textlen=${text.length}&tk=${tk}&client=t`
  })
}

export default {
  id: 'google',
  translate,
  detect,
  audio
}
