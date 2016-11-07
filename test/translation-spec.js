var T = require('../lib/translation')
var nock = require('nock')

nock.disableNetConnect()

describe('Translation 对象', function () {
  var t
  beforeEach(function () {
    t = new T()
  })

  it('create 方法能创建指定接口的实例并保存下来', function () {
    var baidu = t.create('BaiDu', { apiKey: 'good' })
    expect(t.api.BaiDu).toEqual([baidu])
  })

  describe('的 call 方法', function () {
    var b1, b2, b3

    beforeEach(function () {
      b1 = t.create('BaiDu', { apiKey: '1' })
      b2 = t.create('BaiDu', { apiKey: '2' })
      b3 = t.create('BaiDu', { apiKey: '3' })
      spyOn(b1, 'translate').and.returnValue(Promise.resolve({ text: 'gj', result: 'xx' }))
    })

    it('会调用实例的对应方法并会对实例进行排序以做到负载均衡', function (done) {

      expect(t.api.BaiDu).toEqual([b1, b2, b3])

      t.call('translate', { api: 'BaiDu', text: 'w', from: 'zh' }).then(function () {
        expect(t.api.BaiDu).toEqual([b2, b3, b1])
        done()
      }, function () {
        fail('错误的进入了 rejection 分支')
        done()
      })
      expect(b1.translate).toHaveBeenCalledWith({ api: 'BaiDu', text: 'w', from: 'zh' })
    })

    it('如果没有找到指定 API 会进入 rejection', function (done) {
      t.call('translate', { api: 'unknown api' }).then(function () {
        fail('未知 api 错误的进入了 resolve 分支')
        done()
      }, function () {
        done()
      })
    })

    xit('如果调用实例方法时被 reject 了则会调用 T.errorType 判断错误类型', function (done) {
      b1.translate.and.stub().and.returnValue(Promise.reject({ hello: 'world' }))
      spyOn(T, 'errorType')
      t.call('translate', { api: 'BaiDu' }).then(function () {
        fail('错误的进入了 resolve 分支')
        done()
      }, function () {
        expect(T.errorType).toHaveBeenCalledWith({ hello: 'world' })
        done()
      })
    })
  })

  it('的静态方法 errorType 能正确判断 SuperAgent 错误类型', function () {
    expect(T.errorType({ timeout: 1 })).toBe('timeout')
    expect(T.errorType({ status: 500 })).toBe('server error')
    expect(T.errorType({})).toBe('network error')
  })

  it('其它三种方法都只是 call 方法的代理', function () {
    spyOn(t, 'call')

    t.translate({ j: 1 })
    t.detect({ j: 2 })
    t.audio({ j: 3 })

    expect(t.call).toHaveBeenCalledWith('translate', { j: 1 })
    expect(t.call).toHaveBeenCalledWith('detect', { j: 2 })
    expect(t.call).toHaveBeenCalledWith('audio', { j: 3 })
  })
})
