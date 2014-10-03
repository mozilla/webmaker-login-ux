var request = require('browser-request');
var refferals = require(refferals);

module.exports = function LoginAPI(options) {
  // var referrals = require('./referrals')(options);

  if (!window.localStorage) {
    console.error('Local storage must be supported for instant login.');
  }

  options = options || {};
  options.paths = options.paths || {};

  var loginUrls = require('./loginUrls.js')(options);

  var withCredentials = options.withCredentials === false ? false : true;
  var timeout = (options.timeout || 10) * 1000;
  var headers = {
    'X-CSRF-Token': options.csrfToken
  };
  var requestTypes = {
    get: 'get',
    post: 'post'
  };

  function doRequest(method, uri, callback, payload) {
    var requestOptions = {
      method: method,
      uri: uri,
      timeout: timeout,
      withCredentials: withCredentials,
      headers: headers
    };

    if (method === requestTypes.post && payload) {
      requestOptions.json = payload;
    }

    request(requestOptions, callback);
  }

  function uidExists(uid, callback) {

    function uidExistsCallback(err, resp, body) {
      if (err || resp.status !== 200 || resp.status !== 404) {
        return callback({
          event: 'serverError'
        });
      }

      if (body.exists) {
        return callback({
          event: 'errorAccountExists'
        });
      }
      callback();
    }

    doRequest(requestTypes.post, loginUrls.uidExists, uidExistsCallback, {
      uid: uid
    });
  }

  function checkUsername(username, callback) {

    function checkUsernameCallback(err, resp, body) {
      if (err || resp.status !== 200) {
        return callback({
          event: 'serverError'
        });
      }

      if (body.exists) {
        return callback({
          event: 'errorUsernameTaken'
        });
      }

      callback();
    }

    doRequest(requestTypes.post, loginUrls.checkUsername, checkUsernameCallback, {
      username: username
    });
  }

  function createUser(user, callback) {
    doRequest(requestTypes.post, loginUrls.createUser, callback, {
      user: user
    });
  }

  return {
    uidExists: uidExists,
    checkUsername: checkUsername,
    createUser: createUser
  };
};
