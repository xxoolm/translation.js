var Google = require('../libs/APIs/google')
var GoogleCN = require('../libs/APIs/google-cn')
var nock = require('nock')

nock.disableNetConnect()

var testObjects = [{
  Class: Google
}, {
  Class: GoogleCN
}]

testObjects.forEach(function (testObj) {
  var google = new testObj.Class()

  require('./standard')(testObj.Class)

  describe('Google', function () {
    const queryObj = {text: 'man', to: 'zh-CN'}
    const rawRes = {
      'sentences': [{
        'trans': '人',
        'orig': 'man',
        'backend': 1
      }],
      'dict': [{
        'pos': 'noun',
        'terms': ['人', '男子', '鼓舞'],
        'entry': [{
          'word': '人',
          'reverse_translation': ['people', 'person', 'man', 'human being', 'folk'],
          'score': 0.24891968
        }, {
          'word': '男子',
          'reverse_translation': ['man', 'male', 'he'],
          'score': 0.13746651
        }, {
          'word': '鼓舞',
          'reverse_translation': ['inspiration', 'boost', 'stimulation', 'spark', 'excitation', 'man'],
          'score': 0.0000017330547
        }],
        'base_form': 'man',
        'pos_enum': 1
      }, {
        'pos': 'verb',
        'terms': ['為配 ... 備人手'],
        'entry': [{
          'word': '為配 ... 備人手',
          'reverse_translation': ['man']
        }],
        'base_form': 'man',
        'pos_enum': 2
      }],
      'src': 'en',
      'confidence': 0.64077669,
      'ld_result': {
        'srclangs': ['en'],
        'srclangs_confidences': [0.64077669],
        'extended_srclangs': ['en']
      }
    }
    const badQueryObj = {text: 'fdmmgilgnpjigdojojpjoooidkmcomcm', to: 'zh-CN'}
    const rawBadRes = {
      'sentences': [{
        'trans': badQueryObj.text,
        'orig': badQueryObj.text,
        'backend': 0
      }],
      'src': 'eo',
      'confidence': 0.022722878,
      'ld_result': {
        'srclangs': ['eo'],
        'srclangs_confidences': [0.022722878],
        'extended_srclangs': ['eo']
      }
    }

    describe('的 translate 方法：', function () {
      it('在正常情况下会调用 transform 方法返回结果对象', function (done) {
        spyOn(google, 'transform')

        nock(google.link).get(google.translatePath)
          .query(true)
          .reply(200, rawRes)

        google
          .translate(queryObj)
          .then(function () {
            expect(google.transform).toHaveBeenCalledWith(rawRes, queryObj)
            done()
          }, function (e) {
            fail('错误地进入了 rejection 分支: ' + e.toString())
            done()
          })
      })

      it('在网络错误时应该被 reject', function (done) {
        var errorMsg = 'some network error message'
        nock(google.link)
          .get(google.translatePath)
          .query(true)
          .replyWithError(errorMsg)

        google
          .translate({text: 'test'})
          .then(function () {
            fail('错误地进入了 resolve 分支')
            done()
          }, function (e) {
            expect(e instanceof Error).toBeTruthy()
            expect(e.message).toEqual(errorMsg)
            done()
          })
      })
    })

    describe('的 transform 方法：', function () {
      it('在 Google 接口回复为错误信息字符串时，会返回带 Google.ERROR.UNKNOWN 的对象', function () {
        var rawRes = 'Some error info'
        var result = google.transform(rawRes, queryObj)

        expect(result).toEqual(jasmine.objectContaining({
          text: queryObj.text,
          response: rawRes,
          error: Google.ERROR.UNKNOWN
        }))
      })

      it('在 Google 接口回复的对象没有翻译结果时，会返回带 Google.ERROR.NO_RESULT 的对象', function () {
        var result = google.transform(rawBadRes, badQueryObj)

        expect(result).toEqual(jasmine.objectContaining({
          text: badQueryObj.text,
          response: rawBadRes,
          error: google.name + Google.ERROR.NO_RESULT
        }))
      })

      it('在 Google 接口返回正确格式数据时，能正常转换', function () {
        var result = google.transform(rawRes, queryObj)
        expect(result).toEqual({
          text: queryObj.text,
          to: 'zh-CN',
          from: 'en',
          response: rawRes,
          linkToResult: google.link + '/#auto/zh-CN/' + queryObj.text,
          detailed: ['noun：人,男子,鼓舞', 'verb：為配 ... 備人手'],
          result: ['人']
        })
      })
    })

    describe('的 detect 方法', function () {
      describe('若查询对象没有 form 属性，', function () {
        it('若支持此语种，则会调用 translate 方法返回标准语种字符串', function (done) {
          spyOn(google, 'translate').and.callThrough()
          nock(google.link).get(google.translatePath)
            .query(true)
            .reply(200, rawRes)

          google.detect(queryObj).then(function (lang) {
            expect(google.translate).toHaveBeenCalledWith(queryObj)
            expect(lang).toEqual('en')
            done()
          }, function (e) {
            fail('错误地进入了 rejection 分支: ' + e.toString())
            done()
          })
        })

        it('若不支持此语种则返回 null', function (done) {
          nock(google.link).get(google.translatePath)
            .query(true)
            .reply(200, rawBadRes)
          google.detect(badQueryObj).then(function (lang) {
            expect(lang).toBeNull()
            done()
          }, function (e) {
            fail('错误地进入了 rejection 分支: ' + e.toString())
            done()
          })
        })

        it('若检测语种时发生网络错误则返回 SuperAgent 的错误对象', function (done) {
          var errorMsg = 'some network error message'
          nock(google.link)
            .get(google.translatePath)
            .query(true)
            .replyWithError(errorMsg)
          google.detect(queryObj).then(function () {
            fail('错误地进入了 resolve 分支')
            done()
          }, function (e) {
            expect(e instanceof Error).toBeTruthy()
            expect(e.message).toEqual(errorMsg)
            done()
          })
        })
      })
    })

    describe('的 audio 方法：', function () {
      it('若支持此查询对象的语种则返回语音地址字符串', function (done) {
        var queryObj = {text: 'test', from: 'es'}
        google.audio(queryObj).then(function (url) {
          expect(url).toBe(google.audioRoot + '?ie=UTF-8&q=test&tl=' + queryObj.from + '&client=gtx')
          done()
        }, function () {
          fail('错误地进入了 reject 分支')
          done()
        })
      })
    })
  })
})

