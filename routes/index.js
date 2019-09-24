var express = require('express');
var router = express.Router();
const db = require('../db')

/* GET home page. */
router.get('/', async function(req, res, next) {
  const results = await db.query('SELECT secret, calendar_id, api_key, max_results, message, date_format FROM gcal_settings WHERE user_id = $1', [getUser(req).id])
  resultsJson = results.rows[0] || {};
  settings = { 
    gcal: {
      secret: resultsJson.secret || "",
      calendarId: resultsJson.calendar_id || "",
      apiKey: resultsJson.api_key || "",
      maxResults: resultsJson.max_results || 7,
      message: resultsJson.message || "Upcoming events:",
      dateFormat: resultsJson.date_format || "ddd MM/DD [at] h:mma"
    }
  };
  console.log(settings)
  res.render('index', { user: getUser(req), settings });
});

module.exports = router;

function getUser(req) {
  return req.user ? req.user : false
}