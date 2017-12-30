import { StringOrGoogleTranslateOptions } from './types'
import { getRoot } from './state'
import detect from './detect'

export default async function(options: StringOrGoogleTranslateOptions) {
  const { text, com = false } =
    typeof options === 'string' ? { text: options } : options

  return `${getRoot(com)}/translate_tts?ie=UTF-8&client=gtx&tl=${await detect(
    options
  )}&q=${encodeURIComponent(text)}`
}
