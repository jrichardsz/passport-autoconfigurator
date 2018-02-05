# passport-autoconfigurator

passport-autoconfigurator is a utility to reduce code when you need to use [passport](https://www.npmjs.com/package/passport).

## Requirements

- npm and Node.js


## Import module

- Execute :

```
npm install passport-autoconfigurator --save
```

- Or manually add this to your package.json dependencies:

```
"dependencies": {
    "passport-autoconfigurator": "1.0.0"
}
```

# Usage

Imagine a simple express app

```
var express = require('express');
var app = express();

app.get('/home', function(req, res) {
  res.type('text/plain');
  res.send('Hell , its about time!!');
});

app.listen(process.env.PORT || 8080);

```

With a correct session :

```
app.use(session({
	secret: '123456789',
	resave: true,
	saveUninitialized: true,
	cookie: {
		maxAge: (45 * 60 * 1000)
	}
}));
```

This works perfectly, but you need to protect **/home**. So only users logged in google are allowed.

To do that, just add this lines, before **app.listen ...**:

```
var passportAutoconfigurator = require('passport-autoconfigurator');

var options = {
  google: {
    client: {
      id: 'abcdreeghij.apps.googleusercontent.com',
      secret: 'abcdreeghij',
      callbackUrl: 'http://localhost:8080/auth/google/callback',
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
    }
  },
  express : {
    loginRoute : '/auth/google',
    callbackRoute : '/auth/google/callback',
    failureRedirectRoute : '/login'
  }
};


var googlePasssport = new passportAutoconfigurator.GooglePassportAutoconfigurator(options,app);

```

and add **googlePasssport.ensureAuthenticated** to **/home** route:
```
app.get('/home',googlePasssport.ensureAuthenticated, function(req, res) {
  res.type('text/plain');
  res.send('Hell , its about time!!');
});

```

Next time, when user access to **localhost:8080/home** will be redirected to google login form.


