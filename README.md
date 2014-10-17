# Webmaker Login UX

## Install

```
bower install mozilla/webmaker-login-ux
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

|uid|token/password|result|
|-----|-----|------|
|user OR user@webmaker.org|"token"|successfully logged in (modal closes, ui won't update, too much work)|
|user OR user@webmaker.org|Anything not token|401 reponse from server|
|error@webmaker.org|{Anything}|Server returns a 500 response|
|ratelimit OR ratelimit@webmaker.org|Anything|Server returns a 429 response|
|{any valid email or username}|N/A|User not found, asks if you want to create an account|
|{anything that's not a valid email or username}|N/A|"that doesn't look like an email or username"|
|pass OR pass@webmaker.org|topsecret|successfully logged in (modal closes, ui won't update, too much work)|
|pass OR pass@webmaker.org|{anything else}|401 response from server|
|passfail OR passfail@webmaker.org|{anything}|500 response from server|

### Join Webmaker Options:

|uid|username|result|
|-----|-----|------|
|Any|Any|Welcome to Webmaker modal view|
|Any|"taken"|Username already taken error|
|Any|"failCreate"|500 response from server|
