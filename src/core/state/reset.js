var Emitter = require('./emitter.js');
var validation = require('../validation');

module.exports = function ResetController(loginApi) {
  var emitter = new Emitter();

  var RESET_ALERTS = {
    passwordsMustMatch: 'passwordsMustMatch',
    serverError: 'serverError'
  };

  var RESET_EVENTS = {
    sendingRequest: 'sendingRequest',
    displayAlert: 'displayAlert',
    hideAlert: 'hideAlert',
    resetSucceeded: 'resetSucceeded',
    passwordCheckResult: 'passwordCheckResult'
  };

  function emit(event, data) {
    emitter.emit(event, data);
  }

  function setRequestState(state) {
    emit(RESET_EVENTS.sendingRequest, state);
  }

  function displayAlert(alertId) {
    emit(RESET_EVENTS.displayAlert, alertId);
  }

  function hideAlert(alertId) {
    emit(RESET_EVENTS.hideAlert, alertId);
  }

  return {
    on: function (event, listener) {
      emitter.addListener(event, listener);
    },
    off: function (event, listener) {
      if (!listener) {
        return emitter.removeAllListeners(event);
      }
      emitter.removeListener(event, listener);
    },
    passwordsMatch: function (password, confimValue) {
      if (validation.passwordsMatch(password, confimValue)) {
        hideAlert(RESET_ALERTS.passwordsMustMatch);
      } else {
        displayAlert(RESET_ALERTS.passwordsMustMatch);
      }
    },
    checkPasswordStrength: function (password, blur) {
      emit(RESET_EVENTS.passwordCheckResult, validation.checkPasswordStrength(password), blur);
    },
    submitResetRequest: function (uid, resetCode, password) {
      hideAlert(RESET_ALERTS.serverError);

      setRequestState(true);
      loginApi.resetPassword(uid, resetCode, password, function (err, resp, body) {
        setRequestState(false);
        if (err || resp.status !== 200 || body.status !== 200) {
          return emit(RESET_ALERTS.serverError);
        }

        emit(RESET_EVENTS.resetSucceeded);
      });
    }
  };
};
