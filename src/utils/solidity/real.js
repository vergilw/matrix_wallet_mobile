import f from './formatters'
import SolidityType from './type'

/**
 * SolidityTypeReal is a prootype that represents real type
 * It matches:
 * real
 * real[]
 * real[4]
 * real[][]
 * real[3][]
 * real[][6][], ...
 * real32
 * real64[]
 * real8[4]
 * real256[][]
 * real[3][]
 * real64[][6][], ...
 */
var SolidityTypeReal = function () {
  this._inputFormatter = f.formatInputReal
  this._outputFormatter = f.formatOutputReal
}

SolidityTypeReal.prototype = new SolidityType({})
SolidityTypeReal.prototype.constructor = SolidityTypeReal

SolidityTypeReal.prototype.isType = function (name) {
  return !!name.match(/real([0-9]*)?(\[([0-9]*)\])?/)
}

export default SolidityTypeReal
