import { createHash } from 'crypto'

export default function(text: string) {
  return createHash('md5')
    .update(text)
    .digest('hex')
}
