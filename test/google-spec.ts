import mock from './utils/mock'
import google from '../src/api/google'
import { ERROR_CODE } from '../src/constant'

function getResponse () {
  return [
    [
      [
        '测试',
        'test',
        null,
        null,
        2
      ],
      [
        null,
        null,
        'Cèshì',
        'test'
      ]
    ],
    [
      [
        '名词',
        [
          '测试',
          '试验',
          '试',
          '实验',
          '考试',
          '考验',
          '测验'
        ],
        [
          [
            '测试',
            [
              'test',
              'examination'
            ],
            null,
            0.61608213
          ],
          [
            '试验',
            [
              'test',
              'experiment',
              'tentative'
            ],
            null,
            0.21967085
          ],
          [
            '试',
            [
              'test',
              'examination',
              'experiment',
              'exam',
              'fitting'
            ],
            null,
            0.020115795
          ],
          [
            '实验',
            [
              'experiment',
              'test'
            ],
            null,
            0.015912903
          ],
          [
            '考试',
            [
              'examination',
              'exam',
              'test'
            ],
            null,
            0.012588142
          ],
          [
            '考验',
            [
              'test',
              'trial',
              'ordeal'
            ],
            null,
            0.012588142
          ],
          [
            '测验',
            [
              'test',
              'quiz'
            ],
            null,
            0.004559123
          ]
        ],
        'test',
        1
      ],
      [
        '动词',
        [
          '检验',
          '试',
          '考',
          '测验',
          '验',
          '考查',
          '尝'
        ],
        [
          [
            '检验',
            [
              'test',
              'examine',
              'inspect'
            ],
            null,
            0.050571099
          ],
          [
            '试',
            [
              'test',
              'try'
            ],
            null,
            0.020115795
          ],
          [
            '考',
            [
              'test',
              'study',
              'examine',
              'investigate',
              'verify',
              'check'
            ],
            null,
            0.015184198
          ],
          [
            '测验',
            [
              'test',
              'put to test'
            ],
            null,
            0.004559123
          ],
          [
            '验',
            [
              'test',
              'check',
              'verify',
              'examine',
              'prove',
              'confirm'
            ],
            null,
            0.0010999396
          ],
          [
            '考查',
            [
              'test',
              'investigate',
              'check',
              'study'
            ],
            null,
            0.00043074254
          ],
          [
            '尝',
            [
              'taste',
              'flavor',
              'try the flavor',
              'test',
              'flavour'
            ],
            null,
            6.3755516e-07
          ]
        ],
        'test',
        2
      ]
    ],
    'en',
    null,
    null,
    [
      [
        'test',
        null,
        [
          [
            '测试',
            1000,
            true,
            false
          ],
          [
            '试验',
            1000,
            true,
            false
          ]
        ],
        [
          [
            0,
            4
          ]
        ],
        'test',
        0,
        0
      ]
    ],
    0.7647059,
    null,
    [
      ['en'],
      null,
      [0.7647059],
      ['en']
    ],
    null,
    null,
    [
      [
        '名词',
        [
          [
            [
              'trial',
              'experiment',
              'test case',
              'case study',
              'pilot study',
              'trial run',
              'tryout',
              'dry run',
              'check',
              'examination',
              'assessment',
              'evaluation',
              'appraisal',
              'investigation',
              'inspection',
              'analysis',
              'scrutiny',
              'study',
              'probe',
              'exploration',
              'screening',
              'workup',
              'assay'
            ],
            'm_en_us1297943.001'
          ],
          [
            [
              'exam',
              'examination',
              'quiz'
            ],
            'm_en_us1297943.002'
          ],
          [
            [
              'exam',
              'examination'
            ],
            ''
          ],
          [
            [
              'trial run',
              'trial',
              'tryout'
            ],
            ''
          ],
          [
            ['trial'],
            ''
          ],
          [
            [
              'trial',
              'run'
            ],
            ''
          ],
          [
            ['mental test'],
            ''
          ]
        ],
        'test'
      ],
      [
        '动词',
        [
          [
            [
              'try out',
              'put to the test',
              'put through its paces',
              'experiment with',
              'pilot',
              'check',
              'examine',
              'assess',
              'evaluate',
              'appraise',
              'investigate',
              'analyze',
              'scrutinize',
              'study',
              'probe',
              'explore',
              'trial',
              'sample',
              'screen',
              'assay'
            ],
            'm_en_us1297943.009'
          ],
          [
            [
              'put a strain on',
              'strain',
              'tax',
              'try',
              'make demands on',
              'stretch',
              'challenge'
            ],
            'm_en_us1297943.010'
          ],
          [
            ['quiz'],
            ''
          ],
          [
            ['screen'],
            ''
          ],
          [
            [
              'essay',
              'try',
              'prove',
              'examine',
              'try out'
            ],
            ''
          ]
        ],
        'test'
      ]
    ],
    [
      [
        '名词',
        [
          [
            'a procedure intended to establish the quality, performance, or reliability of something, especially before it is taken into widespread use.',
            'm_en_us1297943.001',
            'no sparking was visible during the tests'
          ],
          [
            'a movable hearth in a reverberating furnace, used for separating gold or silver from lead.',
            'm_en_us1297943.008',
            'When fully prepared, the test is allowed to dry, and is then placed in a furnace, constructed in all respects like a common reverberator)\' furnace, except that a space is left open in the bed of it to receive the test, and that the width of the arch is much reduced.'
          ],
          [
            'the shell or integument of some invertebrates and protozoans, especially the chalky shell of a foraminiferan or the tough outer layer of a tunicate.',
            'm_en_us1297944.001',
            'The tests of the shells are recrystallized, but the original ornamentation is preserved in very good detail.'
          ]
        ],
        'test'
      ],
      [
        '动词',
        [
          [
            'take measures to check the quality, performance, or reliability of (something), especially before putting it into widespread use or practice.',
            'm_en_us1297943.009',
            'this range has not been tested on animals'
          ]
        ],
        'test'
      ],
      [
        '缩写词',
        [
          [
            'testator.',
            'm_en_us1297946.001'
          ]
        ],
        'test.'
      ]
    ],
    [
      [
        [
          'If the HPV \u003cb\u003etest\u003c/b\u003e is positive for the high risk type, then the patient warrants a closer look.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.006'
        ],
        [
          'To \u003cb\u003etest\u003c/b\u003e for overheating, touch your bare wrist to the barrel, near its end.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.016'
        ],
        [
          'The best way to \u003cb\u003etest\u003c/b\u003e a chilli for strength is to munch a bit before cooking.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.016'
        ],
        [
          'This week\'s What\'s Your Decision will really \u003cb\u003etest\u003c/b\u003e you and show you just how hard umpiring can be.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.011'
        ],
        [
          'When introducing a fresh cupel or \u003cb\u003etest\u003c/b\u003e , the fire must be low and heat must be applied with great caution, or otherwise the bone ash will split to pieces; and for the same reason the bone ash must be dried very gently.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.008'
        ],
        [
          'such behaviour would severely \u003cb\u003etest\u003c/b\u003e any marriage',
          null,
          null,
          null,
          3,
          'm_en_gb0854610.013'
        ],
        [
          'a useful way to \u003cb\u003etest\u003c/b\u003e out ideas before implementation',
          null,
          null,
          null,
          3,
          'm_en_us1297943.009'
        ],
        [
          'Do you want to compare answers with your buddies during the break and then start writing the \u003cb\u003etest\u003c/b\u003e ?',
          null,
          null,
          null,
          3,
          'm_en_us1297943.002'
        ],
        [
          'On \u003cb\u003etest\u003c/b\u003e there was certainly very little buffeting or wind noise.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.001'
        ],
        [
          'the exam will \u003cb\u003etest\u003c/b\u003e accuracy and neatness',
          null,
          null,
          null,
          3,
          'm_en_gb0854610.012'
        ],
        [
          'It was an unequalled \u003cb\u003etest\u003c/b\u003e of courage, strength and endurance, technique being less important than character.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.003'
        ],
        [
          'For the Canton government, the situation was a \u003cb\u003etest\u003c/b\u003e of both its sincerity and its strength.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.003'
        ],
        [
          'They had had the element of surprise during the first attack, but now it was to be a real \u003cb\u003etest\u003c/b\u003e of strength.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.003'
        ],
        [
          'It was meant to be a crucial exam to \u003cb\u003etest\u003c/b\u003e the basic skills of ambulance workers who wanted to step up the career ladder and become paramedics.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.012'
        ],
        [
          'a positive \u003cb\u003etest\u003c/b\u003e for protein',
          null,
          null,
          null,
          3,
          'm_en_us1297943.006'
        ],
        [
          'The \u003cb\u003etest\u003c/b\u003e is positive if both samples grow bacteria and if the catheter sample grows at least three times as many bacteria as the peripheral blood sample.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.006'
        ],
        [
          'The final 26 were interviewed and ranked based on their combined performance in the \u003cb\u003etest\u003c/b\u003e and interview.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.002'
        ],
        [
          'This young lad, since passing his \u003cb\u003etest\u003c/b\u003e , has written off two cars in self inflicted accidents.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.002'
        ],
        [
          'a \u003cb\u003etest\u003c/b\u003e for HIV',
          null,
          null,
          null,
          3,
          'm_en_gb0854610.004'
        ],
        [
          'On the other hand, there may be potential adverse psychological effects from a positive \u003cb\u003etest\u003c/b\u003e .',
          null,
          null,
          null,
          3,
          'm_en_us1297943.006'
        ],
        [
          'four fax modems are on \u003cb\u003etest\u003c/b\u003e',
          null,
          null,
          null,
          3,
          'm_en_gb0854610.001'
        ],
        [
          'We asked the parliamentary candidates for Wimbledon to tell us a bit about themselves and then we subjected them to a \u003cb\u003etest\u003c/b\u003e of their knowledge of their area.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.002'
        ],
        [
          'several trial runs were carried out to \u003cb\u003etest\u003c/b\u003e the special brakes',
          null,
          null,
          null,
          3,
          'm_en_gb0854610.010'
        ],
        [
          'The \u003cb\u003etest\u003c/b\u003e , when placed in position, forms the bed of the furnace, with the long diameter transversely.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.008'
        ],
        [
          'Their work aims to provide valid exposure data and to develop reliable methods to \u003cb\u003etest\u003c/b\u003e different types of mobile phones.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.009'
        ],
        [
          'Judging applicants must pass a written \u003cb\u003etest\u003c/b\u003e , demonstrating their knowledge of these rules.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.002'
        ],
        [
          'It will be a \u003cb\u003etest\u003c/b\u003e of their strength, their mental toughness and their attitude.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.003'
        ],
        [
          'Using the same pan, fry a small patty of the meat mixture and taste to \u003cb\u003etest\u003c/b\u003e the seasoning.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.016'
        ],
        [
          'The results of the studies that measured reliability indicate that the \u003cb\u003etest\u003c/b\u003e can be reliable if a standard procedure is used.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.001'
        ],
        [
          'The agency has also announced sweeping measures to tag and \u003cb\u003etest\u003c/b\u003e US cattle and other steps to boost confidence.',
          null,
          null,
          null,
          3,
          'm_en_us1297943.009'
        ]
      ]
    ],
    [
      [
        'Test',
        'test tube',
        'blood test',
        'to test',
        'pregnancy test',
        'test drive',
        'test report',
        'driving test',
        'placement test',
        'take a test',
        'stress test'
      ]
    ]
  ]
}

