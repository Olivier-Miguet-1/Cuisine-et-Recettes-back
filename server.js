// 1ere chose à faire, importer les librairies
const express = require('express')              
const _ = require("lodash")
const bodyParser = require('body-parser')
const Config = require ('./config')
const Logger = require('./utils/logger').pino
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Création de notre application express.js
const app = express()

// Démarrage de la database
require('./utils/database')

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

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

// configuration Swagger
const swaggerOptions = require('./swagger.json');
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve,
swaggerUi.setup(swaggerDocs));

// Déclaration des controllers pour l'utilisateur
const UserController = require('./controllers/UserController')
const RecipeController = require('./controllers/RecipeController')

// Déclaration des middlewares
const DatabaseMiddleware = require('./middlewares/database')
const LoggerMiddleware = require('./middlewares/logger')

// Déclaration des middlewares à express
app.use(bodyParser.json(), LoggerMiddleware.addLogger)


/*--------------------- Création des routes (User - Utilisateur) ---------------------*/

// Création du endpoint /login pour connecter un utilisateur
app.post('/login', DatabaseMiddleware.checkConnexion, UserController.loginUser)

// Création du endpoint /user pour l'ajout d'un utilisateur
app.post('/user', DatabaseMiddleware.checkConnexion, UserController.addOneUser)

// Création du endpoint /user pour la récupération d'un utilisateur par le champ selectionné
app.get('/user', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), UserController.findOneUser)

// Création du endpoint /user pour la récupération d'un uti lisateur via l'id
app.get('/user/:id', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), UserController.findOneUserById)

// Création du endpoint /user pour la modification d'un utilisateur
app.put('/user/:id', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), UserController.updateOneUser)

// Création du endpoint /user pour la suppression d'un utilisateur
app.delete('/user/:id', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), UserController.deleteOneUser)


/*--------------------- Création des routes (Recipe - Recette) ---------------------*/

// Création du endpoint /recipe pour l'ajout d'une recette
app.post('/recipe', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }),  RecipeController.addOneRecipe)

// Création du endpoint /recipe pour la récupération d'une recette via l'id
app.get('/recipe/:id', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), RecipeController.findOneRecipeById)

// Création du endpoint /recipe pour la récupération d'une recette par le champ selectionné
app.get('/recipe', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), RecipeController.findOneRecipe)

// Création du endpoint /recipe pour la modification d'une recette
app.put('/recipe/:id', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), RecipeController.updateOneRecipe)

// Création du endpoint /recipe pour la suppression d'une recette
app.delete('/recipe/:id', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), RecipeController.deleteOneRecipe)


// 2e chose à faire : Créer le server avec app.listen

app.listen(Config.port, () => {   
    Logger.info(`Serveur démarré sur le port ${Config.port}.`)
})

module.exports = app
