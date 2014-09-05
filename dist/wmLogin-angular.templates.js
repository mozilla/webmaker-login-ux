angular.module('templates-wmLoginAngular', ['create-user-modal.html', 'legacy-create-user-modal.html', 'login-modal.html']);

angular.module("create-user-modal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("create-user-modal.html",
    "<div class=\"modal-header\">\n" +
    "  <button ng-click=\"cancel()\" ng-hide=\"welcome\" type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "  <h3 class=\"modal-title\" ng-hide=\"welcome && user.username\">{{ 'webmakerAuthCreateAccount' | i18n }}</h3>\n" +
    "  <h3 class=\"modal-title\" ng-show=\"welcome && user.username\">Welcome {{ user.username }}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <form class=\"form\" name=\"form.user\" novalidate>\n" +
    "    <div ng-show=\"enterEmail\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"email\">{{ 'Email' | i18n }}</label>\n" +
    "        <input ng-model=\"user.email\" ng-blur=\"checkEmail();\" type=\"email\" class=\"form-control\" name=\"email\" autocomplete=\"off\" required>\n" +
    "        <span class=\"help-block\" ng-show=\"form.user.email.$error.invalid\">That doesn't look like an email address!</span>\n" +
    "        <span class=\"help-block\" ng-show=\"form.user.email.$error.accountExists\">\n" +
    "          That email already has a Webmaker Account!\n" +
    "          <button type=\"button\" class=\"create-user btn btn-primary\" ng-click=\"cancel(); wmTokenLogin(user.email);\">Log In</button>\n" +
    "        </span>\n" +
    "      </div>\n" +
    "      <div class=\"checkbox\">\n" +
    "        <label>\n" +
    "          <input type=\"checkbox\" ng-disabled=\"form.user.email.$error.accountExists\" ng-model=\"form.agree\" name=\"agreeToTerms\"> <span bind-unsafe-html=\"'webmakerAuthAgreeToTerms' | i18n\"></span>\n" +
    "          <span class=\"help-block\" ng-show=\"submit && !form.agree\">{{ 'webmakerAuthAgreeError' | i18n }}</span>\n" +
    "        </label>\n" +
    "      </div>\n" +
    "      <button ng-click=\"submitEmail()\" ng-disabled=\"form.user.email.$error.accountExists\" class=\"create-user btn btn-primary\" type=\"button\">{{ 'Sign up' | i18n }}</button>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"selectUsername\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"username\">Select Username</label>\n" +
    "        <input ng-model=\"user.username\" name=\"username\" ng-change=\"checkUsername()\" autocomplete=\"off\" required>\n" +
    "        <span class=\"help-block\" ng-show=\"form.user.username.$error.taken\">{{ 'webmakerAuthTakenError' | i18n }}</span>\n" +
    "      </div>\n" +
    "      <button ng-click=\"submitUsername()\" class=\"create-user btn btn-primary\" type=\"button\">{{ 'webmakerAuthCreateAccount' | i18n }}</button>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"welcome\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <p>Welcome to Webmaker!</p>\n" +
    "        <ul>\n" +
    "          <li>Check your email to confirm your account.</li>\n" +
    "          <li>Create your profile or explore all the projects you can remix!</li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "      <button ng-click=\"continue()\" class=\"create-user btn btn-primary\" type=\"button\">Start using Webmaker</button>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-hide=\"welcome\" ng-click=\"cancel()\">{{ 'Cancel' | i18n }}</button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("legacy-create-user-modal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("legacy-create-user-modal.html",
    "<div class=\"modal-header\">\n" +
    "  <button ng-click=\"cancel()\" type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "  <h3 class=\"modal-title\" >{{ 'webmakerAuthWelcome' | i18n }}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <form class=\"form\" name=\"form.user\" novalidate>\n" +
    "    <div class=\"form-group\" ng-class=\"{'has-error': (submit || form.user.username.$dirty) && form.user.username.$invalid }\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-sm-6\">\n" +
    "          <label>{{ 'webmakerAuthChooseUsername' | i18n }}</label>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "          <input ng-model=\"user.username\" name=\"username\" autocomplete=\"off\" class=\"form-control\" ng-change=\"checkUsername()\" required>\n" +
    "          <span class=\"help-block\" ng-show=\"form.user.username.$error.taken\">{{ 'webmakerAuthTakenError' | i18n }}</span>\n" +
    "          <span class=\"help-block\" ng-show=\"form.user.username.$error.invalid\">{{ 'webmakerAuthUsernameInvalid' | i18n }}</span>\n" +
    "          <span class=\"help-block\" ng-show=\"(submit || form.user.username.$dirty) && form.user.username.$error.required\">{{ 'webmakerAuthUsernameRequiredError' | i18n }}</span>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"checkbox\">\n" +
    "      <label>\n" +
    "        <input ng-model=\"user.mailingList\" name=\"mailingList\" type=\"checkbox\"> {{ 'webmakerAuthMailingList' | i18n }}\n" +
    "      </label>\n" +
    "    </div>\n" +
    "    <div class=\"checkbox\" ng-class=\"{'has-error': submit && !form.agree }\">\n" +
    "      <label>\n" +
    "        <input ng-model=\"form.agree\" name=\"agree\" type=\"checkbox\"><span bind-unsafe-html=\"'webmakerAuthAgreeToTerms' | i18n\"></span>\n" +
    "        <span class=\"help-block\" ng-show=\"submit && !form.agree\">{{ 'webmakerAuthAgreeError' | i18n }}</span>\n" +
    "      </label>\n" +
    "    </div>\n" +
    "    <label>{{ 'Language Preference' | i18n }}</label>\n" +
    "    <select ng-model=\"user.prefLocale\" language-select></select>\n" +
    "  </form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"cancel()\">{{ 'Cancel' | i18n }}</button>\n" +
    "  <button ng-click=\"createUser()\" class=\"create-user btn btn-primary\" type=\"button\">{{ 'webmakerAuthCreateAccount' | i18n }}</button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("login-modal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("login-modal.html",
    "<div class=\"modal-header\">\n" +
    "  <button ng-click=\"cancel()\" type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "  <h3 class=\"modal-title\" ng-hide=\"enterToken\">{{ 'Sign in' | i18n }}</h3>\n" +
    "  <span ng-show=\"enterToken\"><i class=\"fa fa-envelope\" style=\"color:#aaa;\"> </i> {{ 'We emailed you a key' | i18n }}</span>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <form class=\"form\" name=\"form.user\" novalidate>\n" +
    "    <div ng-show=\"enterEmail\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"loginEmail\">{{ 'Email' | i18n }}</label>\n" +
    "        <input name=\"loginEmail\" class=\"form-control\" ng-model=\"user.loginEmail\" autocomplete=\"on\" required focus-on=\"login-email\">\n" +
    "        <span class=\"help-block\" ng-show=\"form.user.loginEmail.$error.invalid\">{{ 'That does not look like an email address' | i18n }}</span>\n" +
    "        <span class=\"help-block\" ng-show=\"form.user.loginEmail.$error.noAccount\">\n" +
    "          {{ 'No account found for your email' | i18n }}\n" +
    "          <button type=\"button\" class=\"create-user btn btn-primary\" ng-click=\"switchToSignup();\">{{'Sign up' | i18n}}</button>\n" +
    "        </span>\n" +
    "      </div>\n" +
    "      <p bind-unsafe-html=\"'webmakerAuthAgreeToTerms' | i18n\"></p>\n" +
    "      <div class=\"alert alert-danger\" ng-show=\"form.user.loginEmail.$error.tokenSendFailed\">{{ 'problem sending token' | i18n }}</div>\n" +
    "      <button class=\"submit-userid btn btn-primary\" type=\"button\" ng-disabled=\"form.user.loginEmail.$error.noAccount || resetRequestSent\" ng-click=\"submit()\">{{ 'Sign in' | i18n }}</button>\n" +
    "    </div>\n" +
    "    <div ng-show=\"enterToken\">\n" +
    "      <div class=\"form-group key-group\">\n" +
    "        <label for=\"key\">{{ 'Enter your key to login' | i18n }}</label>\n" +
    "        <input ng-model=\"user.token\" name=\"key\" class=\"form-control\" required=\"\">\n" +
    "      </div>\n" +
    "      <button class=\"submit-userid btn btn-primary\" type=\"button\" ng-click=\"user.token && submitToken()\">{{ 'Submit Key' | i18n }}</button>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n" +
    "");
}]);
