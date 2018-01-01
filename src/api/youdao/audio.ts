import { StringOrTranslateOptions } from '../types'
import detect from './detect'
import { StringObject } from '../../types'
import getError, { ERROR_CODE } from '../../utils/error'

export const standard2custom: StringObject = {
  en: 'eng',
  ja: 'jap',
  ko: 'ko',
  fr: 'fr'
}

export default async function(options: StringOrTranslateOptions) {
  let { text, from = '' } =
    typeof options === 'string' ? { text: options } : options
  if (!from) {
    from = await detect(text)
  }
  const voiceLang = standard2custom[from]
  if (!voiceLang) throw getError(ERROR_CODE.UNSUPPORTED_LANG)
  return `http://tts.youdao.com/fanyivoice?word=${encodeURIComponent(
    text
  )}&le=${voiceLang}&keyfrom=speaker-target`
}
