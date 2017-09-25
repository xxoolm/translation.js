import {
  ITranslateOptions, // tslint:disable-line:no-unused-variable
  IAPI,
  ITranslateResult,
  TStringOrTranslateOptions
} from './interfaces'
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
    return api[method](options)
  } else {
    return Promise.reject(new TranslatorError(ERROR_CODE.NO_THIS_API, `找不到 "${apiID}" 接口。`))
  }
}

export default {
  translate (options: TStringOrTranslateOptions) {
    return (call('translate', options) as Promise<ITranslateResult>)
  },
  detect (options: TStringOrTranslateOptions) {
    return (call('detect', options) as Promise<string>)
  },
  audio (options: TStringOrTranslateOptions) {
    return (call('audio', options) as Promise<string>)
  }
}
