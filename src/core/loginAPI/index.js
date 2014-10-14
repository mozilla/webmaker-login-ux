var request = require('browser-request');

module.exports = function LoginAPI(options) {
  if (!window.localStorage) {
    console.error('Local storage must be supported for instant login.');
  }

  options = options || {};
  options.paths = options.paths || {};

  var refferals = require('./referrals.js')();
  var loginUrls = require('./loginUrls.js')(options);

  var withCredentials = options.withCredentials === false ? false : true;
  var timeout = (options.timeout || 10) * 1000;
  var headers = {
    'X-CSRF-Token': options.csrfToken
  };
  var audience = options.audience || (window.location.protocol + '//' + window.location.host);

  function doRequest(uri, payload, callback) {
    request({
      method: 'post',
      uri: uri,
      timeout: timeout,
      withCredentials: withCredentials,
      headers: headers,
      json: payload
    }, callback);
  }

  function uidExists(uid, callback) {
    doRequest(loginUrls.uidExists, {
      uid: uid
    }, callback);
  }

  function checkUsername(username, callback) {
    doRequest(loginUrls.checkUsername, {
      username: username
    }, callback);
  }

  function createUser(user, callback) {
    user.referrer = refferals.refValue();
    doRequest(loginUrls.createUser, {
      user: user,
      audience: audience
    }, function () {
      refferals.clearReferrerCookie();
      callback.apply(null, arguments);
    });
  }

  function sendLoginKey(uid, callback) {
    doRequest(loginUrls.request, {
      uid: uid
    }, callback);
  }

  function verifyKey(uid, key, validFor, callback) {
    doRequest(loginUrls.authenticateToken, {
      uid: uid,
      token: key,
      validFor: validFor,
      user: {
        referrer: refferals.refValue()
      }
    }, function () {
      refferals.clearReferrerCookie();
      callback.apply(null, arguments);
    });
  }

  function verifyPassword(uid, password, validFor, callback) {
    doRequest(loginUrls.verifyPassword, {
      uid: uid,
      password: password,
      validFor: validFor,
      user: {
        referrer: refferals.refValue()
      }
    }, function () {
      refferals.clearReferrerCookie();
      callback.apply(null, arguments);
    });
  }

  function requestReset(uid, callback) {
    doRequest(loginUrls.requestResetCode, {
      uid: uid
    }, callback);
  }

  function resetPassword(uid, resetCode, password, callback) {
    doRequest(loginUrls.resetPassword, {
      uid: uid,
      resetCode: resetCode,
      newPassword: password
    }, callback);
  }

  function personaLogin(assertion, callback) {
    doRequest(loginUrls.authenticate, {
      assertion: assertion,
      audience: audience,
      user: {
        //todo: referrer code
      }
    }, callback);
  }

  function logout(callback) {
    doRequest(loginUrls.logout, null, callback);
  }

  return {
    uidExists: uidExists,
    checkUsername: checkUsername,
    createUser: createUser,
    sendLoginKey: sendLoginKey,
    verifyKey: verifyKey,
    verifyPassword: verifyPassword,
    requestReset: requestReset,
    resetPassword: resetPassword,
    personaLogin: personaLogin,
    logout: logout
  };
};
