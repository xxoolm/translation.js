const path = require('path')
const fs = require('fs-extra')
const config = require('./config')

// 清空输出目录
fs.emptyDirSync(path.resolve(__dirname, '../dist'))

// 编译 js
const rollup = require('rollup')
const uglifyJS = require('uglify-js')

rollup.rollup({
  input: config.input,
  external: config.external,
  plugins: [
    config.tp
  ]
}).then(bundle => {
  // 输出 umd 格式
  bundle.generate({
    format: 'iife',
    name: config.name,
    globals: {
      superagent: 'superagent',
      [path.resolve(__dirname, '../src/adapters/md5/node.ts')]: 'md5'
    },
    banner: config.banner
  }).then(({ code }) => {
    fs.writeFile(config.umdOutputPath, code)
    fs.writeFile(config.umdMinOutputPath, uglifyJS.minify(code, { output: { comments: /^!/ } }).code)
  })
})
