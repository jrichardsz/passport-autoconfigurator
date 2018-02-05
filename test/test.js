var passportAutoconfigurator = require('../index');

var options = {
  google: {
    client: {
      id: '123456789.apps.googleusercontent.com',
      secret: 'ef9b5c09',
      callbackUrl: 'http://localhost:8080/auth/google/callback'
    }
  },
  express : {
    callbackRoute : '/auth/google/callback',
    failureRedirect : '/login'
  },
  session: {
    secret: '9086e6ef-47402481'
  }
}

function mockExpress (){
  this.use = function () {}
  this.get = function () {}  
}

var googlePasssportAutoconfigurator = new passportAutoconfigurator.GooglePassportAutoconfigurator(options,new mockExpress());

// var FacebookPasssportAutoconfigurator = require('../index');
// 
// var facebookPasssportAutoconfigurator = new FacebookPasssportAutoconfigurator();