/**
 * This things are empty
 * 1. undefined, null, void 0, [], {},
 * 2. object with .length === 0,
 * 3. object without a own enumerable property
 * @param {Object} obj
 * @return Boolean
 */
module.exports = function isEmpty (obj) {
  if (obj == null) return true
  if (obj.length !== undefined) return obj.length === 0
  return Object.keys(obj).length === 0
}
