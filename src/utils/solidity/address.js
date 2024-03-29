import f from './formatters'
import SolidityType from './type'

/**
 * SolidityTypeAddress is a prootype that represents address type
 * It matches:
 * address
 * address[]
 * address[4]
 * address[][]
 * address[3][]
 * address[][6][], ...
 */
var SolidityTypeAddress = function () {
  this._inputFormatter = f.formatInputInt
  this._outputFormatter = f.formatOutputAddress
}

SolidityTypeAddress.prototype = new SolidityType({})
SolidityTypeAddress.prototype.constructor = SolidityTypeAddress

SolidityTypeAddress.prototype.isType = function (name) {
  return !!name.match(/address(\[([0-9]*)\])?/)
}

export default SolidityTypeAddress
