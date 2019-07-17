import md5 from '../../../utils/md5'

const client = 'fanyideskweb'
const navigatorAppVersion = IS_NODE
  ? '5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'
  : navigator.appVersion
const bv = md5(navigatorAppVersion)

/**
 * 有道翻译接口的签名算法
 * @param text
 */
export default function(text: string) {
  const ts = Date.now() + ''
  const salt = ts + parseInt(10 * Math.random() + '', 10)
  return {
    client,
    ts,
    bv,
    salt,
    sign: md5(client + text + salt + '97_3(jkMYg@T[KZQmqjTK')
  }
}
