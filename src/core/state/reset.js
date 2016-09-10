var Emitter = require('./emitter.js');
var validation = require('../validation');
var analytics = require('webmaker-analytics');

module.exports = function ResetController(loginApi) {
  var emitter = new Emitter();

  var RESET_ALERTS = {
    passwordsMustMatch: 'passwordsMustMatch',
    weakPassword: 'weakPassword',
    serverError: 'serverError'
  };

  var RESET_EVENTS = {
    sendingRequest: 'sendingRequest',
    displayAlert: 'displayAlert',
    hideAlert: 'hideAlert',
    resetSucceeded: 'resetSucceeded',
    passwordCheckResult: 'passwordCheckResult',
    checkConfirmPassword: 'checkConfirmPassword'
  };

  function emit() {
    emitter.emit.apply(emitter, arguments);
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
      emitter.on(event, listener);
    },
    off: function (event, listener) {
      emitter.off(event, listener);
    },
    passwordsMatch: function (password, confirmValue, blur) {
      if (validation.passwordsMatch(password, confirmValue)) {
        hideAlert(RESET_ALERTS.passwordsMustMatch);
        emit(RESET_EVENTS.checkConfirmPassword, true);
      } else {
        if (blur) {
          displayAlert(RESET_ALERTS.passwordsMustMatch);
        }
        emit(RESET_EVENTS.checkConfirmPassword, false);
      }
    },
    checkPasswordStrength: function (password, blur) {
      emit(RESET_EVENTS.passwordCheckResult, validation.checkPasswordStrength(password), blur);
    },
    submitResetRequest: function (resetCode, password) {
      hideAlert(RESET_ALERTS.serverError);
      hideAlert(RESET_ALERTS.weakPassword);
      setRequestState(true);
      loginApi.resetPassword(resetCode, password, function (err, resp) {
        setRequestState(false);
        if (resp.status !== 200) {
          if (resp.status === 400) {
            return displayAlert(RESET_ALERTS.weakPassword);
          }
          return displayAlert(RESET_ALERTS.serverError);
        }

        analytics.event('Webmaker Password Reset Succeeded');
        window.location = '/';
        //emit(RESET_EVENTS.resetSucceeded);
      });
    }
  };
};
