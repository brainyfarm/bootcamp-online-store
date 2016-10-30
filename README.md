# Online Store
### https://bc-21-online-store.herokuapp.com

## Introduction

Online Store is a web application built for individuals as well as small scale business to help them create their own stores, add products and sell online for free [Heroku](https://bc-21-online-store.herokuapp.com/).

## Features

- User Authentication. 
- Store creation capacity.
- Product listing to store
- Shareable public store link.
- SMS notification of store unique url.
- Public product listing.


## Technologies

### Backend
- [Node.js](nodejs.org) - A JavaScript runtime for building server-side JavaScript applications.
- [Express](http://expressjs.com/) - A minimal and flexible Node.js web application framework. 
- [Firebase](https://firebase.google.com/) - Google's non-relational database. 
- [Jusibe](https://github.com/azemoh/jusibe) - A nodejs module for consuming [Jusibe.com](https://jusibe.com) SMS API service.

### Front-end
- [Materializecss](materializecss.com) - A modern responsive front-end framework based on Material Design.

### Third-Party Integration
- [Jusibe](https://jusibe.com) - A local API service that allows you to send SMS using a REST API, used to send SMS notifications to experts assigned to maintenance requests.


## Setup
Before we begin, ensure you have the required software to run this application.

### Major Dependencies.
- [Node.js](nodejs.org) - A version with ECMAScript 2015 (ES6) support.
- [ExpressJS](https://expressjs.com/) - This app has been tested on version `4.13.4`

## Local development.

1. Clone this repository locally by running
> `git clone https://github.com/brainyfarm/bootcamp-online-store.git`

2. Install required nodejs packages by running
> `npm install`

3. Create a `.env` file in the root directory and put in the access keys and tokens.

4. After installation, start up the app.
> `npm start`
