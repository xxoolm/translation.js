import { request as requestHTTP } from 'http'
import { request as requestHTTPs } from 'https'
import { parse } from 'url'
import { stringify } from 'querystring'

import { IRequestOptions, IStringObject } from '../../interfaces'
import { ERROR_CODE } from '../../constant'
import { TranslatorError } from '../../utils'

export default function (options: IRequestOptions) {
  const { method = 'get' } = options
  const urlObj = parse(options.url, true)
  const qs = stringify(Object.assign(urlObj.query, options.query))

  const headers: IStringObject = {}
  let body: string

  if (method === 'post') {
    switch (options.type) {
      case 'form':
        headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
        body = stringify(options.body)
        break

      case 'json':
      default:
        headers['Content-Type'] = 'application/json; charset=UTF-8'
        body = JSON.stringify(options.body)
        break
    }

    headers['Content-Length'] = String(Buffer.byteLength(body))
  }

  Object.assign(headers, options.headers)

  const httpOptions = {
    hostname: urlObj.hostname,
    method,
    path: urlObj.pathname + '?' + qs,
    headers,
    auth: urlObj.auth
  }

  return new Promise((resolve, reject) => {
    const req = (urlObj.protocol === 'https:' ? requestHTTPs : requestHTTP)(httpOptions)

    req.on('response', res => {
      // 内置的翻译接口都以 200 作为响应码，所以不是 200 的一律视为错误
      if (res.statusCode !== 200) {
        reject(new TranslatorError(ERROR_CODE.API_SERVER_ERROR))
        return
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk: string) => { rawData += chunk })
      res.on('end', () => {
        try {
          rawData = JSON.parse(rawData)
        } catch (e) {}
        resolve(rawData || undefined)
      })
    })

    req.on('error', (e) => {
      reject(new TranslatorError(ERROR_CODE.NETWORK_ERROR, e.message))
    })

    req.end(body)
  })
}
