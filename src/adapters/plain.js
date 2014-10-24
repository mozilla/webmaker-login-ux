var expressions = require('angular-expressions');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var nunjucks = require('nunjucks');
var url = require('url');
var util = require('util');
var wmLoginCore = require('../core');

var lang_data = {
  'en-US': require('../../locale/en_US/webmaker-login.json')
};
var template = new nunjucks.Environment();
template.addFilter('i18n', function (key) {
  return lang_data['en-US'][key].message;
});
var template_options = {
  lang: 'en-US'
};
expressions.filters.i18n = function (key) {
  return lang_data['en-US'][key].message;
};

var ui = {
  create: template.renderString(fs.readFileSync(__dirname + '/../../templates/join-webmaker-modal.html', {
    encoding: 'utf8'
  }), template_options),
  login: template.renderString(fs.readFileSync(__dirname + '/../../templates/signin-modal.html', {
    encoding: 'utf8'
  }), template_options),
  reset: template.renderString(fs.readFileSync(__dirname + '/../../templates/reset-modal.html', {
    encoding: 'utf8'
  }), template_options),
  wrapper: fs.readFileSync(__dirname + '/../../templates/modal-wrapper.html', {
    encoding: 'utf8'
  })
};

var _create_modal_fragment = function (template) {
  var range = document.createRange();
  range.selectNode(document.body);
  var modal_fragment = range.createContextualFragment(ui.wrapper);
  modal_fragment.querySelector('.modal-content').appendChild(range.createContextualFragment(template));

  return modal_fragment;
};

var _translate_ng_html_expressions = function (modal_fragment) {
  var elements = modal_fragment.querySelectorAll('[ng-bind-html]');
  var i = 0;
  for (i = 0; i < elements.length; i++) {
    elements[i].innerHTML = expressions.compile(elements[i].getAttribute('ng-bind-html'))();
  }

  elements = modal_fragment.querySelectorAll('[bind-trusted-html]');
  for (i = 0; i < elements.length; i++) {
    elements[i].innerHTML = expressions.compile(elements[i].getAttribute('bind-trusted-html'))();
  }
};

var _run_expressions = function (modal, scope) {
  var elements = modal.querySelectorAll('[ng-hide],[ng-show],[ng-disabled],[ng-class]');
  var ng_class;

  for (var i = 0; i < elements.length; i++) {
    if (elements[i].getAttribute('ng-disabled')) {
      if (expressions.compile(elements[i].getAttribute('ng-disabled'))(scope)) {
        elements[i].setAttribute('disabled', true);
      } else {
        elements[i].removeAttribute('disabled');
      }
    }

    if (elements[i].getAttribute('ng-hide')) {
      if (expressions.compile(elements[i].getAttribute('ng-hide'))(scope)) {
        elements[i].classList.add('hide');
      } else {
        elements[i].classList.remove('hide');
      }
    }

    if (elements[i].getAttribute('ng-show')) {
      if (expressions.compile(elements[i].getAttribute('ng-show'))(scope)) {
        elements[i].classList.remove('hide');
      } else {
        elements[i].classList.add('hide');
      }
    }

    if (elements[i].getAttribute('ng-class')) {
      ng_class = expressions.compile(elements[i].getAttribute('ng-class'))(scope);
      /*jshint -W083 */
      Object.keys(ng_class).forEach(function (klass) {
        if (ng_class[klass]) {
          elements[i].classList.add(klass);
        } else {
          elements[i].classList.remove(klass);
        }
      });
      /*jshint +W083 */
    }
  }
};

var _open_modal = function (modal_fragment) {
  document.body.appendChild(modal_fragment);
};

var _close_modal = function () {
  document.body.removeChild(document.querySelector('body > div.modal-backdrop'));
  document.body.removeChild(document.querySelector('body > div.modal'));
};

var WebmakerLogin = function WebmakerLogin(options) {
  var wmLogin = this.wmLogin = new wmLoginCore(options);
  this.showCTA = !! options.showCTA;
  EventEmitter.call(this);

  var query = url.parse(window.location.href, true).query;
  if (query.uid && query.resetCode) {
    this.request_password_reset(query.uid, query.resetCode);
  } else if (query.uid && query.token) {
    wmLogin.instantLogin(query.uid, query.token, query.validFor);
    wmLogin.on('signedIn', function (user) {
      this.emit('login', user);
    }.bind(this));
    wmLogin.on('signinFailed', function (uid) {
      console.log("Instant signin failed for uid %s", uid);
    });
  }

  wmLogin.on('verified', function (user) {
    this.emit('verified', user);
  }.bind(this));

  wmLogin.verify();
};

