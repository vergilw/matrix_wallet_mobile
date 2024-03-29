import f from './formatters'
import SolidityParam from './param'

/**
 * SolidityType prototype is used to encode/decode solidity params of certain type
 */
var SolidityType = function (config) {
  this._inputFormatter = config.inputFormatter
  this._outputFormatter = config.outputFormatter
}

/**
 * Should be used to determine if this SolidityType do match given name
 *
 * @method isType
 * @param {String} name
 * @return {Bool} true if type match this SolidityType, otherwise false
 */
SolidityType.prototype.isType = function (name) {
  throw new Error('this method should be overrwritten for type' + name)
}

/**
 * Should be used to determine what is the length of static part in given type
 *
 * @method staticPartLength
 * @param {String} name
 * @return {Number} length of static part in bytes
 */
SolidityType.prototype.staticPartLength = function (name) {
  // If name isn't an array then treat it like a single element array.
  return (this.nestedTypes(name) || ['[1]'])
    .map(function (type) {
      // the length of the nested array
      return parseInt(type.slice(1, -1), 10) || 1
    })
    .reduce(function (previous, current) {
      return previous * current
      // all basic types are 32 bytes long
    }, 32)
}

/**
 * Should be used to determine if type is dynamic array
 * eg:
 * "type[]" => true
 * "type[4]" => false
 *
 * @method isDynamicArray
 * @param {String} name
 * @return {Bool} true if the type is dynamic array
 */
SolidityType.prototype.isDynamicArray = function (name) {
  var nestedTypes = this.nestedTypes(name)
  return !!nestedTypes && !nestedTypes[nestedTypes.length - 1].match(/[0-9]{1,}/g)
}

/**
 * Should be used to determine if type is static array
 * eg:
 * "type[]" => false
 * "type[4]" => true
 *
 * @method isStaticArray
 * @param {String} name
 * @return {Bool} true if the type is static array
 */
SolidityType.prototype.isStaticArray = function (name) {
  var nestedTypes = this.nestedTypes(name)
  return !!nestedTypes && !!nestedTypes[nestedTypes.length - 1].match(/[0-9]{1,}/g)
}

/**
 * Should return length of static array
 * eg.
 * "int[32]" => 32
 * "int256[14]" => 14
 * "int[2][3]" => 3
 * "int" => 1
 * "int[1]" => 1
 * "int[]" => 1
 *
 * @method staticArrayLength
 * @param {String} name
 * @return {Number} static array length
 */
SolidityType.prototype.staticArrayLength = function (name) {
  var nestedTypes = this.nestedTypes(name)
  if (nestedTypes) {
    return parseInt(nestedTypes[nestedTypes.length - 1].match(/[0-9]{1,}/g) || 1)
  }
  return 1
}

/**
 * Should return nested type
 * eg.
 * "int[32]" => "int"
 * "int256[14]" => "int256"
 * "int[2][3]" => "int[2]"
 * "int" => "int"
 * "int[]" => "int"
 *
 * @method nestedName
 * @param {String} name
 * @return {String} nested name
 */
SolidityType.prototype.nestedName = function (name) {
  // remove last [] in name
  var nestedTypes = this.nestedTypes(name)
  if (!nestedTypes) {
    return name
  }

  return name.substr(0, name.length - nestedTypes[nestedTypes.length - 1].length)
}

/**
 * Should return true if type has dynamic size by default
 * such types are "string", "bytes"
 *
 * @method isDynamicType
 * @param {String} name
 * @return {Bool} true if is dynamic, otherwise false
 */
SolidityType.prototype.isDynamicType = function () {
  return false
}

/**
 * Should return array of nested types
 * eg.
 * "int[2][3][]" => ["[2]", "[3]", "[]"]
 * "int[] => ["[]"]
 * "int" => null
 *
 * @method nestedTypes
 * @param {String} name
 * @return {Array} array of nested types
 */
SolidityType.prototype.nestedTypes = function (name) {
  // return list of strings eg. "[]", "[3]", "[]", "[2]"
  return name.match(/(\[[0-9]*\])/g)
}

/**
 * Should be used to encode the value
 *
 * @method encode
 * @param {Object} value
 * @param {String} name
 * @return {String} encoded value
 */
SolidityType.prototype.encode = function (value, name) {
  var self = this
  if (this.isDynamicArray(name)) {
    return (function () {
      var length = value.length
      var nestedName = self.nestedName(name)
      var result = []
      result.push(f.formatInputInt(length).encode())
      value.forEach(function (v) {
        result.push(self.encode(v, nestedName))
      })

      return result
    })()
  } else if (this.isStaticArray(name)) {
    return (function () {
      var length = self.staticArrayLength(name)
      var nestedName = self.nestedName(name)
      var result = []
      for (var i = 0; i < length; i++) {
        result.push(self.encode(value[i], nestedName))
      }
      return result
    })()
  }
  return this._inputFormatter(value, name).encode()
}

/**
 * Should be used to decode value from bytes
 *
 * @method decode
 * @param {String} bytes
 * @param {Number} offset in bytes
 * @param {String} name type name
 * @returns {Object} decoded value
 */
SolidityType.prototype.decode = function (bytes, offset, name) {
  var self = this

  if (this.isDynamicArray(name)) {
    return (function () {
      var arrayOffset = parseInt('0x' + bytes.substr(offset * 2, 64))
      var length = parseInt('0x' + bytes.substr(arrayOffset * 2, 64))
      var arrayStart = arrayOffset + 32
      var nestedName = self.nestedName(name)
      var nestedStaticPartLength = self.staticPartLength(nestedName)
      var roundedNestedStaticPartLength = Math.floor((nestedStaticPartLength + 31) / 32) * 32
      var result = []

      for (var i = 0; i < length * roundedNestedStaticPartLength; i += roundedNestedStaticPartLength) {
        result.push(self.decode(bytes, arrayStart + i, nestedName))
      }

      return result
    })()
  } else if (this.isStaticArray(name)) {
    return (function () {
      var length = self.staticArrayLength(name)
      var arrayStart = offset
      var nestedName = self.nestedName(name)
      var nestedStaticPartLength = self.staticPartLength(nestedName)
      var roundedNestedStaticPartLength = Math.floor((nestedStaticPartLength + 31) / 32) * 32
      var result = []

      for (var i = 0; i < length * roundedNestedStaticPartLength; i += roundedNestedStaticPartLength) {
        result.push(self.decode(bytes, arrayStart + i, nestedName))
      }

      return result
    })()
  } else if (this.isDynamicType(name)) {
    return (function () {
      var dynamicOffset = parseInt('0x' + bytes.substr(offset * 2, 64))
      var length = parseInt('0x' + bytes.substr(dynamicOffset * 2, 64))
      var roundedLength = Math.floor((length + 31) / 32)
      var param = new SolidityParam(bytes.substr(dynamicOffset * 2, (1 + roundedLength) * 64), 0)
      return self._outputFormatter(param, name)
    })()
  }

  var length = this.staticPartLength(name)
  var param = new SolidityParam(bytes.substr(offset * 2, length * 2))
  return this._outputFormatter(param, name)
}

export default SolidityType
