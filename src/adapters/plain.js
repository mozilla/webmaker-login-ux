var expressions = require('angular-expressions');
var fs = require('fs');
var nunjucks = require('nunjucks');
var wmLoginCore = require('../core');

expressions.filters.i18n = function(key) {
  return lang_data['en-US'][key].message;
};

var lang_data = {
  'en-US': require('../../locale/en_US/webmaker-login.json')
};
var template = new nunjucks.Environment();
template.addFilter('i18n', function(key) {
  return lang_data['en-US'][key].message;
});
var template_options = {
  lang: 'en-US'
};

var ui = {
  create: template.renderString(fs.readFileSync(__dirname + '/../../templates/join-webmaker-modal.html', { encoding: 'utf8' }), template_options),
  login: template.renderString(fs.readFileSync(__dirname + '/../../templates/signin-modal.html', { encoding: 'utf8' }), template_options),
  reset: template.renderString(fs.readFileSync(__dirname + '/../../templates/reset-modal.html', { encoding: 'utf8' }), template_options),
  wrapper: fs.readFileSync(__dirname + '/../../templates/modal-wrapper.html', { encoding: 'utf8' })
};

var WebmakerLogin = function WebmakerLogin(options) {
  this.wmLogin = new wmLoginCore(options);
};

WebmakerLogin.prototype.create = function() {
  var controller = this.wmLogin.joinWebmaker();
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
    welcomeModalIdx: Math.floor(Math.random() * 4),
    canSubmitEmail: function() {
      return scope.user.email && scope.user.agree;
    }
  };
  var modal_fragment = _create_modal_fragment(ui.create);
  _translate_ng_bind_html(modal_fragment);

  controller.on('sendingRequest', function (state) {
    scope.sendingRequest = state;
    _run_expressions(modal, scope);
  });

  controller.on('displayEmailInput', function () {
    scope.currentState = scope.MODALSTATE.inputEmail;
    _run_expressions(modal, scope);
  });

  controller.on('displayUsernameInput', function () {
    scope.currentState = scope.MODALSTATE.inputUsername;
    _run_expressions(modal, scope);
  });

  controller.on('displayWelcome', function (user) {
    scope.currentState = scope.MODALSTATE.welcome;
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

  modal_fragment.querySelector('input[name="email"]').addEventListener('blur', function(e) {
    scope.user.email = e.target.value;
    controller.validateEmail(scope.user.email);
  });

  modal_fragment.querySelector('input[name="agree"]').addEventListener('change', function(e) {
    scope.user.agree = e.target.checked;
    _run_expressions(modal, scope);
  });

  modal_fragment.querySelector('button[ng-click="submitEmail()"]').addEventListener('click', function() {
    controller.submitEmail();
  });

  modal_fragment.querySelector('input[name="username"]').addEventListener('input', function(e) {
    scope.user.username = e.target.value;
    controller.validateUsername(scope.user.username);
  });

  modal_fragment.querySelector('button[ng-click="submitUser()"]').addEventListener('click', function() {
    controller.submitUser(scope.user);
  });

  _run_expressions(modal_fragment, scope);
  _open_modal(modal_fragment);
  var modal = document.querySelector('body > div.modal');
  modal.querySelector(".close").addEventListener("click", function() {
    _close_modal();
  });
  document.querySelector('body > div.modal > .modal-dialog').addEventListener("click", function(e) {
    e.stopPropagation();
  });
  document.querySelector('body > div.modal').addEventListener("click", function() {
    _close_modal();
  });

  controller.start();
};

WebmakerLogin.prototype.login = function() {

};

WebmakerLogin.prototype.logout = function() {

};

var _create_modal_fragment = function(template) {
  var range = document.createRange();
  range.selectNode(document.body);
  var modal_fragment = range.createContextualFragment(ui.wrapper);
  modal_fragment.querySelector('.modal-content').appendChild(range.createContextualFragment(template));

  return modal_fragment;
};

var _translate_ng_bind_html = function(modal_fragment) {
  var elements = modal_fragment.querySelectorAll('[bind-unsafe-html]');
  for (var i = 0; i < elements.length; i++) {
    elements[i].innerHTML = expressions.compile(elements[i].getAttribute('bind-unsafe-html'))();
  }
};

var _run_expressions = function(modal, scope) {
  var elements = modal.querySelectorAll('[ng-hide],[ng-show],[ng-disabled]');
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
  }
};

var _open_modal = function(modal_fragment) {
  document.body.appendChild(modal_fragment);
};

var _close_modal = function() {
  document.body.removeChild(document.querySelector('body > div.modal-backdrop'));
  document.body.removeChild(document.querySelector('body > div.modal'));
};

window.WebmakerLogin = WebmakerLogin;
