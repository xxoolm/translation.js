import sign from './sign'
import seed from './seed'

/**
 * 获取查询百度网页翻译接口所需的 token 和 sign
 * @param text 要查询的文本
 */
export default function(text: string) {
  return seed().then(({ seed, token }) => ({
    token,
    sign: sign(text, seed)
  }))
}
