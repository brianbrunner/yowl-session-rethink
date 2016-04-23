// Instantiate thinky with the provided options
var _thinky;
module.exports.init = function(options) {
  if (!_thinky) {
    _thinky = require('thinky')(options);
    module.exports = _thinky;
  }
};
