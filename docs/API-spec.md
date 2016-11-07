# 翻译接口定义

一个翻译接口其实是一个对象，这个对象的结构如下所示：

```js
var myAPI = {
  name: '我的翻译', // 翻译接口的中文名称，例如 "有道翻译"
  type: 'myAPI', // 翻译接口的类型，在使用 tjs.add() 方法添加翻译接口时，多个相同类型的翻译接口会被视为同一组翻译接口轮流调用，以达到负载均衡的目的。
  link: 'http://my.api.com', // 这个翻译接口的在线翻译地址，若没有则不写
  translate: function (queryObj) { return Promise.resolve(resultObj) }, // 翻译的方法，这个方法必需返回一个 Promise 对象，值为一个 result 对象。query 对象与 result 对象的定义见后文
  detect: function (queryObj) { return Promise.resolve('zh') }, // 检测文本语种的方法，这个方法必需返回一个 Promise 对象，值为一个字符串。如果是一个不支持的语种则返回 null
  audio: function (queryObj) { return Promise.resolve('http://path.to/audio/url') } // 文本的在线音频的地址，这个方法必需返回一个 Promise 对象，值为一个字符串。如果不支持则返回 null
```

> 以上这些属性与方法中，`detect()` 与 `audio()` 方法是可选的，但其它的都是必需有的。

定义好自己的翻译接口之后，就可以把它添加进 tjs 中使用了：

```js
tjs.add(myAPI)

tjs.translate({ api: 'myAPI', text: 'hello world' })
tjs.detect({ api: 'myAPI', text: 'hello world' })
tjs.audio({ api: 'myAPI', text: 'hello world' })
```

### 查询（Query）对象

上面的例子中出现的 `queryObj` 的结构如下：

```js
var queryObj = {
  text: 'some text', // 要查询的文本
  api: 'myAPI', // 要使用哪个接口查询
  from: '', // 文本的源语种。没有则留空，交由翻译接口自行判断
  to: '', // 如果是要调用 translate() 方法，则可以指定要翻译到哪个语种，若不提供则交由翻译接口自行指定；另外，翻译接口可能会因为不支持目标语种而翻译成别的语种。
}
```

### 结果（Result）对象

上面例子中调用 `tjs.translate(queryObj)` 的结果对象 `resultObj` 的结构如下：

```js
var resultObj = {
  text: 'some text', // 等同于查询对象的 text
  api: myAPI, // 由哪个翻译接口处理的这次查询。此时翻译接口会被转换成 JSON 对象，所以方法（`translate()`、`audio()` 等）会被丢弃，但属性（`name`、`type` 等）会保留下来
  response: {}, // 翻译接口提供的原始的、未经转换的查询结果

  // 如果此次请求正常
  linkToResult: 'http://my.api/online', // 此翻译接口的在线查询地址。可选
  from: 'zh', // 由翻译接口提供的源语种，注意可能会与查询对象的 from 不同。可选
  to: 'en', // 由翻译接口提供的目标语种，注意可能会与查询对象的 to 不同。可选
  phonetic: 'aue', // 音标。可选
  phonetic: [{ type: '英', value: 'asc' }], // 若有多个音标（例如美音和英音），则使用数组描述。可选
  detailed: ['详细释义一', '详细释义二'], // 如果查询的是英文单词，有的翻译接口（例如有道翻译）会返回这个单词的详细释义。可选
  result: ['结果一', '结果二'] // 翻译结果，可以有多条（例如一个段落对应一个翻译结果）。可选

  // 如果此次请求不正常，
  // 例如接口返回的数据结构有误、
  // 接口返回了一个错误码（例如有道最多只能查询 200 个字符，若超过就会返回一个错误码）等
  // 则提供一条错误消息，
  // 告知用户发生了什么错误。
  error: '此处是错误消息，例如"翻译接口没有返回查询结果，请稍后重试。"或"查询文本过长"'
}
```

上面的这些属性中，`text` 与 `api` 是无需翻译接口提供的，translation.js 会自动为你加上。

### 语种标准

每个翻译接口表示一个语种的代号可能不尽相同，例如英文的语种代号一般为 "en"，但有道翻译内英语用 "eng" 表示。

所以，translation.js 统一使用标准的语种代码来表示语种，翻译接口需要自行从标准语种转换为接口自定义的语种表示方法（反之亦然）。

### 最佳实践

翻译接口应该用一个构造函数表示，例如：

```js
function MyAPI (options) {
  this.name = '我的翻译接口'
  this.type = 'myAPI'
  this.link = 'http://my.api/'
}
MyAPI.prototype.translate = function (queryObj) { ... }

tjs.add(new MyAPI({ key: 'xxx' }))
```
