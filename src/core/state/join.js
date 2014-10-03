var Emitter = require('./emitter.js');
var validation = require('../validation');

module.exports = function JoinController(loginApi) {

  var emitter = new Emitter();

  var JOIN_ALERTS = {
    agreeToTerms: 'agreeToTerms',
    accountExists: 'accountExists',
    invalidEmail: 'invalidEmail',
    invalidUsername: 'invalidUsername',
    usernameTaken: 'usernameTaken',
    serverError: 'serverError'
  };

  function emit(event, data) {
    emitter.emit(event, data);
  }

  function setRequestState(state) {
    emit('sendingRequest', state);
  }

  function clearAlerts() {
    Object.keys(JOIN_ALERTS).forEach(function (errId) {
      emit('setValidity', errId, true);
    });
  }

  function uidExistsCallback(err, resp, body) {
    setRequestState(false);
    if (err || resp.status !== 200) {
      return emit('setValidity', JOIN_ALERTS.serverError, false);
    }

    if (body.exists) {
      return emit('setValidity', JOIN_ALERTS.accountExists, false);
    }

    emit('displayUsernameInput');
  }

  function usernameExistsCallback(err, resp, body) {
    setRequestState(false);

    if (err || resp.status !== 200) {
      return emit('setValidity', JOIN_ALERTS.serverError, false);
    }

    if (body.exists) {
      return emit('setValidity', JOIN_ALERTS.usernameTaken, false);
    }

    emit('displayUsernameInput');

  }

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
    },
    start: function () {
      clearAlerts();
      emit('displayEmailInput');
    },
    validateEmail: function (email) {
      clearAlerts();

      var valid = validation.isEmail(email);

      if (!valid) {
        emit('setValidity', JOIN_ALERTS.invalidUsername, false);
        return;
      }

      setRequestState(true);

      loginApi.uidExists(email, uidExistsCallback);
    },
    validateUsername: function (username) {
      clearAlerts();

      var valid = validation.isUsername(username);

      if (!valid) {
        return emit('setValidity', JOIN_ALERTS.invalidUsername, false);
      }

      setRequestState(true);

      loginApi.uidExists(username, usernameExistsCallback);
    },
    submitUser: function (formData) {
      emit('clearAlerts');

      if (!validation.join.canSubmit(formData)) {
        return;
      }

      setRequestState(true);
      loginApi.createUser({
        email: formData.email,
        username: formData.username
      }, function (err) {
        setRequestState(false);
        if (err) {
          emit(err.event);
          return;
        }
        emit('displayWelcome');
      });
    }
  };
};
