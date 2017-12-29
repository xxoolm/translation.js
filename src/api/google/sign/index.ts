import getSeed from './seed'
import getToken from './token'

export default function(text: string, com?: boolean) {
  return getSeed(com).then(seed => getToken(text, seed))
}