const fakeToken = ';TKK=eval(\'((function(){var a\x3d1404053479;var b\x3d2735121840;return 418275+\x27.\x27+(a+b)})())\');'

const mockTranslate = mock('https://translate.google.cn', '/translate_a/single', 'get', getResponse())
const mockToken = mock('https://translate.google.cn', '/', 'get', fakeToken)

describe('谷歌翻译', () => {
  describe('的 translate 方法', () => {
    it('会尝试分析单词释义与一般结果', done => {
      mockTranslate()
      mockToken()

      google
        .translate('test')
        .then(result => {
          expect(result.raw).toEqual(getResponse())
          expect(result.text).toBe('test')
          expect(result.to).toBe('zh-CN')
          expect(result.link).toBe('https://translate.google.cn/#en/zh-CN/test')
          expect(result.phonetic).toBeUndefined()
          expect(result.dict).toEqual(['名词：测试，试验，试，实验，考试，考验，测验', '动词：检验，试，考，测验，验，考查，尝'])
          expect(result.result).toEqual(['测试'])
          done()
        }, done.fail)
    })

    it('网络出错时会正确报错', done => {
      mockToken({ error: true })

      google
        .translate('x')
        .then(() => {
          done.fail('没有报错')
        }, error => {
          expect(error.code).toBe(ERROR_CODE.NETWORK_ERROR)
          done()
        })
    })

    it('网络出错时会正确报错', done => {
      mockToken()
      mockTranslate({ error: true })

      google
        .translate('x')
        .then(() => {
          done.fail('没有报错')
        }, error => {
          expect(error.code).toBe(ERROR_CODE.NETWORK_ERROR)
          done()
        })
    })
  })

  describe('的 audio 方法', () => {
    it('会返回在线语音的 URI', done => {
      mockToken()
      mockTranslate()

      google.audio({
        text: 'test',
        from: 'en'
      }).then(uri => {
        expect(uri).toContain('https://translate.google.cn/translate_tts?ie=UTF-8&q=test&tl=en&total=1&idx=0&textlen=4')
        done()
      }, done.fail)
    })

    it('如果没有指定语种会尝试自动检测', done => {
      mockToken({ times: 2 })
      mockTranslate()

      google
        .audio('test')
        .then(uri => {
          expect(uri)
            .toContain('https://translate.google.cn/translate_tts?ie=UTF-8&q=test&tl=en&total=1&idx=0&textlen=4')
          done()
        }, done.fail)
    })
  })
})
