# Stonks

A single page application built with React that simulates the trading experience by leveraging multiple finance API datapools. Designed with the intention of teaching people with little to no investing knowledge how to efficiently trade stocks and crypto in a risk free environment.

This is the back end server. The front end application can be found here https://github.com/archaemedes/stonks-front

## Created by:
### Brandon Copeland, Nick Azurin & Wade Croft.

## Check out our demo!
https://www.youtube.com/watch?v=hq1CcSn6Jmk

## Dependencies:(back end)
	- Axios
	- Body parser
	- Dotenv
	- Express
	- Fs
	- Nodemon	
	- Pg

  ## Getting started:
1. Clone this repository onto your local system
2. Install dependencies for both the application and the backend server with:
```js
npm install
```
3. Navigate to the db/schema path and start psql in order to populate the database
```js
psql
CREATE DATABASE stonk_db
\c stonk_db
\i 01_schema.js
```
4. Run the server with:
```js
npm start
```
5. Run the application with:
```js
npm start
```
6. profit
