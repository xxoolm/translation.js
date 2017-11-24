import { IRequestOptions, IStringOrStringArrayObject } from '../../interfaces'
import { ERROR_CODE } from '../../constant'
import { TranslatorError } from '../../utils'

function qs(obj?: IStringOrStringArrayObject) {
  if (!obj) return ''
  const r = []
  for (let key in obj) {
    const v = [].concat(obj[key] as never)
    r.push(...v.map(valStr => `${key}=${encodeURIComponent(valStr)}`))
  }
  return r.join('&')
}

export default function(options: IRequestOptions) {
  const xhr = new XMLHttpRequest()
  const urlObj = new URL(options.url)

  urlObj.search = (urlObj.search ? '' : '?') + qs(options.query)

  const { method = 'get' } = options

  xhr.open(method, urlObj.toString())

  let body: string

  if (method === 'post') {
    switch (options.type) {
      case 'form':
        xhr.setRequestHeader(
          'Content-Type',
          'application/x-www-form-urlencoded; charset=UTF-8'
        )
        body = qs(options.body)
        break

      case 'json':
      default:
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
        body = JSON.stringify(options.body)
        break
    }
  }

  const { headers } = options
  if (headers) {
    for (let header in headers) {
      xhr.setRequestHeader(header, headers[header])
    }
  }

  return new Promise((resolve, reject) => {
    xhr.onload = () => {
      if (xhr.status !== 200) {
        reject(new TranslatorError(ERROR_CODE.API_SERVER_ERROR))
      }
      const res = xhr.responseText
      try {
        resolve(JSON.parse(res))
      } catch (e) {
        resolve(res)
      }
    }

    xhr.onerror = e => {
      reject(new TranslatorError(ERROR_CODE.NETWORK_ERROR, e.message))
    }

    xhr.send(body)
  })
}
