# BTC-price-guesser API

This is a serverless project that deploys a couple of lambdas and a dynamoDB table.

##The lambdas are:

### `getBtcPrice`

This lambda implements a HTTP GET endpoint to `/btc/price` that, when called, will query CoinMarketCap to get the latest bitcoin price in USD

### `getGuesses`

This lambda implements a HTTP GET endpoint to `/guesses` that, when called, will query the DynamoDB table to fetch all the guesses for a given user.
It expects a `user_name` query parameter.

### `createGuess`

This lambda implements a HTTP POST endpoint to `/guesses` that, when called, will insert a new guess for a given user, at a given price.
This data will then be used to both resolve the guesses in the future and calculate the score, as well as to list the guesses the user did on the client.

### `resolveGuesses`

This lambda implements a handler that is invoked on a schedule every minute. When called, it will retrieve all guesses from the DynamoDB table that
have not yet been resolved. If there are any guesses to be resolved that are older than 1 minute, it will fetch the latest BTC price and use it
to calculate the score for each. Afterwards it will update the DynamoDB records with the score and the price it used to resolve that score.

## Local development

### Setup

This project requires nodejs20.x to be installed in order to run.

The project is currently not prepared for local execution of lambdas, the local development is mainly focused around using unit tests to drive the development work.

In order to run tests, first install all dependencies:
`npm install`

Then you can execute the unit tests:
`npm test`