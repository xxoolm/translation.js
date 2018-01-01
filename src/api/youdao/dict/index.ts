import request from '../../../utils/make-request'
import transform from './transform'
// 词典用的语种跟语音接口的一样
import { standard2custom } from '../audio'
import getError, { ERROR_CODE } from '../../../utils/error'

const langs = ['ko', 'eng', 'fr', 'jap']

export default async function(text: string, from: string, to: string) {
  // from 和 to 必须有且仅有一个是 zh-CN，另一个必须是 ko、eng、fr、jap 中的其中一个
  const fromIsZh = from === 'zh-CN'
  const toIsZh = to === 'zh-CN'
  if ((fromIsZh && toIsZh) || (!fromIsZh && !toIsZh)) {
    throw getError(ERROR_CODE.UNSUPPORTED_LANG)
  }
  const dist = standard2custom[fromIsZh ? to : from]
  if (langs.indexOf(dist) < 0) {
    throw getError(ERROR_CODE.UNSUPPORTED_LANG)
  }

  return transform(
    await request({
      url: `https://dict.youdao.com/w/${dist}/${encodeURIComponent(text)}`,
      responseType: 'document'
    })
  )
}
