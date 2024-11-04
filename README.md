# BTC-price-guesser

This repository contains all the code for a simple application that shows the user the current Bitcoin price
and allows them to guess if it is going to go up or down.

It is composed of a serverless API for the backend part, using a DynamoDB table as storage.

The client is a React project, bootstraped with CRA, that is deployed using AWS Amplify.

Specific instructions for each app can be found in their respective READMEs

The application is currently deployed here: https://main.dxxtx17hdt1qq.amplifyapp.com/

## Solution Overview

The solution is fairly simple:
1. When a user access the website, they will be prompted to enter a username
2. Once the user entered a username, we will show them the current bitcoin price, as well as their current score and all their past guesses.
    - The application fetches all past guesses for the user from the backend, via a HTTP GET request and computes the current score on the client.
3. If they have a pending guess, they will not be able to guess until the pending one is resolved.
    - This check is also performed on the client side, there is no backend validation implemented at this stage.
4. If they don't have a pending guess, they will be able to guess if the price is going to go up or down.
    - When they submit a guess, the client will submit this guess to the backend via a HTTP POST request.
5. Every minute, a schedule runs, that checks for any pending guesses and tries to resolve them. It will not resolve pending guesses that are not older than 1 minute.
6. Once the user refreshes the page, they will be able to see their guess be resolved as well as their new score.

## Deployment

The deployment of this project and all of its infrastructure is automated with github actions.
It uses HCP Terraform to execute terraform code.

## Future improvements

Some topics that could be next steps as improvements to the current project

- Add automatic reloading on the client every minute. Or add a push mechnism to notify the user of score updates as well as bitcoing price updates
- Implement backend validation for business logic. For example, don't allow a user to submit a guess if they have a pending guess
- Add test/lint/format steps to pipeline
- Add HTTP error handling. The current implementation is fairly naive and assumens that everything will always be successful
- Add e2e/integration tests
- Fix the act warning in the client unit tests
- Add loading indicators to asynchronous operations on the UI. For example, loading the current BTC price
- Add some form of global state for shared data accross frontend components. An example would be the username