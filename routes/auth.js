module.exports = function(app, passport) {
  var express = require('express');
  var router = express.Router();

  router.get('/twitch',
    passport.authenticate('twitch'),
    function(req, res){});
  router.get('/twitch/callback',
    passport.authenticate('twitch', { failureRedirect: '/' }),
    function(req, res) {
      res.redirect('/');
    });

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  return router;
}