util.inherits(WebmakerLogin, EventEmitter);

WebmakerLogin.prototype.create = function (email_hint, username_hint) {
  var controller = this.wmLogin.joinWebmaker(this.showCTA);
  var scope = {
    MODALSTATE: {
      inputEmail: 0,
      inputUsername: 1,
      welcome: 2
    },
    currentState: -1,
    form: {
      user: {
        $error: {}
      }
    },
    user: {},
    sendingRequest: false,
    welcomeModalIdx: 0,
    canSubmitEmail: function () {
      return scope.user.email && scope.user.agree;
    }
  };

  var modal_fragment = _create_modal_fragment(ui.create);
  _translate_ng_html_expressions(modal_fragment);

  if (email_hint) {
    scope.user.email = email_hint;
    modal_fragment.querySelector('input[name="email"]').value = email_hint;
  }
  if (username_hint) {
    scope.user.username = username_hint;
    modal_fragment.querySelector('input[name="username"]').value = username_hint;
  }

  controller.on('sendingRequest', function (state) {
    scope.sendingRequest = state;
    _run_expressions(modal, scope);
  });

  controller.on('displayEmailInput', function () {
    scope.currentState = scope.MODALSTATE.inputEmail;
    _run_expressions(modal, scope);
    modal.querySelector('input[focus-on="create-user-email"]').focus();
  });

  controller.on('displayUsernameInput', function () {
    scope.currentState = scope.MODALSTATE.inputUsername;
    _run_expressions(modal, scope);
    modal.querySelector('input[focus-on="create-user-username"]').focus();
  });

  controller.on('userCreated', function (user) {
    this.emit('login', user);
    _close_modal();
  }.bind(this));

  controller.on('displayWelcome', function (user) {
    this.emit('login', user);
    scope.welcomeModalIdx = Math.floor(Math.random() * 2);
    scope.currentState = scope.MODALSTATE.welcome;
    _run_expressions(modal, scope);
  }.bind(this));

  controller.on('displayAlert', function (alertId) {
    scope.form.user.$error[alertId] = true;
    _run_expressions(modal, scope);
  });

  controller.on('hideAlert', function (alertId) {
    scope.form.user.$error[alertId] = false;
    _run_expressions(modal, scope);
  });

  modal_fragment.querySelector('a[ng-click="switchToSignin();"]').addEventListener('click', function () {
    _close_modal();
    setTimeout(function () {
      this.login(scope.user.email);
    }.bind(this), 0);
  }.bind(this));

  modal_fragment.querySelector('input[name="email"]').addEventListener('blur', function (e) {
    scope.user.email = e.target.value;
    controller.validateEmail(scope.user.email);
  });

  modal_fragment.querySelector('input[name="agree"]').addEventListener('change', function (e) {
    scope.user.agree = e.target.checked;
    _run_expressions(modal, scope);
  });

  modal_fragment.querySelector('input[name="subscribeToList"]').addEventListener('change', function (e) {
    scope.user.subscribeToList = e.target.checked;
  });

  modal_fragment.querySelector('button[ng-click="submitEmail()"]').addEventListener('click', function () {
    controller.submitEmail();
  });

  modal_fragment.querySelector('input[name="username"]').addEventListener('input', function (e) {
    scope.user.username = e.target.value;
    controller.validateUsername(scope.user.username);
  });

  modal_fragment.querySelector('button[ng-click="submitUser()"]').addEventListener('click', function () {
    controller.submitUser(scope.user);
  });

  _run_expressions(modal_fragment, scope);
  _open_modal(modal_fragment);
  var modal = document.querySelector('body > div.modal');
  modal.querySelector(".close").addEventListener("click", function () {
    _close_modal();
  });
  document.querySelector('body > div.modal > .modal-dialog').addEventListener("click", function (e) {
    e.stopPropagation();
  });
  document.querySelector('body > div.modal').addEventListener("click", function () {
    _close_modal();
  });

  controller.start();
};

