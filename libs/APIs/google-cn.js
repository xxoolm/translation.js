var Google = require('./google')

function GoogleCN (config) {
  Google.call(this, config)
  this.name = '谷歌翻译（国内）'
  this.type = 'GoogleCN'
  this.link = 'https://translate.google.cn'
  this.audioRoot = this.link + '/translate_tts'
}

GoogleCN.prototype = Object.create(Google.prototype)
GoogleCN.prototype.constructor = GoogleCN

module.exports = GoogleCN
