var expressions = require('angular-expressions');
var fs = require('fs');
var nunjucks = require('nunjucks');
var wmLoginCore = require('../core');

var lang_data = {
  'en-US': require('../../locale/en_US/webmaker-login.json')
};
var template = new nunjucks.Environment();
template.addFilter('i18n', function(key) {
  return lang_data['en-US'][key];
});

var ui = {
  create: template.renderString(fs.readFileSync(__dirname + '/../../templates/join-webmaker-modal.html', { encoding: 'utf8' })),
  login: template.renderString(fs.readFileSync(__dirname + '/../../templates/signin-modal.html', { encoding: 'utf8' })),
  reset: template.renderString(fs.readFileSync(__dirname + '/../../templates/reset-modal.html', { encoding: 'utf8' })),
  wrapper: fs.readFileSync(__dirname + '/../../templates/modal-wrapper.html', { encoding: 'utf8' })
};

var WebmakerLogin = function WebmakerLogin(options) {
  this.wmLogin = new wmLoginCore(options);
};

WebmakerLogin.prototype.create = function() {
  var controller = this.wmLogin.joinWebmaker();
  var scope = {
    currentState: 0,
    MODALSTATE: {
      inputEmail: 0,
      inputUsername: 1,
      welcome: 2
    }
  };

  var modal = _create_modal(ui.create);
  _run_expressions(modal, scope);
  _open_modal(modal);
};

WebmakerLogin.prototype.login = function() {

};

WebmakerLogin.prototype.logout = function() {

};

var _create_modal = function(template) {
  var range = document.createRange();
  range.selectNode(document.body);
  var modal = range.createContextualFragment(ui.wrapper);
  modal.querySelector('.modal-content').appendChild(range.createContextualFragment(template));

  return modal;
};

var _run_expressions = function(modal, scope) {
  var elements = modal.querySelectorAll('[ng-hide],[ng-show]');
  for (var i = 0; i < elements.length; i++) {
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

var _open_modal = function(modal) {
  document.body.appendChild(modal);
};

window.WebmakerLogin = WebmakerLogin;
