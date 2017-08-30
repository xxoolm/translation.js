// 请求 API 接口时发生了网络错误
var NETWORK_ERROR = 0

// 请求 HTTP 接口时产生了服务器错误，例如 4xx 或 5xx 的响应，
// 详情见 http://visionmedia.github.io/superagent/#error-handling
var SERVER_ERROR = 1

var UNKNOWN_ERROR = 2

function Translation () {
  this.APIs = {}
}

/**
 * 判断 superAgent 的错误对象的类型
 * @param {{timeout?:Number,status?:Number}} superAgentErr
 * @returns {Number}
 */
function analyzeErrorType (superAgentErr) {
  if (!superAgentErr.status) {
    return NETWORK_ERROR
  } else {
    return SERVER_ERROR
  }
}

var p = Translation.prototype

/**
 * 添加一个翻译实例
 * @param {API} apiObject
 */
p.add = function (apiObject) {
  var APIs = this.APIs
  var type = apiObject.type
  var instances = APIs[type] || (APIs[type] = [])
  instances.push(apiObject)
}

/**
 * 翻译方法
 * @param {Query} queryObj
 * @returns {Promise}
 */
p.translate = function (queryObj) {
  return this.call('translate', queryObj)
}

/**
 * 返回语音 url 的方法
 * @param queryObj
 * @returns {Promise}
 */
p.audio = function (queryObj) {
  return this.call('audio', queryObj)
}

/**
 * 检测语种的方法。注意，此方法返回的语种类型是 API 相关的，可能不会遵守标准。
 * @param queryObj
 * @returns {Promise}
 */
p.detect = function (queryObj) {
  return this.call('detect', queryObj)
}

/**
 * 调用实例方法
 * @param {String} method - 想调用实例的哪个方法
 * @param {Query} queryObj
 * @returns {Promise}
 */
p.call = function (method, queryObj) {
  var instances = this.APIs[queryObj.api]
  if (!instances) return Promise.reject('没有注册 ' + queryObj.api + ' API。')

  var a = instances[0]
  if (!a[method]) return Promise.reject(a.name + '不支持' + method + '方法。')

  instances.push(instances.shift())

  return a[method](queryObj)
    .then(function (resultObj) {
      if (method === 'translate') resultObj.api = a
      return resultObj
    }, function (superAgentError) {
      if (superAgentError == null) return Promise.reject(UNKNOWN_ERROR)
      return Promise.reject(analyzeErrorType(superAgentError))
    })
}

var tjs = new Translation()

tjs.NETWORK_ERROR = NETWORK_ERROR
tjs.SERVER_ERROR = SERVER_ERROR
tjs.UNKNOWN_ERROR = UNKNOWN_ERROR

// 绑定内置的翻译接口
tjs.BaiDu = require('./APIs/baidu')
tjs.YouDao = require('./APIs/youdao')
tjs.Bing = require('./APIs/bing')
tjs.Google = require('./APIs/google')
tjs.GoogleCN = require('./APIs/google-cn')

module.exports = tjs
