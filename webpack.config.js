var pkg = require('./package.json')
var webpack = require('webpack')

module.exports = {
  entry: './lib/index.js',
  output: {
    path: './dist',
    filename: 'translation.js',
    library: 'tjs',
    libraryTarget: 'umd'
  },
  externals: [
    {
      superagent: true
    }
  ],
  plugins: [
    new webpack.BannerPlugin(
      'translation.js v' + pkg.version + '\n' +
      '' + pkg.homepage + '\n' +
      'Copyright 2015 ' + pkg.author + '\n' +
      'Licensed under ' + pkg.license, { entryOnly: true })
  ]
}
