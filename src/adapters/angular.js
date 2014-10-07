var module = angular.module('ngWebmakerLogin', ['templates-ngWebmakerLogin']);

module.constant('CONFIG', window.angularConfig);

module.factory('wmLoginCore', ['CONFIG',
  function (CONFIG) {
    var LoginCore = require('../core');

    return new LoginCore({
      csrfToken: CONFIG.csrf
    });
  }
]);

module.factory('focus', ['$timeout',
  function ($timeout) {
    return function (selector) {
      // Timeout used to ensure that the DOM has the input that needs to be focused on
      $timeout(function () {
        var el = angular.element(selector);
        if (!el || !el[0]) {
          return;
        }
        el[0].focus();
      }, 0);
    };
  }
]);

module.directive('wmJoinWebmaker', [
  function () {
    return {
      restrict: 'A',
      link: function ($scope, $element) {
        $element.on('click', function () {
          $scope.joinWebmaker();
        });
      },
      controller: ['$rootScope', '$scope', '$modal', '$timeout', 'focus', 'wmLoginCore',
        function ($rootScope, $scope, $modal, $timeout, focus, wmLoginCore) {
          function apply() {
            if ($rootScope.$$phase) {
              $rootScope.$apply();
            }
          }

          $rootScope.joinWebmaker = function (email, username) {
            $modal.open({
              templateUrl: 'join-webmaker-modal.html',
              controller: joinModalController,
              resolve: {
                email: function () {
                  return email;
                },
                username: function () {
                  return username;
                }
              }
            })
              .opened
              .then(function () {
                focus('input[focus-on="create-user-email"]');
              });
          };

          function joinModalController($scope, $modalInstance, email, username) {

            var MODALSTATE = {
              inputEmail: 0,
              inputUsername: 1,
              welcome: 2
            };

            $scope.MODALSTATE = MODALSTATE;
            $scope.currentState = MODALSTATE.inputEmail;

            $scope.form = {};
            $scope.user = {};
            $scope.sendingRequest = false;

            $scope.user.email = email;
            $scope.user.username = username;

            var joinController = wmLoginCore.joinWebmaker();

            joinController.on('sendingRequest', function (state) {
              $scope.sendingRequest = state;
              apply();
            });

            joinController.on('displayEmailInput', function () {
              $scope.currentState = MODALSTATE.inputEmail;
            });

            joinController.on('displayUsernameInput', function () {
              $scope.currentState = MODALSTATE.inputUsername;
            });

            joinController.on('displayWelcome', function () {
              $scope.welcomeModalIdx = Math.floor(Math.random() * 4);
              $scope.currentState = MODALSTATE.welcome;
              apply();
            });

            joinController.on('displayAlert', function (alertId) {
              $scope.form.$setValidity(alertId, false);
              apply();
            });

            joinController.on('hideAlert', function (alertId) {
              $scope.form.user.email.$setValidity(alertId, true);
              apply();
            });

            $scope.validateEmail = function () {
              joinController.validateEmail($scope.user.email);
            };

            $scope.validateUsername = function () {
              joinController.validateUsername($scope.user.username);
            };

            $scope.submitUser = function () {
              $scope.submit = true;
              if (!$scope.form.agree) {
                return;
              }
              joinController.submitUser($scope.user);
            };

            $scope.openTool = function (tool) {
              window.location = 'https://' + tool + '.webmaker.org';
            };

            joinController.start();
          }
        }
      ]
    };
  }
]);

