import mock from './utils/mock'
import youdao from '../src/api/youdao'
import { ERROR_CODE } from '../src/constant'

function getResponse() {
  return {
    translateResult: [[{ tgt: '试验', src: 'test' }]],
    errorCode: 0,
    type: 'en2zh-CHS',
    smartResult: { entries: ['', '一\r\n', '二\r\n', '三\r\n'] }
  }
}

const mockTranslate = mock(
  'https://fanyi.youdao.com',
  '/translate_o',
  'post',
  getResponse()
)

describe('有道翻译', () => {
  describe('的 translate 方法', () => {
    it('会尝试分析单词释义与一般结果', done => {
      mockTranslate()

      youdao.translate('test').then(result => {
        expect(result.raw).toEqual(getResponse())
        expect(result.text).toBe('test')
        expect(result.to).toBe('zh-CN')
        expect(result.link).toBe(
          'https://dict.youdao.com/search?q=test&keyfrom=fanyi.smartResult'
        )
        expect(result.phonetic).toBeUndefined()
        expect(result.dict).toEqual(['一', '二', '三'])
        expect(result.result).toEqual(['试验'])
        done()
      }, done.fail)
    })

    it('网络错误时会正确报错', done => {
      mockTranslate({ error: true })

      youdao.translate('test').then(
        () => {
          done.fail('没有报错')
        },
        error => {
          expect(error.code).toBe(ERROR_CODE.NETWORK_ERROR)
          done()
        }
      )
    })

    it('errorCode 不为 0 时会正确报错', done => {
      mockTranslate({ response: { errorCode: 1 } })

      youdao.translate('test').then(
        () => {
          done.fail('没有报错')
        },
        error => {
          expect(error.code).toBe(ERROR_CODE.API_SERVER_ERROR)
          done()
        }
      )
    })

    it('若语种与目标语种中不含中文则报错', done => {
      youdao
        .translate({
          text: 'x',
          from: 'en',
          to: 'fr'
        })
        .then(
          () => {
            done.fail('没有报错')
          },
          error => {
            expect(error.code).toBe(ERROR_CODE.UNSUPPORTED_LANG)
            done()
          }
        )
    })
  })

  describe('的 audio 方法', () => {
    it('会返回在线语音的 URI', done => {
      youdao
        .audio({
          text: 'test',
          from: 'en'
        })
        .then(uri => {
          expect(uri).toBe('https://dict.youdao.com/dictvoice?audio=test&le=en')
          done()
        }, done.fail)
    })

    it('如果没有指定语种会尝试自动检测', done => {
      mockTranslate()
      youdao.audio('test').then(uri => {
        expect(uri).toBe('https://dict.youdao.com/dictvoice?audio=test&le=en')
        done()
      }, done.fail)
    })
  })

  describe('的 detect 方法', () => {
    it('若检测不到语种会正确报错', done => {
      mockTranslate({
        response: {
          errorCode: 0,
          type: ''
        }
      })

      youdao.detect('test').then(
        () => {
          done.fail('没有报错')
        },
        error => {
          expect(error.code).toBe(ERROR_CODE.UNSUPPORTED_LANG)
          done()
        }
      )
    })
  })
})