WebmakerLogin.prototype.login = function (uid_hint, password_was_reset) {
  var controller = this.wmLogin.signIn();
  var scope = {
    MODALSTATE: {
      enterUid: 0,
      checkEmail: 1,
      enterKey: 2,
      enterPassword: 3,
      resetRequestSent: 4
    },
    currentState: 0,
    form: {
      user: {
        $error: {}
      }
    },
    user: {},
    passwordWasReset: !! password_was_reset,
    sendingRequest: false
  };

  var modal_fragment = _create_modal_fragment(ui.login);
  _translate_ng_html_expressions(modal_fragment);

  if (uid_hint) {
    scope.user.uid = uid_hint;
    modal_fragment.querySelector('input[name="uid"]').value = uid_hint;
  }

  controller.on('sendingRequest', function (state) {
    scope.sendingRequest = state;
    _run_expressions(modal, scope);
  });

  controller.on('displayEnterUid', function () {
    scope.currentState = scope.MODALSTATE.enterUid;
    _run_expressions(modal, scope);
    modal.querySelector('input[focus-on="login-uid"]').focus();
  });

  controller.on('displayEnterPassword', function () {
    scope.currentState = scope.MODALSTATE.enterPassword;
    _run_expressions(modal, scope);
    modal.querySelector('input[focus-on="enter-password"]').focus();
  });

  controller.on('displayEnterKey', function (verified) {
    scope.verified = verified;
    scope.currentState = scope.MODALSTATE.enterKey;
    _run_expressions(modal, scope);
    modal.querySelector('input[focus-on="enter-key"]').focus();
  });

  controller.on('displayCheckEmail', function () {
    scope.currentState = scope.MODALSTATE.checkEmail;
    _run_expressions(modal, scope);
  });

  controller.on('displayResetSent', function () {
    scope.currentState = scope.MODALSTATE.resetRequestSent;
    _run_expressions(modal, scope);
  });

  controller.on('displayAlert', function (alertId) {
    scope.form.user.$error[alertId] = true;
    _run_expressions(modal, scope);
  });

  controller.on('hideAlert', function (alertId) {
    scope.form.user.$error[alertId] = false;
    _run_expressions(modal, scope);
  });

  controller.on('signedIn', function (user) {
    this.emit('login', user);
    _close_modal();
  }.bind(this));

  modal_fragment.querySelector('input[name="uid"]').addEventListener('input', function (e) {
    scope.user.uid = e.target.value;
    _run_expressions(modal, scope);
  });

  modal_fragment.querySelector('button[ng-click="submitUid()"]').addEventListener('click', function () {
    controller.submitUid(scope.user.uid, window.location.pathname);
  });

  modal_fragment.querySelector('input[name="key"]').addEventListener('input', function (e) {
    scope.user.key = e.target.value;
    _run_expressions(modal, scope);
  });

  modal_fragment.querySelector('a[ng-click="enterKey()"]').addEventListener('click', function () {
    controller.displayEnterKey();
  });

  modal_fragment.querySelector('button[ng-click="user.key && submitKey()"]').addEventListener('click', function () {
    controller.verifyKey(scope.user.uid, scope.user.key, scope.user.rememberMe);
  });

  modal_fragment.querySelector('input[name="password"]').addEventListener('blur', function (e) {
    scope.user.password = e.target.value;
    _run_expressions(modal, scope);
  });

  modal_fragment.querySelector('button[ng-click="user.password && submitPassword()"]').addEventListener('click', function () {
    controller.verifyPassword(scope.user.uid, scope.user.password, scope.user.rememberMe);
  });

  modal_fragment.querySelector('a[ng-click="requestReset()"]').addEventListener('click', function () {
    controller.requestReset(scope.user.uid);
  });

  modal_fragment.querySelector('a[ng-click="switchToSignup();"]').addEventListener('click', function () {
    _close_modal();
    setTimeout(function () {
      var uid = scope.user.uid;
      var type = controller.getUidType(uid);
      var email = type === 'email' ? uid : '';
      var username = type === 'username' ? uid : '';

      this.create(email, username);
    }.bind(this), 0);
  }.bind(this));

  modal_fragment.querySelector('a[ng-click="usePersona();"]').addEventListener('click', function () {
    _close_modal();
    setTimeout(function () {
      this._persona_login();
    }.bind(this), 0);
  }.bind(this));

  _run_expressions(modal_fragment, scope);
  _open_modal(modal_fragment);
  var modal = document.querySelector('body > div.modal');
  modal.querySelector(".close").addEventListener("click", function () {
    _close_modal();
  });
  document.querySelector('body > div.modal > .modal-dialog').addEventListener("click", function (e) {
    e.stopPropagation();
  });
  document.querySelector('body > div.modal').addEventListener("click", function () {
    _close_modal();
  });

  controller.start();
};

