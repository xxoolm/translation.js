/**
 * 对一个 API 对象进行标准检测。
 * 里面注释掉的部分需要各个 API 自行测试。
 */

module.exports = function (Class) {
  var className = Class.name
  describe(className + 'API的实例', function () {
    var c = new Class({
      apiKey: 'x',
      keyFrom: 'y'
    })

    it('需要有一个 name 属性', function () {
      expect(typeof c.name).toBe('string')
    })

    it('需要有一个 link 属性', function () {
      expect(typeof c.link).toBe('string')
    })

    // describe('的 translate 方法', function () {
    //   it( '正常情况下回返回一个查询结果对象' )
    //   it( '若网络错误则返回 SuperAgent 错误对象' )
    // })

    describe('的 detect 方法', function () {
      it('必须是一个函数', function () {
        expect(typeof c.detect).toBe('function')
      })

      describe('如果查询对象有 from 属性', function () {
        it('若支持 from 指定的标准语种则返回字符串', function (done) {
          c.detect({
            text: 'test',
            from: 'en'
          }).then(function (lang) {
            expect(lang).toBe('en')
            done()
          }, function () {
            fail('错误的进入了 reject 分支')
            done()
          })
        })

        it('若不支持 from 指定的标准语种则返回 null', function (done) {
          c.detect({
            text: 'test',
            from: 'no this lang'
          }).then(function (lang) {
            expect(lang).toBeNull()
            done()
          }, function (e) {
            fail('错误的进入了 reject 分支' + e.toString())
            done()
          })
        })
      })

      // describe('若查询对象没有 form 属性', function () {
      //   it('若支持此语种则返回标准语种字符串')
      //   it('若不支持此语种则返回 null')
      //   it('若检测语种时发生网络错误则返回 SuperAgent 的错误对象')
      // })
    })

    describe('的 audio 方法', function () {
      // it( '若支持则返回语音地址字符串' )

      it('不支持朗读或者不支持此查询对象的语种会返回 null', function (done) {
        c.audio({ text: 'test', from: 'no this lang' }).then(function (url) {
          expect(url).toBeNull()
          done()
        }, function (e) {
          fail('错误地进入了 reject 分支' + e.toString())
          done()
        })
      })
    })
  })
}
