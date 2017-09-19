# translation.js

translation.js 整合了[谷歌翻译](https://translate.google.cn/)、[百度翻译](https://fanyi.baidu.com/)与[有道翻译](http://fanyi.youdao.com/)的网页翻译接口，让你方便的在这些翻译接口之间切换，并获取相同数据结构的翻译结果。

## 特点

### 可在 NodeJS 及 Chrome 扩展/应用中使用

translateion.js 能同时在 NodeJS 和浏览器端运行，但由于浏览器端[同源策略](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)的限制，这些网页接口只能在允许跨域的运行环境使用，Chrome 扩展/应用则是其中之一。

注：为了能在 Chrome 扩展/应用中使用 translation.js，请阅读后面的[在 Chrome 扩展/应用中使用](#useage-in-chrome)一节。

### 一致的参数与数据结构

每个网页翻译的接口都有不同的参数和翻译结果，translation.js 统一了这些不同之处并提供了一致的 API，同时提供了每个接口的源数据方便自定义处理。

## 安装

首先，使用 NPM 安装：

```
npm install translation.js
```

然后在代码中引用：

```js
// CommonJS 中
const tjs = require('translation.js')

// ES6 中
import * as tjs from 'translation.js'

// 你也可以只引用你用得到的方法
import { translate, detect, audio } from 'translation.js'
```

## 使用

#### 获取翻译结果

获取一段文本的翻译结果可以用 `translate()` 方法：

```js
tjs
  .translate('test')
  .then(result => {
    console.log(result) // result 的数据结构见下文
  })
```

翻译结果默认来自谷歌翻译，你也可以指定要从哪个接口获取结果：

```js
tjs.translate({
  text: 'test',
  api: 'youdao' // 从有道翻译获取结果，或者设为 'baidu' 从百度翻译获取
})
```

#### 检测语种

检测一段文本的语种可以使用 `detect()` 方法：

```js
tjs
  .detect('test')
  .then(lang => {
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

**注：建议一直使用谷歌翻译检测语种，因为它支持的语种是最多的，其他接口可能不支持你所检测的文本的语种。**

#### 获取文本的语音朗读地址

使用 `audio()` 方法可以获取到文本的语音朗读地址：

```js
tjs
  .audio('test')
  .then(uri => {
    console.log(uri) // => 'http://tts.google.cn/.......'
  })
```

在浏览器端，你可以使用 [`<audio>`](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/Using_HTML5_audio_and_video) 播放这段语音，给用户提供"朗读"功能。

这个方法同样支持使用 `api` 属性指定语音朗读地址的接口。另外，你可以使用 `from` 参数指定文本的语种，这样会跳过检测语种的步骤（通常是一次 HTTP 请求）。

百度翻译支持英标与美标读音：

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

#### 源语种与目标语种

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

注：translation.js 统一使用 [ISO-639-1 标准](https://zh.wikipedia.org/wiki/ISO_639-1)作为语种格式，任何地方出现的语种都遵循这个标准。

#### 使用谷歌国际翻译接口

默认情况下，translation.js 从 translate.google**.cn** 获取翻译结果、语种检测及语音地址，但**如果你的运行环境支持**，你也可以从 translate.google**.com** 获取数据：

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

#### 翻译结果的数据结构

#### 错误处理

#### 添加自定义翻译接口

## 许可

MIT
