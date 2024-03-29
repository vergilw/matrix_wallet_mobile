import f from './formatters'
import SolidityType from './type'

var SolidityTypeDynamicBytes = function () {
  this._inputFormatter = f.formatInputDynamicBytes
  this._outputFormatter = f.formatOutputDynamicBytes
}

SolidityTypeDynamicBytes.prototype = new SolidityType({})
SolidityTypeDynamicBytes.prototype.constructor = SolidityTypeDynamicBytes

SolidityTypeDynamicBytes.prototype.isType = function (name) {
  return !!name.match(/^bytes(\[([0-9]*)\])*$/)
}

SolidityTypeDynamicBytes.prototype.isDynamicType = function () {
  return true
}

export default SolidityTypeDynamicBytes
