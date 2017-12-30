const path = require('path')
const fs = require('fs-extra')
const rollup = require('rollup')
const typescript = require('rollup-plugin-typescript2')
const replace = require('rollup-plugin-replace')

// 清空输出目录
fs.emptyDirSync(path.resolve(__dirname, '../dist'))

const xhrAdapter = path.resolve(__dirname, '../src/adapters/http/xhr.ts')

function roll(browser) {
  const plugins = [
    replace({
      IS_NODE: JSON.stringify(!browser)
    })
  ]

  if (browser) {
    plugins.push({
      resolveId(importee) {
        // 将 http adapter 替换成 xhr adapter
        if (importee.endsWith('/adapters/http/node')) {
          return xhrAdapter
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
      input: path.resolve(__dirname, '../src/index.ts'),
      external: ['tslib'],
      plugins
    })
    .then(bundle => {
      bundle.write({
        file: path.resolve(
          __dirname,
          `../dist/tmw${browser ? '.browser' : ''}.c.js`
        ),
        format: 'cjs'
      })

      bundle.write({
        file: path.resolve(
          __dirname,
          `../dist/tmw${browser ? '.browser' : ''}.es.js`
        ),
        format: 'es'
      })
    })
}

roll(false)
roll(true)
