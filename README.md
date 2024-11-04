# BTC-price-guesser

This repository contains all the code for a simple application that shows the user the current Bitcoin price
and allows them to guess if it is going to go up or down.

It is composed of a serverless API for the backend part, using a DynamoDB table as storage.

The client is a React project, bootstraped with CRA, that is deployed using AWS Amplify.

Specific instructions for each app can be found in their respective READMEs

The application is currently deployed here: https://main.dxxtx17hdt1qq.amplifyapp.com/

## Deployment

The deployment of this project and all of its infrastructure is automated with github actions.
It uses HCP Terraform to execute terraform code.

## Future improvements

Some topics that could be next steps as improvements to the current project

- Add test/lint/format steps to pipeline
- Add HTTP error handling. The current implementation is fairly naive and assumens that everything will always be successful
- Add e2e/integration tests
- Fix the act warning in the client unit tests
- Add loading indicators to asynchronous operations on the UI. For example, loading the current BTC price
- Add some form of global state for shared data accross frontend components. An example would be the username