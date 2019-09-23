var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: getUser(req) });
});

module.exports = router;

function getUser(req) {
  return req.user ? req.user : false
}