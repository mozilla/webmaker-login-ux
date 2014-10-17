# Webmaker Login UX

Webmaker Login UX enables developers to implement a consitent login/logout and signup
flow for webmaker across different websites and apps. This is acheived through the use
of an adapter that handles implementation specific details (modal dialog handling,
angular JS style directive implementation), while the common parts of theimplementation
(state, request handling, analytics, etc) are handled by a core library.

The adapter and all of the dependencies (JS, HTML templates) are built using Browserify
into one package that can be included into the target application's build system. Custom CSS to
override Makerstrap styles are also included and should be imported into the target application.

## Installation

```
bower install mozilla/webmaker-login-ux
```

## Angular Adapter Usage
1. Add makerstap in your head `<link rel="stylsheet" href="bower_components/makerstrap/dist/makerstrap.complete.min.css"`. There are other ways to do this -- see the makerstrap docs.
2. The app must define `window.angularConfig` as an object, and specify a `csrfToken` attribute.
3. Make sure `angular.js`, `ui-bootstrap`, `ngWebmakerLogin.js` and `ngWebmakerLogin.templates.js` are all added to your document.
4. Add the `ngWebmakerLogin` module to your angular app.

### ngWebmakerLogin Directives

### wm-join-webmaker

Configures the join webmaker modal to display when the element it is used on is clicked:

```html
<button wm-join-webmaker showcta="true">
</button>
```

Use the `showcta` attribute to define whether or not the welcome to webmaker CTA's should display after an account is created.

### wm-signin

Configures the signin modal to display when the element it is used on is clicked
```html
<button wm-signin>
</button>
```

### wm-password-reset

Configures the password reset modal to display when the page is loaded with the `resetCode` and `uid`
search parameters in the url:

```html
<div wm-pasword-reset></div>
```

### wm-persona-login

Configures the element it is applied to to trigger a persona log in when clicked. Ensure that the persona include file has been loaded.

```html
<button wm-persona-login></button>
```

### wm-logout

Confugures the element it is applied to to trigger a logout when it is clicked.

```html
<button wm-logout></button>
```

## Development

If you run `grunt dev`, all files and folders will be watched and automatically compiled.
A test server will also be launched at http://localhost:4321 where you can test out the modal dialogs
with fake data.

Angular adapter test page: http://localhost:4321/
Plain JavaScript adapter test page: http://localhost:4321/plain

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

### Password reset

Add "?uid=user&resetCode=topsecretcode" to the url to trigger the password reset flow.
Change the values of uid and resetCode to cause a failed reset request.
