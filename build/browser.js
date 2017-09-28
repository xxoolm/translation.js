const path = require('path')
const fs = require('fs-extra')
const typescript = require('rollup-plugin-typescript2')
const pkg = require('../package.json')
const rollup = require('rollup')
const uglifyJS = require('uglify-js')

// 清空输出目录
fs.emptyDirSync(path.resolve(__dirname, '../dist'))

const md5Adapter = path.resolve(__dirname, '../src/adapters/md5/node.ts')

rollup.rollup({
  input: path.resolve(__dirname, '../src/index.ts'),
  external: [
    md5Adapter
  ],
  plugins: [
    typescript()
  ]
}).then(bundle => {
  // 输出 umd 格式
  bundle.generate({
    format: 'iife',
    name: 'tjs',
    globals: {
      [md5Adapter]: 'md5'
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
