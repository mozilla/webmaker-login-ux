var STORAGE_KEY = 'webmaker-login';

module.exports = {
  get: function (key) {
    var data = JSON.parse(localStorage.getItem(STORAGE_KEY));
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
    var userObj = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        userObj[key] = data[key];
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
  },
  clear: function () {
    delete localStorage[STORAGE_KEY];
  }
};
