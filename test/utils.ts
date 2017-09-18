import { invert } from '../src/utils'

describe('utils 中的', () => {
  it('invert 方法会反转对象的键和值', () => {
    expect(invert({
      a: 1
    })).toEqual({
      1: 'a'
    })
  })
})
