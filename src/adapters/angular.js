var module = angular.module('wmLoginAngular', ['templates-wmLoginAngular']);

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
        $element.on('click', $scope.joinWebmaker);
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
              templateUrl: 'create-user-modal.html',
              controller: createUserController,
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

          function createUserController($scope, $modalInstance, email, username) {

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

            joinController.on('close', function () {
              $modalInstance.close();
            });

            joinController.on('sendingRequest', function (state) {
              $scope.sendingRequest = state;
              apply();
            });

            joinController.on('displayEmailInput', function () {
              $scope.currentState = MODALSTATE.inputEmail;
              apply();
            });

            joinController.on('displayUsernameInput', function () {
              $scope.currentState = MODALSTATE.inputUsername;
            });

            joinController.on('displayWelcome', function () {
              $scope.welcomeModalIdx = Math.floor(Math.random() * 4);
              $scope.currentState = MODALSTATE.welcome;
              apply();
            });

            joinController.on('setValidity', function (errorId, state) {
              $scope.form.user.email.$setValidity(errorId, state);
              apply();
            });

            $scope.validateEmail = function () {
              joinController.validateEmail($scope.user.email);
            };

            $scope.validateUsername = function () {
              joinController.validateUsername($scope.user.username);
            };

            $scope.submitUser = function () {
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
