# translation.js [![Build Status](https://img.shields.io/travis/Selection-Translator/translation.js/master.svg?style=flat-square)](https://travis-ci.org/Selection-Translator/translation.js) [![Coverage Status](https://img.shields.io/coveralls/Selection-Translator/translation.js/master.svg?style=flat-square)](https://coveralls.io/github/Selection-Translator/translation.js?branch=master) [![NPM Version](https://img.shields.io/npm/v/translation.js.svg?style=flat-square)](https://www.npmjs.com/package/translation.js)

translation.js 整合了[谷歌翻译](https://translate.google.cn/)、[百度翻译](https://fanyi.baidu.com/)与[有道翻译](http://fanyi.youdao.com/)的网页翻译接口，让你方便的在这些翻译接口之间切换，并获取相同数据结构的翻译结果。

## 特点

### 可在 Node.js 及 Chrome 扩展 / 应用中使用

translateion.js 能同时在 Node.js 和浏览器端运行，但由于浏览器端[同源策略](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)的限制，这些网页接口只能在允许跨域的运行环境使用，Chrome 扩展 / 应用则是其中之一。

**注意**：为了能在 Chrome 扩展 / 应用中使用 translation.js，请阅读最后面的「在 Chrome 扩展 / 应用中使用」一节。

### 一致的参数与数据结构

每个网页翻译的接口都有不同的参数和翻译结果，translation.js 统一了这些不同之处并提供了一致的 API，同时提供了每个接口的源数据方便自定义处理。

## 安装

### 在 Node.js 或 Webpack（及类似的模块打包工具）中使用

先用 NPM 安装：

```
npm install translation.js
```

然后在代码中引用：

```js
// CommonJS 中
const tjs = require('translation.js')

// ES6 中
import * as tjs from 'translation.js'

// 也可以直接引用方法
import { translate, detect, audio } from 'translation.js'
```

### 使用 &lt;script&gt; 标签

在 Chrome 扩展 / 应用中使用 &lt;script&gt; 标签引用时，你需要先下载下面两个文件到你的项目里：

* [md5.min.js](https://unpkg.com/blueimp-md5/js/md5.min.js)
* [translator.min.js](https://unpkg.com/translation.js/dist/translator.min.js)

然后在 HTML 中引用：

```html
<!-- 先引用 translator.js 的依赖 -->
<script src="path/to/md5.min.js"></script>
<!-- 然后引用 translator.js -->
<script src="path/to/translator.min.js"></script>
```

然后就可以使用全局变量 `window.tjs` 调用方法了。

## 使用

### 获取翻译结果

获取一段文本的翻译结果可以用 `translate()` 方法：

```js
tjs.translate('test').then(result => {
  console.log(result) // result 的数据结构见下文
})
```

其中 `result` 的结构示例如下：

```js
{
  text: 'test', // 此次查询的文本
  raw: { ... }, // 接口返回的原本的数据
  link: 'https://translate.google.cn/#en/zh/test', // 在线翻译地址
  from: 'en', // 文本的源语种
  to: 'zh-CN', // 文本的目标语种
  // 单词的音标，目前只有用百度翻译英文单词才可能有
  phonetic: [
    {
      name: '美',
      ttsURI: 'https://fanyi.baidu.com/gettts?lan=en&text=test&spd=3&source=web',
      value: 'test'
    },
    {
      name: '英',
      ttsURI: 'https://fanyi.baidu.com/gettts?lan=en-GB&text=test&spd=3&source=web',
      value: 'test'
    }
  ],
  // 单词的详细释义，翻译英文单词时才可能有
  dict: ['n. 试验；测验；考验；化验', 'vt. 测验；考验；考查；勘探', 'vi. 受试验；受测验；受考验；测得结果' ],
  // 一般翻译结果，数组里的每一项是一个段落的翻译
  result: ['测试']
}
```

**注意**：translation.js 统一使用 [ISO-639-1 标准](https://zh.wikipedia.org/wiki/ISO_639-1)作为语种格式，任何地方出现的语种都遵循这个标准。

翻译结果默认来自谷歌翻译，你也可以指定要从哪个接口获取结果：

```js
tjs.translate({
  text: 'test',
  api: 'youdao' // 从有道翻译获取结果，或者设为 'baidu' 从百度翻译获取
})
```

### 检测语种

检测一段文本的语种可以使用 `detect()` 方法：

```js
tjs.detect('test').then(lang => {
  console.log(lang) // => 'en'
})
```

默认情况下，语种检测的数据同样来自谷歌翻译，但你同样可以指定其他接口：

```js
tjs.detect({
  text: 'test',
  api: 'youdao' // 从有道翻译获取结果，或者设为 'baidu' 从百度翻译获取
})
```

**注意**：建议一直使用谷歌翻译检测语种，因为它支持的语种是最多的，其他接口可能不支持你所检测的文本的语种。

### 获取文本的语音朗读地址

使用 `audio()` 方法可以获取到文本的语音朗读地址：

```js
tjs.audio('test').then(uri => {
  console.log(uri) // => 'http://tts.google.cn/.......'
})
```

在浏览器端，你可以使用 [`<audio>`](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/Using_HTML5_audio_and_video) 播放这段语音，给用户提供朗读功能。

**注意**：谷歌翻译的语音朗读地址只能在 Chrome 扩展 / 应用中的 `<audio>` 里直接引用，在普通网页中引用时会报 404 错误，见 [#20](https://github.com/Selection-Translator/translation.js/issues/20)。

这个方法同样支持使用 `api` 属性指定语音朗读地址的接口。另外，你可以使用 `from` 参数指定文本的语种，这样会跳过检测语种的步骤（通常是一次 HTTP 请求）。

另外，百度翻译支持英标与美标读音：

```js
// 获取美式读音
tjs.audio({
  text: 'test',
  from: 'en',
  api: 'baidu'
})

// 获取英式读音
tjs.audio({
  text: 'test',
  from: 'en-GB',
  api: 'baidu'
})
```

### 源语种与目标语种

`translate()` 方法支持 `from` 与 `to` 属性，用于指定源语种与目标语种：

```js
// 将 'test' 从英语翻译至中文
tjs.translate({
  text: 'test',
  from: 'en',
  to: 'zh-CN'
})
```

一般情况下，你不需要设置 `from`，接口会为你自动检测，但还是建议尽量声明 `from` 以跳过自动检测语种的步骤。

### 使用谷歌国际翻译接口

默认情况下，translation.js 从 translate.google.**_cn_** 获取翻译结果、语种检测及语音地址，但**如果你的运行环境支持**，你也可以从 translate.google.**_com_** 获取数据：

```js
tjs.translate({
  text: 'test',
  com: true // 这一设置仅对谷歌翻译生效
})

tjs.detect({
  text: 'test',
  com: true
})

tjs.audio({
  text: 'test',
  com: true
})
```

## 错误处理

每一个方法都可能抛出错误，抛出的错误是一个 `Error` 对象，你可以检查它的 `code` 属性判断错误原因：

```js
tjs.translate('test').catch(error => {
  console.log(error.code)
})
```

`code` 可能有下面几个值：

```
NETWORK_ERROR - 网络错误，可能是运行环境没有网络连接造成的
API_SERVER_ERROR - 网页翻译接口返回了错误的数据
UNSUPPORTED_LANG - 接口不支持的语种
NO_THIS_API - 没有找到你需要的接口
NETWORK_TIMEOUT - 查询网页接口超时了。由于目前没有设置超时时间，所以暂时不会出现这个错误
```

## 在 Chrome 扩展 / 应用中使用

### 1. 声明跨域权限

最简单的方式就是申请 `<all_urls>` 权限：

```json
{
  "permissions": ["<all_urls>"]
}
```

或者，你至少需要申请这些网址的访问权限：

```js
{
  "permissions": [
    // 百度翻译的接口
    "https://fanyi.baidu.com/langdetect",
    "https://fanyi.baidu.com/v2transapi",
    // 谷歌（中国）翻译的接口
    "https://translate.google.cn/",
    "https://translate.google.cn/translate_a/single",
    // 如果你需要使用谷歌国际翻译接口则添加下面两项
    "https://translate.google.com/",
    "https://translate.google.com/translate_a/single",
    // 有道翻译的接口
    "https://fanyi.youdao.com/translate_o"
  ]
}
```

### 2. 给有道翻译接口添加 Referer 请求头

有道网页翻译接口会验证 `Referer` 请求头判断对接口的访问是否来自网页。由于浏览器不允许为 XMLHTTPRequest 对象设置 `Referer` 请求头，所以这一步只能在扩展程序里做。

你需要申请 `webRequest` 与 `webRequestBlocking` 权限，然后在你的[后台脚本](https://developer.chrome.com/extensions/event_pages)中添加下面这段代码：

```js
chrome.webRequest.onBeforeSendHeaders.addListener(
  ({ requestHeaders }) => {
    const r = {
      name: 'Referer',
      value: 'https://fanyi.youdao.com'
    }
    const index = requestHeaders.findIndex(
      ({ name }) => name.toLowerCase() === 'referer'
    )
    if (index >= 0) {
      requestHeaders.splice(index, 1, r)
    } else {
      requestHeaders.push(r)
    }
    return { requestHeaders }
  },
  {
    urls: ['https://fanyi.youdao.com/translate_o'],
    types: ['xmlhttprequest']
  },
  ['blocking', 'requestHeaders']
)
```

## 许可

MIT
