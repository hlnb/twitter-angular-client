const express = require('express');
const Twitter = require('twit');

const app = express();
const client = new Twitter({
  consumer_key: 'WvmVpUxmYq01as3TIFz9KqjXZ',
  consumer_secret: 'xBPkCxWGNcm4r2GuVMW0hHRoxYWkRXeOhMJMbhWsjEQ0KRTlsX',
  access_token: '14914976-BCAB9ahQyIXRw0iOxUD0B7S8vDw4RATTVbxNhMlvZ',
  access_token_secret: 'cvFdcUrHAFl7a3l4Oa1taSnKlHVrDCJdbrGFPfY9oMZ05'
});

app.use(require('cors')());
app.use(require('body-parser').json());

app.get('/api/user', (req, res) => {
  client
    .get('account/verify_credentials')
    .then(user => {
      res.send(user);
    })
    .catch(error => {
      res.send(error);
    });
});

let cache = [];
let cacheAge = 0;

app.get('/api/home', (req, res) => {
  if (Date.now() - cacheAge > 60000) {
    cacheAge = Date.now();
    const params = { tweet_mode: 'extended', count: 200 };
    if (req.query.since) {
      params.since_id = req.query.since;
    }
    client
      .get(`statuses/home_timeline`, params)
      .then(timeline => {
        cache = timeline;
        res.send(timeline);
      })
      .catch(error => res.send(error));
  } else {
    res.send(cache);
  }
});

app.post('/api/favorite/:id', (req, res) => {
  const path = req.body.state ? 'create' : 'destroy';
  client
    .post(`favorites/${path}`, { id: req.params.id })
    .then(tweet => res.send(tweet))
    .catch(error => res.send(error));
});

app.post('/api/retweet/:id', (req, res) => {
  const path = req.body.state ? 'retweet' : 'unretweet';
  client
    .post(`statuses/retweet/${req.params.id}`)
    .then(tweet => res.send(tweet))
    .catch(error => res.send(error));
});

app.listen(3000, () => console.log('Server running'));
