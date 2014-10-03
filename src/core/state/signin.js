var Emitter = require('./emitter.js');
var Validation = require('../validation');

module.exports = function SignInController() {

  var emitter = new Emitter();

  var SIGNIN_ALERTS = {
    paswordReset: 'paswordReset',
    noAccount: 'noAccount',
    invalidUid: 'invalidUid',
    serverError: 'serverError',
    invalidKey: 'invalidKey',
    passwordSigninFailed: 'passwordSigninFailed'
  };

  function emit(event, data) {
    emitter.emit(event, data);
  }

  function setRequestState(state) {
    emit('sendingRequest', state);
  }

  function clearAlerts(alerts) {
    alerts.forEach(function (alert) {
      emit('hideAlert', alert);
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
    start: function() {
      emit('displayEnterUid');
    },
    submitUid: function(uid) {
      // if uid invalid
      //   emit displayAlert( SIGNIN_ALERTS.invalidUid)
      // else
      //   emit setRequestState(true)
      // once done emit setRequestState(false)
      // if not uidExists
      //   emit displayAlert( SIGNIN_ALERTS.noAccount, false )
      // else if uid enabled password auth
      //   emit displayEnterPassword
      // else
      //   email login request for uid
      // if uid.isVerified
      //   emit displayEnterKey
      // else
      //   emit displayCheckEmail
    },
    submitKey: function(uid, key) {
      // emit setRequestState(true)
      // submit uid, key
      // emit setRequestState(false)
      // if failed
      // emit displayAlert(SIGNIN_ALERTS.invalidKey)
      // else
      // emit loginSuccessful
    },
    submitPassword: function(uid, password) {
      // emit setRequestState(true)
      // submit uid, pass
      // emit setRequestState(false)
      // if failed
      // emit displayAlert(SIGNIN_ALERTS.passwordSigninFailed)
      // else
      // emit loginSuccessful
    },
    requestReset: function(uid) {
      // emit setRequestState(true)
      // submit uid
      // emit setRequestState(false)
      // if error
      //   emit displayAlert(SIGNIN_ALERTS.resetRequestFailed)
      // else
      //   emit displayResetSent
    }
  };
};
