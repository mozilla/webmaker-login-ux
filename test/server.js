var express = require('express'),
    nunjucks = require('nunjucks'),
    i18n = require('webmaker-i18n'),
    path = require('path');

var app = express(),
    nunjucksEnv = nunjucks.configure([__dirname], {
      autoescape: true,
      watch: false
    });

nunjucksEnv.addFilter('instantiate', function (input) {
  return nunjucks.renderString(input, this.getVariables());
});

nunjucksEnv.addFilter('localVar', function (input, localVar) {
  return nunjucks.renderString(input, localVar);
});

nunjucksEnv.addFilter('gettext', function (string) {
  return this.lookup('gettext')(string);
});

nunjucksEnv.express(app);

app.disable('x-powered-by');

app.use(express.logger('dev'));

app.use(express.compress());

app.use(express.json());
app.use(express.urlencoded());

app.use(i18n.middleware({
  supported_languages: ['en-US'],
  default_lang: 'en-US',
  mappings: require('webmaker-locale-mapping'),
  translation_directory: path.resolve(__dirname, '../locale')
}));

app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, '../node_modules')));

app.get('/angular-config.js', function(req, res) {
  res.setHeader('Content-type', 'text/javascript');
  res.send('window.angularConfig = ' + JSON.stringify({
    csrf: 'thisisnotacsrftoken'
  }));
});

app.get('/', function(req, res) {
  res.render('test.html');
});

app.get('/strings/:lang?', i18n.stringsRoute('en-US'));

app.post('/verify', function(req,res) {
  res.json({
    status: 'No Session'
  });
});

app.post('/check-username', function(req, res) {
  var username = req.body.username;

  if (!username) {
    return res.json({
      'error': 'Missing username'
    });
  }

  if ( username === 'taken' ) {
    return res.json({
      username: 'taken',
      exists: true
    });
  }

  res.json({
    username: username,
    exists: false
  });
});

app.post('/auth/v2/create', function(req, res) {
  if ( req.body.user.username === 'failCreate' ) {
    return res.json(500, {
      error: 'Error creating an account'
    });
  }

  res.json({
    user: {
      username: req.body.user.username,
      email: req.body.user.email
    },
    email: req.body.user.email
  });
});

app.post('/auth/v2/request', function(req, res) {
  if ( req.body.email === 'fake@webmaker.org' ) {
    return res.json({
      error: 'User not found'
    });
  }

  if (
    req.body.email === 'user@webmaker.org' ||
    req.body.email === 'error@webmaker.org' ||
    req.body.email === 'ratelimit@webmaker.org' ) {
    return res.json({
      status: 'Login Token Sent'
    });
  }

  res.json(500, {
    error: 'Server Error'
  });
});

app.post('/login', function(req, res) {
  res.json({
    status: "okay"
  });
});

app.post('/logout', function(req, res) {
  res.json({
    status: "okay"
  });
});

app.post('/auth/v2/authenticateToken', function(req, res) {
  if ( req.body.email === 'user@webmaker.org' && req.body.token === 'token' ) {
    return res.json({
      user: {
        email: 'user@webmaker.org',
        username: 'user'
      },
      email: 'user@webmaker.org'
    });
  }

  if ( req.body.email === 'error@webmaker.org' ) {
    return res.json(500, {
      error: "Server Error"
    })
  }

  if ( req.body.email === 'ratelimit@webmaker.org' ) {
    return res.json(429, {
      error: "rate limit exceeded"
    });
  }

  res.json(401,{
    error: "Unauthorized"
  });

});

app.listen(4321, function() {
  console.log( 'Test server listening: http://localhost:4321' );
});
