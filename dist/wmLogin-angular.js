var module = angular.module('wmLoginAngular', ['templates-wmLoginAngular']);

module.constant('CONFIG', window.angularConfig);

module.factory('focus', function ($rootScope, $timeout) {
  return function (name) {
    $timeout(function () {
      $rootScope.$broadcast('focusOn', name);
    });
  };
});

module.factory('wmLoginService', ['$rootScope', '$modal', '$window', '$location', 'CONFIG',
  function ($rootScope, $modal, $window, $location, CONFIG) {

    // This is needed to apply scope changes for events that happen in
    // async callbacks.
    function apply() {
      if (!$rootScope.$$phase) {
        $rootScope.$apply();
      }
    }

    var auth = new $window.WebmakerAuthClient({
      host: '',
      csrfToken: CONFIG.csrf,
      handleNewUserUI: false
    });

    // Set up login/logout functions
    $rootScope.login = function () {
      auth.login();
    };
    $rootScope.logout = auth.logout;

    // Set up user data
    $rootScope._user = {};

    auth.on('login', function (user) {
      $rootScope._user = user;
      apply();
    });

    auth.on('tokenlogin', function (user) {
      $rootScope._user = user;
      apply();
    });

    auth.on('logout', function (why) {
      $rootScope._user = {};
      apply();
    });

    auth.on('error', function (message, xhr) {
      console.error('error', message, xhr);
    });

    var searchObj = $location.search();

    if (searchObj.email && searchObj.token) {
      auth.authenticateToken(searchObj.email, searchObj.token);
    }

    auth.verify();

    return auth;
  }
]);

module.directive('wmCreateUser', [
  function() {
    return {
      restrict: 'A',
      link: function($scope, $element) {
        $element.on('click', function() {
          $scope.wmCreateUser();
        });
      },
      controller:['$rootScope', '$scope', '$http', '$modal', '$timeout', 'focus', 'wmLoginService',
      function($rootScope, $scope, $http, $modal, $timeout, focus, wmLoginService) {
        function apply() {
          if (!$rootScope.$$phase) {
            $rootScope.$apply();
          }
        }

        $rootScope.wmCreateUser = function (email) {
          $modal.open({
            templateUrl: 'create-user-modal.html',
            controller: createUserController,
            resolve: {
              email: function () {
                return email;
              }
            }
          });
        };

        function createUserController($scope, $modalInstance, email) {

          $scope.form = {};
          $scope.user = {};

          if (email) {
            $scope.user.email = email;
          }

          var usernameRegex = /^[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\-]{1,20}$/;
          var emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

          $scope.enterEmail = true;
          $scope.selectUsername = false;
          $scope.welcome = false;

          $scope.submitEmail = function () {
            $scope.submit = true;
            if ($scope.form.agree && $scope.user.email) {
              $scope.enterEmail = false;
              $scope.selectUsername = true;
            }
          };

          $scope.checkEmail = function () {
            if (!$scope.user.email) {
              return;
            }

            var isValid = emailRegex.test($scope.user.email);

            $scope.form.user.email.$setValidity('invalid', isValid);
          };

          $scope.submitUsername = function () {
            if ($scope.form.user.$valid && $scope.form.agree) {
              wmLoginService.createNewUser({
                user: $scope.user
              }, function (err, user) {
                $scope.selectUsername = false;
                $scope.welcome = true;
                apply();
              });
            }
          };

          $scope.continue = function () {
            $modalInstance.dismiss('done');
          };

          $scope.cancel = function () {
            wmLoginService.analytics.webmakerNewUserCancelled();
            $modalInstance.dismiss('cancel');
          };

          $scope.checkUsername = function () {
            if (!$scope.user.username) {
              return;
            }
            if (!usernameRegex.test($scope.user.username)) {
              $scope.form.user.username.$setValidity('invalid', false);
              return;
            }
            $scope.form.user.username.$setValidity('invalid', true);
            $http
              .post(wmLoginService.urls.checkUsername, {
                username: $scope.user.username
              })
              .success(function (username) {
                $scope.form.user.username.$setValidity('taken', !username.exists);
              })
              .error(function (err) {
                $scope.form.user.username.$setValidity('taken', true);
              });
          };
        }
      }]
    };
  }
]);

