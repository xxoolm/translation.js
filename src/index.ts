import { IAPI, ITranslateResult, TStringOrTranslateOptions } from './interfaces'
import baidu from './api/baidu'
import youdao from './api/youdao'
import google from './api/google'
import { ERROR_CODE } from './constant'
import { transformOptions, TranslatorError } from './utils'

const defaultAPI = 'google'

const apis: { [apiId: string]: IAPI } = {}

add(baidu)
add(youdao)
add(google)

function getAPI (id: string) {
  return apis[id]
}

function add (api: IAPI) {
  apis[api.id] = api
}

function call (method: 'translate' | 'detect' | 'audio', options: TStringOrTranslateOptions) {
  const { api: apiID = defaultAPI } = transformOptions(options)
  const api = getAPI(apiID)
  if (api) {
    const func = api[method]
    if (func) {
      return func.call(api, options)
    } else {
      return Promise.reject(new TranslatorError(ERROR_CODE.NO_THIS_METHOD, `${apiID} 不支持 ${method} 方法。`))
    }
  } else {
    return Promise.reject(new TranslatorError(ERROR_CODE.NO_THIS_API, `找不到 "${apiID}" 接口。`))
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
