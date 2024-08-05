const UtensilService = require('../services/UtensilService')
const LoggerHttp = require ('../utils/logger').http

// La fonction permet d'ajouter un ustensile
module.exports.addOneUtensil = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Création d'un ustensile")
    var options = {user: req.user}
    UtensilService.addOneUtensil(req.body, options, null, function(err, value) {
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

/* // La fonction permet d'ajouter plusieurs Utensils
module.exports.addManyUtensil = function(req, res) {
    req.log.info("Création de plusieurs Utensils")
    var options = {users: req.users}
    UtensilService.addManyUtensil(req.body, options, null, function(err, value) {
        if (err) {
            res.statusCode = 405
            res.send(err)
        }else {
            res.statusCode = 201
            res.send(value)
        }
    })
} */

// La fonction permet de chercher un ustensile
module.exports.findOneUtensilById = function(req, res) {
    req.log.info("Recherche d'un Utensil par son id")
    var opts = { populate: req.query.populate }
    UtensilService.findOneUtensilById(req.params.id, opts, function(err, value) {       

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

/* // La fonction permet de chercher plusieurs Utensils
module.exports.findManyUtensilsById = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Recherche de plusieurs Utensils", req.query.id)
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg=[arg]
    var opts = { populate: req.query.populate } 
    UtensilService.findManyUtensilsById(arg, opts, function(err, value) {
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

// La fonction permet de chercher un ustensile par les champs autorisé
module.exports.findOneUtensil = function(req, res){
    LoggerHttp(req, res)
    req.log.info("Recherche d'un ustensile par un champ autorisé")
    let fields = req.query.fields
    if (fields && !Array.isArray(fields))
        fields = [fields]
    var opts = { populate: req.query.populate }
    UtensilService.findOneUtensil(fields, req.query.value, opts, function(err, value) {        
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

/* // La fonction permet de chercher plusieurs Utensils
module.exports.findManyUtensils = function(req, res) {
    req.log.info("Recherche de plusieurs Utensils")
    let page = req.query.page
    let pageSize = req.query.pageSize
    let searchValue = req.query.q
    var opts = { populate: req.query.populate }
    UtensilService.findManyUtensils(searchValue, pageSize, page, opts, function(err, value) {        
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

// La fonction permet de modifier un ustensile
module.exports.updateOneUtensil = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification d'un ustensile")
    let update = req.body
    UtensilService.updateOneUtensil(req.params.id, update, null, function(err, value) {
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

/* // La fonction permet de modifier plusieurs Utensils
module.exports.updateManyUtensils = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification de plusieurs Utensils")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    var updateData = req.body
    UtensilService.updateManyUtensils(arg, updateData, null, function(err, value) {
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

// La fonction permet de supprimer un ustensile
module.exports.deleteOneUtensil = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression d'un ustensile")
    UtensilService.deleteOneUtensil(req.params.id, null, function(err, value) {        
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

/* // La fonction permet de supprimer plusieurs Utensils
module.exports.deleteManyUtensils = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression de plusieurs Utensils")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    UtensilService.deleteManyUtensils(arg, null, function(err, value) {
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