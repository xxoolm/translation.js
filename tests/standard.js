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
  })
}
