const UserService = require('../services/UserService')
const LoggerHttp = require ('../utils/logger').http
const passport = require('passport');

//  La fonction pour gérér l'authentification depuis passport
module.exports.loginUser = function (req, res, next) {
    passport.authenticate('login', { badRequestMessage: "Les champs sont manquants."}, async function (err, user) {
    if (err) {
        res.statusCode = 401
        return res.send({msg: "Le nom d'utilisateur ou mot de passe n'est pas correct.", type_error: "no-valid-login"})
    }
    else {
        req.logIn(user, async function (err) {
            if (err) {
                res.statusCode = 500
                return res.send({msg:"Problème d'authentification sur le serveur", typer_error: "internal"})
            }
            else {
                return res.send(user)
            }
        });
    }
})(req, res, next)
}
   
// La fonction permet d'ajouter un utilisateur
module.exports.addOneUser = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Création d'un utilisateur")
    UserService.addOneUser(req.body, null, function(err, value) {
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
     //       console.log(value)
            res.statusCode = 201
            res.send(value)
        }
    })
}

/* // La fonction permet d'ajouter plusieurs utilisateurs
module.exports.addManyUsers = function(req, res) {
    req.log.info("Création de plusieurs utilisateurs")
    UserService.addManyUsers(req.body, null, function(err, value) {
        if (err) {
            res.statusCode = 405
            res.send(err)
        }
        
        else {
            res.statusCode = 201
            res.send(value)
        }
    })
}
 */

                                                                    
// La fonction permet de chercher un utilisateur avec un champ choisi
module.exports.findOneUser = function(req, res) {
    req.log.info("Chercher un utilisateur avec un champ choisi")
    var arg = req.query.fields
    if (arg && !Array.isArray(arg))
        arg = [arg]
    UserService.findOneUser(arg, req.query.value, null, function(err, value) {        
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

/* // La fonction permet de chercher plusieurs utilisateurs
module.exports.findManyUsers = function(req, res) {
    req.log.info("Recherche de plusieurs utilisateurs avec un champ choisi.")
    let page = req.query.page
    let pageSize = req.query.pageSize
    let search = req.query.q
    UserService.findManyUsers(search, page, pageSize, null, function(err, value) {      
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

// La fonction permet de chercher un utilisateur par l'Id
module.exports.findOneUserById = function(req, res) {
    req.log.info("Recherche d'un utilisateur")
    UserService.findOneUserById(req.params.id, null, function(err, value) {        
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

/* // La fonction permet de chercher plusieurs utilisateurs par l'Id
module.exports.findManyUsersById = function(req, res) {
    req.log.info("Recherche de plusieurs utilisateurs", req.query.id)
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg= [arg]
    UserService.findManyUsersById(arg, null, function(err, value) {
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

// La fonction permet de supprimer un utilisateur
module.exports.deleteOneUser = function(req, res) {
    req.log.info("Suppression d'un utilisateur")
    UserService.deleteOneUser(req.params.id, null, function(err, value) {        
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

/* // La fonction permet de supprimer plusieurs utilisateurs
module.exports.deleteManyUsers = function(req, res) {
    req.log.info("Suppression de plusieurs utilisateur")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    UserService.deleteManyUsers(arg, null, function(err, value) {
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


// La fonction permet de modifier un utilisateur
module.exports.updateOneUser = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification d'un utilisateur")
    UserService.updateOneUser(req.params.id, req.body, null, function(err, value) {
        
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

/* // La fonction permet de modifier plusieurs utilisateurs
module.exports.updateManyUsers = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification de plusieurs utilisateurs")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    var updateData = req.body
    UserService.updateManyUsers(arg, updateData, null, function(err, value) {
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