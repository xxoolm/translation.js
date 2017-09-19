import * as nock from 'nock'

export interface IOptions {
  body?: any // nock.InterceptFunction requestBody
  status?: number
  response?: any
  error?: any
  times?: number
}

export default function (host: string, path: string, method: 'get' | 'post' = 'get') {
  const scope = nock(host)
  return function (options: IOptions) {
    const interceptor = scope[method](path, options.body)
    if (options.times) {
      interceptor.times(options.times)
    }

    if (options.error) {
      interceptor.replyWithError(options.error)
    } else {
      interceptor.reply(options.status || 200, options.response)
    }
  }
}
