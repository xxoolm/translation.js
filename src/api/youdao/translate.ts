import webAPI from './web'
import dict from './dict'
import { StringOrTranslateOptions, TranslateResult } from '../types'

export default async function(options: StringOrTranslateOptions) {
  // 先从网页翻译接口获取一般的翻译结果
  const webResult = await webAPI(options)

  try {
    Object.assign(
      webResult,
      await dict(
        typeof options === 'string' ? options : options.text,
        webResult.from,
        webResult.to
      )
    )
  } catch (e) {}

  return webResult
}
