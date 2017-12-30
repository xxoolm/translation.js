import md5 from '../../adapters/md5/node'

const client = 'fanyideskweb'
const sk = "rY0D^0'nM0}g5Mm1z%1G4"

/**
 * 有道翻译接口的签名算法
 * @param text
 */
export default function(text: string) {
  const salt = Date.now() + parseInt(String(10 * Math.random()), 10)
  return {
    client,
    salt,
    sign: md5(client + text + salt + sk)
  }
}
