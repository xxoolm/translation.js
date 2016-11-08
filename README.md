# translation.js

[![Build Status](https://img.shields.io/travis/Selection-Translator/translation.js/master.svg?style=flat-square)](https://travis-ci.org/Selection-Translator/translation.js)
[![Coverage Status](https://img.shields.io/coveralls/Selection-Translator/translation.js/master.svg?style=flat-square)](https://coveralls.io/github/Selection-Translator/translation.js?branch=master)
[![dependencies Status](https://img.shields.io/david/Selection-Translator/translation.js.svg?style=flat-square)](https://david-dm.org/Selection-Translator/translation.js)
[![devDependencies Status](https://img.shields.io/david/dev/Selection-Translator/translation.js.svg?style=flat-square)](https://david-dm.org/Selection-Translator/translation.js#info=devDependencies)
[![NPM Version](https://img.shields.io/npm/v/translation.js.svg?style=flat-square)](https://www.npmjs.com/package/translation.js)

收集多种翻译接口并用同一个 API 调用。

## 特点

### 统一接口调用方式

互联网上有很多可供免费使用的翻译接口，比如百度翻译、谷歌翻译、有道翻译、必应翻译等等，它们的接口不尽相同，但原理都是发起 HTTP 请求获取翻译结果。translation.js 的目标就是统一这些接口的调用方式，可以使用一种方法调用不同的多个接口。借助于 [Webpack](http://webpack.github.io/) 与 [SuperAgent](https://github.com/visionmedia/superagent) 的力量，它可以同时运行在 Node.js 与浏览器端。

### 负载均衡

以有道翻译接口为例，你可以申请多个 apiKey 在 translation.js 中生成多个翻译实例，那么调用有道翻译时， translation.js 会轮流使用各个实例进行翻译。这样做能有效降低由于使用次数过多而导致 apiKey 被封禁的风险。

### 自定义翻译接口

如果某一个翻译接口没有被添加，你也可以很方便的自定义翻译接口。欢迎提交 PR 添加更多翻译接口！详情见[自定义接口](/docs/API-spec.md)。

## 安装

### 在 Node.js 或 Webpack 中

先使用 NPM 安装：

```
npm install translation.js -S
```

然后：

```js
var tjs = require('translation.js')
```

### 使用 `&lt;script&gt;` 标签：

```html
<!-- translation.js 依赖 superagent -->
<script src="https://unpkg.com/superagent/superagent.js"></script>
<script src="https://unpkg.com/translation.js/dist/translation.js"></script>
<script>alert(window.tjs)</script>
```

## 使用示例

```js
// tjs 内置了下面这些翻译接口
tjs.add(new tjs.BaiDu())
tjs.add(new tjs.Google())
tjs.add(new tjs.GoogleCN())
tjs.add(new tjs.Bing())
tjs.add(new tjs.YouDao({ key: 'xxx', keyFrom: 'xxx' }))

// 使用有道翻译 'test'
tjs
  .translate({ api: 'YouDao', text: 'test' })
  .then(function (resultObj) {
    console.log(resultObj)
  }, function (errMsg) {
    console.log(errMsg)
  })

// 使用百度翻译获取文本的语音地址
tjs
  .audio({ api: 'BaiDu', text: 'test' })
  .then(function (audioUrl) {
    console.log(audioUrl)
  }, function (errMsg) {
    console.log(errMsg)
  })

// 检测语种
tjs
  .detect({ api: 'BaiDu', text: 'test' })
  .then(function (lan) {
    console.log(lan)
  }, function (errMsg) {
    console.log(errMsg)
  })
```

## 内置的翻译接口

translation.js 内置了五种翻译接口：[有道翻译](http://fanyi.youdao.com/)、[百度翻译](http://fanyi.baidu.com/)、[必应翻译](http://cn.bing.com/dict/)、[谷歌翻译](https://translate.google.com/)与[谷歌国内翻译](http://translate.google.cn/)。其中，只有有道翻译使用了[官方的 API 接口](http://fanyi.youdao.com/openapi?path=data-mode)，其它翻译都是使用各自的网页翻译里的翻译接口——因为官方发布的 API 接口都是要收费的，并且会有调用频率限制。

也就是说，只有有道翻译是需要 `apiKey` 与 `keyFrom` 参数的，其它翻译接口只需要创建一个实例即可。

另外，谷歌翻译与谷歌国内翻译返回的结果是完全一样的，只有一点不同：谷歌翻译需要翻墙使用，而谷歌国内翻译不需要。

## 许可

[MIT](https://github.com/Selection-Translator/translation.js/blob/master/LICENSE.md)
