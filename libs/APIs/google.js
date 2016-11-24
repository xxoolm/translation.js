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
  this.translatePath = '/translate_a/single'
  this.link = 'https://translate.google.com'
  // To avoid browser same origin policy block request,
  // use googleapis as apiRoot in browser
  this.apiRoot = (typeof window === 'object' && window.window === window)
    ? Google.API_URL
    : this.link
  this.audioRoot = this.link + '/translate_tts'
}

Google.API_URL = 'https://translate.googleapis.com'
Google.ERROR = {
  UNKNOWN: '谷歌翻译发生了一个错误，可能是因为查询文本过长，或请求频率太高造成的。',
  NO_RESULT: '没有返回翻译结果，请稍后重试。'
}

var p = Google.prototype

// ISO839-1 Code from https://cloud.google.com/translate/docs/languages
var supportedLang = ['af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs',
  'bg', 'ca', 'ceb', 'ny', 'zh-CN', 'zh-TW', 'co', 'hr', 'cs', 'da', 'nl', 'en',
  'eo', 'et', 'tl', 'fi', 'fr', 'fy', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ha',
  'haw', 'iw', 'hi', 'hmn', 'hu', 'is', 'ig', 'id', 'ga', 'it', 'ja', 'jw', 'kn',
  'kk', 'km', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms',
  'ml', 'mt', 'mi', 'mr', 'mn', 'my', 'ne', 'no', 'ps', 'fa', 'pl', 'pt', 'ma',
  'ro', 'ru', 'sm', 'gd', 'sr', 'st', 'sn', 'sd', 'si', 'sk', 'sl', 'so', 'es',
  'su', 'sw', 'sv', 'tg', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'uz', 'vi', 'cy',
  'xh', 'yi', 'yo', 'zu']

/**
 * 翻译的方法
 * @param queryObj
 * @returns {Promise}
 */
p.translate = function (queryObj) {
  var that = this
  var acceptLanguage = queryObj.to
    ? queryObj.to + (queryObj.to.indexOf('-') > -1 ? ',' + queryObj.to.split('-')[0] : '')
    : 'en'
  acceptLanguage += ';q=0.8,en;q=0.6'
  return new Promise(function (resolve, reject) {
    request
      .get(that.apiRoot + that.translatePath)
      .set('Accept-Language', acceptLanguage)  // it affects dict language
      .query({
        // for detect language, just {client: 'gtx', sl: auto, dj: 1, ie: 'UTF-8', oe: 'UTF-8', q: 'test'}
        client: 'gtx',
        sl: queryObj.from || 'auto',  // source language
        tl: queryObj.to || 'auto',    // translated language
        dj: 1,                        // ensure return json is GoogleRes structure
        ie: 'UTF-8',                  // input string encoding
        oe: 'UTF-8',                  // output string encoding
        source: 'icon',               // source
        q: queryObj.text,              // text to be translated
        dt: ['t', 'bd']              // a list to add content to return json
        // possible dt values: correspond return json key
        // t: sentences
        // rm: sentences[1]
        // bd: dict
        // at: alternative_translations
        // ss: synsets
        // rw: related_words
        // ex: examples
        // ld: ld_result
      })
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
 * @property {String} src - 原字符串语种，ISO839-1 格式，如果 queryObj dt 为空，则返回 json 只有这一个字段
 * @property {Object[]} sentences
 * @property {{trans: String, orig: String, backend: Number}} sentences[0] trans:翻译结果，orig:被翻译的字符串
 * @property {{translit: String, src_translit: String}} sentences[1] translit:翻译结果音标，src_translit:原字符串音标
 * @property {{pos: String, terms: String[], entry: Object[]}[]} dict 查词结果，只有请求单个单词翻译时会有，
 * 中翻英经常有，小语种经常没有 pos:词性 terms:词语列表 entry:对每个词的详解
 * @property {{srclangs: String[], srclangs_confidences: Number[], extended_srclangs: String[]}} ld_result
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
      if (isEmpty(sentences)) {
        obj.from = null
      } else {
        obj.from = rawRes.src
        obj.result = sentences.map(function (sentence) {
          return sentence.trans
        })
      }
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
    return (supportedLang.indexOf(from) > -1) ? Promise.resolve(from) : Promise.resolve(null)
  }

  return this.translate(queryObj)
    .then(function (result) {
      return result.from ? Promise.resolve(result.from) : Promise.resolve(null)
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
      return supportedLang.indexOf(lang) > -1
        ? that.audioRoot + '?ie=UTF-8&q=' + encodeURIComponent(queryObj.text) + '&tl=' + lang + '&client=gtx'
        : null
    })
}

module.exports = Google

