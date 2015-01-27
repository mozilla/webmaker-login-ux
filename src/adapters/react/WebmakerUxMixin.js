var WebmakerUxMixin = {

  componentDidMount: function () {
    var WebmakerLoginUx = require("../plain");

    var auth = new WebmakerLoginUx({
      audience: this.props.audience,
      host: this.props.host,
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

  loggedOut: function () {
    this.props.onLoggedOut();
  },

  login: function () {
    this.auth.login();
  },

  logout: function () {
    this.auth.logout();
  }
};

module.exports = WebmakerUxMixin;
