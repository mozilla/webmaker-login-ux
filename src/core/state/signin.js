var Emitter = require('./emitter.js');
var validation = require('../validation');

module.exports = function SignInController(loginApi) {

  var emitter = new Emitter();

  var SIGNIN_ALERTS = {
    paswordReset: 'paswordReset',
    noAccount: 'noAccount',
    invalidUid: 'invalidUid',
    serverError: 'serverError',
    invalidKey: 'invalidKey',
    passwordSigninFailed: 'passwordSigninFailed',
    resetRequestFailed: 'resetRequestFailed'
  };

  var SIGNIN_EVENTS = {
    sendingRequest: 'sendingRequest',
    displayAlert: 'displayAlert',
    hideAlert: 'hideAlert',
    displayEnterUid: 'displayEnterUid',
    displayEnterPassword: 'displayEnterPassword',
    displayEnterKey: 'displayEnterKey',
    displayCheckEmail: 'displayCheckEmail',
    signedIn: 'signedIn'
  };

  function emit(event, data) {
    emitter.emit(event, data);
  }

  function setRequestState(state) {
    emit(SIGNIN_EVENTS.sendingRequest, state);
  }

  function displayAlert(alertId) {
    emit(SIGNIN_EVENTS.displayAlert, alertId);
  }

  function hideAlert(alertId) {
    emit(SIGNIN_EVENTS.hideAlert, alertId);
  }

  function clearAlerts(alerts) {
    alerts = Array.isArray(alerts) ? alerts : [alerts];
    alerts.forEach(function (alertId) {
      hideAlert(alertId);
    });
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
      emit(SIGNIN_EVENTS.displayEnterUid);
    },
    submitUid: function (uid) {
      clearAlerts([
        SIGNIN_ALERTS.invalidUid,
        SIGNIN_ALERTS.serverError,
        SIGNIN_ALERTS.noAccount
      ]);

      var valid = validation.isEmail(uid) || validation.isUsername(uid);

      if (!valid) {
        return displayAlert(SIGNIN_ALERTS.invalidUid);
      }

      setRequestState(true);
      loginApi.uidExists(uid, function uidExistsCallback(err, resp, body) {
        setRequestState(false);

        if (err || resp.status !== 200) {
          return displayAlert(SIGNIN_ALERTS.serverError);
        }

        var isVerified = body.isVerified;

        if (!body.exists) {
          return displayAlert(SIGNIN_ALERTS.noAccount);
        }

        if (body.usePasswordLogin) {
          return emit(SIGNIN_EVENTS.displayEnterPassword);
        }

        loginApi.sendLoginKey(uid, function sendLoginKeyCallback(err, resp, body) {
          if (err) {
            return displayAlert(SIGNIN_ALERTS.serverError);
          }

          if (isVerified) {
            emit(SIGNIN_EVENTS.displayEnterKey);
          } else {
            emit(SIGNIN_EVENTS.displayCheckEmail);
          }
        });
      });
    },
    verifyKey: function (uid, key, rememberMe) {
      setRequestState(true);
      var validFor = rememberMe ? 'one-year' : '';
      loginApi.verifyKey(uid, key, validFor, function verifyKeyCallback(err, resp, body) {
        setRequestState(false);
        if (err) {
          return displayAlert(SIGNIN_ALERTS.serverError);
        }

        if (!body.user) {
          return displayAlert(SIGNIN_ALERTS.invalidKey);
        }

        emit(SIGNIN_EVENTS.signedIn, body.user);

      });
    },
    verifyPassword: function (uid, password, rememberMe) {
      setRequestState(true);
      var validFor = rememberMe ? 'one-year' : '';
      loginApi.verifyPassword(uid, password, validFor, function verifyPasswordCallback(err, resp, body) {
        setRequestState(false);
        if (err) {
          return displayAlert(SIGNIN_ALERTS.serverError);
        }

        if (!body.user) {
          return displayAlert(SIGNIN_ALERTS.passwordSigninFailed);
        }

        emit(SIGNIN_EVENTS.signedIn, body.user);
      });
    },
    requestReset: function (uid) {
      setRequestState(true);
      loginApi.requestReset(uid, function requestResetCallback(err, resp, body) {
        setRequestState(false);
        if (err) {
          displayAlert(SIGNIN_ALERTS.serverError);
        }

        if (!body.status) {
          displayAlert(SIGNIN_ALERTS.resetRequestFailed);
        }

        emit(SIGNIN_EVENTS.displayResetSent);
      });
    },
    getUidType: function (uid) {
      return validation.isEmail(uid) ? 'email' : validation.isUsername(uid) ? 'username' : null;
    }
  };
};
