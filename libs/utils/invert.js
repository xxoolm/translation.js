/**
 * 反转一个对象的键值对
 * @param obj
 * @return {Object}
 */
module.exports = function (obj) {
  var result = {}
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[obj[key]] = key
    }
  }
  return result
}
