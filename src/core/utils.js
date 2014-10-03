module.exports = function (options) {

  var localStorageKey = (options.prefix || 'webmaker-') + 'login';
  var debugEnabled = !! options.debug;

  return {
    storage: {
      get: function (key) {
        var data = JSON.parse(localStorage.getItem(localStorageKey));
        if (!data) {
          return;
        }
        if (key) {
          return data[key];
        } else {
          return data;
        }
      },
      set: function (data) {
        var userObj = JSON.parse(localStorage.getItem(localStorageKey)) || {};
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            userObj[key] = data[key];
          }
        }
        localStorage.setItem(localStorageKey, JSON.stringify(userObj));
      },
      clear: function () {
        delete localStorage[localStorageKey];
      }
    },
    debug: function () {
      if (debugEnabled) {
        console.log.apply(null, arguments);
      }
    }
  };
};
