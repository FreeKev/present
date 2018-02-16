var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var db = require('../models');
require('dotenv').config();

passport.serializeUser(function(user, callback){
  callback(null, user.id);
});

passport.deserializeUser(function(id, callback){
  db.user.findById(id).then(function(user){
    callback(null, user);
  }).catch(function(err){
    callback(err, null);
  });
});

passport.use(new localStrategy({
  usernameField: 'email',
  passwordField: 'password'
  }, function(email, password, callback){
  db.user.findOne({
    where: { email: email }
  }).then(function(user){
    if(!user || !user.isValidPassword(password)){
      callback(null, false);
    } else {
      callback(null, user);
    }
  }).catch(function(err){
    callback(err, null);
  })
}));

passport.use(new facebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.BASE_URL + '/auth/callback/facebook',
  profileFields: ['id', 'email', 'displayName'],
  enableProof: true
}, function(accessToken, refreshToken, profile, callback){
  //Insert or access facebook user in user table
  //Check for an email 2 id user
  var facebookEmail = profile.emails ? profile.emails[0].value : null;

  //See if email exists in users table
  db.user.findOne({
    where: {email: facebookEmail}
  }).then(function(existingUser){
    //This user has logged in before
    if(existingUser && facebookEmail){
      existingUser.updateAttributes({
        facebookID: profile.id,
        facebookToken: accessToken
      }).then(function(updatedUser){
        callback(null, updatedUser);
      }).catch(callback);
    }
    else {
      //The person is new, need to create entry in users table
      //Parse user's name
      var usernameArr = profile.displayName.split(' ');

      db.user.findOrCreate({
        where: {facebookID: profile.id},
        defaults: {
          facebookToken: accessToken,
          email: facebookEmail,
          firstname: usernameArr[0],
          lastname: usernameArr[usernameArr.length - 1],
          username: profile.displayName
        }
      }).spread(function(user, wasCreated){
        if(wasCreated){
          //Expected case: they were new & we created them in the users table
          callback(null, user);
        } else {
          //Not new, but needed to update token for new login session
          //possibly this could happen is user changed email used for FB
          user.facebookToken = accessToken;
          user.email = facebookEmail;
          user.save().then(function(updatedUser){
            callback(null, updatedUser);
          }).catch(callback);
        }
      }).catch(callback);
    }
  });
}));

module.exports = passport;
