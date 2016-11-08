var t = require('../libs/index')
var nock = require('nock')

nock.disableNetConnect()

describe('tjs 对象', function () {
  describe('的 call 方法', function () {
    var b1, b2, b3

    beforeEach(function () {
      b1 = new t.BaiDu()
      b2 = new t.BaiDu()
      b3 = new t.BaiDu()
      t.APIs = {
        BaiDu: [b1, b2, b3]
      }
      spyOn(b1, 'translate').and.returnValue(Promise.resolve({ text: 'gj', result: 'xx' }))
    })

    it('会调用实例的对应方法并会对实例进行排序以做到负载均衡', function (done) {
      expect(t.APIs.BaiDu).toEqual([b1, b2, b3])
      t.call('translate', { api: 'BaiDu', text: 'w', from: 'zh' }).then(function () {
        expect(t.APIs.BaiDu).toEqual([b2, b3, b1])
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

  afterAll(function () {
    t.APIs = {}
  })
})
