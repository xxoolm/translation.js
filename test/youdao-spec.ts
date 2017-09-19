import * as nock from 'nock'
import youdao from '../src/api/youdao'

function getResponse () {
  return {
    translateResult: [[{ tgt: '试验', src: 'test' }]],
    errorCode: 0,
    type: 'en2zh-CHS',
    smartResult: { entries: ['', '一\r\n', '二\r\n', '三\r\n'] }
  }
}

function mockTranslate () {
  nock('https://fanyi.youdao.com')
    .post('/translate_o')
    .query(true)
    .reply(200, getResponse())
}

describe('有道翻译', () => {
  describe('的 translate 方法', () => {
    it('会尝试分析单词释义与一般结果', done => {
      mockTranslate()

      youdao
        .translate('test')
        .then(result => {
          expect(result.raw).toEqual(getResponse())
          expect(result.text).toBe('test')
          expect(result.to).toBe('zh-CN')
          expect(result.link).toBe('https://dict.youdao.com/search?q=test&keyfrom=fanyi.smartResult')
          expect(result.phonetic).toBeUndefined()
          expect(result.dict).toEqual(['一', '二', '三'])
          expect(result.result).toEqual(['试验'])
          done()
        }, done.fail)
    })
  })

  describe('的 audio 方法', () => {
    it('会返回在线语音的 URI', done => {
      youdao.audio({
        text: 'test',
        from: 'en'
      }).then(uri => {
        expect(uri).toBe('https://dict.youdao.com/dictvoice?audio=test&le=en')
        done()
      }, done.fail)
    })

    it('如果没有指定语种会尝试自动检测', done => {
      mockTranslate()
      youdao
        .audio('test')
        .then(uri => {
          expect(uri).toBe('https://dict.youdao.com/dictvoice?audio=test&le=en')
          done()
        }, done.fail)
    })
  })
})
