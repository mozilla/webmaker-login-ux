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

  var JOIN_EVENTS = {
    sendingRequest: 'sendingRequest',
    displayAlert: 'displayAlert',
    hideAlert: 'hideAlert',
    displayUsernameInput: 'displayUsernameInput',
    displayEmailInput: 'displayEmailInput',
    displayWelcome: 'displayWelcome'
  };

  function emit() {
    emitter.emit.apply(emitter, arguments);
  }

  function setRequestState(state) {
    emit(JOIN_EVENTS.sendingRequest, state, !state ? true : false);
  }

  function displayAlert(alertId, forceUpdate) {
    emit(JOIN_EVENTS.displayAlert, alertId, forceUpdate);
  }

  function clearAlerts(alerts) {
    alerts = Array.isArray(alerts) ? alerts : [alerts];
    alerts.forEach(function (alert) {
      emit(JOIN_EVENTS.hideAlert, alert);
    });
  }

  function validateEmailCallback(err, resp, body) {
    setRequestState(false);
    if (err || resp.status !== 200) {
      return displayAlert(JOIN_ALERTS.serverError, true);
    }

    if (body.exists) {
      return displayAlert(JOIN_ALERTS.accountExists, true);
    }
  }

  function usernameExistsCallback(err, resp, body) {
    setRequestState(false);

    if (err || resp.status !== 200) {
      return displayAlert(JOIN_ALERTS.serverError, true);
    }

    if (body.exists) {
      return displayAlert(JOIN_ALERTS.usernameTaken, true);
    }

    emit(JOIN_EVENTS.displayUsernameInput);

  }

  return {
    on: function (event, listener) {
      emitter.on(event, listener);
    },
    off: function (event, listener) {
      if (!listener) {
        return emitter.off(event);
      }
      emitter.removeListener(event, listener);
    },
    start: function () {
      emit(JOIN_EVENTS.displayEmailInput);
    },
    validateEmail: function (email) {
      clearAlerts([
        JOIN_ALERTS.invalidEmail,
        JOIN_ALERTS.accountExists,
        JOIN_ALERTS.serverError
      ]);

      var valid = validation.isEmail(email);

      if (!valid) {
        return displayAlert(JOIN_ALERTS.invalidEmail);
      }

      setRequestState(true);

      loginApi.uidExists(email, validateEmailCallback);
    },
    submitEmail: function () {
      emit(JOIN_EVENTS.displayUsernameInput);
    },
    validateUsername: function (username) {
      clearAlerts([
        JOIN_ALERTS.invalidUsername,
        JOIN_ALERTS.usernameTaken,
        JOIN_ALERTS.serverError
      ]);

      if (!username) {
        return;
      }

      var valid = validation.isUsername(username);

      if (!valid) {
        return displayAlert(JOIN_ALERTS.invalidUsername);
      }

      setRequestState(true);

      loginApi.uidExists(username, usernameExistsCallback);
    },
    submitUser: function (formData) {
      clearAlerts([
        JOIN_ALERTS.agreeToTerms,
        JOIN_ALERTS.serverError,
      ]);

      setRequestState(true);
      loginApi.createUser({
        email: formData.email,
        username: formData.username,
        mailingList: formData.subscribeToList
      }, function (err, resp, body) {
        setRequestState(false);
        if (err || resp.status !== 200) {
          return displayAlert(JOIN_ALERTS.serverError);
        }
        emit(JOIN_EVENTS.displayWelcome, body.user);
      });
    }
  };
};
