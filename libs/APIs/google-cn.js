var _Google = require('./_google')

function GoogleCN () {
  _Google.call(this)
  this.name = '谷歌翻译（国内）'
  this.type = 'GoogleCN'
  this.apiRoot = this.link = 'https://translate.google.cn'
}

GoogleCN.prototype = Object.create(_Google.prototype, {
  constructor: { value: GoogleCN }
})

module.exports = GoogleCN
