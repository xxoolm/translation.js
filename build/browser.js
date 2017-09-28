const path = require('path')
const fs = require('fs-extra')
const typescript = require('rollup-plugin-typescript2')
const pkg = require('../package.json')
const rollup = require('rollup')
const uglifyJS = require('uglify-js')

// 清空输出目录
fs.emptyDirSync(path.resolve(__dirname, '../dist'))

const xhrAdapter = path.resolve(__dirname, '../src/adapters/http/xhr.ts')

rollup.rollup({
  input: path.resolve(__dirname, '../src/index.ts'),
  external: ['blueimp-md5'],
  plugins: [
    {
      resolveId (importee) {
        // 将 http adapter 替换成 xhr adapter
        if (importee.endsWith('/adapters/http/node')) {
          return xhrAdapter
        }
        // 将 Node.js 中的 md5 实现替换成浏览器端的 md5 实现
        if (importee.endsWith('/adapters/md5/node')) {
          return 'blueimp-md5'
        }
      }
    },
    typescript()
  ]
}).then(bundle => {
  // 输出 umd 格式
  bundle.generate({
    format: 'umd',
    name: 'tjs',
    globals: {
      'blueimp-md5': 'md5'
    },
    banner: [
      '/*!',
      ' * translator.js v' + pkg.version,
      ' * https://github.com/Selection-Translator/translation.js',
      ' * Released under the MIT License.',
      ' */'
    ].join('\n')
  }).then(({ code }) => {
    fs.writeFile(path.resolve(__dirname, '../dist/translator.js'), code)
    fs.writeFile(path.resolve(__dirname, '../dist/translator.min.js'), uglifyJS.minify(code, { output: { comments: /translator\.js/ } }).code)
  })
})
