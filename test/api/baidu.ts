import * as nock from 'nock'
import baidu from '../../src/api/baidu'

nock.disableNetConnect()

function getBaiDuResponse () {
  return {
    dict_result: {
      simple_means: {
        symbols: [
          {
            parts: [
              {
                part: '单词属性',
                means: ['一', '二', '三', '四']
              }
            ],
            ph_am: '美标',
            ph_en: '英标'
          }
        ]
      }
    },
    trans_result: {
      data: [
        {
          src: 'test',
          dst: '翻译'
        },
        {
          src: 'test',
          dst: '结果'
        }
      ],
      from: 'en',
      to: 'zh'
    }
  }
}

function mockTranslate (body?: (body: string) => boolean) {
  nock('https://fanyi.baidu.com')
    .post('/v2transapi', body)
    .reply(200, getBaiDuResponse())
}

function mockDetect (lan = 'zh') {
  nock('https://fanyi.baidu.com')
    .post('/langdetect')
    .reply(200, {
      error: 0,
      lan
    })
}

describe('百度翻译', () => {
  describe('的 translate 方法', () => {
    it('会尝试分析单词释义与一般结果', done => {
      mockTranslate()

      baidu
        .translate({
          text: 'test',
          from: 'en'
        })
        .then(result => {
          expect(result.raw).toEqual(getBaiDuResponse())
          expect(result.text).toBe('test')
          expect(result.to).toBe('zh-CN')
          expect(result.link).toBe('https://fanyi.baidu.com/#en/zh/test')
          expect(result.phonetic).toEqual([
            {
              name: '美',
              ttsURI: 'https://fanyi.baidu.com/gettts?lan=en&text=test&spd=3&source=web',
              value: '美标'
            },
            {
              name: '英',
              ttsURI: 'https://fanyi.baidu.com/gettts?lan=en-GB&text=test&spd=3&source=web',
              value: '英标'
            }
          ])
          expect(result.dict).toEqual(['单词属性 一；二；三；四'])
          expect(result.result).toEqual(['翻译', '结果'])
          done()
        }, fail)
    })

    it('如果没有提供语种，则会自动尝试检测', done => {
      mockDetect()

      mockTranslate(body => {
        expect(body.includes('from=zh')).toBeTruthy()
        done()
        return true
      })

      baidu.translate('中文')
    })
  })

  describe('的 audio 方法', () => {
    it('会返回在线语音的 URI', done => {
      baidu.audio({
        text: 'test',
        from: 'en'
      }).then(uri => {
        expect(uri).toBe('https://fanyi.baidu.com/gettts?lan=en&text=test&spd=3&source=web')
        done()
      }, fail)
    })

    it('如果没有指定语种会尝试自动检测', done => {
      mockDetect()
      baidu
        .audio('中文')
        .then(uri => {
          expect(uri)
            .toBe('https://fanyi.baidu.com/gettts?lan=zh&text=' + encodeURIComponent('中文') + '&spd=3&source=web')
          done()
        }, fail)
    })

    it('支持英标', done => {
      baidu
        .audio({
          text: 'test',
          from: 'en-GB'
        })
        .then(uri => {
          expect(uri)
            .toBe('https://fanyi.baidu.com/gettts?lan=uk&text=test&spd=3&source=web')
          done()
        }, fail)
    })
  })
})
