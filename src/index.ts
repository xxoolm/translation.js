import { IAPI, ITranslateResult, TStringOrTranslateOptions } from './interfaces'
import baidu from './api/baidu'
import { ERROR_CODE } from './constant'
import { transformOptions, TranslatorError } from './utils'

interface IAPIS {
  [apiId: string]: IAPI[]
}

const apis: IAPIS = {}

add(baidu)

function getAPI (id: string) {
  const apiArr = apis[id]
  if (apiArr && apiArr.length) {
    const api = apiArr.shift()
    apiArr.push((api as IAPI))
    return api
  }
}

export {
  getAPI as get
}

export function add (api: IAPI) {
  const { id } = api
  const apiArr = apis[id] || (apis[id] = [])
  apiArr.push(api)
}

function call (method: 'translate' | 'detect' | 'audio', options: TStringOrTranslateOptions) {
  const { api: apiID } = transformOptions(options)
  const api = getAPI(apiID || 'baidu')
  if (api) {
    const func = api[method]
    if (func) {
      return func.call(api, options)
    } else {
      return Promise.reject(new TranslatorError(ERROR_CODE.NO_THIS_METHOD))
    }
  } else {
    return Promise.reject(new TranslatorError(ERROR_CODE.NO_THIS_API))
  }
}

export function translate (options: TStringOrTranslateOptions) {
  return (call('translate', options) as Promise<ITranslateResult>)
}

export function detect (options: TStringOrTranslateOptions) {
  return (call('detect', options) as Promise<string>)
}

export function audio (options: TStringOrTranslateOptions) {
  return (call('audio', options) as Promise<string>)
}
