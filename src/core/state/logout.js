var Emitter = require('./emitter.js');

module.exports = function (loginAPI) {
  var emitter = new Emitter();

  function emit() {
    emitter.emit.apply(emitter, arguments);
  }

  return {
    on: function (event, listener) {
      emitter.on(event, listener);
    },
    off: function (event, listener) {
      emitter.off(event, listener);
    },
    logout: function () {
      loginAPI.logout(function (err, resp, body) {
        if (err || resp.status !== 200) {
          return emit('logoutFailed');
        }
        emit('loggedOut');
      });
    }
  };
};
