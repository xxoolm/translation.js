const path = require('path')
const fs = require('fs-extra')
const rollup = require('rollup')
const typescript = require('rollup-plugin-typescript2')
const replace = require('rollup-plugin-replace')

// 清空输出目录
fs.emptyDirSync('./dist')
fs.emptyDirSync('./declaration')

const adapters = {
  '/make-request': './src/utils/make-request/browser.ts',
  '/md5': './src/utils/md5/browser.ts'
}

function roll(browser, traditional) {
  const plugins = [
    replace({
      IS_NODE: JSON.stringify(!browser)
    })
  ]

  if (browser) {
    plugins.push({
      resolveId(importee) {
        for (let name in adapters) {
          if (importee.endsWith(name)) {
            // 必须是一个绝对路径
            return path.resolve(adapters[name])
          }
        }
      }
    })
  }

  plugins.push(
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions:
          browser && !traditional
            ? { declarationDir: 'declaration' }
            : { declaration: false }
      }
    })
  )

  const external = ['tslib']

  if (browser) {
    //  给 <script> 使用的版本要将 tslib 打包进去
    if (traditional) {
      external.pop()
    }
    external.push('blueimp-md5')
  } else {
    external.push('http', 'https', 'url', 'querystring', 'crypto')
  }

  rollup
    .rollup({
      input: './src/index.ts',
      external,
      plugins
    })
    .then(bundle => {
      if (traditional) {
        bundle.write({
          name: 'tjs',
          globals: {
            'blueimp-md5': 'md5'
          },
          file: `./dist/tjs.browser.js`,
          format: 'iife'
        })
      } else {
        bundle.write({
          file: `./dist/tjs.${browser ? 'browser' : 'node'}.common.js`,
          format: 'cjs'
        })

        bundle.write({
          file: `./dist/tjs.${browser ? 'browser' : 'node'}.es.js`,
          format: 'es'
        })
      }
    })
}

roll(false)
roll(true)
roll(true, true)
