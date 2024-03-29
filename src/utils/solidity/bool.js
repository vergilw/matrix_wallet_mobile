import f from './formatters'
import SolidityType from './type'

/**
 * SolidityTypeBool is a prootype that represents bool type
 * It matches:
 * bool
 * bool[]
 * bool[4]
 * bool[][]
 * bool[3][]
 * bool[][6][], ...
 */
var SolidityTypeBool = function () {
  this._inputFormatter = f.formatInputBool
  this._outputFormatter = f.formatOutputBool
}

SolidityTypeBool.prototype = new SolidityType({})
SolidityTypeBool.prototype.constructor = SolidityTypeBool

SolidityTypeBool.prototype.isType = function (name) {
  return !!name.match(/^bool(\[([0-9]*)\])*$/)
}

export default SolidityTypeBool
