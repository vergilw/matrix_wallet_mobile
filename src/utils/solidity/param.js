import utils from './utils'

var SolidityParam = function (value, offset) {
  this.value = value || ''
  this.offset = offset // offset in bytes
}

/**
 * This method should be used to get length of params's dynamic part
 * @method dynamicPartLength
 * @returns {Number} length of dynamic part (in bytes)
 */
SolidityParam.prototype.dynamicPartLength = function () {
  return this.dynamicPart().length / 2
}

/**
 * This method should be used to create copy of solidity param with different offset
 *
 * @method withOffset
 * @param {Number} offset length in bytes
 * @returns {SolidityParam} new solidity param with applied offset
 */
SolidityParam.prototype.withOffset = function (offset) {
  return new SolidityParam(this.value, offset)
}

/**
 * This method should be used to combine solidity params together
 * eg. when appending an array
 *
 * @method combine
 * @param {SolidityParam} param with which we should combine
 * @param {SolidityParam} result of combination
 */
SolidityParam.prototype.combine = function (param) {
  return new SolidityParam(this.value + param.value)
}

/**
 * This method should be called to check if param has dynamic size.
 * If it has, it returns true, otherwise false
 *
 * @method isDynamic
 * @returns {Boolean}
 */
SolidityParam.prototype.isDynamic = function () {
  return this.offset !== undefined
}

/**
 * This method should be called to transform offset to bytes
 *
 * @method offsetAsBytes
 * @returns {String} bytes representation of offset
 */
SolidityParam.prototype.offsetAsBytes = function () {
  return !this.isDynamic() ? '' : utils.padLeft(utils.toTwosComplement(this.offset).toString(16), 64)
}

/**
 * This method should be called to get static part of param
 *
 * @method staticPart
 * @returns {String} offset if it is a dynamic param, otherwise value
 */
SolidityParam.prototype.staticPart = function () {
  if (!this.isDynamic()) {
    return this.value
  }
  return this.offsetAsBytes()
}

/**
 * This method should be called to get dynamic part of param
 *
 * @method dynamicPart
 * @returns {String} returns a value if it is a dynamic param, otherwise empty string
 */
SolidityParam.prototype.dynamicPart = function () {
  return this.isDynamic() ? this.value : ''
}

/**
 * This method should be called to encode param
 *
 * @method encode
 * @returns {String}
 */
SolidityParam.prototype.encode = function () {
  return this.staticPart() + this.dynamicPart()
}

/**
 * This method should be called to encode array of params
 *
 * @method encodeList
 * @param {Array[SolidityParam]} params
 * @returns {String}
 */
SolidityParam.encodeList = function (params) {
  // updating offsets
  var totalOffset = params.length * 32
  var offsetParams = params.map(function (param) {
    if (!param.isDynamic()) {
      return param
    }
    var offset = totalOffset
    totalOffset += param.dynamicPartLength()
    return param.withOffset(offset)
  })

  // encode everything!
  return offsetParams.reduce(function (result, param) {
    return result + param.dynamicPart()
  }, offsetParams.reduce(function (result, param) {
    return result + param.staticPart()
  }, ''))
}
export default SolidityParam
