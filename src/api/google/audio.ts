import { StringOrTranslateOptions } from '../types'
import { getRoot } from './state'
import detect from './detect'

export default async function(options: StringOrTranslateOptions) {
  let { text, from = '', com = false } =
    typeof options === 'string' ? { text: options } : options

  if (!from) {
    from = await detect(text)
  }

  return `${getRoot(
    com
  )}/translate_tts?ie=UTF-8&client=gtx&tl=${from}&q=${encodeURIComponent(text)}`
}
