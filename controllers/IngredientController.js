const IngredientService = require('../services/IngredientService')
const LoggerHttp = require ('../utils/logger').http

// La fonction permet d'ajouter un ingrédient
module.exports.addOneIngredient = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Création d'un ingrédient")
    var options = {user: req.user}
    IngredientService.addOneIngredient(req.body, options, null, function(err, value) {
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

/* // La fonction permet d'ajouter plusieurs ingredients
module.exports.addManyIngredient = function(req, res) {
    req.log.info("Création de plusieurs Ingredients")
    var options = {users: req.users}
    IngredientService.addManyIngredient(req.body, options, null, function(err, value) {
        if (err) {
            res.statusCode = 405
            res.send(err)
        }else {
            res.statusCode = 201
            res.send(value)
        }
    })
} */

// La fonction permet de chercher un ingrédient
module.exports.findOneIngredientById = function(req, res) {
    req.log.info("Recherche d'un Ingredient par son id")
    var opts = { populate: req.query.populate }
    IngredientService.findOneIngredientById(req.params.id, opts, function(err, value) {       

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

/* // La fonction permet de chercher plusieurs ingredients
module.exports.findManyIngredientsById = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Recherche de plusieurs ingredients", req.query.id)
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg=[arg]
    var opts = { populate: req.query.populate } 
    IngredientService.findManyIngredientsById(arg, opts, function(err, value) {
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

// La fonction permet de chercher un ingrédient par les champs autorisé
module.exports.findOneIngredient = function(req, res){
    LoggerHttp(req, res)
    req.log.info("Recherche d'un ingrédient par un champ autorisé")
    let fields = req.query.fields
    if (fields && !Array.isArray(fields))
        fields = [fields]
    var opts = { populate: req.query.populate }
    IngredientService.findOneIngredient(fields, req.query.value, opts, function(err, value) {        
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

/* // La fonction permet de chercher plusieurs ingredients
module.exports.findManyIngredients = function(req, res) {
    req.log.info("Recherche de plusieurs ingredients")
    let page = req.query.page
    let pageSize = req.query.pageSize
    let searchValue = req.query.q
    var opts = { populate: req.query.populate }
    IngredientService.findManyIngredients(searchValue, pageSize, page, opts, function(err, value) {        
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

// La fonction permet de modifier un ingrédient
module.exports.updateOneIngredient = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification d'un ingrédient")
    let update = req.body
    IngredientService.updateOneIngredient(req.params.id, update, null, function(err, value) {
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

/* // La fonction permet de modifier plusieurs ingredients
module.exports.updateManyIngredients = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification de plusieurs ingredients")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    var updateData = req.body
    IngredientService.updateManyIngredients(arg, updateData, null, function(err, value) {
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

// La fonction permet de supprimer un ingrédient
module.exports.deleteOneIngredient = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression d'un ingrédient")
    IngredientService.deleteOneIngredient(req.params.id, null, function(err, value) {        
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

/* // La fonction permet de supprimer plusieurs ingredients
module.exports.deleteManyIngredients = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression de plusieurs ingredients")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    IngredientService.deleteManyIngredients(arg, null, function(err, value) {
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