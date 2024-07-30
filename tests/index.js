/* Connexion à la base de donnée */
require('../utils/database');

const mongoose = require('mongoose')

describe("UserService", () => {
    require('./services/UserService.test')
})

describe("UserController", () => {
    require('./controllers/UserController.test')
})

describe("RecipeService", () => {
    require('./services/RecipeService.test')
})

describe("RecipeController", () => {
    require('./controllers/RecipeController.test')
})

describe("API - Mongo", () => {
    it("vider les dbs. - S", () => {
        if (process.env.npm_lifecycle_event == 'test')
            mongoose.connection.db.dropDatabase();
    })
})