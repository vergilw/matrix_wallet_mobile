import utils from './utils'
import c from './config'
import SolidityParam from './param'

var BigNumber = require('bignumber.js')
/**
 * Formats input value to byte representation of int
 * If value is negative, return it's two's complement
 * If the value is floating point, round it down
 *
 * @method formatInputInt
 * @param {String|Number|BigNumber} value that needs to be formatted
 * @returns {SolidityParam}
 */
var formatInputInt = function (value) {
  BigNumber.config(c.ETH_BIGNUMBER_ROUNDING_MODE)
  var result = utils.padLeft(utils.toTwosComplement(value).toString(16), 64)
  return new SolidityParam(result)
}

/**
 * Formats input bytes
 *
 * @method formatInputBytes
 * @param {String}
 * @returns {SolidityParam}
 */
var formatInputBytes = function (value) {
  var result = utils.toHex(value).substr(2)
  var l = Math.floor((result.length + 63) / 64)
  result = utils.padRight(result, l * 64)
  return new SolidityParam(result)
}

/**
 * Formats input bytes
 *
 * @method formatDynamicInputBytes
 * @param {String}
 * @returns {SolidityParam}
 */
var formatInputDynamicBytes = function (value) {
  var result = utils.toHex(value).substr(2)
  var length = result.length / 2
  var l = Math.floor((result.length + 63) / 64)
  result = utils.padRight(result, l * 64)
  return new SolidityParam(formatInputInt(length).value + result)
}

/**
 * Formats input value to byte representation of string
 *
 * @method formatInputString
 * @param {String}
 * @returns {SolidityParam}
 */
var formatInputString = function (value) {
  var result = utils.fromUtf8(value).substr(2)
  var length = result.length / 2
  var l = Math.floor((result.length + 63) / 64)
  result = utils.padRight(result, l * 64)
  return new SolidityParam(formatInputInt(length).value + result)
}

/**
 * Formats input value to byte representation of bool
 *
 * @method formatInputBool
 * @param {Boolean}
 * @returns {SolidityParam}
 */
var formatInputBool = function (value) {
  var result = '000000000000000000000000000000000000000000000000000000000000000' + (value ? '1' : '0')
  return new SolidityParam(result)
}

/**
 * Formats input value to byte representation of real
 * Values are multiplied by 2^m and encoded as integers
 *
 * @method formatInputReal
 * @param {String|Number|BigNumber}
 * @returns {SolidityParam}
 */
var formatInputReal = function (value) {
  return formatInputInt(new BigNumber(value).times(new BigNumber(2).pow(128)))
}

/**
 * Check if input value is negative
 *
 * @method signedIsNegative
 * @param {String} value is hex format
 * @returns {Boolean} true if it is negative, otherwise false
 */
var signedIsNegative = function (value) {
  return (new BigNumber(value.substr(0, 1), 16).toString(2).substr(0, 1)) === '1'
}

/**
 * Formats right-aligned output bytes to int
 *
 * @method formatOutputInt
 * @param {SolidityParam} param
 * @returns {BigNumber} right-aligned output bytes formatted to big number
 */
var formatOutputInt = function (param) {
  var value = param.staticPart() || '0'

  // check if it's negative number
  // it it is, return two's complement
  if (signedIsNegative(value)) {
    return new BigNumber(value, 16).minus(new BigNumber('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 16)).minus(1)
  }
  return new BigNumber(value, 16)
}

/**
 * Formats right-aligned output bytes to uint
 *
 * @method formatOutputUInt
 * @param {SolidityParam}
 * @returns {BigNumeber} right-aligned output bytes formatted to uint
 */
var formatOutputUInt = function (param) {
  var value = param.staticPart() || '0'
  return new BigNumber(value, 16)
}

/**
 * Formats right-aligned output bytes to real
 *
 * @method formatOutputReal
 * @param {SolidityParam}
 * @returns {BigNumber} input bytes formatted to real
 */
var formatOutputReal = function (param) {
  return formatOutputInt(param).dividedBy(new BigNumber(2).pow(128))
}

/**
 * Formats right-aligned output bytes to ureal
 *
 * @method formatOutputUReal
 * @param {SolidityParam}
 * @returns {BigNumber} input bytes formatted to ureal
 */
var formatOutputUReal = function (param) {
  return formatOutputUInt(param).dividedBy(new BigNumber(2).pow(128))
}

/**
 * Should be used to format output bool
 *
 * @method formatOutputBool
 * @param {SolidityParam}
 * @returns {Boolean} right-aligned input bytes formatted to bool
 */
var formatOutputBool = function (param) {
  if (param.staticPart() === '0000000000000000000000000000000000000000000000000000000000000001') {
    return true
  } else {
    return false
  }
}
/**
 * Should be used to format output bytes
 *
 * @method formatOutputBytes
 * @param {SolidityParam} left-aligned hex representation of string
 * @param {String} name type name
 * @returns {String} hex string
 */
var formatOutputBytes = function (param, name) {
  var matches = name.match(/^bytes([0-9]*)/)
  var size = parseInt(matches[1])
  return '0x' + param.staticPart().slice(0, 2 * size)
}

/**
 * Should be used to format output bytes
 *
 * @method formatOutputDynamicBytes
 * @param {SolidityParam} left-aligned hex representation of string
 * @returns {String} hex string
 */
var formatOutputDynamicBytes = function (param) {
  var length = (new BigNumber(param.dynamicPart().slice(0, 64), 16)).toNumber() * 2
  return '0x' + param.dynamicPart().substr(64, length)
}

/**
 * Should be used to format output string
 *
 * @method formatOutputString
 * @param {SolidityParam} left-aligned hex representation of string
 * @returns {String} ascii string
 */
var formatOutputString = function (param) {
  var length = (new BigNumber(param.dynamicPart().slice(0, 64), 16)).toNumber() * 2
  return utils.toUtf8(param.dynamicPart().substr(64, length))
}

/**
 * Should be used to format output address
 *
 * @method formatOutputAddress
 * @param {SolidityParam} right-aligned input bytes
 * @returns {String} address
 */
var formatOutputAddress = function (param) {
  var value = param.staticPart()
  return '0x' + value.slice(value.length - 40, value.length)
}

export default {
  formatInputInt: formatInputInt,
  formatInputBytes: formatInputBytes,
  formatInputDynamicBytes: formatInputDynamicBytes,
  formatInputString: formatInputString,
  formatInputBool: formatInputBool,
  formatInputReal: formatInputReal,
  formatOutputInt: formatOutputInt,
  formatOutputUInt: formatOutputUInt,
  formatOutputReal: formatOutputReal,
  formatOutputUReal: formatOutputUReal,
  formatOutputBool: formatOutputBool,
  formatOutputBytes: formatOutputBytes,
  formatOutputDynamicBytes: formatOutputDynamicBytes,
  formatOutputString: formatOutputString,
  formatOutputAddress: formatOutputAddress
}
