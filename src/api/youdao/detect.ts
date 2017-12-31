import webAPI from './web'
import { StringOrTranslateOptions } from '../types'

export default async function(options: StringOrTranslateOptions) {
  const result = await webAPI(
    typeof options === 'string' ? options : options.text
  )
  return result.from
}
