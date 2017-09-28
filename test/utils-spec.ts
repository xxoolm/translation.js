import { getValue, invert, transformOptions } from '../src/utils'
import { ERROR_CODE } from '../src/constant'

describe('utils 中的', () => {
  it('invert 方法会反转对象的键和值', () => {
    expect(invert({
      a: 1,
      b: 'x'
    })).toEqual({
      1: 'a',
      x: 'b'
    })
  })

  it('getValue 方法会读取对象上指定路径的值', () => {
    const obj = {
      a: {
        b: 'c'
      }
    }

    expect(getValue(obj, 'a')).toEqual({
      b: 'c'
    })

    expect(getValue(null, 'b')).toBeUndefined()

    expect(getValue(obj, 'd', 'Y')).toBe('Y')

    expect(getValue(obj, ['a', 'b'])).toBe('c')

    expect(getValue(undefined, 'a', 'hi')).toBe('hi')
  })

  it('transformOptions 方法会转换配置项', () => {
    expect(transformOptions('test')).toEqual({
      text: 'test'
    })

    const o = {
      text: 'xx',
      y: 1
    }

    expect(transformOptions(o)).toBe(o)
  })
})