module.directive('wmSignin', [
  function () {
    return {
      restrict: 'A',
      link: function ($scope, $element) {
        $element.on('click', $scope.signin);
      },
      controller: ['$rootScope', '$scope', '$modal', '$timeout', 'focus', 'wmLoginCore',
        function ($rootScope, $scope, $modal, $timeout, focus, wmLoginCore) {
          function apply() {
            if ($rootScope.$$phase) {
              $rootScope.$apply();
            }
          }

          $rootScope.signin = function (uid, passwordWasReset) {
            $modal.open({
              templateUrl: 'signin-modal.html',
              controller: signinModalController,
              resolve: {
                uid: function () {
                  return uid;
                },
                passwordWasReset: function () {
                  return passwordWasReset;
                }
              }
            })
              .opened
              .then(function () {
                focus('input[focus-on="create-user-email"]');
              });
          };

          function signinModalController($scope, $modalInstance, uid, passwordWasReset) {

            var MODALSTATE = {
              enterUid: 0,
              checkEmail: 1,
              enterKey: 2,
              enterPassword: 3,
              resetRequestSent: 4
            };

            $scope.MODALSTATE = MODALSTATE;
            $scope.currentState = MODALSTATE.enterUid;
            $scope.passwordWasReset = passwordWasReset;
            $scope.sendingRequest = false;

            $scope.form = {};
            $scope.user = {};

            if (uid) {
              $scope.user.uid = uid;
            }

            var signinController = wmLoginCore.signIn();

            signinController.on('sendingRequest', function (state) {
              $scope.sendingRequest = state;
              apply();
            });

            signinController.on('displayEnterUid', function () {
              $scope.currentState = MODALSTATE.enterUid;
              apply();
            });

            signinController.on('displayEnterPassword', function () {
              $scope.currentState = MODALSTATE.enterPassword;
              apply();
            });

            signinController.on('displayEnterKey', function () {
              $scope.currentState = MODALSTATE.enterKey;
              apply();
            });

            signinController.on('displayCheckEmail', function () {
              $scope.currentState = MODALSTATE.checkEmail;
              apply();
            });

            signinController.on('displayAlert', function (alertId) {
              $scope.form.user.email.$setValidity(alertId, false);
              apply();
            });

            signinController.on('hideAlert', function (alertId) {
              $scope.form.user.email.$setValidity(alertId, true);
              apply();
            });

            $scope.submitUid = function () {
              signinController.submitUid($scope.user.uid);
            };

            $scope.submitKey = function () {
              signinController.verifyKey($scope.user.uid, $scope.user.key, $scope.user.rememberMe);
            };

            $scope.submitPassword = function () {
              signinController.verifyPassword($scope.user.uid, $scope.user.password, $scope.user.rememberMe);
            };

            $scope.requestReset = function () {
              signinController.requestReset($scope.user.uid);
            };

            $scope.switchToSignup = function () {
              var uid = $scope.user.uid,
                type = signinController.getUidType(uid),
                email = type === 'email' ? uid : '',
                username = type === 'username' ? uid : '';

              $modalInstance.close();
              $rootScope.joinWebmaker(email, username);
            };

            signinController.start();

          }
        }
      ]
    };
  }
]);

module.directive('wmPasswordReset', [
  function () {
    // Prevent multiple dialogs
    var triggered = false;
    return {
      restrict: 'A',
      controller: ['$rootScope', '$scope', '$location', '$modal', 'wmLoginCore',
        function ($rootScope, $scope, $location, $modal, wmLoginCore) {

          var searchObj = $location.search();

          if (!searchObj.resetCode || !searchObj.uid || triggered) {
            return;
          }

          triggered = true;

          function apply() {
            if (!$rootScope.$$phase) {
              $rootScope.$apply();
            }
          }

          function passwordResetModalController($scope, $modalInstance, resetCode, uid) {
            $scope.form = {};
            $scope.password = {};
            $scope.sendingRequest = false;

            $scope.eightChars = angular.element('li.eight-chars');
            $scope.oneEachCase = angular.element('li.one-each-case');
            $scope.oneNumber = angular.element('li.one-number');

            var resetController = wmLoginCore.resetPassword();

            resetController.on('sendingRequest', function (state) {
              $scope.sendingRequest = state;
              apply();
            });

            resetController.on('displayAlert', function (alertId) {
              $scope.form.password.value.$setValidity(alertId, false);
              apply();
            });

            resetController.on('hideAlert', function (alertId) {
              $scope.form.password.value.$setValidity(alertId, true);
              apply();
            });

            resetController.on('passwordCheckResult', function (result, blur) {
              // set to default statue
              if (!result) {
                $scope.eightCharsState = $scope.oneEachCaseState = $scope.oneNumberState = 'default';
                $scope.isValidPassword = false;
                return;
              }

              $scope.eightCharsState = !result.lengthValid ? 'invalid' : blur ? 'valid' : '';
              $scope.oneEachCaseState = !result.validCase ? 'invalid' : blur ? 'valid' : '';
              $scope.oneNumberState = !result.hasNumber ? 'invalid' : blur ? 'valid' : '';
              $scope.isValidPassword = result.lengthValid && result.validCase && result.hasNumber;
              apply();
            });

            resetController.on('resetSucceeded', function () {
              $location.search('uid', null);
              $location.search('resetCode', null);
              $modalInstance.close();
              $rootScope.wmTokenLogin(uid, true);
              apply();
            });

            $scope.checkPasswordStrength = function (blur) {
              resetController.checkPasswordStrength($scope.password.value, blur);
            };

            $scope.checkPasswordsMatch = function () {
              resetController.passwordsMatch($scope.password.value, $scope.password.confirmValue);
            };

            $scope.submitResetRequest = function () {
              resetController.submitResetRequest(uid, resetCode, $scope.password.value);
            };

            resetController.start();
          }

          $modal.open({
            templateUrl: 'reset-modal.html',
            controller: passwordResetModalController,
            resolve: {
              resetCode: function () {
                return searchObj.resetCode;
              },
              uid: function () {
                return searchObj.uid;
              }
            }
          });
        }
      ]
    };
  }
]);
