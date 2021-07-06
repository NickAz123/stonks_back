INSERT INTO users (username, email, password_digest, balance, average_income)
VALUES ('Lambo_Lover', 'daimondhands@gmail.com', '1234', 40000, 50000);

INSERT INTO transactions (user_id, cost, shares, type, symbol) -- type true == buy, type false == sell
VALUES (1, 5000, 15, true, 'AAPL'),
(1, 7500, 20, true, 'BTC'),
(1, 2500, 1000, true, 'DOGE'),
(1, 7600, 20, false, 'BTC'),
(1, 7600, 3250, true, 'DOGE');


INSERT INTO owned (user_id, symbol, amount)
VALUES(1, )