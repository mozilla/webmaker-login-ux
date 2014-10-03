var usernameRegex = /^[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\-]{1,20}$/,
  emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

module.exports = {
  isEmail: function (email) {
    return emailRegex.test(email);
  },
  isUsername: function (username) {
    return usernameRegex.test(username);
  },
  join: {
    canSubmit: function (form) {
      var canSubmit = true;

      canSubmit = emailRegex.test(form.email);
      canSubmit = usernameRegex.test(form.username);
      canSubmit = !! form.agree;

      return canSubmit;
    }
  },
  signin: {

  },
  reset: {

  }
};
