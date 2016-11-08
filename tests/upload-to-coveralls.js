var fs = require('fs')
var coveralls = require('coveralls')
var lcovPath = require('path').resolve(process.cwd(), 'coverage/lcov.info')

if (process.env.TRAVIS) {
  send()
}

// 下面的代码全都来自 [karma-coveralls](https://github.com/caitp/karma-coveralls/blob/1.1.2/lib/index.js)
function send () {
  coveralls.getBaseOptions(function (err, options) {
    if (err) throw err
    options.filepath = '.'
    coveralls.convertLcovToCoveralls(fs.readFileSync(lcovPath, 'utf8').toString(), options, function (err, postData) {
      if (err) throw err
      coveralls.sendToCoveralls(postData, function (err, response, body) {
        console.info('正在上传...')
        sendToCoveralls(err, response, body)
      })
    })
  })
}

function sendToCoveralls (err, response, body) {
  if (err) throw err
  // check coveralls.io for issues, they send 200 even when down for maintenance :-\
  var isJSON
  try {
    JSON.parse(body)
    isJSON = true
  } catch (e) {
    isJSON = false
  }
  if (!response) {
    // Unknown error, response object mysteriously undefined.
    response = {
      statusCode: 0
    }
  }
  if ((response.statusCode >= 200 && response.statusCode < 300) && isJSON) {
    console.info('%d --- %s', response.statusCode, success(body))
  } else {
    console.info('%d --- %s', response.statusCode, body)
  }
}

function success (body) {
  if (typeof body === 'string') body = JSON.parse(body)
  if ('message' in body && 'url' in body) {
    return body.message + ' (' + body.url + ')'
  }
  return 'OK'
}
