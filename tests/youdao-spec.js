var YouDao = require('../libs/APIs/youdao')
var youdao = new YouDao({ apiKey: '1361128838', keyFrom: 'chrome' })
var nock = require('nock')

nock.disableNetConnect()

require('./standard')(YouDao)

describe('有道翻译', function () {
  it('在初始化时若没有提供API Key及 key from则应该报错', function () {
    var pass = 0
    try {
      // eslint-disable-next-line no-new
      new YouDao()
    } catch (e) {
      pass += 1
    }

    try {
      // eslint-disable-next-line no-new
      new YouDao({ apiKey: 'xxx' })
    } catch (e) {
      pass += 1
    }

    try {
      // eslint-disable-next-line no-new
      new YouDao({ keyFrom: 'xxx' })
    } catch (e) {
      pass += 1
    }

    try {
      // eslint-disable-next-line no-new
      new YouDao({ apiKey: 'xxx', keyFrom: 'xxx' })
    } catch (e) {
      pass += 1
    }

    if (pass !== 3) {
      fail('没有 API Key 时应该报错')
    }
  })

  describe('的 translate 方法', function () {
    it('在正常情况下会调用 transform 方法返回结果对象', function (done) {
      var rawRes = {
        errorCode: 0,
        basic: {
          phonetic: '音标',
          explains: ['解释1', '解释2']
        },
        translation: ['这里是翻译结果']
      }

      spyOn(youdao, 'transform')

      nock('https://fanyi.youdao.com')
        .get('/openapi.do')
        .query(true)
        .reply(200, rawRes)

      youdao
        .translate({ text: 'test' })
        .then(function (result) {
          expect(youdao.transform).toHaveBeenCalledWith(rawRes, { text: 'test' })
          done()
        }, function () {
          fail('错误的进入了 rejection 分支')
          done()
        })
    })

    it('在网络错误时应该被 reject', function (done) {
      nock('https://fanyi.youdao.com')
        .get('/openapi.do')
        .query(true)
        .replyWithError('some network error message')

      youdao
        .translate({ text: 'test' })
        .then(function () {
          fail('错误的进入了 resolve 分支')
          done()
        }, function () {
          done()
        })
    })
  })

  describe('的 transform 方法', function () {
    it('在有道接口返回错误码时会 resolve error', function () {
      var rawRes = { errorCode: 20 }
      var result = youdao.transform(rawRes, { text: 'test' })

      expect(result).toEqual(jasmine.objectContaining({
        text: 'test',
        response: rawRes,
        error: youdao.errMsg[20]
      }))
    })

    it('在有道接口返回正确格式数据时能正常转换', function () {
      var rawRes = {
        errorCode: 0,
        basic: {
          phonetic: '音标',
          explains: ['解释一', '解释二']
        },
        translation: ['翻译结果']
      }
      var result = youdao.transform(rawRes, { text: 'test' })

      expect(result).toEqual({
        text: 'test',
        response: rawRes,
        phonetic: '音标',
        detailed: rawRes.basic.explains,
        result: rawRes.translation,
        linkToResult: 'http://fanyi.youdao.com/translate?i=test'
      })
    })
  })

  it('的 audio 方法总是会调用 detect 获取自己的语种', function (done) {
    var q = { text: 'test', from: 'ja' }
    youdao.audio(q).then(function (url) {
      expect(url).toBe('http://tts.youdao.com/fanyivoice?keyfrom=fanyi%2Eweb%2Eindex&le=jap&word=test')
      done()
    }, function () {
      fail('错误的进入了 reject 分支')
      done()
    })
  })
})

