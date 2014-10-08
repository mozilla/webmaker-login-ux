var Emitter = require('./emitter.js');

module.exports = function PersonaController(loginApi) {
  var emitter = new Emitter();

  var PERSONA_EVENTS = {
    signedIn: 'signedIn',
    newUser: 'newUser'
  };

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
    authenticate: function () {
      if (!window.navigator.id) {
        return console.error('No persona found. Did you load include.js?');
      }

      window.navigator.id.get(function (assertion) {
        if (!assertion) {
          return;
        }

        loginApi.personaLogin(assertion, function (err, resp, body) {
          if (err || resp.status !== 200 || body.error || body.err) {
            return;
          }

          if (body.user) {
            emit(PERSONA_EVENTS.signedIn, body.user);
          } else if (body.email) {
            emit(PERSONA_EVENTS.newUser, body.email);
          }
        });
      });
    }
  };
};
