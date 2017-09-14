import { get } from 'superagent'
import { ITranslateOptions, ITranslateResult } from '../interfaces'
import { transformSuperAgentError } from '../utils'
import getGoogleToken from '../google-token'

function translate (options: ITranslateOptions) {
  const { text, from, to, com } = options

  return getGoogleToken(text, com)
    .then(tk => {
      return get('https://translate.google.' + (com ? 'com' : 'cn') + '/translate_a/single')
        .query({
          q: text,
          sl: from || 'auto',
          tl: to || 'auto',
          tk
        })
        .query({
          client: 't',
          hl: 'zh-CN',
          dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
          ie: 'UTF-8',
          oe: 'UTF-8',
          otf: 2,
          ssel: 0,
          tsel: 0,
          kc: 1
        }).then(res => {
          // TODO
          return res.body as ITranslateResult
        }, error => {
          throw transformSuperAgentError(error)
        })
    })
}

// TODO
function detect () {
  return Promise.resolve('')
}

// TODO
function audio () {
  return Promise.resolve('')
}

export default {
  id: 'google',
  translate,
  detect,
  audio
}
