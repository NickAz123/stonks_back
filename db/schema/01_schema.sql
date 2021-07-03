DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS tutorials CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(255) NOT NULL, 
  email VARCHAR(255) NOT NULL,
  password_digest VARCHAR(255) NOT NULL,
  balance INT DEFAULT 50000,
  average_income INT DEFAULT NULL
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  cost INTEGER NOT NULL,
  shares INTEGER NOT NULL,
  last_updated TIMESTAMP DEFAULT NOW(), --timestamp format 2021-06-03 00:13:29
  type BOOLEAN NOT NULL,
  symbol VARCHAR(255) NOT NULL
);

CREATE TABLE tutorials (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  tutorial_1 BOOLEAN NOT NULL DEFAULT FALSE,
  tutorial_2 BOOLEAN NOT NULL DEFAULT FALSE,
  tutorial_3 BOOLEAN NOT NULL DEFAULT FALSE,
  tutorial_4 BOOLEAN NOT NULL DEFAULT FALSE,
  tutorial_5 BOOLEAN NOT NULL DEFAULT FALSE,
  tutorial_6 BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO users (username, email, password_digest, balance, average_income)
VALUES ('Lambo_Lover', 'daimondhands@gmail.com', '1234', 40000, 50000);

INSERT INTO transactions (user_id, cost, shares, type, symbol) -- type true == buy, type false == sell
VALUES (1, 5000, 15, true, 'AAPL'),
(1, 7500, 20, true, 'BTC'),
(1, 2500, 1000, true, 'DOGE'),
(1, 7600, 20, false, 'BTC'),
(1, 7600, 3250, true, 'DOGE');

INSERT INTO tutorials (user_id, tutorial_1, tutorial_2, tutorial_3, tutorial_4, tutorial_5, tutorial_6)
VALUES (1, true, false, false, false, false, false);