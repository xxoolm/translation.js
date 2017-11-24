import {
  // @ts-ignore
  ITranslateOptions,
  TStringOrTranslateOptions,
  ILanguageList
} from './interfaces'
import { ERROR_CODE } from './constant'

/** 反转对象 */
export function invert(obj: ILanguageList) {
  const result: ILanguageList = {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[obj[key]] = key
    }
  }
  return result
}

/**
 * 安全的获取一个变量上指定路径的值
 * @param obj
 * @param {string | string[]} pathArray
 * @param defaultValue
 * @return {any}
 */
export function getValue(
  obj: any,
  pathArray: string | string[],
  defaultValue?: any
) {
  if (obj == null) return defaultValue

  if (typeof pathArray === 'string') {
    pathArray = [pathArray]
  }

  let value = obj

  for (let i = 0; i < pathArray.length; i += 1) {
    const key = pathArray[i]
    value = value[key]
    if (value == null) {
      return defaultValue
    }
  }

  return value
}

export class TranslatorError extends Error {
  readonly code: ERROR_CODE

  constructor(code: ERROR_CODE, message?: string) {
    super(message)
    this.code = code
  }
}

export function transformOptions(options: TStringOrTranslateOptions) {
  if (typeof options === 'string') {
    return {
      text: options
    }
  }
  return options
}
