"use strict";

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

function GooglePasssportAutoconfigurator(options, expressServer) {

  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  expressServer.use(passport.initialize());
  expressServer.use(passport.session());

  // Passport session setup.
  //   To support persistent login sessions, Passport needs to be able to
  //   serialize users into and deserialize users out of the session.  Typically,
  //   this will be as simple as storing the user ID when serializing, and finding
  //   the user by ID when deserializing.  However, since this example does not
  //   have a database of user records, the complete Google profile is
  //   serialized and deserialized.
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  // Use the GoogleStrategy within Passport.
  //   Strategies in Passport require a `verify` function, which accept
  //   credentials (in this case, an accessToken, refreshToken, and Google
  //   profile), and invoke a callback with a user object.
  passport.use(new GoogleStrategy({
    clientID: options.google.client.id,
    clientSecret: options.google.client.secret,
    callbackURL: options.google.client.callbackUrl
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function() {
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.

      // executed only once. Subsequents request with valid login, does not enter to this block
      // we return profile data as proof of success authentication
      // this set the profile data as user var in request
      return done(null, {accessToken, refreshToken, profile});
    });
  }
  ));

  // GET /auth/google
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  The first step in Google authentication will involve
  //   redirecting the user to google.com.  After authorization, Google
  //   will redirect the user back to this application at /auth/google/callback
  expressServer.get(options.express.loginRoute,
  passport.authenticate('google', {scope: options.google.client.scope}),
  function(req, res) {
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

  // GET /auth/google/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  expressServer.get(options.express.callbackRoute,
  passport.authenticate('google', {
    failureRedirect: options.express.failureRedirect
  }),
  function(req, res) {    
    res.redirect('/');
  });

  // Simple route middleware to ensure user is authenticated.
  //   Use this route middleware on any resource that needs to be protected.  If
  //   the request is authenticated (typically via a persistent login session),
  //   the request will proceed.  Otherwise, the user will be redirected to the
  //   login page.

  this.ensureAuthenticated = function (req, res, next) {

    //   executed in every request
    //   if login is invalid, application is redirected to auth google
    //   req.user is the profile data saved after a valid authentication but with user as name
    if (req.isAuthenticated()) {
      return next();
    }

    // if login is valid, application continues as normal
    res.redirect(options.express.loginRoute);
  }

}


/**
* Expose `PasssportAutoconfigurator`.
*/
module.exports = GooglePasssportAutoconfigurator;