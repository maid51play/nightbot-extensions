var express = require('express');
var router = express.Router();
var fetch = require('node-fetch')
const db = require('../db')
const moment = require('moment');


router.post('/config', ensureAuthenticated, async function(req, res, next) {
  const user = getUser(req);

  Object.keys(req.body).map(key => {
    if(req.body[key] == ""){
      delete req.body[key]
    }
  })

  try {
  await db.query('INSERT INTO gcal_settings (user_id, secret, calendar_id, api_key, max_results, message, date_format) ' +
  'VALUES ($1, $2, $3, $4, $5, $6, $7) ' +
  'ON CONFLICT (user_id) DO ' +
  'UPDATE SET secret = $2, calendar_id = $3, api_key = $4, max_results = $5, message = $6, date_format = $7;', [user.id, req.body.secret, req.body.calendarId, req.body.apiKey, req.body.maxResults, req.body.message, req.body.dateFormat])
  } catch(err) {
    console.log(err.stack)
  }
  res.redirect('/');
});

router.get('/:id', async function(req, res, next) {
  const user = req.params.id;
  const results = await db.query('SELECT secret, calendar_id, api_key, max_results, message, date_format FROM gcal_settings WHERE user_id = $1;', [user])
  const secret = results.rows[0].secret;
  const maxResults = results.rows[0].max_results;
  const calendarId = results.rows[0].calendar_id;
  const apiKey = results.rows[0].api_key;
  const message = results.rows[0].message;
  const dateFormat = results.rows[0].date_format;
  const timeMin = `${new Date().toISOString()}`;


  if(req.query.secret != secret) {
    return res.status(401).send(`Only nightbot is allowed to make this request`);
  }
  console.log(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&maxResults=${maxResults}&timeMin=${timeMin}&orderBy=startTime&singleEvents=true`)

  const calendar = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&maxResults=${maxResults}&timeMin=${timeMin}&orderBy=startTime&singleEvents=true`, {
      method: 'get'
    }
  )
  const calendarJson = await calendar.json();
  const events = calendarJson.items.map(event => `${moment(event.start.dateTime).format(dateFormat).replace("am","a").replace("pm","p").replace(":00","")}: ${event.summary}`.replace(/\s/g,"-")).join(" ")

  return res.status(200).send(message + ' ' + events)
})

module.exports = router;

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect(`/?referer=${req.url}`);
}

function getUser(req) {
  return req.user ? req.user : false
}
