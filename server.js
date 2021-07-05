const Express = require('express');
const App = Express();
const BodyParser = require('body-parser');
const PORT = 8080;
require('dotenv').config();
const fs = require('fs')
const axios = require('axios');
const WebSocket = require('ws');

//Database connection configuration
const { Pool } = require('pg');
const dbParams = require('./lib/db.js')
const db = new Pool(dbParams);
console.log(dbParams)
db.connect();

let socket = new WebSocket(`wss://ws.finnhub.io?token=${process.env.API_KEY}`);

// socket.addEventListener('open', function (event) {
//   socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'GOOG'}))
//   socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'AAPL'}))
//   socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'IC MARKETS:1'}))
// });

// // Listen for messages
// socket.addEventListener('message', function (event) {
//   console.log('Message from server ', event.data);
// });

// Express Configuration
App.use(BodyParser.urlencoded({ extended: false }));
App.use(BodyParser.json());
App.use(Express.static('public'));

// Get Route for current logged in user
App.get('/api/users', (req, res) => {
  db.query(`SELECT * FROM users WHERE id=1;`)
  .then(data => {
    const users = data.rows;
    res.json({ users });
  })
  .catch(err => {
    res
      .status(500)
      .json({error: err.message});
  });
});

//Get route for transactions for logged in user
App.get('/api/transactions', (req, res) => {
  db.query(`SELECT * FROM transactions WHERE user_id=1;`)
  .then(data => {
    const transactions = data.rows;
    res.json({ transactions });
  })
  .catch(err => {
    res
      .status(500)
      .json({error: err.message});
  });
});

//Get route for current logged in user tutorial history
App.get('/api/tutorials', (req, res) => {
  db.query(`SELECT * FROM tutorials WHERE user_id=1;`)
  .then(data => {
    const tutorials = data.rows;
    res.json({ tutorials });
  })
  .catch(err => {
    res
      .status(500)
      .json({error: err.message});
  });
});

//Get route for entire stock list
App.get('/api/all-stocks', (req, res) => {
  let allstocks = fs.readFileSync('nyse_full_tickers.json');
  let stocks = JSON.parse(allstocks);
  res.json({stocks});
})

//Get Route for Todays News
App.get('/api/all-news', (req, res) => {
  axios.get(`https://finnhub.io/api/v1/news?category=general&token=${process.env.API_KEY}`).then((news)=> {
    const allnews = news.data.slice(0,10)
    res.json({allnews})
  })
})

//Get history for specific ticker
App.get(`/api/all-history/:ticker`, (req, res) => {
  axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${req.params.ticker}&apikey=${process.env.YAHOO_KEY}`).then((history) => {
    resultsObj = {}
    const allhistory = history.data['Weekly Adjusted Time Series']
    for (const [key, value] of Object.entries(allhistory)){
      if (key.slice(0,4) === '2018'){
        break;
      }
      else {
        resultsObj[key] = value
      }
    }
    res.json(resultsObj)
  })
})

//Get prices for selected ticker
const url = `https://finnhub.io/api/v1/quote?symbol=AAPL&token=${process.env.API_KEY}`
App.get(`/api/ticker-prices/:ticker`, (req, res) => {
  axios.get(url).then((prices) => {
    const allprices = prices.data
    res.json({allprices})
  }).catch((err) => {
    console.log(err)
  })
})

App.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Express seems to be listening on port ${PORT} so that's pretty good 👍`);
});