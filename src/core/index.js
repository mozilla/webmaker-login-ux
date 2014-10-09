var state = require('./state');
var LoginAPI = require('./loginAPI');
var Emitter = require('./state/emitter');

module.exports = function WebmakerLoginCore(options) {
  var loginAPI = new LoginAPI(options);
  var emitter = new Emitter();

  return {
    on: function(event, listener) {
      emitter.on(event, listener);
    },
    off: function(event, listener) {
      emitter.off(event, listener);
    },
    joinWebmaker: function () {
      return new state.JoinController(loginAPI);
    },
    signIn: function () {
      return new state.SignInController(loginAPI);
    },
    resetPassword: function () {
      return new state.ResetController(loginAPI);
    },
    personaLogin: function () {
      return new state.PersonaController(loginAPI);
    },
    logout: function () {
      return new state.LogoutController(loginAPI);
    },
    instantLogin: function(uid, password, validFor) {
      loginAPI.verifyKey(uid, password, validFor, function(err, resp, body) {
        if ( err || resp.status !== 200 || !body.user ) {
          return emitter.emit('signinFailed', uid);
        }

        emitter.emit('signedIn', body.user);
      });
    }
  };
};
