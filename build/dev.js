const config = require('./config')

module.exports = {
  input: config.input,
  external: config.external,
  plugins: [
    config.tp
  ],
  output: {
    file: config.cjsOutputPath,
    format: 'cjs'
  }
}
