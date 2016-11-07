var BaiDu = require('../lib/APIs/baidu')
var baidu = new BaiDu({ apiKey: 'Hs18iW3px3gQ6Yfy6Za0QGg4' })
var nock = require('nock')

nock.disableNetConnect()

require('./standard')(BaiDu)
