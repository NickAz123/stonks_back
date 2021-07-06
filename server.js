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
// console.log(dbParams)
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

//DATABASE AND JSON REQUESTS
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
//Gets users owned stocks
App.get('/api/owned-stocks', (req, res) => {
  db.query(`SELECT * FROM owned WHERE user_id=1`).then((data) => {
    const owned = data.rows;
    res.json({owned});
  }).catch((err) => {
    console.log(err)
  })
})
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

//FINNHUB API REQUESTS
//Get Route for Todays News
App.get('/api/all-news', (req, res) => {
  axios.get(`https://finnhub.io/api/v1/news?category=general&token=${process.env.API_KEY}`).then((news)=> {
    const allnews = news.data.slice(0,10)
    res.json({allnews})
  })
})
//Get prices for selected ticker
App.get(`/api/ticker-prices/:ticker`, (req, res) => {
  axios.get(`https://finnhub.io/api/v1/quote?symbol=${req.params.ticker}&token=${process.env.API_KEY}`).then((prices) => {
    const allprices = prices.data
    res.json({allprices})
  }).catch((err) => {
    console.log(err)
  })
})

//COINMARKET CRYPTO API REQUESTS
//Gets all crypto
const urlc = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=${process.env.CRYPTO_API}`
App.get(`/api/crypto-all`, (req, res) => {
  axios.get(urlc).then((crypto)=> {
    const allcrypto = crypto.data.data;
    res.json({allcrypto})
  }).catch((err)=> {
    console.log(err)
  })
})

//ALPHAVANTAGE API REQUESTS
//Get Company Data for specified ticker
App.get(`/api/company-data/:ticker`, (req, res) => {
  axios.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${req.params.ticker}&apikey=${process.env.YAHOO_KEY}`).then((data) => {
    const companyData = data.data;
    res.json({companyData});
  }).catch((err) => {
    console.log(err)
  })
})
//Get history for specific ticker
App.get(`/api/all-history/:ticker`, (req, res) => {
  axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${req.params.ticker}&apikey=${process.env.YAHOO_KEY}`).then((history) => {
    resultsObj = {}
    const allhistory = history.data['Weekly Adjusted Time Series']
    for (const [key, value] of Object.entries(allhistory)){
      if (key.slice(0,4) === '2019'){
        break;
      }
      else {
        resultsObj[key] = value
      }
    }
    res.json(resultsObj)
  })
})

//APP LISTEN
App.listen(PORT, () => {
  console.log(`Express seems to be listening on port ${PORT} so that's pretty good 👍`);
});