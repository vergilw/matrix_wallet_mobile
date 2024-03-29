import f from './formatters'
import SolidityTypeAddress from './address'
import SolidityTypeBool from './bool'
import SolidityTypeInt from './int'
import SolidityTypeUInt from './uint'
import SolidityTypeDynamicBytes from './dynamicbytes'
import SolidityTypeString from './string'
import SolidityTypeReal from './real'
import SolidityTypeUReal from './ureal'
import SolidityTypeBytes from './bytes'
// import utils from './utils'

let isDynamic = function (solidityType, type) {
  return solidityType.isDynamicType(type) ||
    solidityType.isDynamicArray(type)
}

/**
 * SolidityCoder prototype should be used to encode/decode solidity params of any type
 */
var SolidityCoder = function (types) {
  this._types = types
}
/**
 * This method should be used to transform type to SolidityType
 *
 * @method _requireType
 * @param {String} type
 * @returns {SolidityType}
 * @throws {Error} throws if no matching type is found
 */
SolidityCoder.prototype._requireType = function (type) {
  var solidityType = this._types.filter(function (t) {
    return t.isType(type)
  })[0]

  if (!solidityType) {
    throw Error('invalid solidity type!: ' + type)
  }

  return solidityType
}
/**
 * Should be used to encode plain param
 *
 * @method encodeParam
 * @param {String} type
 * @param {Object} plain param
 * @return {String} encoded plain param
 */
SolidityCoder.prototype.encodeParam = function (type, param) {
  return this.encodeParams([type], [param])
}

/**
 * Should be used to encode list of params
 *
 * @method encodeParams
 * @param {Array} types
 * @param {Array} params
 * @return {String} encoded list of params
 */
SolidityCoder.prototype.encodeParams = function (types, params) {
  var solidityTypes = this.getSolidityTypes(types)

  var encodeds = solidityTypes.map(function (solidityType, index) {
    return solidityType.encode(params[index], types[index])
  })
  var dynamicOffset = solidityTypes.reduce(function (acc, solidityType, index) {
    var staticPartLength = solidityType.staticPartLength(types[index])
    var roundedStaticPartLength = Math.floor((staticPartLength + 31) / 32) * 32
    return acc + (isDynamic(solidityTypes[index], types[index]) ? 32 : roundedStaticPartLength)
  }, 0)

  var result = this.encodeMultiWithOffset(types, solidityTypes, encodeds, dynamicOffset)

  return result
}

SolidityCoder.prototype.encodeMultiWithOffset = function (types, solidityTypes, encodeds, dynamicOffset) {
  var result = ''
  var self = this

  types.forEach(function (type, i) {
    if (isDynamic(solidityTypes[i], types[i])) {
      result += f.formatInputInt(dynamicOffset).encode()
      var e = self.encodeWithOffset(types[i], solidityTypes[i], encodeds[i], dynamicOffset)
      dynamicOffset += e.length / 2
    } else {
      // don't add length to dynamicOffset. it's already counted
      result += self.encodeWithOffset(types[i], solidityTypes[i], encodeds[i], dynamicOffset)
    }

    // TODO: figure out nested arrays
  })

  types.forEach(function (type, i) {
    if (isDynamic(solidityTypes[i], types[i])) {
      var e = self.encodeWithOffset(types[i], solidityTypes[i], encodeds[i], dynamicOffset)
      dynamicOffset += e.length / 2
      result += e
    }
  })
  return result
}

// TODO: refactor whole encoding!
SolidityCoder.prototype.encodeWithOffset = function (type, solidityType, encoded, offset) {
  var self = this
  if (solidityType.isDynamicArray(type)) {
    // offset was already set
    var nestedName = solidityType.nestedName(type)
    var nestedStaticPartLength = solidityType.staticPartLength(nestedName)
    var result = encoded[0]
    var previousLength = 2
    if (solidityType.isDynamicArray(nestedName)) {
      for (let i = 1; i < encoded.length; i++) {
        previousLength += +(encoded[i - 1])[0] || 0
        result += f.formatInputInt(offset + i * nestedStaticPartLength + previousLength * 32).encode()
      }
    }
    for (let i = 0; i < encoded.length - 1; i++) {
      let additionalOffset = result / 2
      result += self.encodeWithOffset(nestedName, solidityType, encoded[i + 1], offset + additionalOffset)
    }
    return result
  } else if (solidityType.isStaticArray(type)) {
    let nestedName = solidityType.nestedName(type)
    let nestedStaticPartLength = solidityType.staticPartLength(nestedName)
    let result = ''
    if (solidityType.isDynamicArray(nestedName)) {
      let previousLength = 0
      for (let i = 0; i < encoded.length; i++) {
        // calculate length of previous item
        previousLength += +(encoded[i - 1] || [])[0] || 0
        result += f.formatInputInt(offset + i * nestedStaticPartLength + previousLength * 32).encode()
      }
    }
    for (let i = 0; i < encoded.length; i++) {
      let additionalOffset = result / 2
      result += self.encodeWithOffset(nestedName, solidityType, encoded[i], offset + additionalOffset)
    }

    return result
  }

  return encoded
}

/**
 * Should be used to decode bytes to plain param
 *
 * @method decodeParam
 * @param {String} type
 * @param {String} bytes
 * @return {Object} plain param
 */
SolidityCoder.prototype.decodeParam = function (type, bytes) {
  return this.decodeParams([type], bytes)[0]
}

/**
 * Should be used to decode list of params
 *
 * @method decodeParam
 * @param {Array} types
 * @param {String} bytes
 * @return {Array} array of plain params
 */
SolidityCoder.prototype.decodeParams = function (types, bytes) {
  var solidityTypes = this.getSolidityTypes(types)
  var offsets = this.getOffsets(types, solidityTypes)

  return solidityTypes.map(function (solidityType, index) {
    return solidityType.decode(bytes, offsets[index], types[index], index)
  })
}

SolidityCoder.prototype.getOffsets = function (types, solidityTypes) {
  var lengths = solidityTypes.map(function (solidityType, index) {
    return solidityType.staticPartLength(types[index])
  })

  for (let i = 1; i < lengths.length; i++) {
    // sum with length of previous element
    lengths[i] += lengths[i - 1]
  }

  return lengths.map(function (length, index) {
    // remove the current length, so the length is sum of previous elements
    var staticPartLength = solidityTypes[index].staticPartLength(types[index])
    return length - staticPartLength
  })
}

SolidityCoder.prototype.getSolidityTypes = function (types) {
  var self = this
  return types.map(function (type) {
    return self._requireType(type)
  })
}

var coder = new SolidityCoder([
  new SolidityTypeAddress(),
  new SolidityTypeBool(),
  new SolidityTypeInt(),
  new SolidityTypeUInt(),
  new SolidityTypeDynamicBytes(),
  new SolidityTypeBytes(),
  new SolidityTypeString(),
  new SolidityTypeReal(),
  new SolidityTypeUReal()
])
export default coder
