import { translate, audio, detect } from '../src/index'
import google from '../src/api/google'
import { ERROR_CODE } from '../src/constant'

describe('', () => {
  it('默认情况下使用谷歌翻译接口', () => {
    spyOn(google, 'translate')
    spyOn(google, 'detect')
    spyOn(google, 'audio')
    // tslint:disable:no-floating-promises
    translate('x')
    detect('x')
    audio('x')
    // tslint:enable
    expect(google.translate).toHaveBeenCalled()
    expect(google.detect).toHaveBeenCalled()
    expect(google.audio).toHaveBeenCalled()
  })

  it('若指定了不存在的接口会报错', done => {
    translate({
      text: 'x',
      api: 'no-this-api'
    }).then(() => {
      done.fail('没有报错')
    }, error => {
      expect(error.code).toBe(ERROR_CODE.NO_THIS_API)
      done()
    })
  })
})
