const RecipeService = require('../services/RecipeService')
const LoggerHttp = require ('../utils/logger').http

// La fonction permet d'ajouter une recette
module.exports.addOneRecipe = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Création d'une recette")
    var options = {user: req.user}
    RecipeService.addOneRecipe(req.body, options, null, function(err, value) {
        if (err && err.type_error == "no found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "validator") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "duplicate") {
            res.statusCode = 405
            res.send(err)   
        }
        else {
            res.statusCode = 201
            res.send(value)
        }
    })
}

/* // La fonction permet d'ajouter plusieurs recettes
module.exports.addManyRecipes = function(req, res) {
    req.log.info("Création de plusieurs Recipes")
    var options = {users: req.users}
    RecipeService.addManyRecipes(req.body, options, null, function(err, value) {
        if (err) {
            res.statusCode = 405
            res.send(err)
        }else {
            res.statusCode = 201
            res.send(value)
        }
    })
} */

// La fonction permet de chercher une recette
module.exports.findOneRecipeById = function(req, res) {
    req.log.info("Recherche d'une Recette par son id")
    var opts = { populate: req.query.populate }
    RecipeService.findOneRecipeById(req.params.id, opts, function(err, value) {       

        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

/* // La fonction permet de chercher plusieurs recettes
module.exports.findManyRecipesById = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Recherche de plusieurs recettes", req.query.id)
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg=[arg]
    var opts = { populate: req.query.populate } 
    RecipeService.findManyRecipesById(arg, opts, function(err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
} */

// La fonction permet de chercher une recette par les champs autorisé
module.exports.findOneRecipe = function(req, res){
    LoggerHttp(req, res)
    req.log.info("Recherche d'une recette par un champ autorisé")
    let fields = req.query.fields
    if (fields && !Array.isArray(fields))
        fields = [fields]
    var opts = { populate: req.query.populate }
    RecipeService.findOneRecipe(fields, req.query.value, opts, function(err, value) {        
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

/* // La fonction permet de chercher plusieurs recettes
module.exports.findManyRecipes = function(req, res) {
    req.log.info("Recherche de plusieurs recettes")
    let page = req.query.page
    let pageSize = req.query.pageSize
    let searchValue = req.query.q
    var opts = { populate: req.query.populate }
    RecipeService.findManyRecipes(searchValue, pageSize, page, opts, function(err, value) {        
        if (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
} */

// La fonction permet de modifier une recette
module.exports.updateOneRecipe = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification d'une recette")
    let update = req.body
    RecipeService.updateOneRecipe(req.params.id, update, null, function(err, value) {
        //
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && (err.type_error == "no-valid" || err.type_error == "validator" || err.type_error == "duplicate" ) ) {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

/* // La fonction permet de modifier plusieurs recettes
module.exports.updateManyRecipes = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification de plusieurs recettes")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    var updateData = req.body
    RecipeService.updateManyRecipes(arg, updateData, null, function(err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && (err.type_error == "no-valid" || err.type_error == "validator" || err.type_error == 'duplicate')) {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
} */

// La fonction permet de supprimer une recette
module.exports.deleteOneRecipe = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression d'une recette")
    RecipeService.deleteOneRecipe(req.params.id, null, function(err, value) {        
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

/* // La fonction permet de supprimer plusieurs recettes
module.exports.deleteManyRecipes = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression de plusieurs recettes")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    RecipeService.deleteManyRecipes(arg, null, function(err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
} */