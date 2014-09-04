# Webmaker Login Angular

## Install

```
bower install cadecairos/makeapi-angular
```

## Setup

1. Add makerstap in your head `<link rel="stylsheet" href="bower_components/makerstrap/dist/makerstrap.complete.min.css"`. There are other ways to do this -- see the makerstrap docs.
2. Ensure that an `angularConfig` object is defined on `window`, and specifies a csrfToken attribute.
3. Make sure `angular.js`, `ui-bootstrap`, `webmaker-auth-client.js`, `wmLogin-angular.js` and `wmLogin-angular.templates.js` are all added to your document.
4. Add the `wmLoginAngular` module to your angular app.

## Directives

### wm-create-user

To add a create user modal use the `wm-create-user` attribute:

```html
<button wm-create-user>
</button>
```

### wm-login

To add a login modal use the `wm-login` attribute
```html
<button wm-login>
</button>
```

## Development

If you run `grunt dev`, all files and folders will be watched and automatically compiled.
A test server will also be launched at https://localhost:4321 where you can test out the modal dialogs
with fake data.

### Sign In Options:

* email: "user@webmaker.org"
* token: "token"
* result: Should successfully log in (modal closes, check console if you don't trust me)

* email: "user@webmaker.org"
* token: anything that's not "token"
* result: 401 reponse from server

* email: "error@webmaker.org"
* token: And token you want
* result: server returns a 500 response

* email: "ratelimit@webmaker.org"
* token: any
* result: server returns a 429 response

* email: "fake@webmaker.org"
* result: User not found, asks if you want to create an account

### Sign Up Options:

* email: Any
* username: Any username
* result: Welcome to webmaker modal page

* email: Any
* username: "taken"
* result: username is taken error

* email: Any
* username: "failCreate"
* result: 500 response from server.
