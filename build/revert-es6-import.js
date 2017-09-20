const fs = require('fs')
const path = require('path')

const file = path.resolve(__dirname, '../src/api/youdao.ts')

const str = fs.readFileSync(file, 'utf8')

fs.writeFileSync(file, str.replace('import md5 = require(\'blueimp-md5\')', 'import md5 from \'blueimp-md5\''))
