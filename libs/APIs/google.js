/**
 * 谷歌翻译支持几乎所有语种，并且它的语种格式就是标准的。
 */
var request = require('superagent')
var isEmpty = require('../utils/isEmpty')

/**
 * 谷歌翻译
 */
function Google () {
  this.name = '谷歌翻译'
  this.type = 'Google'
  this.link = 'https://translate.google.com'
  this.audioRoot = this.link + '/translate_tts'
  this.translatePath = '/translate_a/single'
}
Google.ERROR = {
  UNKNOWN: '谷歌翻译发生了一个错误，可能是因为查询文本过长，或请求频率太高造成的。',
  NO_RESULT: '没有返回翻译结果，请稍后重试。'
}

var p = Google.prototype

// ISO839-1 Code from https://cloud.google.com/translate/docs/languages
var supportedLang = ['af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'ceb', 'ny', 'zh-CN', 'zh-TW', 'co', 'hr', 'cs', 'da', 'nl', 'en', 'eo', 'et', 'tl', 'fi', 'fr', 'fy', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ha', 'haw', 'iw', 'hi', 'hmn', 'hu', 'is', 'ig', 'id', 'ga', 'it', 'ja', 'jw', 'kn', 'kk', 'km', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mn', 'my', 'ne', 'no', 'ps', 'fa', 'pl', 'pt', 'ma', 'ro', 'ru', 'sm', 'gd', 'sr', 'st', 'sn', 'sd', 'si', 'sk', 'sl', 'so', 'es', 'su', 'sw', 'sv', 'tg', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu']

/**
 * 翻译的方法
 * @param queryObj
 * @returns {Promise}
 */
p.translate = function (queryObj) {
  var that = this
  return new Promise(function (resolve, reject) {
    request
      .get(that.link + that.translatePath)
      .query('client=gtx&sl=' + (queryObj.from || 'auto') + '&tl=' + (queryObj.to || 'auto') + '&dt=t&dt=bd&ie=UTF-8&oe=UTF-8&dj=1&source=icon&q=' + encodeURIComponent(queryObj.text))
      // {
      //   client : 'gtx' ,
      //   sl : 'auto' , // 源语言
      //   tl : queryObj.to || 'auto' , // 目标语言
      //   dt : [ 't' , 'bd' ] , // 这个地方必须写成 &dt=t&dt=tl，所以没有用对象的方式声明
      //   dj : 1 ,
      //   source : 'icon' ,
      //   q : queryObj.text
      // } )
      .timeout(that.timeout)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve(that.transform(res.body, queryObj))
        }
      })
  })
}

/**
 * Google 翻译返回的数据结构
 * @typedef {Object} GoogleRes
 * @property {{trans: String, orig: String, backend: Number}[]} sentences trans:翻译结果，orig:被翻译的字符串
 * @property {{pos: String, terms: [], entry: []}} dict 查词结果，只有请求单个单词翻译时会有，
 * 中翻英经常有，小语种经常没有
 * @property {String} src - 翻译结果的源语种，ISO839-1 格式
 */
/**
 * 将谷歌翻译的数据转换为统一格式
 * @param {GoogleRes} rawRes
 * @param queryObj
 * @returns {{}}
 */
p.transform = function (rawRes, queryObj) {
  var obj = {
    text: queryObj.text,
    to: queryObj.to || 'auto',
    response: rawRes
  }

  obj.linkToResult = this.link + '/#auto/' + obj.to + '/' + queryObj.text

  if (typeof rawRes === 'string') {
    obj.error = Google.ERROR.UNKNOWN
  } else {
    try {
      // 尝试获取详细释义
      obj.detailed = rawRes.dict.map(function (v) {
        return v.pos + '：' + (v.terms.slice(0, 3) || []).join(',')
      })
    } catch (e) {}
    try {
      // 尝试取得翻译结果
      var sentences = rawRes.sentences.filter(function (sentence) {
        return sentence.trans !== queryObj.text
      })
      obj.from = isEmpty(sentences) ? null : rawRes.src
      obj.result = sentences.map(function (sentence) {
        return sentence.trans
      })
    } catch (e) {}

    if (isEmpty(obj.detailed) && isEmpty(obj.result)) {
      obj.error = this.name + Google.ERROR.NO_RESULT
    }
  }
  return obj
}

/**
 * 使用谷歌翻译检测文本语种。
 * @param queryObj
 * @returns {Promise}
 */
p.detect = function (queryObj) {
  var from = queryObj.from
  if (from) {
    return (supportedLang.indexOf(from) > -1) ? Promise.resolve(from) : Promise.reject(null)
  }

  return this.translate(queryObj)
    .then(function (result) {
      return result.from
    })
}

/**
 * 返回语音播放的 url
 * @param queryObj
 * @returns {Promise}
 */
p.audio = function (queryObj) {
  var that = this
  return this.detect(queryObj)
    .then(function (lang) {
      return encodeURI(that.audioRoot + '?ie=UTF-8&q=' +
        encodeURIComponent(queryObj.text) + '&tl=' + lang + '&client=gtx')
    })
}

module.exports = Google

