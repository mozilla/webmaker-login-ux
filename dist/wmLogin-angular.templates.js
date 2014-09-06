angular.module('templates-wmLoginAngular', ['create-user-modal.html', 'legacy-create-user-modal.html', 'login-modal.html']);

angular.module("create-user-modal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("create-user-modal.html",
    "<div class=\"modal-header\">\n" +
    "  <button ng-click=\"cancel()\" ng-hide=\"\" type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "  <h3 class=\"modal-title\" ng-hide=\"welcome && user.username\">{{ 'webmakerAuthCreateWelcome' | i18n }}</h3>\n" +
    "  <h3 class=\"modal-title\" ng-show=\"welcome && user.username\">Welcome to Webmaker!</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <form class=\"form\" name=\"form.user\" novalidate>\n" +
    "    <div class=\"alert alert-danger\" ng-show=\"submit && !form.agree\" bind-unsafe-html=\"'webmakerAuthAgreeError' | i18n\"></div>\n" +
    "    <!-- TODO: Show the following div if a Webmaker account exists -->\n" +
    "    <div class=\"alert alert-warning\" ng-show=\"submit && !form.agree\" bind-unsafe-html=\"'WebmakerAccountExists' | i18n\"></div>\n" +
    "    <!-- TODO: Show the following div if entry is not an email -->\n" +
    "    <div class=\"alert alert-danger\" ng-show=\"submit && !form.agree\" bind-unsafe-html=\"'NotAnEmail' | i18n\"></div>\n" +
    "    <div class=\"alert alert-danger\" ng-show=\"form.user.username.$error.taken\" bind-unsafe-html=\"'webmakerAuthTakenError' | i18n\"></div>\n" +
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
    "        </label>\n" +
    "      </div>\n" +
    "      <button ng-click=\"submitEmail()\" ng-disabled=\"form.user.email.$error.accountExists\" class=\"create-user btn btn-primary\" type=\"button\">{{ 'Sign up' | i18n }}</button>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"selectUsername\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"pre-username\">Choose a username</label>\n" +
    "        <label for=\"username-url\">webmaker.org/user/</label>\n" +
    "        <input ng-model=\"user.username\" name=\"username-url\" ng-change=\"checkUsername()\" class=\"form-control username\" autocomplete=\"off\" required autofocus>\n" +
    "      </div>\n" +
    "      <button ng-click=\"submitUsername()\" class=\"create-user btn btn-primary\" type=\"button\">{{ 'webmakerAuthCreateAccount' | i18n }}</button>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"welcome\">\n" +
    "      <p class=\"subheadline\">Make your own web pages, interactive videos, remixes and mobile apps.</p>\n" +
    "      <div class=\"tool-desc\">\n" +
    "        <div class=\"icon\">\n" +
    "          <?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n" +
    "          <svg width=\"276px\" height=\"210px\" viewBox=\"0 0 276 210\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n" +
    "            <title>Goggles</title>\n" +
    "            <desc>XRay Goggles.</desc>\n" +
    "            <defs></defs>\n" +
    "            <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n" +
    "              <g id=\"Artboard-27\" sketch:type=\"MSArtboardGroup\" transform=\"translate(-8.000000, -25.000000)\">\n" +
    "                <g id=\"goggles\" sketch:type=\"MSLayerGroup\" transform=\"translate(8.000000, 25.000000)\">\n" +
    "                  <path d=\"M256.460878,100.757257 C254.300432,98.595 248.740338,93.6349115 244.461405,91.3416372 L87.2010811,2.31836283 C82.0372703,-0.216504425 74.6962297,-1.41238938 69.0606081,4.21300885 C63.4091351,9.83747788 64.2679054,16.7711947 66.8740541,21.7935398 L156.207608,178.545531 C158.362459,181.89531 163.757514,188.816947 165.933811,190.960619 C190.938851,215.872566 231.455838,215.88 256.460878,190.960619 C281.469649,166.057965 281.469649,125.658982 256.460878,100.757257\" id=\"Fill-1\" fill=\"#ECA5C0\" sketch:type=\"MSShapeGroup\"></path>\n" +
    "                  <path d=\"M206.411635,4.22137168 C200.776946,-1.41238938 193.033095,-0.216504425 188.474432,2.21336283 L32.3423514,90.5518142 C27.5645676,93.5884513 21.1746081,98.595 19.0113649,100.757257 C-5.99367568,125.658982 -5.99367568,166.057965 19.0113649,190.960619 C44.015473,215.872566 84.5389865,215.872566 109.525378,190.960619 C111.700743,188.816947 116.493446,182.464912 118.293041,180.08708 L208.316595,22.2302655 C211.235108,17.7031858 212.050986,9.83747788 206.411635,4.22137168\" id=\"Fill-2\" fill=\"#59B3D7\" sketch:type=\"MSShapeGroup\"></path>\n" +
    "                  <path d=\"M137.699757,146.04292 L187.347122,58.9867699 L137.736122,30.9025221 L88.0896892,58.9923451 L137.699757,146.04292\" id=\"Fill-3\" fill=\"#4E72A7\" sketch:type=\"MSShapeGroup\"></path>\n" +
    "                  <path d=\"M19.0113649,190.960619 C-5.99367568,166.057965 -5.99367568,125.658982 19.0113649,100.757257 C44.015473,75.8360177 84.5389865,75.8360177 109.525378,100.757257 C134.526689,125.658982 134.526689,166.057965 109.525378,190.960619 C84.5389865,215.872566 44.015473,215.872566 19.0113649,190.960619\" id=\"Fill-4\" fill=\"#369ECD\" sketch:type=\"MSShapeGroup\"></path>\n" +
    "                  <path d=\"M256.526149,190.960619 C231.520176,215.88 191.001324,215.872566 165.995351,190.960619 C140.994041,166.057965 140.994041,125.667345 165.995351,100.747965 C191.001324,75.8360177 231.520176,75.8360177 256.526149,100.757257 C281.532122,125.658982 281.532122,166.057965 256.526149,190.960619\" id=\"Fill-5\" fill=\"#E36D9E\" sketch:type=\"MSShapeGroup\"></path>\n" +
    "                  <path d=\"M235.671365,172.371903 C222.429892,185.550796 200.976486,185.550796 187.746203,172.371903 C174.501,159.16885 174.501,137.799027 187.746203,124.595044 C200.976486,111.409646 222.429892,111.409646 235.671365,124.612699 C248.903514,137.799027 248.903514,159.16885 235.671365,172.371903\" id=\"Fill-6\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n" +
    "                  <path d=\"M211.686405,130.685973 C197.874284,130.685973 186.669243,142.526814 186.669243,147.321504 C186.669243,148.542478 187.402135,149.697478 188.704743,150.735398 C189.952338,148.202389 191.521622,145.792035 193.651297,143.673451 C195.952541,141.379248 198.579203,139.622124 201.369041,138.337035 C195.774446,143.999602 195.790297,153.095575 201.451095,158.720973 C207.112824,164.37146 216.304743,164.37146 221.987919,158.720973 C227.658041,153.061195 227.658041,143.897389 221.987919,138.246903 C221.513311,137.773938 220.980892,137.392035 220.455,137.00177 C224.543716,138.231106 228.400257,140.452832 231.635797,143.673451 C233.390635,145.410133 234.738,147.370752 235.893284,149.405708 C236.381878,148.741327 236.7045,148.044425 236.7045,147.321504 C236.7045,142.526814 225.511581,130.685973 211.686405,130.685973 L211.686405,130.685973 Z M220.613514,144.661195 C220.613514,146.779779 218.886649,148.491372 216.75977,148.491372 C214.626365,148.491372 212.908824,146.779779 212.908824,144.661195 C212.908824,142.542611 214.626365,140.822655 216.75977,140.822655 C218.886649,140.822655 220.613514,142.542611 220.613514,144.661195 L220.613514,144.661195 Z\" id=\"Fill-7\" fill=\"#E36D9E\" sketch:type=\"MSShapeGroup\"></path>\n" +
    "                  <path d=\"M86.2761081,172.371903 C73.0467568,185.550796 51.5765676,185.550796 38.3490811,172.371903 C25.1048108,159.16885 25.1048108,137.799027 38.3490811,124.595044 C51.5765676,111.409646 73.0467568,111.409646 86.2761081,124.612699 C99.5073243,137.799027 99.5073243,159.16885 86.2761081,172.371903\" id=\"Fill-8\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n" +
    "                  <path d=\"M62.3051351,130.685973 C48.479027,130.685973 37.2861081,142.526814 37.2861081,147.321504 C37.2861081,148.542478 38.0031486,149.697478 39.2871081,150.735398 C40.5552162,148.202389 42.1384865,145.792035 44.2373919,143.673451 C46.5367703,141.38854 49.1615676,139.630487 51.9476757,138.347257 C46.3754595,144.014469 46.3978378,153.095575 52.0334595,158.720973 C57.7026486,164.37146 66.9085541,164.37146 72.5768108,158.720973 C78.2599865,153.061195 78.2599865,143.897389 72.5768108,138.246903 C72.0938108,137.765575 71.553,137.383673 71.0233784,136.984115 C75.134473,138.214381 79.0087297,140.440752 82.254527,143.673451 C83.9897838,145.410133 85.3362162,147.370752 86.5138784,149.405708 C86.981027,148.741327 87.3111081,148.044425 87.3111081,147.321504 C87.3111081,142.526814 76.1107297,130.685973 62.3051351,130.685973 L62.3051351,130.685973 Z M71.2163919,144.661195 C71.2163919,146.779779 69.4913919,148.491372 67.3645135,148.491372 C65.2478919,148.491372 63.5089054,146.779779 63.5089054,144.661195 C63.5089054,142.542611 65.2478919,140.822655 67.3645135,140.822655 C69.4913919,140.822655 71.2163919,142.542611 71.2163919,144.661195 L71.2163919,144.661195 Z\" id=\"Fill-9\" fill=\"#369ECD\" sketch:type=\"MSShapeGroup\"></path>\n" +
    "                </g>\n" +
    "              </g>\n" +
    "            </g>\n" +
    "          </svg>\n" +
    "        </div>\n" +
    "        <h4>X-Ray Goggles</h4>\n" +
    "        <p>X-Ray Goggles allow you to see the building blocks that make up\n" +
    "          websites on the Internet. Activate the goggles to inspect the code behind\n" +
    "          any webpage.</p>\n" +
    "          <div class=\"clearfix\">\n" +
    "            <button class=\"create-user btn btn-primary\" type=\"button\">Try the Goggles now</button>\n" +
    "            <a href=\"#\" class=\"explore-link\">Explore the rest of Webmaker</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "  </form>\n" +
    "</div>\n" +
    "<!-- <div class=\"modal-footer\">\n" +
    "  <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-hide=\"welcome\" ng-click=\"cancel()\">{{ 'Cancel' | i18n }}</button>\n" +
    "</div>\n" +
    " -->\n" +
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
    "  <h3 class=\"modal-title\" ng-show=\"enterToken\">{{ 'checkEmail' | i18n }}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <form class=\"form\" name=\"form.user\" novalidate>\n" +
    "    <div class=\"alert alert-warning\" ng-show=\"form.user.loginEmail.$error.noAccount\" bind-unsafe-html=\"'No account found for your email' | i18n\"></div>\n" +
    "    <div class=\"alert alert-danger\" ng-show=\"form.user.loginEmail.$error.invalid\" bind-unsafe-html=\"'That does not look like an email address' | i18n\"></div>\n" +
    "    <div class=\"alert alert-danger\" ng-show=\"form.user.loginEmail.$error.tokenSendFailed\" bind-unsafe-html=\"'problem sending token' | i18n\"></div>\n" +
    "    <!-- TODO: Show this error if key is incorrect -->\n" +
    "    <div class=\"alert alert-danger\" ng-show=\"form.user.loginEmail.$error.tokenSendFailed\" bind-unsafe-html=\"'incorrecToken' | i18n\"></div>\n" +
    "    <div ng-show=\"enterEmail\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"loginEmail\">{{ 'Email' | i18n }}</label>\n" +
    "        <input name=\"loginEmail\" class=\"form-control\" ng-model=\"user.loginEmail\" autocomplete=\"on\" required focus-on=\"login-email\">\n" +
    "      </div>\n" +
    "      <button class=\"submit-userid btn btn-primary\" type=\"button\" ng-disabled=\"form.user.loginEmail.$error.noAccount || resetRequestSent\" ng-click=\"submit()\">{{ 'Sign in' | i18n }}</button>\n" +
    "    </div>\n" +
    "    <div class=\"enterToken\" ng-show=\"enterToken\">\n" +
    "      <div class=\"email-container\">\n" +
    "        <div class=\"mailIcon\">\n" +
    "          <?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n" +
    "          <svg width=\"94px\" height=\"94px\" viewBox=\"0 0 94 94\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n" +
    "              <!-- Generator: Sketch 3.0.4 (8053) - http://www.bohemiancoding.com/sketch -->\n" +
    "              <title>Mail Icon</title>\n" +
    "              <desc></desc>\n" +
    "              <defs></defs>\n" +
    "              <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n" +
    "                  <g id=\"AC4\" sketch:type=\"MSArtboardGroup\" transform=\"translate(-126.000000, -92.000000)\">\n" +
    "                      <g id=\"Mail-Icon\" sketch:type=\"MSLayerGroup\" transform=\"translate(126.000000, 92.000000)\">\n" +
    "                          <circle id=\"Oval-1\" fill=\"#3FB58E\" sketch:type=\"MSShapeGroup\" cx=\"47\" cy=\"47\" r=\"47\"></circle>\n" +
    "                          <rect id=\"Rectangle-1\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\" x=\"18\" y=\"27\" width=\"59\" height=\"41\" rx=\"3\"></rect>\n" +
    "                          <path d=\"M21.0069321,27 C19.3462494,27 17.9900756,28.3368135 17.9778938,29.9953973 C17.9778938,29.9953973 17.9712616,30.8538058 17.9707031,31.0256348 C17.9688241,31.6037734 44.3277476,50.7739169 44.3277476,50.7739169 C45.6547338,51.7409595 47.981989,52.0459954 49.4771883,51.3411914 C49.4771883,51.3411914 52.3180561,50.8603167 59.4023438,44.0800781 C61.1871084,42.3719134 77.0395508,31.2178814 77.0395508,30.1010742 C77.0395508,29.644898 77.0391066,29.9910722 77.0391066,29.9910722 C77.0175086,28.3391486 75.6568485,27 73.9930679,27 L21.0069321,27 Z\" id=\"Rectangle-95\" fill=\"#F3F3F3\" sketch:type=\"MSShapeGroup\"></path>\n" +
    "                          <path d=\"M17.7634277,31.0032813 L46.7917565,50.276875 L75.0556641,31.3201563 L46.5782176,55.1035938 L17.7634277,31.0032813 Z\" id=\"Path-1\" fill=\"#D8D8D8\" sketch:type=\"MSShapeGroup\"></path>\n" +
    "                      </g>\n" +
    "                  </g>\n" +
    "              </g>\n" +
    "          </svg>\n" +
    "          <p>The email we just sent you contains a link and key to sign in.</p>\n" +
    "        </div>\n" +
    "        <div class=\"form-group key-group\">\n" +
    "          <label for=\"key\">{{ 'Enter your key to login' | i18n }}</label>\n" +
    "          <input ng-model=\"user.token\" name=\"key\" class=\"form-control\" required=\"\">\n" +
    "          <button class=\"submit-userid btn btn-primary\" type=\"button\" ng-click=\"user.token && submitToken()\">{{ 'Submit Key' | i18n }}</button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n" +
    "");
}]);
