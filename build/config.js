const path = require('path')
const typescript = require('rollup-plugin-typescript2')
const pkg = require('../package.json')

module.exports = {
  input: path.resolve(__dirname, '../src/index.ts'),
  name: 'tjs',
  tp: typescript({
    useTsconfigDeclarationDir: true
  }),
  external: Object.keys(pkg.dependencies),
  esOutputPath: path.resolve(__dirname, '../dist/translator.esm.js'),
  cjsOutputPath: path.resolve(__dirname, '../dist/translator.common.js'),
  umdOutputPath: path.resolve(__dirname, '../dist/translator.js'),
  umdMinOutputPath: path.resolve(__dirname, '../dist/translator.min.js'),
  banner: [
    '/*!',
    ' * translator.js v' + pkg.version,
    ' * https://github.com/Selection-Translator/translation.js',
    ' * Released under the MIT License.',
    ' */'
  ].join('\n')
}
