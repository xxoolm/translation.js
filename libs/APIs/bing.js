/**
 * 必应词典的这个接口仅支持中文和英文；
 * 中文会翻译成英文，反之英文会翻译成中文，
 * 但其它语种全都不支持；
 * 若翻译了一个不支持的语种（如日语），
 * 那么语种会被判断为 EN，
 * 但不会有任何翻译结果。
 */

var superagent = require('superagent')
var invertObj = require('../utils/invert')
var custom2standard = {
  cn: 'zh-CN',
  en: 'en'
}
var standard2custom = invertObj(custom2standard)

/**
 * 在自定义语种与标准语种之间转换，默认会将标准语种转换为自定义语种
 * @param {String} lang
 * @param {Boolean} [invert] - 但如果 invert 为真值，则会将自定义语种转换为标准语种
 * @return {String}
 */
function langTransform (lang, invert) {
  return (invert ? custom2standard : standard2custom)[lang] || null
}

/**
 * 必应翻译
 */
function Bing () {
  this.name = '必应翻译'
  this.type = 'Bing'
  this.link = 'http://cn.bing.com/dict/'
}

var p = Bing.prototype

/**
 * 翻译的方法
 * @param queryObj
 * @returns {Promise}
 */
p.translate = function (queryObj) {
  var that = this
  return superagent
    .post('http://dict.bing.com.cn/io.aspx')
    .type('form')
    .send({
      t: 'dict',
      ut: 'default',
      q: queryObj.text,
      ulang: 'AUTO',
      tlang: 'AUTO'
    })
    .then(function (res) {
      return that.transform(res.text, queryObj)
    })
}

/**
 * 将必应翻译的数据转换为统一格式
 * @param responseText
 * @param queryObj
 * @returns {{}}
 */
p.transform = function (responseText, queryObj) {
  var rawRes = JSON.parse(responseText)
  var ROOT = rawRes.ROOT
  var obj = {
    text: queryObj.text,
    to: queryObj.to || 'auto',
    response: rawRes,
    from: langTransform(ROOT.$LANG, true),
    linkToResult: this.link + 'search?q=' + queryObj.text
  }

  // 尝试获取错误消息
  try {
    var error = rawRes.ERR.$
    if (error) {
      obj.error = error
      return obj
    }
  } catch (e) {}

  // 尝试获取详细释义
  try {
    obj.detailed = ROOT.DEF[0].SENS.map(function (v) {
      var s = v.$POS + '. '
      if (Array.isArray(v.SEN)) {
        v.SEN.forEach(function (j) {
          s += j.D.$ + ' '
        })
      } else {
        s += v.SEN.D.$
      }
      return s
    })
  } catch (e) {}

  // 尝试获取翻译结果
  try {
    obj.result = [ROOT.SMT.R.$.replace(/\{\d+#|\$\d+\}/g, '')]
  } catch (e) {}

  if (!obj.detailed && !obj.result) {
    obj.error = '必应翻译不支持此语种。'
    obj.from = '' // 不支持的语种始终会被解析为 en，这是不正确的
  }
  return obj
}

module.exports = Bing
