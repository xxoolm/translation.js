import request from '../../../adapters/http/node'
import { TranslatorError } from '../../../utils'
import { ERROR_CODE } from '../../../constant'

const seedReg = /window\.gtk\s=\s'([^']+)';/
const tokenReg = /token:\s'([^']+)'/

export default function() {
  // 尚不清楚 gtk 和 token 多久变一次，暂时在每次请求时都解析一遍
  return request({
    url: 'https://fanyi.baidu.com',
    headers: {
      // 鸡贼的百度，需要带上 BAIDUUID 才会返回正确的 token；请求接口时也需要带上相同的 Cookie。
      // 在浏览器端应该不需要做额外设置，因为浏览器会自动保存 cookie，然后请求接口时自动带上。
      // 换了一个 IP 地址后也能用相同的 Cookie 请求，不过不清楚过期了是否还能继续用。
      Cookie: 'BAIDUID=0F8E1A72A51EE47B7CA0A81711749C00:FG=1;'
    }
  }).then((html: string) => {
    const seed = html.match(seedReg)
    if (seed) {
      const token = html.match(tokenReg)
      if (token) {
        return {
          seed: seed[1],
          token: token[1]
        }
      }
    }
    // 如果不能正确解析出 seed 和 token，则视为服务器错误
    throw new TranslatorError(ERROR_CODE.API_SERVER_ERROR)
  })
}
