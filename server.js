// 1ere chose à faire, importer les librairies
const express = require('express')              
const _ = require("lodash")
const bodyParser = require('body-parser')
const Config = require ('./config')
const Logger = require('./utils/logger').pino

// Création de notre application express.js
const app = express()

// Démarrage de la database
require('./utils/database')

// Ajout du module de login
const passport = require('./utils/passport');
//  passport init

var session = require('express-session');

app.use(session({
    secret: Config.secret_cookie,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());