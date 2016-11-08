// @see http://fanyi.youdao.com/openapi?path=data-mode#bd

/**
 * 有道翻译返回的数据结构
 * @typedef {Object} YouDaoRes
 * @property {Number} errorCode - 有道翻译错误码，0 表示正常
 * @property {{phonetic?:String,explains?:String[]}} [basic] - 翻译结果的源语种，百度格式的
 * @property {String[]} [translation] - 翻译结果，偶尔抽风可能没有
 */

var request = require('superagent')
var invertObj = require('../utils/invert')
var standard2custom = {
  en: 'eng',
  ja: 'jap',
  ko: 'ko',
  fr: 'fr',
  ru: 'ru',
  es: 'es'
}
var custom2standard = invertObj(standard2custom)

function langTransform (lang, invert) {
  return (invert ? custom2standard : standard2custom)[lang] || null
}

YouDao.resolve = langTransform

/**
 * 有道翻译构造函数
 * @param {Object} config
 * @param {String} config.apiKey
 * @param {String} config.keyFrom
 */
function YouDao (config) {
  if (!config || !config.apiKey || !config.keyFrom) {
    throw new Error('有道翻译必须要有 API Key 及 keyFrom，否则无法使用翻译接口。')
  }

  this.apiKey = config.apiKey
  this.keyFrom = config.keyFrom

  this.name = '有道翻译'
  this.link = 'http://fanyi.youdao.com/'
  this.type = 'YouDao'
  this.errMsg = {
    20: '有道翻译服务一次性只能翻译200个字符',
    30: '有道翻译暂时无法翻译这段文本',
    40: '有道翻译不支持这种语言',
    50: 'api key被封禁',
    60: '无词典结果'
  }
}

var p = YouDao.prototype

/**
 * 翻译的方法。有道不支持指定源语种或目标语种。
 * @param queryObj
 * @returns {Promise}
 */
p.translate = function (queryObj) {
  var that = this
  return new Promise(function (resolve, reject) {
    request
      .get('https://fanyi.youdao.com/openapi.do')
      .query({
        key: that.apiKey,
        keyfrom: that.keyFrom,
        type: 'data',
        doctype: 'json',
        version: '1.1',
        q: queryObj.text
      })
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
 * 将有道接口的数据转换为统一格式
 * @param {YouDaoRes} rawRes
 * @param {Query} queryObj
 * @returns {{}}
 */
p.transform = function (rawRes, queryObj) {
  var obj = {
    text: queryObj.text,
    response: rawRes,
    linkToResult: 'http://fanyi.youdao.com/translate?i=' + queryObj.text
  }

  // rawRes 偶尔是 null
  if (rawRes) {
    // 如果有错误码则直接处理错误
    if (rawRes.errorCode !== 0) {
      obj.error = this.errMsg[rawRes.errorCode]
    } else {
      // 详细释义
      try {
        var basic = rawRes.basic
        obj.detailed = basic.explains
        obj.phonetic = basic.phonetic
      } catch (e) {}

      // 翻译结果
      try {
        obj.result = rawRes.translation
      } catch (e) {}
    }
  }

  if (!obj.error && !obj.detailed && !obj.result) {
    obj.error = this.name + '没有返回有效的翻译结果，请稍后重试。'
  }

  return obj
}

/**
 * 检测语种的方法，有道没有，所以若没有提供源语种就总是返回 null
 * @param {Query} queryObj
 * @returns {Promise}
 */
p.detect = function (queryObj) {
  return new Promise(function (resolve, reject) {
    var from = queryObj.from

    if (langTransform(from)) {
      resolve(from)
    } else {
      reject(null)
    }
  })
}

/**
 * 返回语音播放的 url
 * @param queryObj
 * @returns {Promise}
 */
p.audio = function (queryObj) {
  return this
    .detect(queryObj)
    .then(function (lang) {
      var l = langTransform(lang)
      return 'http://tts.youdao.com/fanyivoice?keyfrom=fanyi%2Eweb%2Eindex&le=' + l + '&word=' + queryObj.text
    })
}

module.exports = YouDao
