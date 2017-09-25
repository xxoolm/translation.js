import * as crypto from 'crypto'

export default function (text: string) {
  return crypto.createHash('md5').update(text).digest('hex')
}
