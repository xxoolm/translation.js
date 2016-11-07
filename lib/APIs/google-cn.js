var Google = require('./google')

function GoogleCN (config) {
  var google = new Google(config)
  google.name = '谷歌翻译（国内）'
  google.link = 'https://translate.google.cn'
  google.apiRoot = 'https://translate.google.cn'
  return google
}

module.exports = GoogleCN
