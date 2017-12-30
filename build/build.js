const path = require('path')
const fs = require('fs-extra')
const rollup = require('rollup')
const typescript = require('rollup-plugin-typescript2')
const replace = require('rollup-plugin-replace')

// 清空输出目录
fs.emptyDirSync('./dist')
fs.emptyDirSync('./declaration')

const adapters = {
  '/make-request': './src/utils/make-request/browser.ts'
}

function roll(browser) {
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
        compilerOptions: browser
          ? { declarationDir: 'declaration' }
          : { declaration: false }
      }
    })
  )

  rollup
    .rollup({
      input: './src/index.ts',
      external: ['tslib'],
      plugins
    })
    .then(bundle => {
      bundle.write({
        file: `./dist/tmw${browser ? '.browser' : ''}.c.js`,
        format: 'cjs'
      })

      bundle.write({
        file: `./dist/tmw${browser ? '.browser' : ''}.es.js`,
        format: 'es'
      })
    })
}

roll(false)
roll(true)
