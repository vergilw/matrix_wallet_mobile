import f from './formatters'
import SolidityType from './type'

/**
 * SolidityTypeUInt is a prootype that represents uint type
 * It matches:
 * uint
 * uint[]
 * uint[4]
 * uint[][]
 * uint[3][]
 * uint[][6][], ...
 * uint32
 * uint64[]
 * uint8[4]
 * uint256[][]
 * uint[3][]
 * uint64[][6][], ...
 */
var SolidityTypeUInt = function () {
  this._inputFormatter = f.formatInputInt
  this._outputFormatter = f.formatOutputUInt
}

SolidityTypeUInt.prototype = new SolidityType({})
SolidityTypeUInt.prototype.constructor = SolidityTypeUInt

SolidityTypeUInt.prototype.isType = function (name) {
  return !!name.match(/^uint([0-9]*)?(\[([0-9]*)\])*$/)
}

export default SolidityTypeUInt
