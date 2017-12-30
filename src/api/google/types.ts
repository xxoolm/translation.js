import { TranslateOptions } from '../types'

export interface GoogleTranslateOptions extends TranslateOptions {
  /** 是否调用谷歌国际版翻译接口 */
  com?: boolean
}

export type StringOrGoogleTranslateOptions = string | GoogleTranslateOptions
