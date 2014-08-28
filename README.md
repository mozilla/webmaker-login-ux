# Webmaker Login Angular

## Install

```
bower install cadecairos/makeapi-angular
```

## Setup

1. Add makerstap in your head `<link rel="stylsheet" href="bower_components/makerstrap/dist/makerstrap.complete.min.css"`. There are other ways to do this -- see the makerstrap docs.
2. Make sure `angular.js`, `webmaker-auth-client.js`, `wmLogin-angular.js` and `wmLogin-angular.templates.js` are all added to your document.
3. Add the `wmLoginAngular` module to your angular app.

## Directives

### wm-create-user

To add a create user modal use a `wm-create-user` element or attribute:

```html
<wm-create-user>
</wm-create-user>
```

### wm-login

To add a login modal use a `wm-login` element or attribute
```html
<wm-login>
</wm-login>
```