module.directive('wmLogin', [
  function() {
    return {
      restrict: 'A',
      link: function($scope, $element) {
        $element.on('click', function() {
          $scope.wmTokenLogin();
        });
      },
      controller:['$rootScope', '$scope', '$http', '$modal', '$timeout', 'wmLoginService',
        function($rootScope, $scope, $http, $modal, $timeout, wmLoginService) {
          function apply() {
            if (!$rootScope.$$phase) {
              $rootScope.$apply();
            }
          }

          $rootScope.wmTokenLogin = function (email) {
            $modal.open({
              templateUrl: 'login-modal.html',
              controller: tokenLoginController,
              resolve: {
                email: function () {
                  return email;
                }
              }
            }).opened
              .then(function () {
                // hack for focusing the email input after opening
                $timeout(function () {
                  focus('login-email');
                }, 0);
              });
          };

          function tokenLoginController($scope, $modalInstance, email) {
            $scope.form = {};
            $scope.user = {};
            $scope.enterEmail = true;

            if (email) {
              $scope.user.loginEmail = email;
            }

            var emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

            // this is borked, causes $modal to throw when the create user modal attempts to close..
            $scope.switchToSignup = function () {
              $modalInstance.close();
              $rootScope.wmCreateUser($scope.user.loginEmail);
            };

            $scope.submit = function () {
              var isValid = emailRegex.test($scope.user.loginEmail);
              $scope.form.user.loginEmail.$setValidity('invalid', isValid);
              if (!isValid) {
                return;
              }

              wmLoginService.request($scope.user.loginEmail, function (err) {
                if (err) {
                  console.log( typeof err );
                  if ( err === "User not found" ) {
                    $scope.form.user.loginEmail.$setValidity('noAccount', false);
                  } else {
                    $scope.form.user.loginEmail.$setValidity('tokenSendFailed', false);
                    $timeout(function () {
                      $scope.form.user.loginEmail.$setValidity('tokenSendFailed', true);
                    }, 10000);
                  }
                } else {
                  $scope.enterEmail = false;
                  $scope.enterToken = true;
                }
                apply();
              });
            };

            $scope.submitToken = function () {
              wmLoginService.authenticateToken($scope.user.loginEmail, $scope.user.token);
            };

            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };

            $scope.continue = function() {
              $modalInstance.dismiss('done');
            };

            wmLoginService.on('login', $scope.continue);

            wmLoginService.on('tokenlogin', $scope.continue);
          };
        }
      ]
    };
  }
]);

// Legacy Persona login
module.factory('wmPersonaListener', ['$modal', '$http', 'wmLoginService',
  function($modal, $http, wmLoginService) {
    wmLoginService.on('newuser', function (assertion) {
      $modal.open({
        templateUrl: 'legacy-create-user-modal.html',
        controller: createUserCtrl,
        resolve: {
          assertion: function () {
            return assertion;
          }
        }
      });
    });

    function createUserCtrl($scope, $modalInstance, wmLoginService, assertion) {

      $scope.form = {};
      $scope.user = {};

      var usernameRegex = /^[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\-]{1,20}$/;

      $scope.checkUsername = function () {
        if (!$scope.form.user.username) {
          return;
        }
        if (!usernameRegex.test($scope.form.user.username.$viewValue)) {
          $scope.form.user.username.$setValidity('invalid', false);
          return;
        }
        $scope.form.user.username.$setValidity('invalid', true);
        $http
          .post(wmLoginService.urls.checkUsername, {
            username: $scope.form.user.username.$viewValue
          })
          .success(function (username) {
            $scope.form.user.username.$setValidity('taken', !username.exists);
          })
          .error(function (err) {
            $scope.form.user.username.$setValidity('taken', true);
          });
      };

      $scope.createUser = function () {
        $scope.submit = true;
        if ($scope.form.user.$valid && $scope.form.agree) {
          wmLoginService.createUser({
            assertion: assertion,
            user: $scope.user
          });
          $modalInstance.close();
        }
      };

      $scope.cancel = function () {
        wmLoginService.analytics.webmakerNewUserCancelled();
        $modalInstance.dismiss('cancel');
      };
    }
  }
]);

module.directive('wmPersonaLogin', ['wmPersonaListener',
  function() {
    return {
      restrict: 'A',
      link: function($scope, $element) {
        $element.on('click', function() {
          $scope.login();
        });
      }
    };
  }
]);

module.directive('wmLogout', ['wmLoginService',
  function() {
    return {
      restrict: 'A',
      link: function($scope, $element) {
        $element.on('click', function() {
          $scope.logout();
        });
      }
    };
  }
]);
