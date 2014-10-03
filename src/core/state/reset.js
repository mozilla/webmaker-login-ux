var Emitter = require('./emitter.js');
// var Validation = require('../validation');

module.exports = function ResetController() {
  var emitter = new Emitter();

  // function emit(event, data) {
  //   emitter.emit(event, data);
  // }

  // function notifySending(state) {
  //   emit('sendingRequest', state);
  // }

  return {
    on: function (event, listener) {
      emitter.addListener(event, listener);
    },
    off: function (event, listener) {
      if (!listener) {
        emitter.removeAllListeners(event);
        return;
      }
      emitter.removeListener(event, listener);
    }
  };
};