WebmakerLogin.prototype._persona_login = function () {
  var controller = this.wmLogin.personaLogin();

  controller.on('signedIn', function (user) {
    this.emit('login', user);
  }.bind(this));

  controller.on('newUser', function (email) {
    setTimeout(function () {
      this.create(email);
    }.bind(this), 0);
  });

  controller.authenticate();
};

WebmakerLogin.prototype.request_password_reset = function (uid, token) {
  var controller = this.wmLogin.resetPassword();
  var scope = {
    form: {
      password: {
        $error: {}
      }
    },
    password: {},
    sendingRequest: false
  };

  var modal_fragment = _create_modal_fragment(ui.reset);
  _translate_ng_html_expressions(modal_fragment);

  controller.on('sendingRequest', function (state) {
    scope.sendingRequest = state;
    _run_expressions(modal, scope);
  });

  controller.on('displayAlert', function (alertId) {
    scope.form.password.$error[alertId] = true;
    _run_expressions(modal, scope);
  });

  controller.on('hideAlert', function (alertId) {
    scope.form.password.$error[alertId] = false;
    _run_expressions(modal, scope);
  });

  controller.on('checkConfirmPassword', function (status) {
    scope.passwordsMatch = status;
    _run_expressions(modal, scope);
  });

  controller.on('passwordCheckResult', function (result, blur) {
    if (!result) {
      scope.eightCharsState = scope.oneEachCaseState = scope.oneNumberState = 'default';
      scope.isValidPassword = false;
      return;
    }

    scope.eightCharsState = !result.lengthValid ? 'invalid' : blur ? 'valid' : '';
    scope.oneEachCaseState = !result.caseValid ? 'invalid' : blur ? 'valid' : '';
    scope.oneNumberState = !result.digitValid ? 'invalid' : blur ? 'valid' : '';
    scope.isValidPassword = result.lengthValid && result.caseValid && result.digitValid;

    _run_expressions(modal, scope);
  });

  controller.on('resetSucceeded', function () {
    _close_modal();
    setTimeout(function () {
      this.login(uid, true);
    }.bind(this), 0);
  }.bind(this));

  modal_fragment.querySelector('input[name="value"]').addEventListener('input', function (e) {
    scope.password.value = e.target.value;
    controller.checkPasswordStrength(scope.password.value, false);
  });

  modal_fragment.querySelector('input[name="value"]').addEventListener('blur', function (e) {
    scope.password.value = e.target.value;
    controller.checkPasswordStrength(scope.password.value, true);
  });

  modal_fragment.querySelector('input[name="confirmValue"]').addEventListener('input', function (e) {
    scope.password.confirmValue = e.target.value;
    controller.passwordsMatch(scope.password.value, scope.password.confirmValue, false);
  });

  modal_fragment.querySelector('input[name="confirmValue"]').addEventListener('blur', function (e) {
    scope.password.confirmValue = e.target.value;
    controller.passwordsMatch(scope.password.value, scope.password.confirmValue, true);
  });

  modal_fragment.querySelector('button[ng-click="submitResetRequest()"]').addEventListener('click', function (e) {
    controller.submitResetRequest(uid, token, scope.password.value);
  });

  _run_expressions(modal_fragment, scope);
  _open_modal(modal_fragment);
  var modal = document.querySelector('body > div.modal');
  modal.querySelector(".close").addEventListener("click", function () {
    _close_modal();
  });
  document.querySelector('body > div.modal > .modal-dialog').addEventListener("click", function (e) {
    e.stopPropagation();
  });
  document.querySelector('body > div.modal').addEventListener("click", function () {
    _close_modal();
  });
};

WebmakerLogin.prototype.logout = function () {
  var controller = this.wmLogin.logout();

  controller.on('loggedOut', function () {
    this.emit('logout');
  }.bind(this));

  controller.logout();
};

window.WebmakerLogin = WebmakerLogin;
