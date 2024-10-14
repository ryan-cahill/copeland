# Weather viewer app 

This project contains two different applications. One is an API to get data from the OpenWeather API, and the other is an app powered by the API in this project.

## Dependencies

The following is required before running the application:

* [Install Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) version 18 or higher. Installation through [`nvm`](https://github.com/nvm-sh/nvm#intro) is recommended.
* [Install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). If you've already installed Node.js with `nvm`, a version of npm is already installed.
* In the root of both the app and api project directories, run `npm install` in order to install each project's dependencies.

## Running the applications

### API

In order run the API, navigate to the `./api` directory then run the command `OPENWEATHERMAP_APP_ID=<your_openweather_api_key> npm run start:debug` in a terminal.

### app

In another terminal, navigate to the `./app` directory and start the app with the command `npm run dev`. Open a browser and navigate to `http://localhost:3001/`.
