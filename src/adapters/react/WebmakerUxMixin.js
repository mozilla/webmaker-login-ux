var WebmakerUxMixin = {

  componentDidMount: function () {
    var WebmakerLoginUx = require("../plain");

    var auth = new WebmakerLoginUx({
      audience: this.props.audience,
      paths: this.props.paths,
      csrfToken: this.props.csrftoken,
      disablePersona: this.props.disablePersona
    });

    auth.on("login", this.loggedIn);
    auth.on("logout", this.loggedOut);
    auth.on("verified", function (user) {
      if (user) {
        auth.emit("login", user);
      } else {
        auth.emit("logout");
      }
    });

    this.auth = auth;
  },

  loggedIn: function (user) {
    this.props.onLoggedIn(user);
  },

  loggedOut: function (evt) {
    this.props.onLoggedOut();
  },

  login: function (evt) {
    this.auth.login();
  }
};

module.exports = WebmakerUxMixin;
