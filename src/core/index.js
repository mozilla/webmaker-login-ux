var state = require('./state');
var LoginAPI = require('./loginAPI');

module.exports = function WebmakerLoginCore(options) {
  var loginAPI = new LoginAPI(options);
  return {
    joinWebmaker: function () {
      return new state.JoinController(loginAPI);
    },
    signIn: function () {
      return new state.SignInController(loginAPI);
    },
    resetPassword: function () {
      return new state.ResetController(loginAPI);
    }
  };
};
