/* tslint:disable */
var yr: any = null

/**
 * 根据需要翻译的文本和 seed 计算出此次翻译所需的 token。
 * @see https://github.com/matheuss/google-translate-token
 * @param text 需要翻译的文本
 * @param seed 计算 token 所需的 seed，可以通过 ./seed.ts 模块获取
 */
export default function(text: string, seed: string) {
  var b
  if (null !== yr) b = yr
  else {
    b = (yr = seed || '') || ''
  }
  var d = b.split('.')
  b = Number(d[0]) || 0
  for (var e = [], f = 0, g = 0; g < text.length; g++) {
    var l = text.charCodeAt(g)
    128 > l
      ? (e[f++] = l)
      : (2048 > l
          ? (e[f++] = (l >> 6) | 192)
          : (55296 == (l & 64512) &&
            g + 1 < text.length &&
            56320 == (text.charCodeAt(g + 1) & 64512)
              ? ((l =
                  65536 + ((l & 1023) << 10) + (text.charCodeAt(++g) & 1023)),
                (e[f++] = (l >> 18) | 240),
                (e[f++] = ((l >> 12) & 63) | 128))
              : (e[f++] = (l >> 12) | 224),
            (e[f++] = ((l >> 6) & 63) | 128)),
        (e[f++] = (l & 63) | 128))
  }
  // @ts-ignore
  text = b
  for (f = 0; f < e.length; f++) (text += e[f]), (text = xr(text, '+-a^+6'))
  text = xr(text, '+-3^+b+-f')
  // @ts-ignore
  text ^= Number(d[1]) || 0
  // @ts-ignore
  0 > text && (text = (text & 2147483647) + 2147483648)
  // @ts-ignore
  text %= 1e6
  // @ts-ignore
  return text.toString() + '.' + (text ^ b)
}

function xr(a: any, b: any) {
  for (var c = 0; c < b.length - 2; c += 3) {
    var d = b.charAt(c + 2),
      d1 = 'a' <= d ? d.charCodeAt(0) - 87 : Number(d),
      d2 = '+' == b.charAt(c + 1) ? a >>> d1 : a << d1
    a = '+' == b.charAt(c) ? (a + d2) & 4294967295 : a ^ d2
  }
  return a
}
