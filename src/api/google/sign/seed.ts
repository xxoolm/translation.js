import request from '../../../adapters/http/node'

let seed = ''

/**
 * 获取计算 token 需要的 seed。
 * @param com - 是否从国际版谷歌翻译上获取 seed。默认从中国谷歌翻译上获取。
 */
export default function(com?: boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    const now = Math.floor(Date.now() / 3600000)

    // TODO: 同百度翻译一样，在接口 403 时才重新获取，不要通过时间判断。
    // seed 每小时刷新一次，如果没过期则直接使用上次更新的 seed
    if (Number(seed.split('.')[0]) === now) {
      resolve(seed)
    } else {
      // 从谷歌翻译的网页上获取到最新的 seed
      request({
        url: 'https://translate.google.' + (com ? 'com' : 'cn')
      }).then((text: string) => {
        const match = text.match(
          /TKK=eval\('\(\(function\(\){(.*?)}\)\(\)\)'\);/
        )
        if (match) {
          // 函数体不接收 ASCII 码，所以这里要手动转换一遍
          const code = match[1].replace(/\\x3d/g, '=').replace(/\\x27/g, "'")
          try {
            seed = new Function(code)()
          } catch (e) {}
        }
        resolve(seed)
      }, reject)
    }
  })
}
