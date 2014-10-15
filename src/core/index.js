var state = require('./state');
var storage = require('./storage');
var LoginAPI = require('./loginAPI');
var Emitter = require('./state/emitter');

module.exports = function WebmakerLoginCore(options) {
  var loginAPI = new LoginAPI(options);
  var emitter = new Emitter();

  function verify() {
    var storedUser = storage.get();

    if (storedUser) {
      emitter.emit('verified', storedUser, 'restored');
    } else {
      storedUser = {};
    }

    loginAPI.verify(function (err, resp, body) {
      if (err) {
        return emitter.emit('error', err);
      }

      try {
        body = JSON.parse(body);
      } catch (ex) {
        return emitter.emit('error', 'could not parse json from verify route');
      }

      if (storedUser.email && body.email === storedUser.email) {
        emitter.emit('verified', body.user, 'valid-session');
        storage.set(body.user);
      } else if (body.user) {
        emitter.emit('verified', body.user, 'email-mismatch');
        storage.set(body.user);
      } else {
        emitter.emit('logout');
        storage.clear();
      }
    });
  }

  window.addEventListener('focus', verify);

  return {
    on: function (event, listener) {
      emitter.on(event, listener);
    },
    off: function (event, listener) {
      emitter.off(event, listener);
    },
    joinWebmaker: function (showCTA) {
      return new state.JoinController(loginAPI, !! showCTA);
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
    instantLogin: function (uid, password, validFor) {
      loginAPI.verifyKey(uid, password, validFor, function (err, resp, body) {
        if (err || resp.status !== 200 || !body.user) {
          return emitter.emit('signinFailed', uid);
        }

        emitter.emit('signedIn', body.user);
      });
    },
    verify: verify
  };
};
