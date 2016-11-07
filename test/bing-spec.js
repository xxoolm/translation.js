'use strict';

var Bing = require('../lib/APIs/bing')
var bing = new Bing()
var nock = require('nock')

nock.disableNetConnect()

require('./standard')(Bing)

describe('必应翻译', function () {
  describe('的 translate 方法', function () {
    it('在正常情况下会调用 transform 方法返回结果对象', function (done) {
      var rawRes = JSON.stringify({
        ROOT: {
          $LANG: '源语种',
          DEF: [
            {
              SENS: [
                {
                  $POS: 'adj',
                  SEN: [
                    {
                      D: {
                        $: '其中一条详细解释'
                      }
                    }
                  ]
                }
              ]
            }
          ],
          SMT: { R: { $: '翻译结果' } }
        }
      })

      spyOn(bing, 'transform')

      nock('http://dict.bing.com.cn')
        .post('/io.aspx')
        .reply(200, rawRes)

      bing
        .translate({ text: 'test' })
        .then(function () {
          expect(bing.transform).toHaveBeenCalledWith(rawRes, { text: 'test' })
          done()
        }, function () {
          fail('错误的进入了 rejection 分支')
          done()
        })
    })

    it('在网络错误时应该被 reject', function (done) {
      nock('http://dict.bing.com.cn')
        .post('/io.aspx')
        .replyWithError('some network error message')

      bing
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
    it('在没有详细解释时返回的结果只有 result', function () {
      expect(bing.transform(JSON.stringify({
        ROOT: {
          $LANG: '源语种',
          SMT: { R: { $: '翻译结果' } }
        }
      }), { text: 'test' })).toEqual(jasmine.objectContaining({
        result: ['翻译结果']
      }))
    })

    it('在没有翻译结果时返回的结果只有详细解释', function () {
      expect(bing.transform(JSON.stringify({
        ROOT: {
          $LANG: '源语种',
          DEF: [
            {
              SENS: [
                {
                  $POS: 'adj',
                  SEN: [
                    {
                      D: {
                        $: '其中一条详细解释'
                      }
                    }
                  ]
                }
              ]
            }
          ] // 么有翻译结果
        }
      }), { text: 'test' })).toEqual(jasmine.objectContaining({
        detailed: ['adj. 其中一条详细解释 ']
      }))
    })

    it('在没有翻译结果且详细解释不是数组时也只有详细解释', function () {
      expect(bing.transform(JSON.stringify({
        ROOT: {
          $LANG: '源语种',
          DEF: [
            {
              SENS: [
                {
                  $POS: 'adj',
                  SEN: {
                    D: {
                      $: '其中一条详细解释'
                    }
                  }
                }
              ]
            }
          ]
        }
      }), { text: 'test' })).toEqual(jasmine.objectContaining({
        detailed: ['adj. 其中一条详细解释']
      }))
    })
  })
})
